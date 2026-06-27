import { Hero } from '@/components/Hero'
import { InfoCards } from '@/components/sections/InfoCards'
import { Courses } from '@/components/sections/Courses'
import { Features } from '@/components/sections/Features'
import { GalleryPromo } from '@/components/sections/GalleryPromo'
import { Faq } from '@/components/sections/Faq'

export function Home() {
  return (
    <>
      <Hero />
      <InfoCards />
      <Courses />
      <Features />
      <GalleryPromo />
      <Faq />
    </>
  )
}
