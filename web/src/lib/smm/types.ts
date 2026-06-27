export type MediaType = 'image' | 'video'

export interface MediaItem {
  id: string
  type: MediaType
  /** category id (matches a Category.id) */
  category: string
  title: string
  /** image thumbnail or video poster */
  thumb: string
  /** full image url or video file url */
  src: string
  w: number
  h: number
  createdAt: number
}

export interface Category {
  id: string
  label: string
}

export interface Teacher {
  id: string
  name: string
  role: string
  photo: string
}
