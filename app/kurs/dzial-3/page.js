import Link from 'next/link'

export const metadata = {
  title: 'Dział 3: Równania i nierówności — Ósemkarz',
}

const LEKCJE = [
  {
    n: 1, title: 'Czym jest równanie?',
    desc: 'Definicja, rodzaje, sprawdzanie rozwiązania',
    czas: '10 min', cke: true, status: 'done',
    href: '/kurs/rownania-liniowe', xp: 120,
  },
  {
    n: 2, title: 'Równania I stopnia z jedną niewiadomą',
    desc: 'Rozwiązywanie, zadania tekstowe, sprawdzanie',
    czas: '12 min', cke: true, status: 'done',
    href: '#', xp: 150,
  },
  {
    n: 3, title: 'Układy równań z dwiema niewiadomymi',
    desc: 'Metoda dodawania, metoda podstawiania, zadania CKE',
    czas: '12 min', cke: true, status: 'done',
    href: '/kurs/uklady-rownan', xp: 180,
  },
  {
    n: 4, title: 'Nierówności liniowe',
    desc: 'Rozwiązywanie, zasada znaku, oś liczbowa, zadania tekstowe',
    czas: '15 min', cke: true, status: 'active',
    href: '/kurs/nierownosci', xp: 180,
  },
  {
    n: 5, title: 'Zadania tekstowe z równaniami i nierównościami',
    desc: 'Układanie równań z treści, strategie rozwiązywania',
    czas: '14 min', cke: true, status: 'locked',
    href: '#', xp: 200,
  },
  {
    n: 6, title: 'Zastosowania w geometrii',
    desc: 'Równania w zadaniach geometrycznych, obwody, pola',
    czas: '12 min', cke: true, status: 'locked',
    href: '#', xp: 180,
  },
  {
    n: 7, title: '🏆 Sprawdzian działu',
    desc: '20 pytań ze wszystkich tematów · Analiza błędów · Raport Maxa',
    czas: '30 min', cke: true, status: 'locked',
    href: '#', xp: 400, isTest: true,
  },
]

const STATUS = {
  done: { label: 'Ukończona', bg: '#F0FFF4', color: '#276749', dot: '#00B894' },
  active: { label: 'W trakcie', bg: 'rgba(245,84,30,0.08)', color: '#C05621', dot: '#F5541E' },
  locked: { label: 'Zablokowana', bg: '#F7F8FC', color: '#8896A5', dot: '#E2E8F0' },
}

export default function Dzial3Page() {
  const done = LEKCJE.filter(l => l.status === 'done').length
  const total = LEKCJE.filter(l => !l.isTest).length
  const pct = Math.round((done / total) * 100)

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FC', fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAV */}
      <nav style={{ background: '#0F1729', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 54 }}>
          <Link href="/kurs" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none' }}>
            ← Kurs
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>Dział 3</span>
          <div style={{ marginLeft: 'auto', fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 900, color: '#fff' }}>
            Ósem<span style={{ color: '#F5541E' }}>karz</span>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 16px' }}>

        {/* HEADER */}
        <div style={{ background: '#0F1729', borderRadius: 16, padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(245,84,30,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dział 3 z 8</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>Równania i nierówności</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20, lineHeight: 1.6 }}>
            Jeden z kluczowych działów na egzaminie ósmoklasisty — zwykle 3–4 zadania w arkuszu CKE.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Postęp działu</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{done}/{total} lekcji</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#F5541E,#FF7A4D)', borderRadius: 3, transition: 'width 0.5s' }} />
              </div>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{pct}%</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>ukończone</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            {[['6', 'lekcji'], ['1', 'sprawdzian'], ['~75 min', 'łącznie'], ['CKE', 'zadania']].map(([v, l], i) => (
              <div key={i}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LISTA LEKCJI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LEKCJE.map((l, i) => {
            const s = STATUS[l.status]
            const clickable = l.status !== 'locked'
            return (
              <Link key={i} href={clickable ? l.href : '#'} style={{ textDecoration: 'none', opacity: l.status === 'locked' ? 0.55 : 1, cursor: clickable ? 'pointer' : 'default' }}>
                <div style={{
                  background: l.isTest ? '#0F1729' : '#fff',
                  borderRadius: 14,
                  border: l.status === 'active' ? '2px solid #F5541E' : l.isTest ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
                  padding: '18px 20px',
                  display: 'flex', alignItems: 'center', gap: 16,
                  transition: 'transform 0.15s',
                }}>
                  {/* Numer / ikona */}
                  <div style={{
                    width: 44, height: 44, borderRadius: l.isTest ? '50%' : 10, flexShrink: 0,
                    background: l.status === 'done' ? '#00B894' : l.status === 'active' ? '#F5541E' : l.isTest ? 'rgba(255,255,255,0.1)' : '#F0F0F0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: l.isTest ? 20 : 15, fontWeight: 700,
                    color: l.status === 'done' || l.status === 'active' ? '#fff' : l.isTest ? '#fff' : '#8896A5',
                  }}>
                    {l.status === 'done' ? '✓' : l.isTest ? '🏆' : l.n}
                  </div>

                  {/* Treść */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: l.isTest ? '#fff' : '#0F1729' }}>{l.title}</span>
                      {l.status === 'active' && <span style={{ fontSize: 11, background: 'rgba(245,84,30,0.15)', color: '#F5541E', padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>Kontynuuj</span>}
                      {l.cke && <span style={{ fontSize: 10, background: l.isTest ? 'rgba(255,255,255,0.1)' : '#FFF5EB', color: l.isTest ? 'rgba(255,255,255,0.6)' : '#C05621', padding: '2px 7px', borderRadius: 8 }}>CKE</span>}
                    </div>
                    <div style={{ fontSize: 13, color: l.isTest ? 'rgba(255,255,255,0.5)' : '#8896A5', lineHeight: 1.5 }}>{l.desc}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: l.isTest ? 'rgba(255,255,255,0.4)' : '#8896A5' }}>⏱ {l.czas}</span>
                      <span style={{ fontSize: 11, color: '#FDCB6E' }}>⚡ +{l.xp} XP</span>
                    </div>
                  </div>

                  {/* Status / arrow */}
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {l.status !== 'locked' && (
                      <span style={{ fontSize: 13, color: l.isTest ? 'rgba(255,255,255,0.5)' : '#8896A5' }}>→</span>
                    )}
                    {l.status === 'locked' && (
                      <span style={{ fontSize: 16, color: '#8896A5' }}>🔒</span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* INFO BOX */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: '16px 20px', marginTop: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
          <div style={{ fontSize: 13, color: '#4A5568', lineHeight: 1.7 }}>
            <strong style={{ color: '#0F1729' }}>Jak działa każda lekcja:</strong> Teoria → Quiz (5 pytań z wyjaśnieniem) → Fiszki ze spaced repetition → Kartkówka (10 pytań, tryb trening lub egzamin) → Raport Maxa z mapą błędów. Sprawdzian działu odblokujesz po ukończeniu wszystkich 6 lekcji.
          </div>
        </div>

        {/* NAWIGACJA MIĘDZY DZIAŁAMI */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 10 }}>
          <Link href="/kurs" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, color: '#0F1729', textDecoration: 'none', fontWeight: 500 }}>
            ← Wróć do kursu
          </Link>
          <Link href="/kurs" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: '#F7F8FC', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 13, color: '#8896A5', textDecoration: 'none' }}>
            Dział 4: Funkcje →
          </Link>
        </div>
      </div>
    </div>
  )
}
