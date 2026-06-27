import { useState } from 'react'
import { isAuthenticated } from '@/lib/smm/store'
import { SmmLogin } from '@/pages/smm/SmmLogin'
import { SmmDashboard } from '@/pages/smm/SmmDashboard'

/** SMM admin portal: shows the login screen until authenticated. */
export default function SmmPage() {
  const [authed, setAuthed] = useState(isAuthenticated)

  return authed ? (
    <SmmDashboard onLogout={() => setAuthed(false)} />
  ) : (
    <SmmLogin onAuthed={() => setAuthed(true)} />
  )
}
