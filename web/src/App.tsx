import { lazy, Suspense, useEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Home } from '@/pages/Home'

// Gallery (with the lightbox + image manifest) is its own chunk, loaded on demand.
const GalleryPage = lazy(() => import('@/pages/GalleryPage'))
// SMM admin portal — its own chunk, kept out of the public bundle.
const SmmPage = lazy(() => import('@/pages/SmmPage'))
const TeachersPage = lazy(() => import('@/pages/TeachersPage'))

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink-200 border-t-accent-500" />
    </div>
  )
}

/** Scroll to top on route change, or scroll to anchor if a hash is present. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Allow the target section to render before scrolling
      const timer = setTimeout(() => {
        const el = document.querySelector(hash)
        if (el) {
          const navOffset = 88
          const top = el.getBoundingClientRect().top + window.scrollY - navOffset
          window.scrollTo({ top, behavior: 'smooth' })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/galereya"
            element={
              <Suspense fallback={<PageLoader />}>
                <GalleryPage />
              </Suspense>
            }
          />
          <Route
            path="/mugallymlar"
            element={
              <Suspense fallback={<PageLoader />}>
                <TeachersPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Home />} />
        </Route>

        {/* Admin portal — standalone (no public navbar/footer) */}
        <Route
          path="/smm"
          element={
            <Suspense fallback={<PageLoader />}>
              <SmmPage />
            </Suspense>
          }
        />
      </Routes>
    </>
  )
}
