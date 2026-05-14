'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ─────────────────────────────────────────────────────────────────────────────
// LESSON SHELL — zunifikowana obudowa dla wszystkich lekcji Ósemkarza
//
// Props:
//   dzial      { n, title, href, lekcje: [{n, title, slug, status, segments?}] }
//   lekcja     { n, title, total, czas, poziom, cke }
//   segments   [{ id, icon, label, content: ReactNode }]
//   xpMap      { segmentId: xpPoints }  — ile XP za ukończenie segmentu
//   maxContext  string — kontekst dla Maxa (temat lekcji)
//   maxFaq      [{ q, a }] — gotowe odpowiedzi offline dla Maxa
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  navy:'#0F1729', navy2:'#1a2540', accent:'#F5541E', accent2:'#FF7A4D',
  green:'#00B894', yellow:'#FDCB6E', purple:'#6C5CE7',
  bg:'#F7F8FC', white:'#fff', border:'#E2E8F0',
  text:'#0F1729', text2:'#4A5568', text3:'#8896A5',
}

// ── MAX OFFLINE ENGINE ────────────────────────────────────────────────────────
const MAX_GENERIC = [
  { keys:['nie rozumiem','nie wiem','pomoc','help'], a:'Spokojnie, wytłumaczę inaczej! Który konkretnie krok sprawia trudność? Opisz mi gdzie się zatrzymałeś, a znajdziemy rozwiązanie razem. 💪' },
  { keys:['egzamin','cke','arkusz'], a:'Na egzaminie ósmoklasisty masz 125 minut na 20-21 zadań (30 punktów). Zadania z tego tematu to zwykle 1-2 zadania zamknięte i jedno otwarte. Kluczowe: zawsze zapisuj tok rozwiązania i sprawdzaj wynik! 🎯' },
  { keys:['trudne','za trudne','ciężkie'], a:'Rozumiem że to wymagające! Ale pamiętaj — każdy kto zdał egzamin ósmoklasisty kiedyś uczył się dokładnie tego samego. Idź krok po kroku, nie pomijaj teorii. Dasz radę! 💪' },
  { keys:['przykład','pokaż','zadanie'], a:'Świetnie że chcesz ćwiczyć! Przejdź do sekcji "Kartkówka" — tam znajdziesz 10 zadań z podpowiedziami. W trybie "trening" możesz klikać po wskazówkę gdy coś jest niejasne. 🏋️' },
  { keys:['ocena','ile punktów','ile muszę'], a:'Na egzaminie z matematyki próg zaliczenia to 0 punktów — egzamin jest obowiązkowy ale nie ma progu. Jednak do dobrego liceum potrzebujesz zwykle 70-80%+. Warto celować wysoko! 🎓' },
]

function getMaxResponse(text, faq = []) {
  const low = text.toLowerCase()
  // Najpierw sprawdź FAQ lekcji
  for (const item of faq) {
    const keys = item.q.toLowerCase().split(' ').filter(w => w.length > 3)
    if (keys.some(k => low.includes(k))) return item.a
  }
  // Potem ogólne odpowiedzi
  for (const item of MAX_GENERIC) {
    if (item.keys.some(k => low.includes(k))) return item.a
  }
  return 'Dobre pytanie! To zagadnienie jest dokładnie opisane w sekcji Teorii tej lekcji — wróć do zakładki 📖 i poszukaj odpowiedzi. A jeśli nadal jest niejasne, opisz mi dokładniej co Cię trapi! 😊'
}

// ── HOOKS ─────────────────────────────────────────────────────────────────────
function useXP() {
  const [xp, setXp] = useState(680)
  const [streak, setStreak] = useState(7)
  useEffect(() => {
    try {
      const s = localStorage.getItem('osemkarz_xp')
      if (s) setXp(parseInt(s))
    } catch {}
  }, [])
  const addXP = useCallback((n) => {
    setXp(prev => {
      const next = Math.min(prev + n, 9999)
      try { localStorage.setItem('osemkarz_xp', String(next)) } catch {}
      return next
    })
  }, [])
  return { xp, streak, addXP }
}

function useCompletedSegments(lessonSlug) {
  const key = `osemkarz_done_${lessonSlug}`
  const [done, setDone] = useState(new Set())
  useEffect(() => {
    try {
      const s = localStorage.getItem(key)
      if (s) setDone(new Set(JSON.parse(s)))
    } catch {}
  }, [key])
  const markDone = useCallback((segId) => {
    setDone(prev => {
      const next = new Set([...prev, segId])
      try { localStorage.setItem(key, JSON.stringify([...next])) } catch {}
      return next
    })
  }, [key])
  return { done, markDone }
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ dzial, lekcja, xp, streak, done, segments }) {
  const dzialDone = (dzial.lekcje || []).filter(l => l.status === 'done').length
  const dzialTotal = (dzial.lekcje || []).filter(l => !l.isTest).length
  const dzialPct = dzialTotal > 0 ? Math.round((dzialDone / dzialTotal) * 100) : 0
  const segDone = segments.filter(s => done.has(s.id)).length
  const segPct = Math.round((segDone / segments.length) * 100)

  return (
    <div style={{ background: C.navy, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Logo + back */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <Link href={dzial.href} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 12, textDecoration: 'none', marginBottom: 10, padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', width: 'fit-content' }}>
          ← {dzial.title}
        </Link>
        <Link href="/kurs" style={{ fontFamily: 'Fraunces, serif', fontSize: 19, fontWeight: 900, color: '#fff', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          Ósem<span style={{ color: C.accent }}>karz</span>
        </Link>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 1 }}>Egzamin ósmoklasisty</div>
      </div>

      {/* XP + Streak */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>⚡ {xp} XP</span>
          <span style={{ fontSize: 12, color: C.yellow }}>🔥 {streak} dni</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: `linear-gradient(90deg,${C.accent},${C.accent2})`, borderRadius: 2, width: `${Math.min((xp % 1000) / 10, 100)}%`, transition: 'width .5s' }} />
        </div>
      </div>

      {/* Postęp tej lekcji */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Ta lekcja</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{segDone}/{segments.length} segmentów</span>
          <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{segPct}%</span>
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {segments.map(s => (
            <div key={s.id} title={s.label} style={{ flex: 1, height: 4, borderRadius: 2, background: done.has(s.id) ? C.green : 'rgba(255,255,255,0.1)', transition: 'background .3s' }} />
          ))}
        </div>
      </div>

      {/* Postęp działu */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Dział {dzial.n}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{dzialDone}/{dzialTotal} lekcji</span>
          <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>{dzialPct}%</span>
        </div>
        <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: C.green, borderRadius: 3, width: `${dzialPct}%`, transition: 'width .5s' }} />
        </div>
      </div>

      {/* Lista lekcji działu */}
      <div style={{ padding: '10px 12px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px', marginBottom: 6 }}>Lekcje działu</div>
        {(dzial.lekcje || []).map((l, i) => {
          const isActive = l.n === lekcja.n
          return (
            <Link key={i} href={l.status !== 'locked' ? (l.href || '#') : '#'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 7, marginBottom: 2, background: isActive ? 'rgba(245,84,30,0.15)' : 'transparent', border: `1px solid ${isActive ? 'rgba(245,84,30,0.3)' : 'transparent'}`, cursor: l.status === 'locked' ? 'default' : 'pointer', opacity: l.status === 'locked' ? 0.35 : 1 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: l.status === 'done' ? C.green : isActive ? C.accent : 'rgba(255,255,255,0.2)', boxShadow: isActive ? `0 0 6px ${C.accent}` : 'none' }} />
              <span style={{ fontSize: 11, color: isActive ? '#fff' : 'rgba(255,255,255,0.6)', lineHeight: 1.3, flex: 1 }}>{l.title}</span>
              {l.status === 'done' && <span style={{ fontSize: 10, color: C.green }}>✓</span>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ── MAX PANEL ─────────────────────────────────────────────────────────────────
function MaxPanel({ maxFaq, lessonTitle }) {
  const [msgs, setMsgs] = useState([
    { r: 'a', t: `Hej! 👋 Jestem Max — Twój korepetytor AI.\n\nDzisiaj: **${lessonTitle}**.\n\nPytaj o cokolwiek — tłumaczę inaczej gdy coś jest niejasne, podam przykład, powiem co wychodzi na egzaminie. 💪` }
  ])
  const [inp, setInp] = useState('')
  const [busy, setBusy] = useState(false)
  const msgsRef = useRef(null)

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight
  }, [msgs])

  const send = async (text) => {
    if (!text.trim() || busy) return
    const userMsg = { r: 'u', t: text }
    setMsgs(prev => [...prev, userMsg])
    setInp('')
    setBusy(true)
    // Symulacja "pisania" + offline response
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400))
    const reply = getMaxResponse(text, maxFaq)
    setMsgs(prev => [...prev, { r: 'a', t: reply }])
    setBusy(false)
  }

  const QUICK = ['Nie rozumiem tego kroku 🤔', 'Pokaż mi co wychodzi na CKE', 'Jak mam to sprawdzić?']

  return (
    <div style={{ background: C.navy, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Header */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${C.accent},${C.accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🤖</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Max</div>
            <div style={{ fontSize: 11, color: busy ? C.yellow : C.green, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: busy ? C.yellow : C.green, display: 'inline-block', animation: 'pulse 2s infinite' }} />
              {busy ? 'Pisze...' : 'Gotowy'}
            </div>
          </div>
        </div>
      </div>

      {/* Wiadomości */}
      <div ref={msgsRef} style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
        {msgs.map((m, i) => (
          <div key={i}>
            {m.r === 'a'
              ? <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '10px 10px 10px 2px', padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Max</div>
                  <div style={{ fontSize: 12, lineHeight: 1.75, color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-wrap' }}>{m.t.replace(/\*\*(.*?)\*\*/g, '$1')}</div>
                </div>
              : <div style={{ background: 'rgba(245,84,30,0.2)', borderRadius: '10px 10px 2px 10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: 12, lineHeight: 1.75, color: 'rgba(255,255,255,0.9)' }}>{m.t}</div>
                </div>
            }
          </div>
        ))}
        {busy && <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '10px 10px 10px 2px', padding: '10px 12px', fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>● ● ●</div>}
      </div>

      {/* Szybkie pytania */}
      <div style={{ padding: '0 12px 8px', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Szybkie pytania</div>
        {QUICK.map((q, i) => (
          <button key={i} onClick={() => send(q)} disabled={busy} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '7px 10px', fontSize: 11, color: 'rgba(255,255,255,0.65)', cursor: 'pointer', textAlign: 'left', marginBottom: 5, fontFamily: 'inherit', transition: 'all .15s' }}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(inp)} disabled={busy} placeholder="Zapytaj Maxa..." style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fff', fontFamily: 'inherit', outline: 'none' }} />
          <button onClick={() => send(inp)} disabled={busy || !inp.trim()} style={{ background: busy ? 'rgba(245,84,30,0.4)' : C.accent, border: 'none', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', color: '#fff', fontSize: 15, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
        </div>
      </div>
    </div>
  )
}

// ── SEGMENT TABS ──────────────────────────────────────────────────────────────
function SegmentTabs({ segments, active, done, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 0, background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 18, flexShrink: 0 }}>
      {segments.map((s, i) => {
        const isActive = active === s.id
        const isDone = done.has(s.id)
        return (
          <button key={s.id} onClick={() => onSelect(s.id)} style={{
            flex: 1, padding: '10px 4px', border: 'none', borderRight: i < segments.length - 1 ? `1px solid ${C.border}` : 'none', background: isActive ? C.navy : isDone ? '#F0FFF4' : C.white, color: isActive ? '#fff' : isDone ? '#276749' : C.text3, cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 500, transition: 'all .15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3
          }}>
            <span style={{ fontSize: 16 }}>{isDone && !isActive ? '✓' : s.icon}</span>
            <span style={{ fontSize: 10 }}>{s.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── MAIN SHELL ────────────────────────────────────────────────────────────────
export default function LessonShell({ dzial, lekcja, segments, xpMap = {}, maxContext = '', maxFaq = [] }) {
  const router = useRouter()
  const { xp, streak, addXP } = useXP()
  const lessonSlug = lekcja.slug || `lekcja-${dzial.n}-${lekcja.n}`
  const { done, markDone } = useCompletedSegments(lessonSlug)
  const [activeSegment, setActiveSegment] = useState(segments[0]?.id)

  const handleSegmentSelect = (id) => {
    setActiveSegment(id)
  }

  const handleSegmentComplete = useCallback((segId) => {
    if (!done.has(segId)) {
      markDone(segId)
      const xpGain = xpMap[segId] || 20
      addXP(xpGain)
    }
  }, [done, markDone, addXP, xpMap])

  const currentSegment = segments.find(s => s.id === activeSegment)

  // Inject completion callback into segment content
  const contentWithCallback = currentSegment
    ? typeof currentSegment.content === 'function'
      ? currentSegment.content({ onComplete: () => handleSegmentComplete(activeSegment) })
      : currentSegment.content
    : null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr 230px', height: '100vh', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeup { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }
      `}</style>

      {/* SIDEBAR */}
      <Sidebar dzial={dzial} lekcja={lekcja} xp={xp} streak={streak} done={done} segments={segments} />

      {/* MAIN CONTENT */}
      <div style={{ overflow: 'auto', background: C.bg, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '13px 20px', position: 'sticky', top: 0, zIndex: 10, flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: C.text3, marginBottom: 3 }}>
            Dział {dzial.n} — {dzial.title} &rarr; <span style={{ color: C.accent, fontWeight: 500 }}>Lekcja {lekcja.n} z {lekcja.total}</span>
          </div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 19, fontWeight: 900, color: C.text, lineHeight: 1.2, marginBottom: 7 }}>{lekcja.title}</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: '#EBF4FF', color: '#2B6CB0' }}>⏱ {lekcja.czas}</span>
            {lekcja.poziom && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: '#F0FFF4', color: '#276749' }}>{lekcja.poziom}</span>}
            {lekcja.cke && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: '#FFF5EB', color: '#C05621' }}>CKE ✓</span>}
          </div>
        </div>

        {/* Content area */}
        <div style={{ padding: 18, flex: 1 }}>
          <SegmentTabs segments={segments} active={activeSegment} done={done} onSelect={handleSegmentSelect} />
          <div key={activeSegment} style={{ animation: 'fadeup 0.25s ease' }}>
            {contentWithCallback}
          </div>
        </div>
      </div>

      {/* MAX PANEL */}
      <MaxPanel maxFaq={maxFaq} lessonTitle={lekcja.title} />
    </div>
  )
}
