'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ─────────────────────────────────────────────────────────────────────────────
// LESSON SHELL v3 — unified lesson wrapper
// Fixes: sidebar navigation, progress tracking, XP per segment, visual clarity
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  navy: '#0F1729', navy2: '#1a2540',
  accent: '#F5541E', accent2: '#FF7A4D',
  green: '#00B894', yellow: '#FDCB6E', purple: '#6C5CE7',
  bg: '#F7F8FC', white: '#fff', border: '#E2E8F0',
  text: '#0F1729', text2: '#4A5568', text3: '#8896A5',
}

// ── MAX OFFLINE ENGINE ────────────────────────────────────────────────────────
const MAX_GENERIC = [
  { keys: ['nie rozumiem', 'nie wiem', 'pomoc'], a: 'Spokojnie! Który konkretnie krok sprawia trudność? Opisz mi gdzie się zatrzymałeś. 💪' },
  { keys: ['egzamin', 'cke', 'arkusz'], a: 'Na egzaminie CKE masz 125 minut na 20–21 zadań (30 punktów). Zawsze zapisuj tok rozwiązania i sprawdzaj wynik! 🎯' },
  { keys: ['trudne', 'za trudne', 'ciężkie'], a: 'Każdy kto zdał egzamin uczył się tego samego. Idź krok po kroku — dasz radę! 💪' },
  { keys: ['przykład', 'pokaż', 'zadanie'], a: 'Przejdź do zakładki Kartkówka — tam znajdziesz zadania z podpowiedziami w trybie trening. 🏋️' },
]

function getMaxResponse(text, faq = []) {
  const low = text.toLowerCase()
  for (const item of faq) {
    const keys = item.q.toLowerCase().split(' ').filter(w => w.length > 3)
    if (keys.some(k => low.includes(k))) return item.a
  }
  for (const item of MAX_GENERIC) {
    if (item.keys.some(k => low.includes(k))) return item.a
  }
  return 'Dobre pytanie! Sprawdź sekcję Teorii tej lekcji — a jeśli nadal niejasne, opisz dokładniej co Cię trapi. 😊'
}

// ── HOOKS ─────────────────────────────────────────────────────────────────────
function useXP() {
  const [xp, setXp] = useState(680)
  const [streak] = useState(7)
  useEffect(() => {
    try { const s = localStorage.getItem('osemkarz_xp'); if (s) setXp(parseInt(s)) } catch {}
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
    try { const s = localStorage.getItem(key); if (s) setDone(new Set(JSON.parse(s))) } catch {}
  }, [key])
  const markDone = useCallback((segId) => {
    setDone(prev => {
      const next = new Set([...prev, segId])
      try { localStorage.setItem(key, JSON.stringify([...next])) } catch {}
      return next
    })
  }, [key])
  const resetAll = useCallback(() => {
    setDone(new Set())
    try { localStorage.removeItem(key) } catch {}
  }, [key])
  return { done, markDone, resetAll }
}

// ── XP POPUP ─────────────────────────────────────────────────────────────────
function XPPopup({ amount, visible }) {
  return (
    <div style={{
      position: 'fixed', top: 80, right: 260, zIndex: 100,
      background: C.yellow, color: '#7C5B00', padding: '8px 16px',
      borderRadius: 20, fontWeight: 700, fontSize: 15,
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-12px)',
      transition: 'all 0.4s ease', pointerEvents: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    }}>
      +{amount} XP ⚡
    </div>
  )
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({ dzial, lekcja, xp, streak, done, segments, onSegmentClick, activeSegment }) {
  const segDone = segments.filter(s => done.has(s.id)).length
  const segPct = Math.round((segDone / segments.length) * 100)

  return (
    <div style={{ background: C.navy, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Logo + back */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <Link href={dzial.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.45)', fontSize: 11, textDecoration: 'none', marginBottom: 10, padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}>
          ← {dzial.title}
        </Link>
        <Link href="/kurs" style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 900, color: '#fff', textDecoration: 'none', letterSpacing: '-0.5px', display: 'block' }}>
          Ósem<span style={{ color: C.accent }}>karz</span>
        </Link>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 1 }}>Egzamin ósmoklasisty</div>
      </div>

      {/* XP + Streak */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>⚡ {xp} XP</span>
          <span style={{ fontSize: 11, color: C.yellow }}>🔥 {streak} dni</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: `linear-gradient(90deg,${C.accent},${C.accent2})`, borderRadius: 2, width: `${Math.min((xp % 1000) / 10, 100)}%`, transition: 'width .6s' }} />
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>{xp % 1000} / 1000 do następnego poziomu</div>
      </div>

      {/* Postęp tej lekcji — segmenty jako klikalne kafelki */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ta lekcja</span>
          <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>{segPct}%</span>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {segments.map(s => {
            const isDone = done.has(s.id)
            const isActive = activeSegment === s.id
            return (
              <button
                key={s.id}
                onClick={() => onSegmentClick(s.id)}
                title={`${s.label}${isDone ? ' — ukończone' : ''}`}
                style={{
                  flex: '1 1 auto', minWidth: 28, padding: '5px 4px',
                  borderRadius: 6, border: `1px solid ${isActive ? 'rgba(245,84,30,0.6)' : isDone ? 'rgba(0,184,148,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  background: isActive ? 'rgba(245,84,30,0.2)' : isDone ? 'rgba(0,184,148,0.15)' : 'rgba(255,255,255,0.05)',
                  cursor: 'pointer', textAlign: 'center', transition: 'all .15s',
                }}
              >
                <div style={{ fontSize: 12 }}>{isDone && !isActive ? '✓' : s.icon}</div>
                <div style={{ fontSize: 9, color: isActive ? '#FF7A4D' : isDone ? C.green : 'rgba(255,255,255,0.35)', marginTop: 2, lineHeight: 1.2 }}>{s.label}</div>
              </button>
            )
          })}
        </div>
        {/* Pasek postępu segmentów */}
        <div style={{ display: 'flex', gap: 2, marginTop: 8 }}>
          {segments.map(s => (
            <div key={s.id} style={{ flex: 1, height: 3, borderRadius: 2, background: done.has(s.id) ? C.green : activeSegment === s.id ? C.accent : 'rgba(255,255,255,0.1)', transition: 'background .3s' }} />
          ))}
        </div>
      </div>

      {/* Lista lekcji działu — ZAWSZE KLIKALNE */}
      <div style={{ padding: '8px 10px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 4px', marginBottom: 6 }}>Lekcje działu {dzial.n}</div>
        {(dzial.lekcje || []).map((l, i) => {
          const isActive = l.n === lekcja.n
          const hasHref = l.href && l.href !== '#'
          const isTest = !!l.isTest

          return hasHref && !isTest
            ? (
              <Link
                key={i}
                href={l.href}
                style={{
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 8px', borderRadius: 8, marginBottom: 2,
                  background: isActive ? 'rgba(245,84,30,0.18)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(245,84,30,0.35)' : 'transparent'}`,
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: l.status === 'done' ? 'rgba(0,184,148,0.2)' : isActive ? 'rgba(245,84,30,0.3)' : 'rgba(255,255,255,0.07)',
                  border: `1px solid ${l.status === 'done' ? 'rgba(0,184,148,0.4)' : isActive ? 'rgba(245,84,30,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: l.status === 'done' ? C.green : isActive ? C.accent : 'rgba(255,255,255,0.4)', fontWeight: 600,
                }}>
                  {l.status === 'done' ? '✓' : l.n}
                </div>
                <span style={{ fontSize: 11, color: isActive ? '#fff' : 'rgba(255,255,255,0.65)', lineHeight: 1.35, flex: 1, fontWeight: isActive ? 500 : 400 }}>{l.title}</span>
              </Link>
            )
            : (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 8px', borderRadius: 8, marginBottom: 2,
                  opacity: 0.3, cursor: 'default',
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                  {isTest ? '🏆' : l.n}
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.35, flex: 1 }}>{l.title}</span>
                <span style={{ fontSize: 10 }}>🔒</span>
              </div>
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
    setMsgs(prev => [...prev, { r: 'u', t: text }])
    setInp('')
    setBusy(true)
    await new Promise(r => setTimeout(r, 500 + Math.random() * 400))
    setMsgs(prev => [...prev, { r: 'a', t: getMaxResponse(text, maxFaq) }])
    setBusy(false)
  }

  const QUICK = ['Nie rozumiem tego kroku 🤔', 'Co wychodzi na CKE?', 'Jak mam to sprawdzić?']

  return (
    <div style={{ background: C.navy, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${C.accent},${C.accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Max</div>
            <div style={{ fontSize: 11, color: busy ? C.yellow : C.green }}>{busy ? 'Pisze...' : '● Gotowy'}</div>
          </div>
        </div>
      </div>

      <div ref={msgsRef} style={{ flex: 1, padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
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
        {busy && <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '10px 10px 10px 2px', padding: '10px 12px', fontSize: 14, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em' }}>● ● ●</div>}
      </div>

      <div style={{ padding: '0 12px 8px', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Szybkie pytania</div>
        {QUICK.map((q, i) => (
          <button key={i} onClick={() => send(q)} disabled={busy} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '7px 10px', fontSize: 11, color: 'rgba(255,255,255,0.65)', cursor: 'pointer', textAlign: 'left', marginBottom: 5, fontFamily: 'inherit' }}>{q}</button>
        ))}
      </div>

      <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(inp)} disabled={busy} placeholder="Zapytaj Maxa..." style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#fff', fontFamily: 'inherit', outline: 'none' }} />
          <button onClick={() => send(inp)} disabled={busy || !inp.trim()} style={{ background: busy ? 'rgba(245,84,30,0.4)' : C.accent, border: 'none', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', color: '#fff', fontSize: 15, flexShrink: 0 }}>↑</button>
        </div>
      </div>
    </div>
  )
}

// ── SEGMENT TABS (top bar) ────────────────────────────────────────────────────
function SegmentTabs({ segments, active, done, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 0, background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 18, flexShrink: 0 }}>
      {segments.map((s, i) => {
        const isActive = active === s.id
        const isDone = done.has(s.id)
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            style={{
              flex: 1, padding: '10px 4px', border: 'none',
              borderRight: i < segments.length - 1 ? `1px solid ${C.border}` : 'none',
              background: isActive ? C.navy : isDone ? '#F0FFF4' : C.white,
              color: isActive ? '#fff' : isDone ? '#276749' : C.text3,
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 500,
              transition: 'all .15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}
          >
            <span style={{ fontSize: 16 }}>{isDone && !isActive ? '✓' : s.icon}</span>
            <span style={{ fontSize: 10 }}>{s.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── MAIN SHELL ────────────────────────────────────────────────────────────────
export default function LessonShell({ dzial, lekcja, segments, xpMap = {}, maxFaq = [] }) {
  const { xp, streak, addXP } = useXP()
  const lessonSlug = lekcja.slug || `lekcja-${dzial.n}-${lekcja.n}`
  const { done, markDone } = useCompletedSegments(lessonSlug)
  const [activeSegment, setActiveSegment] = useState(segments[0]?.id)
  const [xpPopup, setXpPopup] = useState({ visible: false, amount: 0 })

  const handleSegmentSelect = useCallback((id) => {
    setActiveSegment(id)
  }, [])

  const handleSegmentComplete = useCallback((segId) => {
    if (!done.has(segId)) {
      markDone(segId)
      const gain = xpMap[segId] || 20
      addXP(gain)
      setXpPopup({ visible: true, amount: gain })
      setTimeout(() => setXpPopup(p => ({ ...p, visible: false })), 2000)
    }
  }, [done, markDone, addXP, xpMap])

  const currentSegment = segments.find(s => s.id === activeSegment)
  const contentWithCallback = currentSegment
    ? typeof currentSegment.content === 'function'
      ? currentSegment.content({ onComplete: () => handleSegmentComplete(activeSegment) })
      : currentSegment.content
    : null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 230px', height: '100vh', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeup { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }
        a:hover { opacity: 0.85; }
      `}</style>

      <XPPopup amount={xpPopup.amount} visible={xpPopup.visible} />

      <Sidebar
        dzial={dzial} lekcja={lekcja} xp={xp} streak={streak}
        done={done} segments={segments}
        onSegmentClick={handleSegmentSelect}
        activeSegment={activeSegment}
      />

      <div style={{ overflow: 'auto', background: C.bg, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '13px 20px', position: 'sticky', top: 0, zIndex: 10, flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: C.text3, marginBottom: 3 }}>
            Dział {dzial.n} — {dzial.title} → <span style={{ color: C.accent, fontWeight: 500 }}>Lekcja {lekcja.n} z {lekcja.total}</span>
          </div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 19, fontWeight: 900, color: C.text, lineHeight: 1.2, marginBottom: 7 }}>{lekcja.title}</div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: '#EBF4FF', color: '#2B6CB0' }}>⏱ {lekcja.czas}</span>
            {lekcja.poziom && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: '#F0FFF4', color: '#276749' }}>{lekcja.poziom}</span>}
            {lekcja.cke && <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: '#FFF5EB', color: '#C05621' }}>CKE ✓</span>}
          </div>
        </div>

        <div style={{ padding: 18, flex: 1 }}>
          <SegmentTabs segments={segments} active={activeSegment} done={done} onSelect={handleSegmentSelect} />
          <div key={activeSegment} style={{ animation: 'fadeup 0.2s ease' }}>
            {contentWithCallback}
          </div>
        </div>
      </div>

      <MaxPanel maxFaq={maxFaq} lessonTitle={lekcja.title} />
    </div>
  )
}
