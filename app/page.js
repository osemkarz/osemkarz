import Link from 'next/link'

// ── DANE ──────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '📖',
    title: 'Strukturyzowany kurs',
    desc: 'Teoria, przykłady krok po kroku i quizy — wszystko zgodne z podstawą programową MEN i zadaniami CKE.',
    color: '#6C5CE7', bg: '#F5F3FF',
  },
  {
    icon: '🤖',
    title: 'AI tutor Max',
    desc: 'Wirtualny korepetytor dostępny 24/7. Tłumaczy inaczej gdy nie rozumiesz, wskazuje braki i motywuje.',
    color: '#F5541E', bg: '#FFF5EB',
  },
  {
    icon: '🎯',
    title: 'Personalizowana nauka',
    desc: 'System analizuje Twoje błędy i automatycznie generuje plan powtórek przed egzaminem.',
    color: '#00B894', bg: '#F0FFF4',
  },
]

const STEPS = [
  { n: '01', title: 'Ucz się z lekcji', desc: 'Teoria z wykresami, przykłady rozpisane krok po kroku. Żadnych filmów — tylko to co potrzebujesz.' },
  { n: '02', title: 'Ćwicz z quizami', desc: 'Po każdej lekcji quiz z natychmiastowym feedbackiem. Po każdym dziale — sprawdzian diagnozujący.' },
  { n: '03', title: 'Max wskazuje braki', desc: 'AI analizuje gdzie popełniasz błędy i tworzy spersonalizowany plan powtórek na przed egzaminem.' },
]

const DZIALY = [
  { n: '01', name: 'Liczby i działania', topics: '8 lekcji', done: true },
  { n: '02', name: 'Wyrażenia algebraiczne', topics: '6 lekcji', done: true },
  { n: '03', name: 'Równania i nierówności', topics: '7 lekcji', active: true },
  { n: '04', name: 'Funkcje', topics: '5 lekcji' },
  { n: '05', name: 'Geometria płaska', topics: '9 lekcji' },
  { n: '06', name: 'Bryły', topics: '6 lekcji' },
  { n: '07', name: 'Statystyka i prawdopodobieństwo', topics: '4 lekcje' },
  { n: '08', name: 'Próbny egzamin CKE', topics: '3 arkusze', exam: true },
]

// ── KOMPONENTY ────────────────────────────────────────────────────

function Nav() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(15,23,41,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
            Ósem<span style={{ color: '#F5541E' }}>karz</span>
          </Link>
          <div style={{ display: 'flex', gap: 4 }}>
            {[['Jak to działa', '#jak-dziala'], ['Program kursu', '#program'], ['Cennik', '#cennik']].map(([l, h]) => (
              <Link key={l} href={h} style={{ padding: '6px 12px', fontSize: 13, color: 'rgba(255,255,255,0.6)', borderRadius: 6, transition: 'color 0.15s' }}>
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/login" style={{
            padding: '8px 16px', fontSize: 13, color: 'rgba(255,255,255,0.7)',
            borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
          }}>
            Zaloguj się
          </Link>
          <Link href="/kurs" style={{
            padding: '8px 18px', fontSize: 13, fontWeight: 600,
            background: '#F5541E', color: '#fff', borderRadius: 8,
          }}>
            Zacznij za darmo →
          </Link>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section style={{
      background: 'var(--navy)',
      padding: '80px 24px 100px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* tło dekoracyjne */}
      <div style={{
        position: 'absolute', top: -100, right: -100,
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(108,92,231,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -50, left: -50,
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(245,84,30,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,84,30,0.12)', border: '1px solid rgba(245,84,30,0.25)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, background: '#F5541E', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Nowa platforma — dołącz pierwszy</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 900, color: '#fff', lineHeight: 1.1,
            letterSpacing: '-1px', marginBottom: 20,
          }}>
            Zdaj egzamin<br />
            ósmoklasisty<br />
            <span style={{ color: '#F5541E' }}>bez stresu.</span>
          </h1>

          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 32, maxWidth: 440 }}>
            Ustrukturyzowany kurs matematyki dla klas 7–8 z AI tutorem Maxem.
            Quizy, analiza błędów i spersonalizowany plan nauki — wszystko w jednym miejscu.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/kurs" style={{
              padding: '14px 28px', fontSize: 15, fontWeight: 600,
              background: '#F5541E', color: '#fff', borderRadius: 10,
              transition: 'all 0.2s', display: 'inline-block',
            }}>
              Zacznij za darmo →
            </Link>
            <Link href="#jak-dziala" style={{
              padding: '14px 28px', fontSize: 15, fontWeight: 500,
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, display: 'inline-block',
            }}>
              Jak to działa?
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
            {[['0 zł', 'na start'], ['8', 'działów kursu'], ['CKE', 'zadania egzaminacyjne']].map(([v, l], i) => (
              <div key={i}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* App preview card */}
        <div style={{ animation: 'float 4s ease-in-out infinite' }}>
          <div style={{
            background: '#1a2540',
            borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
          }}>
            {/* header */}
            <div style={{ background: '#0F1729', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Dział 3 → Lekcja 3</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff' }}>Układy równań</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {['done','done','active','idle','idle'].map((s,i) => (
                  <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: s==='done'?'#00B894':s==='active'?'#F5541E':'rgba(255,255,255,0.1)' }} />
                ))}
              </div>
            </div>
            {/* content */}
            <div style={{ padding: '16px 18px' }}>
              <div style={{ background: '#0F1729', borderRadius: 8, padding: '12px 14px', marginBottom: 14, textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#fff', lineHeight: 1.9 }}>
                  <span style={{ color: '#FF7A4D' }}>a₁</span>x + <span style={{ color: '#FF7A4D' }}>b₁</span>y = <span style={{ color: '#FF7A4D' }}>c₁</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#fff', lineHeight: 1.9 }}>
                  <span style={{ color: '#FF7A4D' }}>a₂</span>x + <span style={{ color: '#FF7A4D' }}>b₂</span>y = <span style={{ color: '#FF7A4D' }}>c₂</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {['x = 3', 'x = 6', 'x = 4', 'x = 8'].map((o, i) => (
                  <div key={i} style={{
                    border: `1.5px solid ${i===1?'#00B894':'rgba(255,255,255,0.1)'}`,
                    borderRadius: 7, padding: '9px 12px',
                    fontFamily: 'monospace', fontSize: 14,
                    textAlign: 'center', color: i===1?'#00B894':'rgba(255,255,255,0.6)',
                    background: i===1?'rgba(0,184,148,0.1)':'transparent',
                  }}>{o}</div>
                ))}
              </div>
              <div style={{ background: 'rgba(0,184,148,0.1)', border: '1px solid rgba(0,184,148,0.3)', borderRadius: 8, padding: '10px 12px', marginTop: 12, fontSize: 12, color: '#00B894', display: 'flex', gap: 8 }}>
                <span>✅</span>
                <span>Świetnie! Dodając równania: 2x = 12, więc x = 6.</span>
              </div>
            </div>
            {/* max chat preview */}
            <div style={{ background: '#0F1729', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 18px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#F5541E,#FF7A4D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: '#F5541E', fontWeight: 600, marginBottom: 3 }}>MAX</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Brawo! Pamiętaj żeby zawsze sprawdzić wynik podstawiając do obu równań 💪</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section style={{ padding: '80px 24px', background: 'var(--white)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Dlaczego Ósemkarz</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: 'var(--navy)', lineHeight: 1.2 }}>
            Wszystko czego potrzebujesz<br />do egzaminu w jednym miejscu
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: 'var(--off)', borderRadius: 16,
              padding: '28px', border: '1px solid var(--border)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="jak-dziala" style={{ padding: '80px 24px', background: 'var(--off)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Jak to działa</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: 'var(--navy)' }}>
            Trzy kroki do egzaminu
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 20 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ background: 'var(--white)', borderRadius: 16, padding: '28px', border: '1px solid var(--border)', position: 'relative' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900, color: 'rgba(15,23,41,0.06)', position: 'absolute', top: 16, right: 20, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 10 }}>Krok {s.n}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CourseMap() {
  return (
    <section id="program" style={{ padding: '80px 24px', background: 'var(--navy)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Program kursu</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
              Cały materiał<br />na egzamin ósmoklasisty
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 32 }}>
              8 działów, dziesiątki lekcji, setki zadań — wszystko zgodne z podstawą programową MEN i arkuszami CKE.
            </p>
            <Link href="/kurs" style={{
              display: 'inline-block', padding: '13px 26px', fontSize: 14, fontWeight: 600,
              background: '#F5541E', color: '#fff', borderRadius: 10,
            }}>
              Zobacz pełny program →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DZIALY.map((d, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: d.active ? 'rgba(245,84,30,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${d.active ? 'rgba(245,84,30,0.25)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 10, padding: '12px 16px',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: d.done ? '#00B894' : d.active ? '#F5541E' : d.exam ? '#6C5CE7' : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: '#fff', fontWeight: 600,
                }}>
                  {d.done ? '✓' : d.n}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: d.active ? '#fff' : 'rgba(255,255,255,0.75)', fontWeight: d.active ? 500 : 400 }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{d.topics}</div>
                </div>
                {d.exam && <span style={{ fontSize: 11, background: 'rgba(108,92,231,0.2)', color: '#A78BFA', padding: '2px 8px', borderRadius: 10, border: '1px solid rgba(108,92,231,0.3)' }}>Próbny</span>}
                {d.active && <span style={{ fontSize: 11, background: 'rgba(245,84,30,0.2)', color: '#FF7A4D', padding: '2px 8px', borderRadius: 10 }}>W trakcie</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function MaxShowcase() {
  return (
    <section style={{ padding: '80px 24px', background: 'var(--white)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--purple)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>AI Tutor</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: 'var(--navy)', lineHeight: 1.2, marginBottom: 12 }}>
            Poznaj Maxa — Twojego<br />osobistego korepetytora AI
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 520, margin: '0 auto' }}>
            Max jest dostępny 24/7, nigdy się nie niecierpliwi i zawsze znajdzie sposób żeby wytłumaczyć temat inaczej.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
          {[
            { icon: '💬', title: 'Czat w każdej chwili', desc: 'Pytaj o cokolwiek podczas lekcji — Max odpowiada w kilka sekund.' },
            { icon: '🔁', title: 'Wyjaśni inaczej', desc: 'Jedno kliknięcie i dostaniesz alternatywne wyjaśnienie — metaforą, przykładem, innym podejściem.' },
            { icon: '📊', title: 'Analizuje błędy', desc: 'Po quizie Max wie gdzie masz braki i wskazuje dokładnie co powtórzyć.' },
            { icon: '📅', title: 'Plan przed egzaminem', desc: 'Na 2 tygodnie przed egzaminem tworzy spersonalizowany plan powtórek tylko z Twoich słabych tematów.' },
          ].map((f, i) => (
            <div key={i} style={{ background: 'var(--off)', borderRadius: 12, padding: '22px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="cennik" style={{ padding: '80px 24px', background: 'var(--off)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Cennik</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: 'var(--navy)' }}>
            Prosty i uczciwy
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* FREE */}
          <div style={{ background: 'var(--white)', borderRadius: 16, padding: '28px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--navy)', marginBottom: 8 }}>Darmowy</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 900, color: 'var(--navy)', marginBottom: 4 }}>0 zł</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>na zawsze</div>
            {['1 pełny dział demo', '10 lekcji próbnych', 'Quizy podstawowe', 'Czat z Maxem (limit 20/dzień)', 'Rejestracja konta'].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, fontSize: 13, color: 'var(--text2)' }}>
                <span style={{ color: '#00B894', flexShrink: 0 }}>✓</span>{f}
              </div>
            ))}
            <Link href="/kurs" style={{ display: 'block', textAlign: 'center', marginTop: 20, padding: '11px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--navy)' }}>
              Zacznij za darmo
            </Link>
          </div>

          {/* PREMIUM */}
          <div style={{ background: 'var(--navy)', borderRadius: 16, padding: '28px', border: '1px solid rgba(245,84,30,0.3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, background: '#F5541E', padding: '4px 14px', borderRadius: '0 16px 0 8px', fontSize: 11, fontWeight: 600, color: '#fff' }}>Polecany</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Premium</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 4 }}>149 zł</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>/ rok (12,40 zł/mies.)</div>
            {['Pełny kurs kl. 7–8 (wszystkie działy)', 'Sprawdziany po każdym dziale', 'Max bez limitów', 'Panel postępów dla rodzica', 'Tryb "przed egzaminem"', 'Zadania z arkuszy CKE'].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                <span style={{ color: '#00B894', flexShrink: 0 }}>✓</span>{f}
              </div>
            ))}
            <Link href="/kurs" style={{ display: 'block', textAlign: 'center', marginTop: 20, padding: '11px', background: '#F5541E', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff' }}>
              Kup dostęp premium
            </Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)', marginTop: 20 }}>
          Dla szkół i korepetytorów — licencje grupowe w przygotowaniu.
        </p>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section style={{ padding: '80px 24px', background: 'var(--navy)' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
          Egzamin ósmoklasisty<br />jest do zdania.
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 32, lineHeight: 1.75 }}>
          Dołącz do Ósemkarza i zacznij się uczyć z pierwszego działu już dziś — za darmo.
        </p>
        <Link href="/kurs" style={{
          display: 'inline-block', padding: '15px 36px', fontSize: 16, fontWeight: 600,
          background: '#F5541E', color: '#fff', borderRadius: 12,
        }}>
          Zacznij za darmo →
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#080E1A', padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: '#fff' }}>
          Ósem<span style={{ color: '#F5541E' }}>karz</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
          © 2025 Ósemkarz. Wszelkie prawa zastrzeżone.
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Regulamin', 'Prywatność', 'Kontakt'].map((l, i) => (
            <span key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <CourseMap />
      <MaxShowcase />
      <Pricing />
      <FinalCTA />
      <Footer />
    </>
  )
}
