'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD — /kurs
// Dynamiczne statystyki z localStorage + klikalne działy + rozwijane lekcje
// Architektura: każda nowa lekcja dodaje się automatycznie gdy pojawi się slug
// ─────────────────────────────────────────────────────────────────────────────

// Wszystkie segmenty które muszą być ukończone by lekcja była "done"
const ALL_SEGS = ['teoria','quiz','fiszki','kartkowka','cke','raport']

// MASTER LISTA DZIAŁU — dodaj tu nowe lekcje gdy je budujesz
// status: 'live' = strona istnieje | 'soon' = brak strony, zablokowane
const DZIALY = [
  {
    n:1, name:'Liczby i działania', href:'/kurs/dzial-1',
    lekcje:[
      {n:1,name:'Liczby naturalne i całkowite',href:'#',slug:null},
      {n:2,name:'Ułamki zwykłe',href:'#',slug:null},
      {n:3,name:'Ułamki dziesiętne',href:'#',slug:null},
      {n:4,name:'Procenty — podstawy',href:'#',slug:null},
      {n:5,name:'Potęgi i pierwiastki',href:'#',slug:null},
      {n:6,name:'Kolejność działań',href:'#',slug:null},
      {n:7,name:'Liczby wymierne i niewymierne',href:'#',slug:null},
      {n:8,name:'Sprawdzian działu',href:'#',slug:null,isTest:true},
    ],
    staticDone: 8, // lekcje statycznie oznaczone jako ukończone (brak slugów)
  },
  {
    n:2, name:'Wyrażenia algebraiczne', href:'/kurs/dzial-2',
    lekcje:[
      {n:1,name:'Zmienne i wyrażenia',href:'#',slug:null},
      {n:2,name:'Upraszczanie wyrażeń',href:'#',slug:null},
      {n:3,name:'Wzory skróconego mnożenia',href:'#',slug:null},
      {n:4,name:'Wyłączanie przed nawias',href:'#',slug:null},
      {n:5,name:'Działania na wielomianach',href:'#',slug:null},
      {n:6,name:'Sprawdzian działu',href:'#',slug:null,isTest:true},
    ],
    staticDone: 6,
  },
  {
    n:3, name:'Równania i nierówności', href:'/kurs/dzial-3',
    lekcje:[
      {n:1,name:'Równania liniowe',href:'/kurs/rownania-liniowe',slug:'rownania-liniowe'},
      {n:2,name:'Układy równań',href:'/kurs/uklady-rownan',slug:'uklady-rownan'},
      {n:3,name:'Nierówności liniowe',href:'/kurs/nierownosci',slug:'nierownosci'},
      {n:4,name:'Zadania tekstowe',href:'/kurs/zadania-tekstowe',slug:'zadania-tekstowe'},
      {n:5,name:'Równania w geometrii',href:'/kurs/rownania-geometria',slug:'rownania-geometria'},
      {n:6,name:'Sprawdzian działu',href:'/kurs/sprawdzian-3',slug:'sprawdzian-3',isTest:true},
    ],
    staticDone: null,
  },
  {
    n:4, name:'Procenty i zastosowania', href:'/kurs/dzial-4',
    badge:'✨ Nowe',
    lekcje:[
      {n:1,name:'Zastosowania procentów',href:'/kurs/procenty',slug:'procenty'},
      {n:2,name:'Procenty w statystyce',href:'#',slug:null},
      {n:3,name:'Punkty procentowe',href:'#',slug:null},
      {n:4,name:'Średnia i mediana',href:'#',slug:null},
      {n:5,name:'Prawdopodobieństwo',href:'#',slug:null},
    ],
    staticDone: null,
  },
  {
    n:5, name:'Funkcje', href:'/kurs/dzial-5',
    lekcje:[
      {n:1,name:'Pojęcie funkcji',href:'#',slug:null},
      {n:2,name:'Funkcja liniowa',href:'#',slug:null},
      {n:3,name:'Wykresy funkcji',href:'#',slug:null},
      {n:4,name:'Funkcja kwadratowa',href:'#',slug:null},
      {n:5,name:'Sprawdzian działu',href:'#',slug:null,isTest:true},
    ],
    staticDone: null,
  },
  {
    n:6, name:'Geometria płaska', href:'/kurs/dzial-6',
    lekcje:[
      {n:1,name:'Trójkąty',href:'#',slug:null},
      {n:2,name:'Czworokąty',href:'#',slug:null},
      {n:3,name:'Koło i okrąg',href:'#',slug:null},
      {n:4,name:'Pole i obwód',href:'#',slug:null},
      {n:5,name:'Twierdzenie Pitagorasa',href:'#',slug:null},
      {n:6,name:'Podobieństwo',href:'#',slug:null},
      {n:7,name:'Trygonometria',href:'#',slug:null},
      {n:8,name:'Sprawdzian działu',href:'#',slug:null,isTest:true},
    ],
    staticDone: null,
  },
  {
    n:7, name:'Bryły', href:'/kurs/dzial-7',
    lekcje:[
      {n:1,name:'Graniastosłupy',href:'#',slug:null},
      {n:2,name:'Ostrosłupy',href:'#',slug:null},
      {n:3,name:'Walec i stożek',href:'#',slug:null},
      {n:4,name:'Kula',href:'#',slug:null},
      {n:5,name:'Siatki brył',href:'#',slug:null},
      {n:6,name:'Sprawdzian działu',href:'#',slug:null,isTest:true},
    ],
    staticDone: null,
  },
  {
    n:8, name:'Statystyka i prawdopodobieństwo', href:'/kurs/dzial-8',
    lekcje:[
      {n:1,name:'Diagramy i wykresy',href:'#',slug:null},
      {n:2,name:'Średnia, mediana, dominanta',href:'#',slug:null},
      {n:3,name:'Prawdopodobieństwo',href:'#',slug:null},
      {n:4,name:'Sprawdzian działu',href:'#',slug:null,isTest:true},
    ],
    staticDone: null,
  },
  {
    n:9, name:'Próbny egzamin CKE', href:'/kurs/egzamin',
    exam: true,
    lekcje:[
      {n:1,name:'Arkusz 2022',href:'#',slug:null},
      {n:2,name:'Arkusz 2023',href:'#',slug:null},
      {n:3,name:'Arkusz 2024',href:'#',slug:null},
    ],
    staticDone: null,
  },
]

const TOTAL_LEKCJI = DZIALY.reduce((a,d) => a + d.lekcje.length, 0)

// Zlicza ile segmentów ukończono dla danego sluga
function getSegsDone(slug, doneMap) {
  if (!slug) return 0
  const s = doneMap[slug]
  if (!s) return 0
  return ALL_SEGS.filter(seg => s.has(seg)).length
}

// Czy lekcja jest w pełni ukończona
function isLessonDone(slug, doneMap) {
  if (!slug) return false
  return getSegsDone(slug, doneMap) === ALL_SEGS.length
}

export default function KursPage() {
  const router = useRouter()
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(1)
  const [doneMap, setDoneMap] = useState({})
  const [expanded, setExpanded] = useState(null)
  const [hov, setHov] = useState(null)

  // Czyta wszystkie dane z localStorage przy każdym mount
  useEffect(() => {
    const load = () => {
      try {
        setXp(parseInt(localStorage.getItem('osemkarz_xp') || '0'))
        setStreak(parseInt(localStorage.getItem('osemkarz_streak') || '1'))
        // Skanuje WSZYSTKIE możliwe slugi z DZIALY
        const map = {}
        DZIALY.forEach(d => d.lekcje.forEach(l => {
          if (!l.slug) return
          const raw = localStorage.getItem(`osemkarz_done_${l.slug}`)
          if (raw) {
            try { map[l.slug] = new Set(JSON.parse(raw)) } catch {}
          }
        }))
        setDoneMap(map)
      } catch {}
    }
    load()
    // Odświeżaj gdy tab zyska fokus (powrót z lekcji)
    window.addEventListener('focus', load)
    return () => window.removeEventListener('focus', load)
  }, [])

  // Liczy ukończone lekcje per dział
  const getDzialDone = (dzial) => {
    if (dzial.staticDone !== null && dzial.staticDone !== undefined) return dzial.staticDone
    return dzial.lekcje.filter(l => isLessonDone(l.slug, doneMap)).length
  }

  const totalDone = DZIALY.reduce((a, d) => a + getDzialDone(d), 0)
  const progressPct = Math.round((totalDone / TOTAL_LEKCJI) * 100)

  const C = {
    navy:'#0F1729', accent:'#F5541E', green:'#00B894',
    bg:'#F7F8FC', white:'#fff', border:'#E2E8F0',
    text:'#0F1729', text2:'#4A5568', text3:'#8896A5',
  }

  return (
    <div style={{minHeight:'100vh',background:C.bg,fontFamily:"'DM Sans',sans-serif"}}>

      {/* NAV */}
      <nav style={{background:C.navy,padding:'0 24px',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:20}}>
        <div style={{maxWidth:960,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:56}}>
          <Link href="/" style={{fontFamily:'Fraunces,serif',fontSize:20,fontWeight:900,color:'#fff',textDecoration:'none',letterSpacing:'-0.5px'}}>
            Ósem<span style={{color:C.accent}}>karz</span>
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            {/* XP pill */}
            <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.08)',borderRadius:20,padding:'5px 14px',border:'1px solid rgba(255,255,255,0.1)'}}>
              <span style={{fontSize:14}}>⚡</span>
              <span style={{fontSize:13,fontWeight:700,color:'#fff'}}>{xp.toLocaleString('pl')} XP</span>
            </div>
            {/* Streak pill */}
            <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,0.08)',borderRadius:20,padding:'5px 14px',border:'1px solid rgba(255,255,255,0.1)'}}>
              <span style={{fontSize:14}}>🔥</span>
              <span style={{fontSize:13,fontWeight:700,color:'#FDCB6E'}}>{streak}</span>
            </div>
            <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#F5541E,#FF7A4D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,marginLeft:4}}>👤</div>
          </div>
        </div>
      </nav>

      <div style={{maxWidth:960,margin:'0 auto',padding:'28px 20px'}}>

        {/* HEADER + PROGRESS BAR */}
        <div style={{background:C.navy,borderRadius:16,padding:'28px 32px',marginBottom:20,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:-40,right:-40,width:220,height:220,background:'radial-gradient(circle,rgba(245,84,30,0.12) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',bottom:-60,left:-20,width:180,height:180,background:'radial-gradient(circle,rgba(0,184,148,0.08) 0%,transparent 70%)',pointerEvents:'none'}}/>

          <div style={{fontSize:12,color:'rgba(255,255,255,.35)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:6}}>Twój postęp</div>
          <div style={{fontFamily:'Fraunces,serif',fontSize:24,fontWeight:900,color:'#fff',marginBottom:4}}>Matematyka — Egzamin ósmoklasisty</div>
          <div style={{fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:20}}>kl. 7–8 · zgodny z podstawą programową MEN 2024 i CKE 2025</div>

          {/* Progress bar */}
          <div style={{marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontSize:12,color:'rgba(255,255,255,.5)'}}>Ukończone lekcje</span>
              <span style={{fontSize:12,fontWeight:600,color:'#fff'}}>{totalDone} / {TOTAL_LEKCJI}</span>
            </div>
            <div style={{height:8,background:'rgba(255,255,255,0.1)',borderRadius:4,overflow:'hidden'}}>
              <div style={{height:'100%',width:`${progressPct}%`,background:'linear-gradient(90deg,#F5541E,#FF7A4D)',borderRadius:4,transition:'width .6s ease'}}/>
            </div>
          </div>

          {/* Stats row */}
          <div style={{display:'flex',gap:24,marginTop:18}}>
            {[
              {icon:'📚',val:`${totalDone}/${TOTAL_LEKCJI}`,label:'lekcji ukończonych'},
              {icon:'⚡',val:xp > 0 ? xp.toLocaleString('pl') : '0',label:'punktów XP'},
              {icon:'🔥',val:streak,label:'dni z rzędu'},
              {icon:'📊',val:`${progressPct}%`,label:'kursu ukończone'},
            ].map((s,i)=>(
              <div key={i}>
                <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:2}}>{s.icon} {s.label}</div>
                <div style={{fontSize:18,fontWeight:700,color:'#fff'}}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LISTA DZIAŁÓW */}
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {DZIALY.map((d,i) => {
            const done = getDzialDone(d)
            const pct = Math.round((done / d.lekcje.length) * 100)
            const allDone = done === d.lekcje.length
            const isExp = expanded === i
            const isH = hov === i
            const hasPage = d.href && d.href !== '#'

            return (
              <div key={i} style={{background:C.white,borderRadius:12,border:`1px solid ${isH?'#CBD5E0':C.border}`,overflow:'hidden',transition:'box-shadow .15s, border-color .15s',boxShadow:isH?'0 3px 12px rgba(0,0,0,0.06)':'none'}}>

                {/* Główny wiersz */}
                <div
                  onClick={() => hasPage && router.push(d.href)}
                  onMouseEnter={() => setHov(i)}
                  onMouseLeave={() => setHov(null)}
                  style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:14,cursor:hasPage?'pointer':'default'}}
                >
                  {/* Ikona numeru/statusu */}
                  <div style={{width:40,height:40,borderRadius:10,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,
                    background: allDone ? C.green : done > 0 ? C.accent : d.exam ? '#6C5CE7' : '#EEF0F5',
                    color: (allDone || done > 0 || d.exam) ? '#fff' : C.text3,
                  }}>
                    {allDone ? '✓' : d.exam ? '📝' : String(d.n).padStart(2,'0')}
                  </div>

                  {/* Nazwa + pasek */}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5,flexWrap:'wrap'}}>
                      <span style={{fontSize:14,fontWeight:600,color:C.text}}>{d.name}</span>
                      {d.badge && <span style={{fontSize:10,fontWeight:500,background:'rgba(0,184,148,0.12)',color:'#00856F',padding:'2px 7px',borderRadius:10}}>{d.badge}</span>}
                      {d.exam && <span style={{fontSize:10,fontWeight:500,background:'rgba(108,92,231,0.1)',color:'#6C5CE7',padding:'2px 7px',borderRadius:10}}>Próbny egzamin</span>}
                      {done > 0 && !allDone && <span style={{fontSize:10,fontWeight:500,background:'rgba(245,84,30,0.1)',color:C.accent,padding:'2px 7px',borderRadius:10}}>W trakcie</span>}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{flex:1,height:3,background:'#F0F0F0',borderRadius:2,overflow:'hidden',maxWidth:260}}>
                        <div style={{height:'100%',width:`${pct}%`,background:allDone ? C.green : C.accent,borderRadius:2,transition:'width .5s'}}/>
                      </div>
                      <span style={{fontSize:11,color:C.text3,whiteSpace:'nowrap'}}>{done}/{d.lekcje.length} lekcji</span>
                    </div>
                  </div>

                  {/* Przycisk + strzałka rozwijania */}
                  <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                    {hasPage && (
                      <div style={{padding:'7px 14px',fontSize:12,fontWeight:600,borderRadius:8,whiteSpace:'nowrap',background:isH?C.accent:'rgba(245,84,30,0.08)',color:isH?'#fff':C.accent,transition:'all .15s'}}>
                        {allDone ? '✓ Ukończony' : 'Otwórz →'}
                      </div>
                    )}
                    <button
                      onClick={e=>{e.stopPropagation();setExpanded(isExp?null:i)}}
                      style={{width:28,height:28,borderRadius:6,background:C.bg,border:`1px solid ${C.border}`,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:C.text3,transition:'transform .2s',transform:isExp?'rotate(180deg)':'none'}}
                      title="Pokaż lekcje"
                    >▾</button>
                  </div>
                </div>

                {/* Rozwinięta lista lekcji */}
                {isExp && (
                  <div style={{borderTop:`1px solid ${C.border}`,padding:'6px 12px 10px'}}>
                    {d.lekcje.map((l,j) => {
                      const segs = getSegsDone(l.slug, doneMap)
                      const lDone = l.slug ? isLessonDone(l.slug, doneMap) : (d.staticDone ? j < d.staticDone : false)
                      const hasHref = l.href && l.href !== '#'
                      const isActive = l.slug && doneMap[l.slug] && segs > 0 && !lDone

                      return (
                        <div
                          key={j}
                          onClick={() => hasHref && router.push(l.href)}
                          style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:8,cursor:hasHref?'pointer':'default',transition:'background .12s'}}
                          onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                          onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                        >
                          {/* Status ikona */}
                          <div style={{width:26,height:26,borderRadius:7,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,
                            background: lDone ? '#EAF3DE' : isActive ? '#FFF5EB' : C.bg,
                            border: `1px solid ${lDone ? '#C0DD97' : isActive ? '#FDDCBA' : C.border}`,
                            color: lDone ? '#27500A' : isActive ? '#C05621' : C.text3,
                          }}>
                            {lDone ? '✓' : l.isTest ? '🏆' : j+1}
                          </div>

                          {/* Nazwa */}
                          <span style={{fontSize:13,color:lDone?'#27500A':C.text2,flex:1,fontWeight:lDone?500:400}}>{l.name}</span>

                          {/* Progress segmentów */}
                          {l.slug && segs > 0 && !lDone && (
                            <div style={{display:'flex',gap:3,flexShrink:0}}>
                              {ALL_SEGS.map((seg,si)=>(
                                <div key={si} style={{width:5,height:14,borderRadius:2,background:doneMap[l.slug]?.has(seg)?C.green:'#E2E8F0'}}/>
                              ))}
                            </div>
                          )}

                          {/* Badge */}
                          {!hasHref && !lDone && <span style={{fontSize:11,color:C.text3}}>Wkrótce</span>}
                          {hasHref && !lDone && <span style={{fontSize:11,color:C.text3}}>→</span>}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{textAlign:'center',padding:'20px 0 8px',fontSize:12,color:C.text3}}>
          Postęp aktualizuje się automatycznie po każdej ukończonej lekcji · {TOTAL_LEKCJI} lekcji w programie
        </div>
      </div>
    </div>
  )
}
