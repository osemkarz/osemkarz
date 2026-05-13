'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const QUIZ = [
  { q: 'Ile wynosi x w układzie równań?', eq: ['x + y = 10', 'x − y = 2'], opts: ['x = 3', 'x = 6', 'x = 4', 'x = 8'], ans: 1, exp: 'Dodajemy równania: 2x = 12, więc x = 6. Następnie y = 10 − 6 = 4. Sprawdzenie: 6+4=10 ✓' },
  { q: 'Ile wynosi y w układzie równań?', eq: ['2x + y = 11', 'x − y = 1'], opts: ['y = 1', 'y = 5', 'y = 3', 'y = 7'], ans: 2, exp: 'Dodając równania: 3x = 12, więc x = 4. Podstawiając do II: 4 − y = 1, więc y = 3.' },
  { q: 'Ania i Bartek razem mają 30 zł. Ania ma o 4 zł więcej. Ile ma Bartek?', eq: ['A + B = 30', 'A − B = 4'], opts: ['B = 10 zł', 'B = 17 zł', 'B = 13 zł', 'B = 15 zł'], ans: 2, exp: 'Dodając równania: 2A = 34, więc A = 17 zł. Bartek: B = 30 − 17 = 13 zł.' },
]

const NAV_ITEMS = [
  { name: 'Czym jest równanie?', state: 'done' },
  { name: 'Równania I stopnia', state: 'done' },
  { name: 'Układy równań', state: 'active' },
  { name: 'Nierówności', state: 'lock' },
  { name: 'Sprawdzian działu', state: 'lock' },
]

const SYS = `Jesteś Maxem — przyjaznym korepetytorem matematyki na platformie Ósemkarz dla uczniów klasy 7-8 w Polsce. Przygotowujesz ich do egzaminu ósmoklasisty z matematyki. Temat: Układy równań z dwiema niewiadomymi. Zasady: zawsze po polsku, przyjazny i motywujący, krótko (3-5 zdań), tłumacz krok po kroku, gdy błąd — zachęcaj nie krytykuj.`

export default function LessonViewer() {
  const [screen, setScreen] = useState(0)
  const [xp, setXp] = useState(680)
  const [msgs, setMsgs] = useState([{ r: 'a', t: 'Hej! 👋 Dzisiaj omawiamy układy równań — ważny temat na egzaminie, zwykle 1-2 zadania. Jeśli coś jest niejasne — pisz śmiało! 💪' }])
  const [inp, setInp] = useState('')
  const [busy, setBusy] = useState(false)
  const [qi, setQi] = useState(0)
  const [sel, setSel] = useState(null)
  const [done, setDone] = useState(false)
  const [score, setScore] = useState(0)
  const msgsRef = useRef(null)

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [msgs, busy])

  const addXP = (n) => setXp(x => Math.min(x + n, 1000))

  const sendToMax = async (text) => {
    if (busy) return
    const allMsgs = [...msgs, { r: 'u', t: text }]
    setMsgs(allMsgs)
    setInp('')
    setBusy(true)
    try {
      const apiMsgs = allMsgs.map(m => ({ role: m.r === 'u' ? 'user' : 'assistant', content: m.t }))
      const startIdx = apiMsgs.findIndex(m => m.role === 'user')
      const cleaned = startIdx >= 0 ? apiMsgs.slice(startIdx) : apiMsgs
      const res = await fetch('/api/max', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: SYS, messages: cleaned }),
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || 'Spróbuj jeszcze raz! 🔄'
      setMsgs(prev => [...prev, { r: 'a', t: reply }])
    } catch {
      setMsgs(prev => [...prev, { r: 'a', t: 'Mam chwilowy problem. Spróbuj za chwilę! 🔄' }])
    }
    setBusy(false)
  }

  const pickAnswer = (i) => {
    if (done) return
    setSel(i)
    setDone(true)
    if (i === QUIZ[qi].ans) { setScore(s => s + 1); addXP(30) } else addXP(5)
  }

  const nextQ = () => {
    if (qi < QUIZ.length - 1) { setQi(q => q + 1); setSel(null); setDone(false) }
    else { addXP(100); setScreen(3) }
  }

  const xpPct = Math.round((xp / 1000) * 100)
  const stepColors = ['#E2E8F0', '#E2E8F0', '#E2E8F0', '#E2E8F0']
  for (let i = 0; i < 4; i++) {
    if (i < screen) stepColors[i] = '#00B894'
    else if (i === screen) stepColors[i] = '#F5541E'
  }

  const S = { // shared styles
    btn: { background: 'transparent', border: '1.5px solid #0F1729', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#0F1729', fontFamily: 'inherit' },
    btnPri: { background: '#0F1729', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
    btnPur: { background: '#6C5CE7', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
  }

  // ── SCREENS ───────────────────────────────────────────────────
  const screens = [
    // TEORIA
    <div key="t">
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6C5CE7', marginBottom: 12 }}>📖 Teoria</div>
      <p style={{ fontSize: 14, lineHeight: 1.85, color: '#4A5568', marginBottom: 16 }}>
        <strong style={{ color: '#0F1729' }}>Układ równań</strong> to dwa równania, które muszą być spełnione <strong style={{ color: '#0F1729' }}>jednocześnie</strong>. Szukamy wartości x i y pasujących do obu naraz.
      </p>
      <div style={{ background: '#0F1729', borderRadius: 10, padding: '16px 20px', textAlign: 'center', marginBottom: 16 }}>
        {[['a₁', 'b₁', 'c₁'], ['a₂', 'b₂', 'c₂']].map(([a, b, c], i) => (
          <div key={i} style={{ fontFamily: 'monospace', fontSize: 18, color: '#fff', lineHeight: 2 }}>
            <span style={{ color: '#FF7A4D' }}>{a}</span>x + <span style={{ color: '#FF7A4D' }}>{b}</span>y = <span style={{ color: '#FF7A4D' }}>{c}</span>
          </div>
        ))}
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Ogólna postać układu równań z dwiema niewiadomymi</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        {[
          { t: 'Metoda dodawania', d: 'Dodaj lub odejmij równania żeby jedna zmienna znikła.', f: 'I + II → eliminacja' },
          { t: 'Metoda podstawiania', d: 'Wyznacz x lub y z jednego równania i podstaw do drugiego.', f: 'x = ... → wstaw do II' },
        ].map((a, i) => (
          <div key={i} style={{ background: '#F7F8FC', borderRadius: 8, padding: '12px 14px', borderLeft: '3px solid #6C5CE7' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0F1729', marginBottom: 4 }}>{a.t}</div>
            <div style={{ fontSize: 12, color: '#4A5568', lineHeight: 1.5, marginBottom: 6 }}>{a.d}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#6C5CE7' }}>{a.f}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#FFF5EB', border: '1px solid #FDDCBA', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 13, color: '#C05621', lineHeight: 1.6 }}>
        💡 <strong>Wskazówka Maxa:</strong> Metoda dodawania jest szybsza gdy przy y masz wartości różniące się znakiem (y i −y).
      </div>
      <button onClick={() => { addXP(50); setScreen(1) }} style={S.btn}>Rozumiem → Przejdź do przykładu ›</button>
    </div>,

    // PRZYKŁAD
    <div key="e">
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5541E', marginBottom: 12 }}>✏️ Przykład krok po kroku</div>
      <div style={{ background: 'linear-gradient(135deg,#FFF5EB,#FFFAF5)', border: '1px solid #FDDCBA', borderRadius: 8, padding: '12px 16px', marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#F5541E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Zadanie</div>
        <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#0F1729', fontWeight: 500, lineHeight: 1.9 }}>x + y = 10<br />x − y = 2</div>
      </div>
      {[
        [1, 'Dodajemy oba równania stronami — y i −y się znoszą:', '(x+y) + (x−y) = 10 + 2', false],
        [2, 'Upraszczamy lewą stronę:', '2x = 12', false],
        [3, 'Dzielimy obie strony przez 2:', 'x = 6', false],
        [4, 'Podstawiamy x = 6 do I równania:', '6 + y = 10  →  y = 4', false],
        [5, 'Odpowiedź końcowa:', 'x = 6,  y = 4  ✓', true],
      ].map(([n, a, r, hi]) => (
        <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
          <div style={{ width: 24, height: 24, background: '#0F1729', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0, marginTop: 2 }}>{n}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#4A5568', marginBottom: 5, lineHeight: 1.5 }}>{a}</div>
            <div style={hi
              ? { background: '#F0FFF4', borderLeft: '3px solid #00B894', padding: '8px 12px', borderRadius: '0 7px 7px 0', fontFamily: 'monospace', fontSize: 15, color: '#276749', fontWeight: 600 }
              : { background: '#F7F8FC', padding: '7px 12px', borderRadius: 7, fontFamily: 'monospace', fontSize: 14, color: '#0F1729', display: 'inline-block' }
            }>{r}</div>
          </div>
        </div>
      ))}
      <div style={{ background: '#F5F3FF', border: '1px solid #C4B5FD', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 13, color: '#4C1D95', lineHeight: 1.6 }}>
        🔍 <strong>Zawsze sprawdzaj!</strong> Podstaw x=6, y=4 do obu równań: 6+4=10 ✓ i 6−4=2 ✓
      </div>
      <button onClick={() => { addXP(50); setScreen(2); setQi(0); setSel(null); setDone(false) }} style={S.btn}>Czas na quiz! →</button>
    </div>,

    // QUIZ
    <div key="q">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00B894' }}>🧠 Quiz — pytanie {qi + 1}/{QUIZ.length}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {QUIZ.map((_, i) => <div key={i} style={{ width: 22, height: 4, borderRadius: 2, background: i < qi ? '#00B894' : i === qi ? '#F5541E' : '#E2E8F0' }} />)}
        </div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 500, color: '#0F1729', marginBottom: 10, lineHeight: 1.5 }}>{QUIZ[qi].q}</div>
      <div style={{ background: '#0F1729', borderRadius: 8, padding: '12px 18px', marginBottom: 18, display: 'inline-block' }}>
        {QUIZ[qi].eq.map((e, i) => <div key={i} style={{ fontFamily: 'monospace', fontSize: 17, color: '#fff', lineHeight: 1.9 }}>{e}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {QUIZ[qi].opts.map((o, i) => {
          let bg = '#fff', border = '#E2E8F0', color = '#0F1729'
          if (done) {
            if (i === QUIZ[qi].ans) { bg = '#F0FFF4'; border = '#00B894'; color = '#276749' }
            else if (i === sel) { bg = '#FFF5F5'; border = '#E17055'; color = '#9B2C2C' }
          }
          return (
            <div key={i} onClick={() => pickAnswer(i)} style={{
              border: `1.5px solid ${border}`, borderRadius: 8, padding: '12px 16px',
              cursor: done ? 'default' : 'pointer', fontFamily: 'monospace', fontSize: 15,
              fontWeight: 500, textAlign: 'center', background: bg, color, transition: 'all 0.15s',
            }}>{o}</div>
          )
        })}
      </div>
      {done && (
        <>
          <div style={{
            padding: '12px 16px', borderRadius: 8, marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start',
            background: sel === QUIZ[qi].ans ? '#F0FFF4' : '#FFF5F5',
            border: `1px solid ${sel === QUIZ[qi].ans ? '#C6F6D5' : '#FED7D7'}`,
            color: sel === QUIZ[qi].ans ? '#276749' : '#9B2C2C',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{sel === QUIZ[qi].ans ? '✅' : '❌'}</span>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}><strong>{sel === QUIZ[qi].ans ? 'Świetnie!' : 'Nie tym razem.'}</strong> {QUIZ[qi].exp}</div>
          </div>
          <button onClick={nextQ} style={S.btn}>{qi < QUIZ.length - 1 ? 'Następne pytanie →' : 'Zobacz wynik →'}</button>
        </>
      )}
    </div>,

    // WYNIK
    <div key="r" style={{ textAlign: 'center', padding: '10px 0' }}>
      <div style={{ fontSize: 52, marginBottom: 8 }}>{score === 3 ? '🏆' : score === 2 ? '⭐' : '📚'}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, color: '#0F1729', marginBottom: 6 }}>
        {score === 3 ? 'Perfekcja!' : score === 2 ? 'Dobra robota!' : 'Czas na powtórkę!'}
      </div>
      <div style={{ fontSize: 14, color: '#4A5568', marginBottom: 22 }}>Wynik: <strong>{score}/{QUIZ.length}</strong> poprawnych odpowiedzi</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[['⚡', `+${score * 30 + 100}`, 'Zdobyte XP'], ['✅', `${score}/${QUIZ.length}`, 'Poprawne'], ['📅', '7 🔥', 'Seria dni']].map(([ico, v, l], i) => (
          <div key={i} style={{ background: '#F7F8FC', borderRadius: 8, padding: '14px 10px' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{ico}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0F1729' }}>{v}</div>
            <div style={{ fontSize: 11, color: '#8896A5', marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>
      {score < 3
        ? <div style={{ background: '#FFF5EB', border: '1px solid #FDDCBA', borderRadius: 8, padding: '12px 16px', marginBottom: 18, fontSize: 13, color: '#C05621', textAlign: 'left', lineHeight: 1.6 }}>
          💡 <strong>Max sugeruje:</strong> Powtórz metodę dodawania — zapytaj go w czacie dlaczego dodajemy równania stronami!
        </div>
        : <div style={{ background: '#F0FFF4', border: '1px solid #C6F6D5', borderRadius: 8, padding: '12px 16px', marginBottom: 18, fontSize: 13, color: '#276749', textAlign: 'left', lineHeight: 1.6 }}>
          🎯 <strong>Gotowy na więcej?</strong> Następna lekcja: <strong>Nierówności</strong> — równie ważna na egzaminie!
        </div>
      }
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => { setScreen(0); setQi(0); setSel(null); setDone(false); setScore(0) }} style={S.btnPri}>Powtórz lekcję</button>
        <button onClick={() => sendToMax(score === 3 ? 'Ukończyłem quiz z wynikiem 3/3! 🎉 Co dalej?' : `Ukończyłem quiz z wynikiem ${score}/3. Pomóż mi zrozumieć błędy.`)} style={S.btnPur}>Powiedz Maxowi 🤖</button>
      </div>
    </div>,
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', height: '100vh', fontFamily: 'var(--font-sans)', overflow: 'hidden', background: '#F7F8FC' }}>

      {/* ── SIDEBAR ── */}
      <div style={{ background: '#0F1729', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/kurs/dzial-3" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecoration: 'none', marginBottom: 10 }}>
            ← Dział 3
          </Link>
          <Link href="/kurs" style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
            Ósem<span style={{ color: '#F5541E' }}>karz</span>
          </Link>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 2 }}>Egzamin ósmoklasisty</div>
        </div>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Twoje postępy</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{xp} XP</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>1000</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#F5541E,#FF7A4D)', borderRadius: 2, width: `${xpPct}%`, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            🔥 Seria: <span style={{ color: '#FDCB6E', fontWeight: 600 }}>7 dni</span>
          </div>
        </div>
        <div style={{ padding: '10px 12px', flex: 1, overflow: 'auto' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px', marginBottom: 6 }}>Dział 3</div>
          {NAV_ITEMS.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px', borderRadius: 7, marginBottom: 2,
              background: item.state === 'active' ? 'rgba(245,84,30,0.15)' : 'transparent',
              border: item.state === 'active' ? '1px solid rgba(245,84,30,0.3)' : '1px solid transparent',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: item.state === 'done' ? '#00B894' : item.state === 'active' ? '#F5541E' : 'rgba(255,255,255,0.2)', boxShadow: item.state === 'active' ? '0 0 6px #F5541E' : 'none' }} />
              <span style={{ fontSize: 11, lineHeight: 1.3, color: item.state === 'lock' ? 'rgba(255,255,255,0.25)' : item.state === 'active' ? '#fff' : 'rgba(255,255,255,0.65)', flex: 1 }}>{item.name}</span>
              {item.state === 'done' && <span style={{ fontSize: 10, color: '#00B894' }}>✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ overflow: 'auto', background: '#F7F8FC' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ fontSize: 11, color: '#8896A5', marginBottom: 3 }}>
            <Link href="/kurs" style={{ color: '#8896A5' }}>Dział 3 — Równania</Link> → <span style={{ color: '#F5541E', fontWeight: 500 }}>Lekcja 3</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: '#0F1729', lineHeight: 1.2 }}>Układy równań z dwiema niewiadomymi</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 7, flexWrap: 'wrap' }}>
            {[['⏱ 12 min', '#EBF4FF', '#2B6CB0'], ['Poziom: podstawowy', '#F0FFF4', '#276749'], ['CKE ✓', '#FFF5EB', '#C05621']].map(([t, bg, c], i) => (
              <span key={i} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: bg, color: c }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {stepColors.map((c, i) => <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: c, transition: 'background 0.4s' }} />)}
          </div>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: 22 }}>
            {screens[Math.min(screen, 3)]}
          </div>
        </div>
      </div>

      {/* ── MAX PANEL ── */}
      <div style={{ background: '#0F1729', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#F5541E,#FF7A4D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🤖</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Max</div>
              <div style={{ fontSize: 11, color: busy ? '#FDCB6E' : '#00B894', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: busy ? '#FDCB6E' : '#00B894', borderRadius: '50%', display: 'inline-block' }} />
                {busy ? 'Pisze...' : 'Gotowy do pomocy'}
              </div>
            </div>
          </div>
        </div>
        <div ref={msgsRef} style={{ flex: 1, padding: '12px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          {msgs.map((m, i) => (
            <div key={i}>
              {m.r === 'a'
                ? <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '10px 10px 10px 2px', padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Max</div>
                  <div style={{ fontSize: 12, lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-wrap' }}>{m.t}</div>
                </div>
                : <div style={{ background: 'rgba(245,84,30,0.2)', borderRadius: '10px 10px 2px 10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: 12, lineHeight: 1.75, color: 'rgba(255,255,255,0.9)' }}>{m.t}</div>
                </div>
              }
            </div>
          ))}
          {busy && <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '10px 10px 10px 2px', padding: '10px 12px', fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>● ● ●</div>}
        </div>
        <div style={{ padding: '0 12px 8px', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Szybkie pytania</div>
          {['Nie rozumiem tej metody 🤔', 'Pokaż zadanie z egzaminu CKE', 'Co będzie na egzaminie?'].map((q, i) => (
            <button key={i} onClick={() => sendToMax(q)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '7px 10px', fontSize: 11, color: 'rgba(255,255,255,0.65)', cursor: 'pointer', textAlign: 'left', marginBottom: 5, fontFamily: 'inherit' }}>{q}</button>
          ))}
        </div>
        <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && inp.trim() && sendToMax(inp.trim())} placeholder="Zapytaj Maxa..." disabled={busy}
              style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fff', fontFamily: 'inherit', outline: 'none' }} />
            <button onClick={() => inp.trim() && sendToMax(inp.trim())} disabled={busy}
              style={{ background: busy ? 'rgba(245,84,30,0.5)' : '#F5541E', border: 'none', borderRadius: 8, width: 34, height: 34, cursor: busy ? 'default' : 'pointer', color: '#fff', fontSize: 15, flexShrink: 0 }}>↑</button>
          </div>
        </div>
      </div>
    </div>
  )
}
