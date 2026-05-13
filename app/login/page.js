'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    router.push('/kurs')
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0F1729',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Nav */}
      <nav style={{ padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', height: 56 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
            Ósem<span style={{ color: '#F5541E' }}>karz</span>
          </Link>
        </div>
      </nav>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{
          background: '#fff', borderRadius: 20, padding: '40px',
          width: '100%', maxWidth: 420,
          boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: '#0F1729' }}>
              Ósem<span style={{ color: '#F5541E' }}>karz</span>
            </div>
            <div style={{ fontSize: 13, color: '#8896A5', marginTop: 4 }}>
              {tab === 'login' ? 'Witaj z powrotem! 👋' : 'Dołącz do Ósemkarza 🎯'}
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            background: '#F7F8FC', borderRadius: 10, padding: 4, marginBottom: 24,
          }}>
            {[['login', 'Zaloguj się'], ['register', 'Zarejestruj się']].map(([t, l]) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '9px', fontSize: 13, fontWeight: 500, borderRadius: 8, border: 'none',
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#0F1729' : '#8896A5',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}>{l}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#0F1729', display: 'block', marginBottom: 6 }}>Imię</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="np. Kacper" type="text" required={tab === 'register'}
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#0F1729' }} />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#0F1729', display: 'block', marginBottom: 6 }}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="twoj@email.pl" type="email" required
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#0F1729' }} />
            </div>

            <div style={{ marginBottom: tab === 'login' ? 12 : 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#0F1729', display: 'block', marginBottom: 6 }}>Hasło</label>
              <input value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" type="password" required
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#0F1729' }} />
            </div>

            {tab === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: 20 }}>
                <span style={{ fontSize: 13, color: '#F5541E', cursor: 'pointer' }}>Zapomniałem hasła</span>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', fontSize: 14, fontWeight: 600,
              background: loading ? '#FDA598' : '#F5541E', color: '#fff',
              border: 'none', borderRadius: 10, cursor: loading ? 'default' : 'pointer',
              fontFamily: 'inherit', transition: 'background 0.15s',
            }}>
              {loading ? 'Ładowanie...' : tab === 'login' ? 'Zaloguj się →' : 'Utwórz konto →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
            <span style={{ fontSize: 12, color: '#8896A5' }}>lub</span>
            <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
          </div>

          {/* Google */}
          <button onClick={() => router.push('/kurs')} style={{
            width: '100%', padding: '12px', fontSize: 14, fontWeight: 500,
            background: '#fff', color: '#0F1729', border: '1.5px solid #E2E8F0',
            borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            Kontynuuj z Google
          </button>

          {tab === 'register' && (
            <p style={{ fontSize: 12, color: '#8896A5', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
              Rejestrując się akceptujesz{' '}
              <span style={{ color: '#F5541E', cursor: 'pointer' }}>Regulamin</span>{' '}i{' '}
              <span style={{ color: '#F5541E', cursor: 'pointer' }}>Politykę prywatności</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
