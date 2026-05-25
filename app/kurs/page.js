'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const DZIALY = [
  {
    n: '01', name: 'Liczby i działania', href: '#',
    lekcje: ['Liczby naturalne i całkowite', 'Ułamki zwykłe', 'Ułamki dziesiętne', 'Procenty', 'Potęgi i pierwiastki', 'Kolejność działań', 'Liczby wymierne i niewymierne', 'Sprawdzian działu'],
    total: 8, status: 'done',
    slugs: [],
  },
  {
    n: '02', name: 'Wyrażenia algebraiczne', href: '#',
    lekcje: ['Zmienne i wyrażenia', 'Upraszczanie wyrażeń', 'Wzory skróconego mnożenia', 'Wyłączanie przed nawias', 'Działania na wielomianach', 'Sprawdzian działu'],
    total: 6, status: 'done',
    slugs: [],
  },
  {
    n: '03', name: 'Równania i nierówności', href: '/kurs/dzial-3',
    lekcje: ['Równania liniowe', 'Układy równań', 'Nierówności liniowe', 'Zadania tekstowe', 'Zastosowania w geometrii', 'Sprawdzian działu'],
    total: 6, status: 'active',
    slugs: ['rownania-liniowe', 'uklady-rownan', 'nierownosci', 'zadania-tekstowe', 'rownania-geometria', 'sprawdzian-3'],
  },
  {
    n: '04', name: 'Procenty i zastosowania', href: '/kurs/dzial-4',
    lekcje: ['Zastosowania procentów', 'Procenty w statystyce', 'Punkty procentowe', 'Średnia i mediana', 'Prawdopodobieństwo', 'Sprawdzian działu'],
    total: 6, status: 'active',
    slugs: ['procenty', 'procenty-statystyka', 'punkty-procentowe', 'srednia-mediana', 'prawdopodobienstwo', 'sprawdzian-4'],
    badge: '✨ Nowa lekcja!',
  },
  { n: '05', name: 'Funkcje', href: '#', lekcje: ['Pojęcie funkcji', 'Funkcja liniowa', 'Wykresy funkcji', 'Funkcja kwadratowa', 'Sprawdzian działu'], total: 5, status: 'locked', slugs: [] },
  { n: '06', name: 'Geometria płaska', href: '#', lekcje: ['Trójkąty', 'Czworokąty', 'Koło i okrąg', 'Pole i obwód', 'Twierdzenie Pitagorasa', 'Podobieństwo', 'Trygonometria', 'Sprawdzian działu'], total: 8, status: 'locked', slugs: [] },
  { n: '07', name: 'Bryły', href: '#', lekcje: ['Graniastosłupy', 'Ostrosłupy', 'Walec i stożek', 'Kula', 'Siatki brył', 'Sprawdzian działu'], total: 6, status: 'locked', slugs: [] },
  { n: '08', name: 'Statystyka i prawdopodobieństwo', href: '#', lekcje: ['Diagramy i wykresy', 'Średnia, mediana, dominanta', 'Prawdopodobieństwo', 'Sprawdzian działu'], total: 4, status: 'locked', slugs: [] },
  { n: '09', name: 'Próbny egzamin CKE', href: '#', lekcje: ['Arkusz 2022', 'Arkusz 2023', 'Arkusz 2024'], total: 3, status: 'locked', slugs: [], exam: true },
]

const TOTAL_LEKCJE = DZIALY.reduce((a, d) => a + d.total, 0)

export default function KursPage() {
  const router = useRouter()
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [doneMap, setDoneMap] = useState({}) // slug -> Set of completed segments
  const [hov, setHov] = useState(null)

  useEffect(() => {
    try {
      // XP
      const savedXp = parseInt(localStorage.getItem('osemkarz_xp') || '0')
      setXp(savedXp)
      // Streak
      const savedStreak = parseInt(localStorage.getItem('osemkarz_streak') || '0')
      setStreak(savedStreak)
      // Count completed lessons per slug
      const map = {}
      DZIALY.forEach(d => {
        d.slugs.forEach(slug => {
          const raw = localStorage.getItem(`osemkarz_done_${slug}`)
          if (raw) {
            try { map[slug] = new Set(JSON.parse(raw)) } catch {}
          }
        })
      })
      setDoneMap(map)
    } catch {}
  }, [])

  // Count lessons where all 6 segments completed
  const ALL_SEGMENTS = ['teoria', 'quiz', 'fiszki', 'kartkowka', 'cke', 'raport']
  const countDone = (slugs) => slugs.filter(slug => {
    const s = doneMap[slug]
    return s && ALL_SEGMENTS.every(seg => s.has(seg))
  }).length

  const totalDone = DZIALY.reduce((acc, d) => {
    if (d.status === 'done') return acc + d.total // hardcoded completed działy
    return acc + countDone(d.slugs)
  }, 0)

  const quizPct = xp > 0 ? Math.min(99, Math.round(70 + (xp / 100))) : 0

  const C = { navy:'#0F1729', accent:'#F5541E', green:'#00B894', bg:'#F7F8FC', white:'#fff', border:'#E2E8F0', text:'#0F1729', text2:'#4A5568', text3:'#8896A5' }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: C.navy, padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 900, color: '#fff', textDecoration: 'none' }}>
            Ósem<span style={{ color: C.accent }}>karz</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>🔥 <strong style={{ color: '#FDCB6E' }}>{streak || 1}</strong></span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>⚡ <strong style={{ color: '#fff' }}>{xp} XP</strong></span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F5541E,#FF7A4D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 900, color: C.text, marginBottom: 4 }}>Twój kurs</h1>
          <p style={{ fontSize: 14, color: C.text3 }}>Matematyka — Egzamin ósmoklasisty kl. 7–8</p>
        </div>

        {/* Stats — dynamiczne */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Ukończone lekcje', val: `${totalDone} / ${TOTAL_LEKCJE}`, icon: '✅' },
            { label: 'Zdobyte XP', val: xp.toLocaleString('pl'), icon: '⚡' },
            { label: 'Seria dni', val: streak || 1, icon: '🔥' },
            { label: 'Wynik quizów', val: xp > 0 ? `${quizPct}%` : '—', icon: '🎯' },
          ].map((s, i) => (
            <div key={i} style={{ background: C.white, borderRadius: 12, padding: '16px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{s.val}</div>
              <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Działy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DZIALY.map((d, i) => {
            const locked = d.status === 'locked'
            const doneCnt = d.status === 'done' ? d.total : countDone(d.slugs)
            const pct = Math.round((doneCnt / d.total) * 100)
            const isActive = d.status === 'active'
            const isH = hov === i && !locked
            const clickable = !locked && d.href !== '#'

            return (
              <div
                key={i}
                onClick={() => clickable && router.push(d.href)}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                style={{
                  background: C.white,
                  borderRadius: 14,
                  border: `1px solid ${isActive && isH ? C.accent : isActive ? 'rgba(245,84,30,0.2)' : isH ? '#CBD5E0' : C.border}`,
                  overflow: 'hidden',
                  opacity: locked ? 0.55 : 1,
                  cursor: clickable ? 'pointer' : locked ? 'not-allowed' : 'default',
                  transform: isH && clickable ? 'translateY(-1px)' : 'none',
                  boxShadow: isH && clickable ? '0 4px 16px rgba(0,0,0,0.07)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>

                  {/* Ikona */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: d.status === 'done' ? C.green : isActive ? C.accent : d.exam ? '#6C5CE7' : '#E2E8F0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: locked && !d.exam ? C.text3 : '#fff', fontWeight: 700,
                  }}>
                    {d.status === 'done' ? '✓' : d.exam ? '📝' : d.n}
                  </div>

                  {/* Treść — klikalna cała */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{d.name}</span>
                      {isActive && !d.badge && <span style={{ fontSize: 11, background: 'rgba(245,84,30,0.1)', color: C.accent, padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>W trakcie</span>}
                      {d.badge && <span style={{ fontSize: 11, background: 'rgba(0,184,148,0.1)', color: '#00856F', padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>{d.badge}</span>}
                      {d.exam && <span style={{ fontSize: 11, background: 'rgba(108,92,231,0.1)', color: '#6C5CE7', padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>Próbny</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 4, background: '#F0F0F0', borderRadius: 2, overflow: 'hidden', maxWidth: 280 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: d.status === 'done' ? C.green : C.accent, borderRadius: 2, transition: 'width .5s' }} />
                      </div>
                      <span style={{ fontSize: 12, color: C.text3, whiteSpace: 'nowrap' }}>{doneCnt}/{d.total} lekcji</span>
                    </div>
                  </div>

                  {/* Przycisk / ikona */}
                  {locked
                    ? <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
                    : d.status === 'done'
                      ? <span style={{ fontSize: 13, fontWeight: 500, color: C.green, flexShrink: 0, whiteSpace: 'nowrap' }}>✓ Ukończony</span>
                      : <div style={{
                          padding: '8px 16px', fontSize: 12, fontWeight: 600, borderRadius: 8, flexShrink: 0, whiteSpace: 'nowrap',
                          background: isH ? C.accent : 'rgba(245,84,30,0.08)',
                          color: isH ? '#fff' : C.accent,
                          transition: 'all .15s',
                        }}>
                          Przejdź →
                        </div>
                  }
                </div>
              </div>
            )
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: C.text3, marginTop: 24 }}>
          Postęp aktualizuje się automatycznie po ukończeniu każdej lekcji
        </p>
      </div>
    </div>
  )
}
