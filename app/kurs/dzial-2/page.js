'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const LEKCJE = [
  { n:1, title:'Zmienne i wyrażenia',        desc:'Pojęcie zmiennej, wyrażenia algebraiczne, wartość wyrażenia',          czas:'15 min', xp:120, href:'#',                              status:'soon' },
  { n:2, title:'Upraszczanie wyrażeń',        desc:'Trzy prawa algebry, redukcja wyrazów podobnych, nawiasy zagnieżdżone', czas:'25 min', xp:220, href:'/kurs/wyrazenia-algebraiczne', status:'active' },
  { n:3, title:'Wzory skróconego mnożenia',   desc:'(a±b)², (a+b)(a-b), zastosowania w zadaniach CKE',                   czas:'20 min', xp:180, href:'#',                              status:'soon' },
  { n:4, title:'Wyłączanie przed nawias',     desc:'NWW wyrazów, faktoryzacja wyrażeń, upraszczanie ułamków algebraicznych',czas:'20 min', xp:180, href:'#',                              status:'soon' },
  { n:5, title:'Działania na wielomianach',   desc:'Dodawanie, odejmowanie, mnożenie wielomianów',                        czas:'20 min', xp:180, href:'#',                              status:'soon' },
  { n:6, title:'Sprawdzian działu',           desc:'25 zadań · Analiza błędów · Raport Maxa',                             czas:'35 min', xp:450, href:'#',                              status:'soon', isTest:true },
]

const C = { navy:'#0F1729',accent:'#F5541E',green:'#00B894',bg:'#F7F8FC',white:'#fff',border:'#E2E8F0',text:'#0F1729',text2:'#4A5568',text3:'#8896A5' }

export default function Dzial2Page() {
  const router = useRouter()
  const [hov, setHov] = useState(null)

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'DM Sans',sans-serif" }}>
      <nav style={{ background:C.navy, padding:'0 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, zIndex:10 }}>
        <div style={{ maxWidth:800, margin:'0 auto', display:'flex', alignItems:'center', gap:12, height:54 }}>
          <Link href="/kurs" style={{ color:'rgba(255,255,255,0.5)', fontSize:13, textDecoration:'none', padding:'5px 10px', borderRadius:7, border:'1px solid rgba(255,255,255,0.1)' }}>← Kurs</Link>
          <span style={{ color:'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontSize:13, color:'#fff', fontWeight:500 }}>Dział 2 — Wyrażenia algebraiczne</span>
          <Link href="/" style={{ marginLeft:'auto', fontFamily:'Fraunces,serif', fontSize:18, fontWeight:900, color:'#fff', textDecoration:'none' }}>Ósem<span style={{ color:C.accent }}>karz</span></Link>
        </div>
      </nav>

      <div style={{ maxWidth:800, margin:'0 auto', padding:'28px 16px' }}>
        <div style={{ background:C.navy, borderRadius:16, padding:'28px 32px', marginBottom:20, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, background:'radial-gradient(circle,rgba(245,84,30,0.15) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.08em' }}>Dział 2 z 8</div>
          <div style={{ fontFamily:'Fraunces,serif', fontSize:26, fontWeight:900, color:'#fff', marginBottom:8 }}>Wyrażenia algebraiczne</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)', marginBottom:20, lineHeight:1.6 }}>Fundamenty algebry — zmienne, upraszczanie, prawa matematyki i wzory skróconego mnożenia.</div>
          <div style={{ display:'flex', gap:20 }}>
            {[['5','lekcji'],['1','sprawdzian'],['~100 min','łącznie'],['CKE','egzamin']].map(([v,l],i)=>(
              <div key={i}><div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{v}</div><div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{l}</div></div>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {LEKCJE.map((l,i) => {
            const soon = l.status === 'soon'
            const isH = hov === i && !soon
            return (
              <div key={i}
                onClick={() => !soon && router.push(l.href)}
                onMouseEnter={() => setHov(i)}
                onMouseLeave={() => setHov(null)}
                style={{ background:l.isTest?C.navy:C.white, borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, cursor:soon?'not-allowed':'pointer', opacity:soon?0.5:1, transform:isH?'translateY(-1px)':'none', boxShadow:isH?'0 4px 16px rgba(0,0,0,0.08)':'none', transition:'all 0.15s', border:l.status==='active'?`2px solid ${C.accent}`:`1px solid ${l.isTest?'rgba(255,255,255,0.1)':C.border}` }}>
                <div style={{ width:44, height:44, borderRadius:l.isTest?'50%':10, flexShrink:0, background:l.status==='active'?C.accent:l.isTest?'rgba(255,255,255,0.1)':'#F0F0F0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:l.isTest?18:15, fontWeight:700, color:l.status==='active'?'#fff':l.isTest?'#fff':C.text3 }}>
                  {l.isTest ? '🏆' : l.n}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ fontSize:15, fontWeight:600, color:l.isTest?'#fff':C.text }}>{l.title}</span>
                    {l.status==='active' && <span style={{ fontSize:11, background:'rgba(245,84,30,0.12)', color:C.accent, padding:'2px 8px', borderRadius:10, fontWeight:500 }}>Dostępna</span>}
                    {soon && <span style={{ fontSize:11, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.3)', padding:'2px 8px', borderRadius:10 }}>Wkrótce</span>}
                    <span style={{ fontSize:10, background:l.isTest?'rgba(255,255,255,0.1)':'#FFF5EB', color:l.isTest?'rgba(255,255,255,0.4)':'#C05621', padding:'2px 7px', borderRadius:8 }}>CKE</span>
                  </div>
                  <div style={{ fontSize:13, color:l.isTest?'rgba(255,255,255,0.5)':C.text3, lineHeight:1.5 }}>{l.desc}</div>
                  <div style={{ display:'flex', gap:14, marginTop:5 }}>
                    <span style={{ fontSize:11, color:l.isTest?'rgba(255,255,255,0.35)':C.text3 }}>⏱ {l.czas}</span>
                    <span style={{ fontSize:11, color:'#FDCB6E' }}>⚡ +{l.xp} XP</span>
                  </div>
                </div>
                <div style={{ flexShrink:0 }}>
                  {soon
                    ? <span style={{ fontSize:18 }}>🔒</span>
                    : <div style={{ width:32, height:32, borderRadius:'50%', background:isH?C.navy:C.bg, border:`1px solid ${isH?'transparent':C.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:isH?'#fff':C.text3, fontSize:14, transition:'all .15s' }}>→</div>}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:14, gap:10 }}>
          <Link href="/kurs" style={{ padding:'10px 18px', background:C.white, border:`1px solid ${C.border}`, borderRadius:10, fontSize:13, color:C.text, textDecoration:'none', fontWeight:500 }}>← Wróć do kursu</Link>
          <Link href="/kurs/dzial-3" style={{ padding:'10px 18px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, fontSize:13, color:C.text3, textDecoration:'none' }}>Dział 3: Równania →</Link>
        </div>
      </div>
    </div>
  )
}
