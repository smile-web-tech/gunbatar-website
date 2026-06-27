import type { Category, MediaItem, Teacher } from './types'

/*
 * SMM data layer — talks to the real PHP API.
 * Base URL defaults to same-origin `/api` (production on cPanel). In dev/preview
 * a Vite proxy forwards `/api` to the local PHP server (see vite.config.ts).
 */
const API = import.meta.env.VITE_API_URL ?? '/api'
const TOKEN_KEY = 'smm-token'

// --- token storage ---
function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t)
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  const t = getToken()
  if (!t) return false
  // Token is `base64url(payload).sig` — check the exp claim locally.
  try {
    const payload = JSON.parse(atob(t.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      logout()
      return false
    }
  } catch {
    /* malformed token still counts as "present"; the API will reject it */
  }
  return true
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(`${API}${path}`, { ...init, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && token) logout()
    throw new Error((data as { error?: string }).error ?? 'Säwlik ýüze çykdy.')
  }
  return data as T
}

// --- auth ---
export async function login(username: string, password: string): Promise<void> {
  const { token } = await request<{ token: string }>('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  setToken(token)
}

// --- categories ---
let catCache: Category[] = []

export async function getCategories(): Promise<Category[]> {
  const { categories } = await request<{ categories: Category[] }>('/categories')
  catCache = categories
  return categories
}

export function categoryLabel(id: string): string {
  return catCache.find((c) => c.id === id)?.label ?? id
}

// --- media ---
export async function getMedia(): Promise<MediaItem[]> {
  const { media } = await request<{ media: MediaItem[] }>('/media')
  return media
}

export interface UploadInput {
  file: File
  category: string
  title?: string
}

export async function uploadMedia({ file, category, title }: UploadInput): Promise<MediaItem> {
  const form = new FormData()
  form.append('file', file)
  form.append('category', category)
  if (title) form.append('title', title)

  // For videos, generate a poster frame + dimensions client-side so the server
  // doesn't need ffmpeg (it just stores what we send).
  if (file.type.startsWith('video/')) {
    const probed = await probeVideo(file)
    form.append('w', String(probed.w))
    form.append('h', String(probed.h))
    if (probed.poster) form.append('poster', probed.poster)
  }

  const { media } = await request<{ media: MediaItem }>('/media', { method: 'POST', body: form })
  return media
}

export async function deleteMedia(id: string): Promise<void> {
  await request(`/media/${id}`, { method: 'DELETE' })
}

export async function bulkDeleteMedia(ids: string[]): Promise<{ deleted: string[]; failed: string[] }> {
  const results = await Promise.allSettled(ids.map((id) => deleteMedia(id)))
  const deleted: string[] = []
  const failed: string[] = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') deleted.push(ids[i])
    else failed.push(ids[i])
  })
  return { deleted, failed }
}

// --- teachers ---
export async function getTeachers(): Promise<Teacher[]> {
  const { teachers } = await request<{ teachers: Teacher[] }>('/teachers')
  return teachers
}

export async function createTeacher(input: {
  photo: File
  name: string
  role?: string
}): Promise<Teacher> {
  const form = new FormData()
  form.append('photo', input.photo)
  form.append('name', input.name)
  if (input.role) form.append('role', input.role)
  const { teacher } = await request<{ teacher: Teacher }>('/teachers', {
    method: 'POST',
    body: form,
  })
  return teacher
}

export async function deleteTeacher(id: string): Promise<void> {
  await request(`/teachers/${id}`, { method: 'DELETE' })
}

// --- helpers ---
function probeVideo(file: File): Promise<{ w: number; h: number; poster?: string }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const v = document.createElement('video')
    v.preload = 'metadata'
    v.muted = true
    v.src = url
    const done = (r: { w: number; h: number; poster?: string }) => {
      URL.revokeObjectURL(url)
      resolve(r)
    }
    v.onloadeddata = () => {
      v.currentTime = Math.min(0.1, v.duration || 0.1)
    }
    v.onseeked = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = v.videoWidth
        canvas.height = v.videoHeight
        canvas.getContext('2d')?.drawImage(v, 0, 0)
        done({ w: v.videoWidth, h: v.videoHeight, poster: canvas.toDataURL('image/webp', 0.6) })
      } catch {
        done({ w: v.videoWidth || 1280, h: v.videoHeight || 720 })
      }
    }
    v.onerror = () => done({ w: 1280, h: 720 })
  })
}
