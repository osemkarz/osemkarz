import Link from 'next/link'

const DZIALY = [
  {
    n: '01', name: 'Liczby i działania',
    lekcje: ['Liczby naturalne i całkowite', 'Ułamki zwykłe', 'Ułamki dziesiętne', 'Procenty', 'Potęgi i pierwiastki', 'Kolejność działań', 'Liczby wymierne i niewymierne', 'Sprawdzian działu'],
    done: 8, total: 8, status: 'done',
  },
  {
    n: '02', name: 'Wyrażenia algebraiczne',
    lekcje: ['Zmienne i wyrażenia', 'Upraszczanie wyrażeń', 'Wzory skróconego mnożenia', 'Wyłączanie przed nawias', 'Działania na wielomianach', 'Sprawdzian działu'],
    done: 6, total: 6, status: 'done',
  },
  {
    n: '03', name: 'Równania i nierówności',
    lekcje: ['Czym jest równanie?', 'Równania I stopnia', 'Układy równań', 'Nierówności', 'Zadania tekstowe z równaniami', 'Zastosowania w geometrii', 'Sprawdzian działu'],
    done: 2, total: 7, status: 'active', current: 2,
  },
  {
    n: '04', name: 'Funkcje',
    lekcje: ['Pojęcie funkcji', 'Funkcja liniowa', 'Wykresy funkcji', 'Funkcja kwadratowa', 'Sprawdzian działu'],
    done: 0, total: 5, status: 'locked',
  },
  {
    n: '05', name: 'Geometria płaska',
    lekcje: ['Trójkąty', 'Czworokąty', 'Koło i okrąg', 'Pole i obwód', 'Twierdzenie Pitagorasa', 'Podobieństwo', 'Trygonometria', 'Przekształcenia', 'Sprawdzian działu'],
    done: 0, total: 9, status: 'locked',
  },
  {
    n: '06', name: 'Bryły',
    lekcje: ['Graniastosłupy', 'Ostrosłupy', 'Walec i stożek', 'Kula', 'Siatki brył', 'Sprawdzian działu'],
    done: 0, total: 6, status: 'locked',
  },
  {
    n: '07', name: 'Statystyka i prawdopodobieństwo',
    lekcje: ['Diagramy i wykresy', 'Średnia, mediana, dominanta', 'Prawdopodobieństwo', 'Sprawdzian działu'],
    done: 0, total: 4, status: 'locked',
  },
  {
    n: '08', name: 'Próbny egzamin CKE',
    lekcje: ['Arkusz 2022', 'Arkusz 2023', 'Arkusz 2024'],
    done: 0, total: 3, status: 'locked', exam: true,
  },
]

export default function KursPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FC', fontFamily: 'var(--font-sans)' }}>

      {/* Nav */}
      <nav style={{ background: '#0F1729', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: '#fff' }}>
            Ósem<span style={{ color: '#F5541E' }}>karz</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
              🔥 <span style={{ color: '#FDCB6E', fontWeight: 600 }}>7</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
              ⚡ <span style={{ color: '#fff', fontWeight: 600 }}>680 XP</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F5541E,#FF7A4D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: '#0F1729', marginBottom: 6 }}>Twój kurs</h1>
          <p style={{ fontSize: 14, color: '#4A5568' }}>Matematyka — Egzamin ósmoklasisty kl. 7–8</p>
        </div>

        {/* Progress overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Ukończone lekcje', val: '14 / 48', icon: '✅' },
            { label: 'Zdobyte XP', val: '680', icon: '⚡' },
            { label: 'Seria dni', val: '7', icon: '🔥' },
            { label: 'Wynik quizów', val: '82%', icon: '🎯' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0F1729' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: '#8896A5', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Działy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DZIALY.map((d, i) => {
            const pct = d.total > 0 ? Math.round((d.done / d.total) * 100) : 0
            const locked = d.status === 'locked'
            return (
              <div key={i} style={{
                background: '#fff', borderRadius: 14,
                border: `1px solid ${d.status === 'active' ? 'rgba(245,84,30,0.25)' : '#E2E8F0'}`,
                overflow: 'hidden', opacity: locked ? 0.6 : 1,
              }}>
                <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: d.status === 'done' ? '#00B894' : d.status === 'active' ? '#F5541E' : d.exam ? '#6C5CE7' : '#E2E8F0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: locked ? '#8896A5' : '#fff', fontWeight: 700,
                  }}>
                    {d.status === 'done' ? '✓' : d.n}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, color: '#0F1729' }}>{d.name}</span>
                      {d.status === 'active' && <span style={{ fontSize: 11, background: 'rgba(245,84,30,0.1)', color: '#F5541E', padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>W trakcie</span>}
                      {d.exam && <span style={{ fontSize: 11, background: 'rgba(108,92,231,0.1)', color: '#6C5CE7', padding: '2px 8px', borderRadius: 10, fontWeight: 500 }}>Próbny</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 4, background: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: d.status === 'done' ? '#00B894' : '#F5541E', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#8896A5', whiteSpace: 'nowrap' }}>{d.done}/{d.total} lekcji</span>
                    </div>
                  </div>
                  {!locked && (
                    <Link href={d.status === 'active' ? d.n === '03' ? '/kurs/nierownosci' : '#' : '#'} style={{
                      padding: '8px 18px', fontSize: 12, fontWeight: 500, borderRadius: 8,
                      background: d.status === 'active' ? '#F5541E' : d.status === 'done' ? 'transparent' : 'transparent',
                      color: d.status === 'active' ? '#fff' : d.status === 'done' ? '#00B894' : '#8896A5',
                      border: d.status === 'active' ? 'none' : `1px solid ${d.status === 'done' ? '#00B894' : '#E2E8F0'}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {d.status === 'done' ? '✓ Ukończony' : d.status === 'active' ? 'Kontynuuj →' : '🔒 Zablokowany'}
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
