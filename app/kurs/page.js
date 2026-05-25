'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Mapa lekcji — slug → href
const LESSON_HREFS = {
  'rownania-liniowe': '/kurs/rownania-liniowe',
  'uklady-rownan':    '/kurs/uklady-rownan',
  'nierownosci':      '/kurs/nierownosci',
  'procenty':         '/kurs/procenty',
}

const DZIALY = [
  {
    n: '01', name: 'Liczby i działania', href: '/kurs/dzial-1',
    total: 8, done_static: 8, // ukończony — static
    lekcje: ['Liczby naturalne i całkowite','Ułamki zwykłe','Ułamki dziesiętne','Procenty','Potęgi i pierwiastki','Kolejność działań','Liczby wymierne i niewymierne','Sprawdzian działu'],
    slugs: [],
  },
  {
    n: '02', name: 'Wyrażenia algebraiczne', href: '/kurs/dzial-2',
    total: 6, done_static: 6,
    lekcje: ['Zmienne i wyrażenia','Upraszczanie wyrażeń','Wzory skróconego mnożenia','Wyłączanie przed nawias','Działania na wielomianach','Sprawdzian działu'],
    slugs: [],
  },
  {
    n: '03', name: 'Równania i nierówności', href: '/kurs/dzial-3',
    total: 6, done_static: null,
    lekcje: ['Równania liniowe','Układy równań','Nierówności liniowe','Zadania tekstowe','Zastosowania w geometrii','Sprawdzian działu'],
    slugs: ['rownania-liniowe','uklady-rownan','nierownosci','zadania-tekstowe','rownania-geometria','sprawdzian-3'],
  },
  {
    n: '04', name: 'Procenty i zastosowania', href: '/kurs/dzial-4',
    total: 5, done_static: null, badge: '✨ Nowe',
    lekcje: ['Zastosowania procentów','Procenty w statystyce','Punkty procentowe','Średnia i mediana','Prawdopodobieństwo'],
    slugs: ['procenty','procenty-statystyka','punkty-procentowe','srednia-mediana','prawdopodobienstwo'],
  },
  {
    n: '05', name: 'Funkcje', href: '/kurs/dzial-5',
    total: 5, done_static: null,
    lekcje: ['Pojęcie funkcji','Funkcja liniowa','Wykresy funkcji','Funkcja kwadratowa','Sprawdzian działu'],
    slugs: [],
  },
  {
    n: '06', name: 'Geometria płaska', href: '/kurs/dzial-6',
    total: 8, done_static: null,
    lekcje: ['Trójkąty','Czworokąty','Koło i okrąg','Pole i obwód','Twierdzenie Pitagorasa','Podobieństwo','Trygonometria','Sprawdzian działu'],
    slugs: [],
  },
  {
    n: '07', name: 'Bryły', href: '/kurs/dzial-7',
    total: 6, done_static: null,
    lekcje: ['Graniastosłupy','Ostrosłupy','Walec i stożek','Kula','Siatki brył','Sprawdzian działu'],
    slugs: [],
  },
  {
    n: '08', name: 'Statystyka i prawdopodobieństwo', href: '/kurs/dzial-8',
    total: 4, done_static: null,
    lekcje: ['Diagramy i wykresy','Średnia, mediana, dominanta','Prawdopodobieństwo','Sprawdzian działu'],
    slugs: [],
  },
  {
    n: '09', name: 'Próbny egzamin CKE', href: '/kurs/egzamin', exam: true,
    total: 3, done_static: null,
    lekcje: ['Arkusz 2022','Arkusz 2023','Arkusz 2024'],
    slugs: [],
  },
]

const ALL_SEGS = ['teoria','quiz','fiszki','kartkowka','cke','raport']

export default function KursPage() {
  const router = useRouter()
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(1)
  const [doneMap, setDoneMap] = useState({})
  const [hov, setHov] = useState(null)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    try {
      setXp(parseInt(localStorage.getItem('osemkarz_xp') || '0'))
      setStreak(parseInt(localStorage.getItem('osemkarz_streak') || '1'))
      const map = {}
      DZIALY.forEach(d => d.slugs.forEach(slug => {
        try {
          const raw = localStorage.getItem(`osemkarz_done_${slug}`)
          if (raw) map[slug] = new Set(JSON.parse(raw))
        } catch {}
      }))
      setDoneMap(map)
    } catch {}
  }, [])

  const countDone = (d) => {
    if (d.done_static !== null) return d.done_static
    return d.slugs.filter(slug => {
      const s = doneMap[slug]
      return s && ALL_SEGS.every(seg => s.has(seg))
    }).length
  }

  const totalDone = DZIALY.reduce((a, d) => a + countDone(d), 0)
  const totalAll = DZIALY.reduce((a, d) => a + d.total, 0)

  const C = {
    navy:'#0F1729', accent:'#F5541E', green:'#00B894',
    bg:'#F7F8FC', white:'#fff', border:'#E2E8F0',
    text:'#0F1729', text2:'#4A5568', text3:'#8896A5',
  }

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>

      <nav style={{ background:C.navy, padding:'0 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ maxWidth:960, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:56 }}>
          <Link href="/" style={{ fontFamily:'Fraunces,serif', fontSize:20, fontWeight:900, color:'#fff', textDecoration:'none' }}>
            Ósem<span style={{ color:C.accent }}>karz</span>
          </Link>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>🔥 <strong style={{ color:'#FDCB6E' }}>{streak}</strong></span>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>⚡ <strong style={{ color:'#fff' }}>{xp} XP</strong></span>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#F5541E,#FF7A4D)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>👤</div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'32px 20px' }}>

        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:26, fontWeight:900, color:C.text, marginBottom:4 }}>Twój kurs</h1>
          <p style={{ fontSize:14, color:C.text3 }}>Matematyka — Egzamin ósmoklasisty kl. 7–8</p>
        </div>

        {/* Stats dynamiczne */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:28 }}>
          {[
            { label:'Ukończone lekcje', val:`${totalDone} / ${totalAll}`, icon:'✅' },
            { label:'Zdobyte XP',       val:xp > 0 ? xp.toLocaleString('pl') : '0', icon:'⚡' },
            { label:'Seria dni',        val:streak, icon:'🔥' },
            { label:'Postęp kursu',     val:`${Math.round(totalDone/totalAll*100)}%`, icon:'📊' },
          ].map((s,i) => (
            <div key={i} style={{ background:C.white, borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, textAlign:'center' }}>
              <div style={{ fontSize:22, marginBottom:5 }}>{s.icon}</div>
              <div style={{ fontSize:20, fontWeight:700, color:C.text }}>{s.val}</div>
              <div style={{ fontSize:11, color:C.text3, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Działy — wszystkie klikalne */}
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {DZIALY.map((d, i) => {
            const done = countDone(d)
            const pct = Math.round((done / d.total) * 100)
            const isDone = done === d.total
            const isH = hov === i
            const isExpanded = expanded === i

            return (
              <div key={i} style={{
                background: C.white, borderRadius:14,
                border:`1px solid ${isH ? '#CBD5E0' : C.border}`,
                overflow:'hidden',
                boxShadow: isH ? '0 3px 12px rgba(0,0,0,0.06)' : 'none',
                transition:'all .15s',
              }}>
                {/* Główny wiersz — klikalny */}
                <div
                  onClick={() => router.push(d.href)}
                  onMouseEnter={() => setHov(i)}
                  onMouseLeave={() => setHov(null)}
                  style={{ padding:'15px 20px', display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}
                >
                  {/* Ikona */}
                  <div style={{
                    width:40, height:40, borderRadius:10, flexShrink:0,
                    background: isDone ? C.green : d.exam ? '#6C5CE7' : done > 0 ? C.accent : '#E8EDF3',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:13, color: (isDone || done > 0 || d.exam) ? '#fff' : C.text3, fontWeight:700,
                  }}>
                    {isDone ? '✓' : d.exam ? '📝' : d.n}
                  </div>

                  {/* Treść */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontSize:15, fontWeight:600, color:C.text }}>{d.name}</span>
                      {d.badge && <span style={{ fontSize:10, background:'rgba(0,184,148,0.12)', color:'#00856F', padding:'2px 8px', borderRadius:10, fontWeight:500 }}>{d.badge}</span>}
                      {d.exam && <span style={{ fontSize:10, background:'rgba(108,92,231,0.1)', color:'#6C5CE7', padding:'2px 8px', borderRadius:10, fontWeight:500 }}>Próbny</span>}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ flex:1, height:3, background:'#F0F0F0', borderRadius:2, overflow:'hidden', maxWidth:240 }}>
                        <div style={{ height:'100%', width:`${pct}%`, background: isDone ? C.green : C.accent, borderRadius:2, transition:'width .5s' }}/>
                      </div>
                      <span style={{ fontSize:12, color:C.text3, whiteSpace:'nowrap' }}>{done}/{d.total} lekcji</span>
                    </div>
                  </div>

                  {/* Akcja */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    {isDone
                      ? <span style={{ fontSize:13, fontWeight:500, color:C.green }}>✓ Ukończony</span>
                      : <div style={{
                          padding:'7px 14px', fontSize:12, fontWeight:600, borderRadius:8,
                          background: isH ? C.accent : 'rgba(245,84,30,0.08)',
                          color: isH ? '#fff' : C.accent,
                          transition:'all .15s',
                        }}>Otwórz →</div>
                    }
                    {/* Rozwiń lekcje */}
                    <div
                      onClick={e => { e.stopPropagation(); setExpanded(isExpanded ? null : i) }}
                      style={{ width:28, height:28, borderRadius:6, background:C.bg, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:C.text3, cursor:'pointer', transition:'transform .2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                    >▾</div>
                  </div>
                </div>

                {/* Rozwinięta lista lekcji */}
                {isExpanded && (
                  <div style={{ borderTop:`1px solid ${C.border}`, padding:'8px 16px 12px' }}>
                    {d.lekcje.map((l, j) => {
                      const slug = d.slugs[j]
                      const segDone = slug && doneMap[slug] ? ALL_SEGS.filter(s => doneMap[slug].has(s)).length : 0
                      const lessonDone = segDone === 6
                      const href = slug ? (LESSON_HREFS[slug] || d.href) : d.href
                      return (
                        <div
                          key={j}
                          onClick={() => router.push(href)}
                          style={{
                            display:'flex', alignItems:'center', gap:10,
                            padding:'9px 10px', borderRadius:8, cursor:'pointer',
                            transition:'background .12s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = C.bg}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{
                            width:24, height:24, borderRadius:6, flexShrink:0,
                            background: lessonDone ? '#EAF3DE' : segDone > 0 ? '#FFF5EB' : C.bg,
                            border:`1px solid ${lessonDone ? '#C0DD97' : segDone > 0 ? '#FDDCBA' : C.border}`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:10, fontWeight:600,
                            color: lessonDone ? '#27500A' : segDone > 0 ? '#C05621' : C.text3,
                          }}>
                            {lessonDone ? '✓' : j + 1}
                          </div>
                          <span style={{ fontSize:13, color: lessonDone ? '#27500A' : C.text2, flex:1 }}>{l}</span>
                          {segDone > 0 && !lessonDone && (
                            <span style={{ fontSize:11, color:'#C05621', background:'#FFF5EB', padding:'2px 7px', borderRadius:6 }}>{segDone}/6 segm.</span>
                          )}
                          {!lessonDone && !segDone && (
                            <span style={{ fontSize:11, color:C.text3 }}>→</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p style={{ textAlign:'center', fontSize:12, color:C.text3, marginTop:20 }}>
          Postęp aktualizuje się automatycznie po ukończeniu każdej lekcji · XP i postępy zapisywane lokalnie
        </p>
      </div>
    </div>
  )
}
