import { MapPin, Phone } from 'lucide-react'
import { BRANCHES, SOCIAL, TAGLINE } from '@/lib/content'
import { scrollToAnchor } from '@/lib/scroll'

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/** Google Maps directions to a branch (opens the route from the user's location). */
function mapsHref(branch: (typeof BRANCHES)[number]) {
  const dest = encodeURIComponent(`Günbatar Şapagy okuw merkezi, ${branch.address}, ${branch.city}, Türkmenistan`)
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

/** Faint neutral dot texture so the white footer isn't a bare empty block. */
const DOT_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='2' cy='2' r='1.1' fill='%231c1a17' fill-opacity='0.05'/%3E%3C/svg%3E\")"

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.5 3c.32 2.1 1.5 3.42 3.5 3.58v2.4c-1.16.11-2.27-.27-3.5-.98v6.62c0 3.4-2.77 6.12-6.2 5.55-2.5-.41-4.3-2.53-4.3-5.02 0-3.02 2.62-5.34 5.62-4.84v2.52c-.43-.11-.9-.16-1.34-.07-1.27.25-2 1.34-1.78 2.6.2 1.12 1.2 1.85 2.42 1.64 1.1-.19 1.78-1.12 1.78-2.32V3h2.78z" />
    </svg>
  )
}

function BranchCard({ branch }: { branch: (typeof BRANCHES)[number] }) {
  return (
    <div className="text-center sm:text-left">
      <h3 className="mb-3 text-lg font-bold text-ink-900">{branch.city}</h3>
      <ul className="flex flex-col gap-2 text-sm text-muted">
        {branch.phones.map((p) => (
          <li key={p} className="flex items-center justify-center gap-2 sm:justify-start">
            <Phone className="h-4 w-4 shrink-0 text-accent-500" />
            <a href={telHref(p)} className="transition-colors hover:text-accent-600">
              {p}
            </a>
          </li>
        ))}
        <li>
          <a
            href={mapsHref(branch)}
            target="_blank"
            rel="noopener noreferrer"
            title="Kartada görkez — ýol salgyny aç"
            className="flex items-center justify-center gap-2 transition-colors hover:text-accent-600 sm:justify-start"
          >
            <MapPin className="h-4 w-4 shrink-0 text-accent-500" />
            <span className="underline-offset-2 hover:underline">{branch.address}</span>
          </a>
        </li>
      </ul>
    </div>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      id="contact"
      className="border-t-4 border-accent-500 bg-white"
      style={{ backgroundImage: DOT_TEXTURE }}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid items-start gap-10 md:grid-cols-3">
          <BranchCard branch={BRANCHES[0]} />

          {/* Center: logo + CTA */}
          <div className="flex flex-col items-center text-center">
            <img src="/images/footer-logo.png" alt="Günbatar Şapagy" className="h-20 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-muted">{TAGLINE}</p>
            <p className="mt-5 text-sm font-semibold text-ink-900">Sorag ýüze çykdymy?</p>
            <a
              href="#contact"
              onClick={(e) => scrollToAnchor('#contact', e)}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600"
            >
              Biz bilen habarlaş
            </a>
          </div>

          <BranchCard branch={BRANCHES[1]} />
        </div>

        {/* Socials — branded solid colors (no gradients) */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E1306C] text-white shadow-sm transition-transform hover:scale-110"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href={SOCIAL.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-white shadow-sm transition-transform hover:scale-110"
          >
            <TikTokIcon className="h-5 w-5" />
          </a>
        </div>

        <div className="mt-10 border-t border-base pt-6 text-center text-sm text-muted">
          © {year} "Günbatar Şapagy" okuw merkezi — K-team.
        </div>
      </div>
    </footer>
  )
}
