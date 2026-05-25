'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const LEKCJE_DEFAULT = [
  { n:1, title:'Zastosowania procentów',        desc:'Wielokrotne zmiany, mnożniki dziesiętne, stężenia, lokaty i odsetki',      czas:'30 min', xp:220, href:'/kurs/procenty',           status:'active' },
  { n:2, title:'Procenty w statystyce',          desc:'Diagramy procentowe, odczytywanie danych, obliczenia na wykresach',        czas:'20 min', xp:180, href:'#',                         status:'locked' },
  { n:3, title:'Punkty procentowe',              desc:'Różnica między p.p. a procentem, zadania z danych statystycznych',         czas:'15 min', xp:160, href:'#',                         status:'locked' },
  { n:4, title:'Średnia, mediana, dominanta',    desc:'Miary położenia, obliczanie ze zbioru danych, interpretacja',              czas:'20 min', xp:180, href:'#',                         status:'locked' },
  { n:5, title:'Prawdopodobieństwo',             desc:'Zdarzenia losowe, obliczanie prawdopodobieństwa, doświadczenia losowe',    czas:'20 min', xp:200, href:'#',                         status:'locked' },
  { n:6, title:'🏆 Sprawdzian działu',           desc:'25 zadań diagnostycznych · Analiza błędów · Raport Maxa',                 czas:'35 min', xp:450, href:'#',                         status:'locked', isTest:true },
]

const C = { navy:'#0F1729',accent:'#F5541E',green:'#00B894',bg:'#F7F8FC',white:'#fff',border:'#E2E8F0',text:'#0F1729',text2:'#4A5568',text3:'#8896A5' }

export default function Dzial4Page() {
  const router = useRouter()
  const [lekcje, setLekcje] = useState(LEKCJE_DEFAULT)
  const [showReset, setShowReset] = useState(false)
  const [toast, setToast] = useState(false)
  const [hov, setHov] = useState(null)

  useEffect(() => {
    try { const s = localStorage.getItem('osemkarz_dzial4'); if (s) setLekcje(JSON.parse(s)) } catch {}
  }, [])

  const done = lekcje.filter(l => l.status === 'done').length
  const total = lekcje.filter(l => !l.isTest).length
  const pct = Math.round((done / total) * 100)

  const handleReset = () => {
    const r = LEKCJE_DEFAULT.map((l, i) => ({ ...l, status: i === 0 ? 'active' : 'locked' }))
    setLekcje(r)
    try { localStorage.setItem('osemkarz_dzial4', JSON.stringify(r)) } catch {}
    setShowReset(false)
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>

      {/* MODAL RESET */}
      {showReset && (
        <div onClick={() => setShowReset(false)} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.white,borderRadius:16,padding:28,maxWidth:400,width:'100%',boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize:36,textAlign:'center',marginBottom:12 }}>⚠️</div>
            <div style={{ fontFamily:'Fraunces,serif',fontSize:20,fontWeight:900,color:C.text,textAlign:'center',marginBottom:8 }}>Resetować postępy?</div>
            <p style={{ fontSize:14,color:C.text2,lineHeight:1.7,textAlign:'center',marginBottom:24 }}>Wszystkie ukończone lekcje w tym dziale zostaną odznaczone. XP i odznaki pozostają.</p>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
              <button onClick={() => setShowReset(false)} style={{ padding:11,fontSize:13,fontWeight:500,borderRadius:8,border:`1px solid ${C.border}`,background:C.white,color:C.text,cursor:'pointer',fontFamily:'inherit' }}>Anuluj</button>
              <button onClick={handleReset} style={{ padding:11,fontSize:13,fontWeight:500,borderRadius:8,border:'none',background:'#E17055',color:'#fff',cursor:'pointer',fontFamily:'inherit' }}>Tak, resetuj</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:C.navy,color:'#fff',padding:'12px 24px',borderRadius:10,fontSize:13,fontWeight:500,zIndex:50,boxShadow:'0 8px 24px rgba(0,0,0,0.3)' }}>
          ✅ Postępy działu 4 zostały zresetowane
        </div>
      )}

      {/* NAV */}
      <nav style={{ background:C.navy,padding:'0 24px',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:10 }}>
        <div style={{ maxWidth:800,margin:'0 auto',display:'flex',alignItems:'center',gap:12,height:54 }}>
          <Link href="/kurs" style={{ color:'rgba(255,255,255,0.5)',fontSize:13,textDecoration:'none',padding:'5px 10px',borderRadius:7,border:'1px solid rgba(255,255,255,0.1)' }}>← Kurs</Link>
          <span style={{ color:'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontSize:13,color:'#fff',fontWeight:500 }}>Dział 4 — Procenty i statystyka</span>
          <div style={{ marginLeft:'auto',display:'flex',alignItems:'center',gap:10 }}>
            <button onClick={() => setShowReset(true)} style={{ fontSize:12,color:'rgba(255,255,255,0.4)',background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,padding:'5px 10px',cursor:'pointer',fontFamily:'inherit' }}>↺ Resetuj</button>
            <Link href="/kurs" style={{ fontFamily:'Fraunces,serif',fontSize:18,fontWeight:900,color:'#fff',textDecoration:'none' }}>Ósem<span style={{ color:C.accent }}>karz</span></Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:800,margin:'0 auto',padding:'28px 16px' }}>

        {/* HEADER */}
        <div style={{ background:C.navy,borderRadius:16,padding:'28px 32px',marginBottom:20,position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:-60,right:-60,width:200,height:200,background:'radial-gradient(circle,rgba(245,84,30,0.15) 0%,transparent 70%)',pointerEvents:'none' }} />
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.4)',marginBottom:6,textTransform:'uppercase',letterSpacing:'0.08em' }}>Dział 4 z 8</div>
          <div style={{ fontFamily:'Fraunces,serif',fontSize:26,fontWeight:900,color:'#fff',marginBottom:8 }}>Procenty i statystyka</div>
          <div style={{ fontSize:14,color:'rgba(255,255,255,0.5)',marginBottom:20,lineHeight:1.6 }}>Procenty pojawiają się w każdym arkuszu CKE — w zadaniach o cenach, statystyce i prawdopodobieństwie.</div>
          <div style={{ display:'flex',alignItems:'center',gap:16,marginBottom:14 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:6 }}>
                <span style={{ fontSize:12,color:'rgba(255,255,255,0.5)' }}>Postęp działu</span>
                <span style={{ fontSize:12,fontWeight:600,color:'#fff' }}>{done}/{total} lekcji</span>
              </div>
              <div style={{ height:6,background:'rgba(255,255,255,0.1)',borderRadius:3,overflow:'hidden' }}>
                <div style={{ height:'100%',width:`${pct}%`,background:'linear-gradient(90deg,#F5541E,#FF7A4D)',borderRadius:3,transition:'width 0.5s' }} />
              </div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:22,fontWeight:700,color:'#fff' }}>{pct}%</div>
              <div style={{ fontSize:11,color:'rgba(255,255,255,0.4)' }}>ukończone</div>
            </div>
          </div>
          <div style={{ display:'flex',gap:20 }}>
            {[['5','lekcji'],['1','sprawdzian'],['~120 min','łącznie'],['CKE','egzamin']].map(([v,l],i)=>(
              <div key={i}><div style={{ fontSize:15,fontWeight:700,color:'#fff' }}>{v}</div><div style={{ fontSize:11,color:'rgba(255,255,255,0.4)' }}>{l}</div></div>
            ))}
          </div>
        </div>

        {/* LISTA LEKCJI */}
        <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
          {lekcje.map((l, i) => {
            const locked = l.status === 'locked'
            const isH = hov === i && !locked
            return (
              <div key={i} onClick={() => !locked && router.push(l.href)} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
                style={{ background:l.isTest?C.navy:C.white,borderRadius:14,padding:'16px 20px',display:'flex',alignItems:'center',gap:16,cursor:locked?'not-allowed':'pointer',opacity:locked?0.5:1,transform:isH?'translateY(-1px)':'none',boxShadow:isH?'0 4px 16px rgba(0,0,0,0.08)':'none',transition:'all 0.15s',border:l.status==='active'?`2px solid ${C.accent}`:isH?'1.5px solid #CBD5E0':`1px solid ${l.isTest?'rgba(255,255,255,0.1)':C.border}` }}>
                <div style={{ width:44,height:44,borderRadius:l.isTest?'50%':10,flexShrink:0,background:l.status==='done'?C.green:l.status==='active'?C.accent:l.isTest?'rgba(255,255,255,0.1)':'#F0F0F0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:l.isTest?18:15,fontWeight:700,color:['done','active'].includes(l.status)?'#fff':l.isTest?'#fff':C.text3 }}>
                  {l.status==='done'?'✓':l.isTest?'🏆':l.n}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap' }}>
                    <span style={{ fontSize:15,fontWeight:600,color:l.isTest?'#fff':C.text }}>{l.title}</span>
                    {l.status==='active'&&<span style={{ fontSize:11,background:'rgba(245,84,30,0.12)',color:C.accent,padding:'2px 8px',borderRadius:10,fontWeight:500 }}>Dostępna</span>}
                    {l.status==='done'&&<span style={{ fontSize:11,background:'#F0FFF4',color:'#276749',padding:'2px 8px',borderRadius:10,fontWeight:500 }}>Ukończona</span>}
                    <span style={{ fontSize:10,background:l.isTest?'rgba(255,255,255,0.1)':'#FFF5EB',color:l.isTest?'rgba(255,255,255,0.5)':'#C05621',padding:'2px 7px',borderRadius:8 }}>CKE</span>
                  </div>
                  <div style={{ fontSize:13,color:l.isTest?'rgba(255,255,255,0.5)':C.text3,lineHeight:1.5 }}>{l.desc}</div>
                  <div style={{ display:'flex',gap:14,marginTop:5 }}>
                    <span style={{ fontSize:11,color:l.isTest?'rgba(255,255,255,0.35)':C.text3 }}>⏱ {l.czas}</span>
                    <span style={{ fontSize:11,color:'#FDCB6E' }}>⚡ +{l.xp} XP</span>
                  </div>
                </div>
                <div style={{ flexShrink:0 }}>
                  {locked
                    ?<span style={{ fontSize:18 }}>🔒</span>
                    :<div style={{ width:32,height:32,borderRadius:'50%',background:isH?C.navy:C.bg,border:`1px solid ${isH?'transparent':C.border}`,display:'flex',alignItems:'center',justifyContent:'center',color:isH?'#fff':C.text3,fontSize:14,transition:'all .15s' }}>→</div>}
                </div>
              </div>
            )
          })}
        </div>

        {/* INFO */}
        <div style={{ background:C.white,borderRadius:12,border:`1px solid ${C.border}`,padding:'16px 20px',marginTop:14,display:'flex',gap:14,alignItems:'flex-start' }}>
          <span style={{ fontSize:20,flexShrink:0 }}>💡</span>
          <div style={{ fontSize:13,color:C.text2,lineHeight:1.7 }}><strong style={{ color:C.text }}>Każda lekcja:</strong> Teoria (5 sekcji) → Quiz → Fiszki → Kartkówka (trening lub egzamin) → Zadanie CKE → Raport Maxa. Sprawdzian otwiera się po ukończeniu wszystkich 5 lekcji.</div>
        </div>

        {/* RESET */}
        <div style={{ marginTop:14,padding:'16px 20px',background:'#FFF5F5',borderRadius:12,border:'1px solid #FED7D7',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16 }}>
          <div>
            <div style={{ fontSize:13,fontWeight:500,color:'#9B2C2C',marginBottom:2 }}>Resetuj postępy działu 4</div>
            <div style={{ fontSize:12,color:'#C53030',lineHeight:1.5 }}>Odznacza wszystkie lekcje. XP i odznaki pozostają.</div>
          </div>
          <button onClick={() => setShowReset(true)} style={{ padding:'9px 18px',fontSize:13,fontWeight:500,borderRadius:8,border:'1px solid #FEB2B2',background:C.white,color:'#9B2C2C',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap',flexShrink:0 }}>↺ Resetuj</button>
        </div>

        {/* NAWIGACJA */}
        <div style={{ display:'flex',justifyContent:'space-between',marginTop:14,gap:10 }}>
          <Link href="/kurs" style={{ padding:'10px 18px',background:C.white,border:`1px solid ${C.border}`,borderRadius:10,fontSize:13,color:C.text,textDecoration:'none',fontWeight:500 }}>← Wróć do kursu</Link>
          <Link href="/kurs" style={{ padding:'10px 18px',background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,fontSize:13,color:C.text3,textDecoration:'none' }}>Dział 5: Funkcje →</Link>
        </div>
      </div>
    </div>
  )
}
