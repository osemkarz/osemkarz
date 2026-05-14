'use client'
import LessonShell from '../LessonShell'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA 1: Równania liniowe z jedną niewiadomą — Dział 3
// ─────────────────────────────────────────────────────────────────────────────

const C = { navy:'#0F1729',accent:'#F5541E',green:'#00B894',purple:'#6C5CE7',bg:'#F7F8FC',white:'#fff',border:'#E2E8F0',text:'#0F1729',text2:'#4A5568',text3:'#8896A5' }
const card = { background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }
const btn = (x={}) => ({ padding:'10px 22px', fontSize:13, fontWeight:500, borderRadius:8, cursor:'pointer', fontFamily:'inherit', border:`1.5px solid ${C.border}`, background:C.white, color:C.text, ...x })
const Step = ({n,text,result,hi,col=C.navy}) => (
  <div style={{display:'flex',gap:10,marginBottom:10}}>
    <div style={{width:22,height:22,background:col,color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0,marginTop:2}}>{n}</div>
    <div>
      <div style={{fontSize:13,color:C.text2,marginBottom:4,lineHeight:1.5}}>{text}</div>
      <div style={hi?{background:'#F0FFF4',borderLeft:'3px solid #00B894',padding:'7px 12px',borderRadius:'0 7px 7px 0',fontFamily:'monospace',fontSize:14,color:'#276749',fontWeight:600}:{background:C.bg,padding:'6px 10px',borderRadius:6,fontFamily:'monospace',fontSize:13,color:C.text,display:'inline-block'}}>{result}</div>
    </div>
  </div>
)
const TaskBox = ({label,eq}) => (
  <div style={{background:'linear-gradient(135deg,#FFF5EB,#FFFAF5)',border:'1px solid #FDDCBA',borderRadius:8,padding:'12px 16px',margin:'14px 0'}}>
    <div style={{fontSize:11,fontWeight:600,color:C.accent,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>{label}</div>
    <div style={{fontFamily:'monospace',fontSize:18,color:C.text,fontWeight:500,lineHeight:1.8}}>{eq}</div>
  </div>
)
const RuleBox = ({bg,bc,c,children}) => (
  <div style={{background:bg,borderLeft:`3px solid ${bc}`,borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:c,lineHeight:1.7,margin:'12px 0'}}>{children}</div>
)

// ── TEORIA ────────────────────────────────────────────────────────────────────
const TTABS = [
  {id:'def',label:'Co to równanie'},
  {id:'proste',label:'Równania ax+b=c'},
  {id:'obustrony',label:'x po obu stronach'},
  {id:'nawiasy',label:'Równania z nawiasami'},
  {id:'bledy',label:'⚠️ Błędy i sprawdzanie'},
]

function TeoriaContent({onComplete}) {
  const [tab,setTab] = useState('def')
  const CONTENT = {
    def: <div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}><strong style={{color:C.text}}>Równanie</strong> to zdanie matematyczne zawierające <strong style={{color:C.text}}>znak równości</strong> i przynajmniej jedną <strong style={{color:C.text}}>niewiadomą</strong> (x). Rozwiązanie to wartość, która zamieniona za x daje prawdziwe zdanie.</p>
      <div style={{background:C.navy,borderRadius:10,padding:'16px 20px',textAlign:'center',marginBottom:14}}>
        <div style={{fontFamily:'monospace',fontSize:20,color:'#fff',lineHeight:2}}><span style={{color:'#FF7A4D'}}>a</span>x + <span style={{color:'#FF7A4D'}}>b</span> = <span style={{color:'#00B894'}}>c</span></div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:4}}>Ogólna postać równania liniowego z jedną niewiadomą</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        {[['Wyrażenie algebraiczne','2x + 3','Brak znaku =, nie można rozwiązać','#F5F3FF','#6C5CE7'],['Równanie','2x + 3 = 11','Ma znak =, szukamy x które spełnia','#F0FFF4','#00B894']].map(([t,f,d,bg,c])=>(
          <div key={t} style={{background:bg,borderRadius:8,padding:'12px 14px',border:`1px solid ${c}22`}}>
            <div style={{fontSize:12,fontWeight:600,color:c,marginBottom:4}}>{t}</div>
            <div style={{fontFamily:'monospace',fontSize:16,color:C.text,marginBottom:6,fontWeight:600}}>{f}</div>
            <div style={{fontSize:12,color:C.text2,lineHeight:1.5}}>{d}</div>
          </div>
        ))}
      </div>
      <RuleBox bg='#EBF4FF' bc='#185FA5' c='#0C447C'>💡 <strong>Kluczowa zasada:</strong> Możemy wykonywać dowolne działania na <strong>obu stronach równania jednocześnie</strong> — dodawanie, odejmowanie, mnożenie, dzielenie (≠ 0).</RuleBox>
      <div style={{marginTop:14}}>
        <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:8}}>Rodzaje równań na egzaminie CKE:</div>
        {[['ax + b = c','najprostsze — jedna operacja','#F0FFF4','#276749'],['ax + b = cx + d','x po obu stronach','#FFF5EB','#C05621'],['a(bx + c) = d','z nawiasem','#F5F3FF','#4C1D95'],['a(bx+c) = d(ex+f)','nawiasy po obu stronach','#FFF5F5','#9B2C2C']].map(([eq,desc,bg,c])=>(
          <div key={eq} style={{display:'flex',gap:12,alignItems:'center',padding:'8px 12px',background:bg,borderRadius:7,marginBottom:6}}>
            <div style={{fontFamily:'monospace',fontSize:14,color:c,fontWeight:600,minWidth:200}}>{eq}</div>
            <div style={{fontSize:12,color:C.text2}}>{desc}</div>
          </div>
        ))}
      </div>
    </div>,

    proste: <div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}>Równanie <strong style={{color:C.text}}>ax + b = c</strong> rozwiązujemy w dwóch krokach: izolujemy x przez przeniesienie liczb, potem dzielimy przez współczynnik.</p>
      <TaskBox label="Przykład 1 — najprostszy typ" eq="2x + 3 = 11" />
      <Step n={1} text="Odejmujemy 3 od obu stron:" result="2x = 8" />
      <Step n={2} text="Dzielimy przez 2:" result="x = 4 ✓" hi />
      <RuleBox bg='#F0FFF4' bc='#00B894' c='#276749'>✅ Sprawdzenie: 2·<strong>4</strong> + 3 = 8 + 3 = 11 ✓</RuleBox>
      <TaskBox label="Przykład 2 — ujemne wyrazy" eq="5x − 8 = 17" />
      <Step n={1} text="Dodajemy 8 do obu stron:" result="5x = 25" />
      <Step n={2} text="Dzielimy przez 5:" result="x = 5 ✓" hi />
      <TaskBox label="Przykład 3 — wynik ułamkowy (typ CKE!)" eq="3x + 2 = 9" />
      <Step n={1} text="Odejmujemy 2:" result="3x = 7" />
      <Step n={2} text="Dzielimy przez 3:" result="x = 7/3 ✓" hi />
      <RuleBox bg='#FFF5EB' bc='#F5541E' c='#C05621'>💡 Na egzaminie CKE wynik może być <strong>ułamkiem zwykłym lub dziesiętnym</strong> — to normalne!</RuleBox>
      <TaskBox label="Przykład 4 — ujemny współczynnik przy x" eq="−4x + 1 = 13" />
      <Step n={1} text="Odejmujemy 1:" result="−4x = 12" />
      <Step n={2} text="Dzielimy przez −4:" result="x = −3 ✓" hi />
    </div>,

    obustrony: <div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}>Gdy x pojawia się po obu stronach — <strong style={{color:C.text}}>przenosimy wszystkie wyrazy z x na lewą stronę</strong>, liczby na prawą.</p>
      <RuleBox bg='#FFF5EB' bc='#F5541E' c='#C05621'>⚠️ <strong>Uwaga!</strong> Zmiana strony = zmiana znaku! +3x po prawej → −3x po lewej.</RuleBox>
      <TaskBox label="Przykład 1 — standardowy" eq="4x + 2 = 2x + 10" />
      <Step n={1} text="Przenosimy 2x na lewą (odejmujemy 2x od obu stron):" result="4x − 2x + 2 = 10" />
      <Step n={2} text="Upraszczamy:" result="2x + 2 = 10" />
      <Step n={3} text="Odejmujemy 2, dzielimy przez 2:" result="x = 4 ✓" hi />
      <RuleBox bg='#F0FFF4' bc='#00B894' c='#276749'>✅ Sprawdzenie: 4·4+2 = 18 i 2·4+10 = 18 ✓</RuleBox>
      <TaskBox label="Przykład 2 — x z ujemnym współczynnikiem po prawej" eq="x + 5 = 7 − 2x" />
      <Step n={1} text="Dodajemy 2x do obu stron:" result="3x + 5 = 7" />
      <Step n={2} text="Odejmujemy 5, dzielimy przez 3:" result="x = 2/3 ✓" hi />
      <div style={{background:C.bg,borderRadius:8,padding:'14px 16px',marginTop:14}}>
        <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:10}}>Typowe błędy — CKE to sprawdza:</div>
        {[['Błąd: nie zmieniono znaku','4x + 2 = 2x + 10 → 4x + 2x = 10 ✗','#FFF5F5','#9B2C2C'],['Poprawnie:','4x − 2x = 10 − 2 ✓','#F0FFF4','#276749']].map(([l,eq,bg,c])=>(
          <div key={l} style={{background:bg,borderRadius:6,padding:'8px 12px',marginBottom:6,fontSize:12}}>
            <div style={{color:c,fontWeight:500}}>{l}</div>
            <div style={{fontFamily:'monospace',color:c,marginTop:2}}>{eq}</div>
          </div>
        ))}
      </div>
    </div>,

    nawiasy: <div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}>Gdy w równaniu pojawia się nawias — <strong style={{color:C.text}}>najpierw go rozwijamy</strong> (rozdzielność mnożenia), potem rozwiązujemy.</p>
      <div style={{background:C.navy,borderRadius:10,padding:'14px 20px',textAlign:'center',marginBottom:14}}>
        <div style={{fontFamily:'monospace',fontSize:18,color:'#fff',lineHeight:2}}><span style={{color:'#FF7A4D'}}>a</span>(<span style={{color:'#FF7A4D'}}>b</span>x + <span style={{color:'#FF7A4D'}}>c</span>) = <span style={{color:'#FF7A4D'}}>a</span>·<span style={{color:'#FF7A4D'}}>b</span>x + <span style={{color:'#FF7A4D'}}>a</span>·<span style={{color:'#FF7A4D'}}>c</span></div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:4}}>Rozdzielność mnożenia</div>
      </div>
      <TaskBox label="Przykład 1 — nawias z plusem" eq="3(x + 5) = 24" />
      <Step n={1} text="Rozwijamy nawias:" result="3x + 15 = 24" />
      <Step n={2} text="Odejmujemy 15, dzielimy przez 3:" result="x = 3 ✓" hi />
      <TaskBox label="Przykład 2 — nawias z minusem ⚠️" eq="4(x − 2) = 2x + 2" />
      <Step n={1} text="Rozwijamy nawias (uwaga na znak!):" result="4x − 8 = 2x + 2" />
      <Step n={2} text="Przenosimy x na lewą:" result="2x = 10" />
      <Step n={3} text="Dzielimy przez 2:" result="x = 5 ✓" hi />
      <RuleBox bg='#FFF5F5' bc='#E17055' c='#9B2C2C'>⚠️ <strong>Najczęstszy błąd:</strong> 4(x−2) = 4x − 2 (źle!) zamiast 4x − 8. Mnożysz przez WSZYSTKO w nawiasie!</RuleBox>
      <TaskBox label="Przykład 3 — nawiasy po obu stronach (typ CKE!)" eq="2(x + 3) = 3(x − 1)" />
      <Step n={1} text="Rozwijamy oba nawiasy:" result="2x + 6 = 3x − 3" />
      <Step n={2} text="Przenosimy: 2x−3x = −3−6" result="−x = −9" />
      <Step n={3} text="Mnożymy przez −1:" result="x = 9 ✓" hi />
      <TaskBox label="Przykład 4 — minus przed nawiasem ⚠️" eq="5x − (2x + 4) = 8" />
      <Step n={1} text="Rozwijamy (minus odwraca WSZYSTKIE znaki):" result="5x − 2x − 4 = 8" />
      <Step n={2} text="Upraszczamy i rozwiązujemy:" result="x = 4 ✓" hi />
    </div>,

    bledy: <div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}><strong style={{color:C.text}}>Sprawdzenie rozwiązania</strong> jest obowiązkowe w zadaniach otwartych CKE. Pominięcie = brak punktu!</p>
      <div style={{background:C.navy,borderRadius:10,padding:'16px 20px',marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:500,color:'#fff',marginBottom:10}}>Schemat sprawdzania (4 kroki):</div>
        {[['1. Weź oryginalne równanie','4x + 2 = 2x + 10'],['2. Podstaw znalezione x','x=4: 4·4+2 = 2·4+10'],['3. Oblicz obie strony','LS = 18, PS = 18'],['4. Sprawdź równość','LS = PS ✓ → x = 4 jest rozwiązaniem']].map(([s,eq])=>(
          <div key={s} style={{display:'flex',gap:10,marginBottom:6,alignItems:'center'}}>
            <div style={{fontSize:12,color:'rgba(255,255,255,.5)',minWidth:220}}>{s}</div>
            <div style={{fontFamily:'monospace',fontSize:13,color:'#FF7A4D'}}>{eq}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:10}}>Najczęstsze błędy na egzaminie CKE:</div>
      {[['Błąd znaku przy przenoszeniu','2x + 5 = x + 9 → 2x + x = 9 + 5 ✗','Poprawnie: 2x − x = 9 − 5 → x = 4'],['Błąd przy nawiasie z minusem','−(x + 3) = −x + 3 ✗','Poprawnie: −(x+3) = −x − 3'],['Dzielenie tylko jednej strony','3x = 12 → x = 12 (bez dzielenia PS) ✗','Poprawnie: 3x ÷ 3 = 12 ÷ 3 → x = 4'],['Pominięcie sprawdzenia','Brak weryfikacji = brak punktu za uzasadnienie','Zawsze sprawdzaj w ORYGINALNYM równaniu']].map(([t,w,ok])=>(
        <div key={t} style={{background:C.bg,borderRadius:8,padding:'12px 14px',marginBottom:8,borderLeft:'3px solid #E17055'}}>
          <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:6}}>⚠️ {t}</div>
          <div style={{fontFamily:'monospace',fontSize:12,color:'#9B2C2C',marginBottom:4}}>{w}</div>
          <div style={{fontFamily:'monospace',fontSize:12,color:'#276749'}}>✓ {ok}</div>
        </div>
      ))}
    </div>,
  }

  const idx = TTABS.findIndex(t=>t.id===tab)
  return (
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.purple,marginBottom:12}}>📖 Teoria</div>
      <div style={{display:'flex',gap:6,marginBottom:18,flexWrap:'wrap'}}>
        {TTABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'6px 14px',fontSize:12,fontWeight:500,borderRadius:20,cursor:'pointer',fontFamily:'inherit',border:`1.5px solid ${tab===t.id?C.navy:C.border}`,background:tab===t.id?C.navy:C.white,color:tab===t.id?'#fff':C.text2,transition:'all .15s'}}>{t.label}</button>)}
      </div>
      {CONTENT[tab]}
      <div style={{display:'flex',justifyContent:'space-between',marginTop:20,gap:8}}>
        {idx>0 && <button onClick={()=>setTab(TTABS[idx-1].id)} style={btn()}>← Poprzednia</button>}
        {idx<TTABS.length-1
          ? <button onClick={()=>setTab(TTABS[idx+1].id)} style={btn({marginLeft:'auto'})}>Następna sekcja →</button>
          : <button onClick={onComplete} style={btn({background:C.navy,color:'#fff',border:'none',marginLeft:'auto'})}>✓ Ukończyłem teorię →</button>}
      </div>
    </div>
  )
}

// ── QUIZ ──────────────────────────────────────────────────────────────────────
const QUIZ = [
  {q:'Rozwiąż równanie:',eq:'2x + 5 = 13',opts:['x = 4','x = 9','x = 3','x = 6'],ans:0,dlaczego:'Krok 1: odejmujemy 5 od obu stron → 2x = 8. Krok 2: dzielimy przez 2 → x = 4. Sprawdzenie: 2·4+5=13 ✓'},
  {q:'Rozwiąż równanie (x po obu stronach):',eq:'3x − 4 = x + 8',opts:['x = 2','x = 6','x = 4','x = 8'],ans:1,dlaczego:'Przenosimy x na lewą: 3x−x = 8+4 → 2x = 12 → x = 6. Sprawdzenie: 3·6−4=14 i 6+8=14 ✓'},
  {q:'Rozwiąż równanie z nawiasem:',eq:'2(x + 3) = 14',opts:['x = 7','x = 5','x = 4','x = 8'],ans:2,dlaczego:'Rozwijamy: 2x+6=14. Odejmujemy 6: 2x=8. Dzielimy: x=4. Sprawdzenie: 2·(4+3)=14 ✓'},
  {q:'Które x spełnia równanie 5x − 3 = 2x + 9?',eq:'',opts:['x = 2','x = 4','x = 6','x = 3'],ans:1,dlaczego:'5x−2x = 9+3 → 3x = 12 → x = 4. Sprawdzenie: 5·4−3=17 i 2·4+9=17 ✓'},
  {q:'Ojciec jest 3 razy starszy od syna. Za 8 lat razem będą mieć 64 lata. Ile lat ma teraz syn?',eq:'',opts:['x = 10','x = 12','x = 8','x = 14'],ans:1,dlaczego:'Syn=x, ojciec=3x. Za 8 lat: (x+8)+(3x+8)=64 → 4x+16=64 → 4x=48 → x=12.'},
]

function QuizContent({onComplete}) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([])
  if(qi>=QUIZ.length){const ok=results.filter(r=>r).length;return(
    <div style={card}>
      <div style={{textAlign:'center',padding:'16px 0 24px'}}>
        <div style={{fontSize:48,marginBottom:8}}>{ok>=4?'🎯':ok>=3?'👍':'📚'}</div>
        <div style={{fontFamily:'Fraunces,serif',fontSize:24,fontWeight:900,color:C.text,marginBottom:6}}>{ok}/{QUIZ.length} poprawnych</div>
        <div style={{fontSize:14,color:C.text2}}>{ok>=4?'Świetnie! Czas na fiszki.':'Powtórz teorię i spróbuj ponownie.'}</div>
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
        <button onClick={()=>{setQi(0);setSel(null);setDone(false);setResults([])}} style={btn()}>Powtórz quiz</button>
        <button onClick={onComplete} style={btn({background:C.navy,color:'#fff',border:'none'})}>✓ Ukończyłem quiz →</button>
      </div>
    </div>
  )}
  const q=QUIZ[qi]
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.green,marginBottom:12}}>🧠 Quiz — pytanie {qi+1}/{QUIZ.length}</div>
      <div style={{display:'flex',gap:4,marginBottom:16}}>{QUIZ.map((_,i)=><div key={i} style={{height:4,flex:1,borderRadius:2,background:i<qi?C.green:i===qi?C.accent:C.border,transition:'background .3s'}}/>)}</div>
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:10,lineHeight:1.5}}>{q.q}</div>
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'11px 18px',marginBottom:16,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div></div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#F0FFF4';border='#00B894';color='#276749'}else if(i===sel){bg='#FFF5F5';border='#E17055';color='#9B2C2C'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setResults(p=>[...p,i===q.ans])}} style={{border:`1.5px solid ${border}`,borderRadius:8,padding:'11px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:15,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<>
        <div style={{padding:'12px 16px',borderRadius:8,marginBottom:10,display:'flex',gap:10,alignItems:'flex-start',background:sel===q.ans?'#F0FFF4':'#FFF5F5',border:`1px solid ${sel===q.ans?'#C6F6D5':'#FED7D7'}`,color:sel===q.ans?'#276749':'#9B2C2C'}}>
          <span style={{fontSize:16,flexShrink:0}}>{sel===q.ans?'✅':'❌'}</span>
          <div style={{fontSize:13,lineHeight:1.7}}><strong>{sel===q.ans?'Świetnie!':'Nie tym razem.'}</strong>
            <div style={{background:'#F5F3FF',border:'1px solid #C4B5FD',borderRadius:6,padding:'8px 12px',marginTop:8,fontSize:12,color:'#4C1D95',lineHeight:1.7}}>💡 <strong>Dlaczego?</strong> {q.dlaczego}</div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button onClick={()=>{if(qi<QUIZ.length-1){setQi(q=>q+1);setSel(null);setDone(false)}else setQi(QUIZ.length)}} style={btn({background:C.navy,color:'#fff',border:'none'})}>{qi<QUIZ.length-1?'Następne →':'Zobacz wynik →'}</button>
        </div>
      </>}
    </div>
  )
}

// ── FISZKI ────────────────────────────────────────────────────────────────────
const FISZKI = [
  {q:'Co to jest równanie?',a:'Zdanie matematyczne z znakiem = i niewiadomą. Rozwiązanie to wartość, która czyni to zdanie prawdziwym.',f:'2x + 3 = 11 → szukamy x'},
  {q:'Co to jest rozwiązanie (korzeń) równania?',a:'Wartość nevědomej, która podstawiona do równania daje prawdziwe zdanie.',f:'x=4 jest rozwiązaniem 2x+3=11',note:'bo: 2·4+3=11 ✓'},
  {q:'Podstawowa zasada rozwiązywania równań',a:'Możemy wykonywać dowolne działania na obu stronach — o ile robimy to samo po obu stronach.',f:'a = b ⟺ a + c = b + c'},
  {q:'Schemat rozwiązania ax + b = c',a:'Krok 1: przenieś b na prawą (odejmij). Krok 2: podziel przez a.',f:'ax+b=c → ax=c−b → x=(c−b)/a',note:'Pamiętaj: a ≠ 0'},
  {q:'Jak rozwiązać gdy x jest po obu stronach?',a:'Przenieś wszystkie wyrazy z x na lewą, liczby na prawą.',f:'ax+b=cx+d → (a−c)x = d−b',note:'Zmiana strony = zmiana znaku!'},
  {q:'Jak rozwinąć nawias a(b + c)?',a:'Mnożymy a przez każdy wyraz w nawiasie.',f:'a(b+c) = ab + ac',note:'Uwaga: −(x+3) = −x − 3, nie −x + 3!'},
  {q:'Co to jest równanie sprzeczne?',a:'Nie ma rozwiązań — po uproszczeniu daje fałszywe zdanie.',f:'x+1=x+5 → 1=5 ✗ → brak rozwiązań'},
  {q:'Co to jest równanie tożsamościowe?',a:'Prawdziwe dla każdej wartości x — nieskończenie wiele rozwiązań.',f:'2(x+1)=2x+2 → 0=0 ✓',note:'Każda liczba rzeczywista jest rozwiązaniem.'},
  {q:'Jak sprawdzić poprawność rozwiązania?',a:'Podstaw x do ORYGINALNEGO równania i sprawdź czy obie strony są równe.',f:'x=3 w 2x+1=7: 2·3+1=7 → 7=7 ✓',note:'Sprawdzaj zawsze w oryginalnym, nie przekształconym!'},
  {q:'Strategia zadania tekstowego z równaniem',a:'1. Oznacz x. 2. Wyraź resztę przez x. 3. Ułóż równanie z treści. 4. Rozwiąż. 5. Sprawdź w treści.',f:'x → wyrażenia → równanie → wynik → weryfikacja'},
]

function FiszkiContent({onComplete}) {
  const [deck,setDeck]=useState(FISZKI.map((f,i)=>({...f,id:i}))),[flipped,setFlipped]=useState(false),[mastered,setMastered]=useState(0)
  if(deck.length===0)return(
    <div style={{...card,textAlign:'center'}}>
      <div style={{fontSize:48,marginBottom:8}}>🎴</div>
      <div style={{fontFamily:'Fraunces,serif',fontSize:22,fontWeight:900,color:C.text,marginBottom:6}}>Wszystkie {FISZKI.length} kart opanowane!</div>
      <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:16}}>
        <button onClick={()=>{setDeck(FISZKI.map((f,i)=>({...f,id:i})));setFlipped(false);setMastered(0)}} style={btn()}>Powtórz fiszki</button>
        <button onClick={onComplete} style={btn({background:C.navy,color:'#fff',border:'none'})}>✓ Ukończyłem fiszki →</button>
      </div>
    </div>
  )
  const c=deck[0],pct=Math.round((mastered/FISZKI.length)*100)
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.accent,marginBottom:10}}>🃏 Fiszki ({mastered}/{FISZKI.length} opanowane)</div>
      <div style={{height:4,background:C.border,borderRadius:2,marginBottom:12,overflow:'hidden'}}><div style={{height:'100%',background:C.green,width:`${pct}%`,transition:'width .3s',borderRadius:2}}/></div>
      <div style={{fontSize:12,color:C.text3,textAlign:'center',marginBottom:12}}>Pozostało: {deck.length} kart · Kliknij żeby obrócić</div>
      <div onClick={()=>setFlipped(f=>!f)} style={{cursor:'pointer',minHeight:180,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',padding:28,textAlign:'center',background:flipped?C.white:C.navy,border:`1px solid ${flipped?C.border:'rgba(255,255,255,.08)'}`,transition:'background .3s',marginBottom:14}}>
        {!flipped
          ?<div><div style={{fontSize:11,color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10}}>Fiszka {mastered+1}/{FISZKI.length}</div><div style={{fontSize:16,fontWeight:500,color:'#fff',lineHeight:1.5}}>{c.q}</div><div style={{fontSize:11,color:'rgba(255,255,255,.3)',marginTop:10}}>Kliknij żeby zobaczyć odpowiedź</div></div>
          :<div><div style={{fontSize:14,fontWeight:500,color:C.text,lineHeight:1.6,marginBottom:8}}>{c.a}</div>{c.f&&<div style={{fontFamily:'monospace',fontSize:15,color:C.accent,fontWeight:600,margin:'8px 0'}}>{c.f}</div>}{c.note&&<div style={{fontSize:12,color:C.text3}}>{c.note}</div>}</div>}
      </div>
      {flipped&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlipped(false)}} style={btn({background:'#E17055',color:'#fff',border:'none',textAlign:'center'})}>😅 Trudna — powtórz</button>
        <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlipped(false)}} style={btn({background:C.green,color:'#fff',border:'none',textAlign:'center'})}>✅ Łatwa — następna</button>
      </div>}
    </div>
  )
}

// ── KARTKÓWKA ─────────────────────────────────────────────────────────────────
const KARTKOWKA = [
  {q:'Rozwiąż:',eq:'x + 7 = 12',opts:['x = 5','x = 19','x = 7','x = 4'],ans:0,hint:'Odejmij 7 od obu stron.'},
  {q:'Rozwiąż:',eq:'3x = 18',opts:['x = 54','x = 15','x = 6','x = 21'],ans:2,hint:'Podziel obie strony przez 3.'},
  {q:'Rozwiąż:',eq:'4x − 3 = 13',opts:['x = 4','x = 5','x = 2','x = 10'],ans:0,hint:'Najpierw dodaj 3, potem podziel przez 4.'},
  {q:'Rozwiąż:',eq:'2x + 6 = x + 10',opts:['x = 8','x = 2','x = 4','x = 16'],ans:2,hint:'Przenieś x na lewą, liczby na prawą.'},
  {q:'Rozwiąż:',eq:'5x − 2 = 3x + 8',opts:['x = 5','x = 3','x = 1','x = 6'],ans:0,hint:'5x − 3x = 8 + 2'},
  {q:'Rozwiąż:',eq:'3(x + 4) = 18',opts:['x = 2','x = 6','x = 14','x = 10'],ans:0,hint:'Rozwiń nawias: 3x + 12 = 18'},
  {q:'Rozwiąż:',eq:'2(3x − 1) = 4x + 6',opts:['x = 4','x = 2','x = 8','x = 1'],ans:0,hint:'Rozwiń: 6x − 2 = 4x + 6, przenieś x.'},
  {q:'Które x spełnia 3x + 2 = 11?',eq:'',opts:['x = 2','x = 3','x = 4','x = 5'],ans:1,hint:'Rozwiąż lub sprawdź każdą opcję.'},
  {q:'Tomek ma 2x kart, Kacper x kart. Razem 36 kart. Ile ma Kacper?',eq:'',opts:['x = 18','x = 12','x = 24','x = 9'],ans:1,hint:'x + 2x = 36 → 3x = 36 → x = 12'},
  {q:'Rozwiąż:',eq:'2(x + 1) + 3 = x + 9',opts:['x = 4','x = 6','x = 2','x = 8'],ans:0,hint:'Rozwiń: 2x + 2 + 3 = x + 9'},
]

function KartkowkaContent({onComplete}) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([]),[timer,setTimer]=useState(600),[hint,setHint]=useState(false)
  const ref=useRef(null)
  useEffect(()=>{if(mode==='egzamin'&&ki<KARTKOWKA.length){ref.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(ref.current);setKi(KARTKOWKA.length);return 0}return t-1}),1000)}return()=>clearInterval(ref.current)},[mode,ki])
  if(!mode)return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'#185FA5',marginBottom:12}}>✏️ Kartkówka — 10 pytań</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
        {[['trening','🏋️','Tryb trening','Podpowiedzi dostępne'],['egzamin','🎯','Tryb egzamin','Timer 10 min, bez podpowiedzi']].map(([m,ico,t,d])=>(
          <div key={m} onClick={()=>setMode(m)} style={{border:`2px solid ${mode===m?C.navy:C.border}`,borderRadius:12,padding:16,cursor:'pointer',background:mode===m?C.navy:C.white,textAlign:'center'}}>
            <div style={{fontSize:24,marginBottom:8}}>{ico}</div>
            <div style={{fontSize:14,fontWeight:600,color:mode===m?'#fff':C.text,marginBottom:4}}>{t}</div>
            <div style={{fontSize:12,color:mode===m?'rgba(255,255,255,.5)':C.text3}}>{d}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>mode&&setKi(0)} disabled={!mode} style={btn({width:'100%',textAlign:'center',background:mode?C.navy:'#E2E8F0',color:mode?'#fff':C.text3,border:'none',padding:'13px',cursor:mode?'pointer':'not-allowed'})}>Zacznij kartkówkę →</button>
    </div>
  )
  if(ki>=KARTKOWKA.length){const ok=results.filter(r=>r).length;return(
    <div style={{...card,textAlign:'center'}}>
      <div style={{fontSize:52,marginBottom:8}}>{ok>=8?'🏆':ok>=6?'⭐':'📚'}</div>
      <div style={{fontFamily:'Fraunces,serif',fontSize:24,fontWeight:900,color:C.text,marginBottom:6}}>{ok}/10 poprawnych</div>
      <div style={{fontSize:14,color:C.text2,marginBottom:20}}>Ocena: {ok>=9?'A':ok>=7?'B':ok>=5?'C':'D'}</div>
      <div style={{display:'flex',justifyContent:'center',gap:8}}>
        <button onClick={()=>{setMode(null);setKi(0);setSel(null);setDone(false);setResults([]);setTimer(600)}} style={btn()}>Powtórz</button>
        <button onClick={onComplete} style={btn({background:C.navy,color:'#fff',border:'none'})}>✓ Raport Maxa →</button>
      </div>
    </div>
  )}
  const q=KARTKOWKA[ki],mins=Math.floor(timer/60).toString().padStart(2,'0'),secs=(timer%60).toString().padStart(2,'0')
  return(
    <div style={card}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'#185FA5'}}>✏️ Kartkówka {ki+1}/{KARTKOWKA.length}</div>
        {mode==='egzamin'&&<div style={{fontFamily:'monospace',fontSize:18,fontWeight:600,color:timer<60?'#E17055':C.text,background:timer<60?'#FFF5F5':C.bg,padding:'4px 12px',borderRadius:8,border:`1px solid ${timer<60?'#FED7D7':C.border}`}}>{mins}:{secs}</div>}
      </div>
      <div style={{display:'flex',gap:4,marginBottom:14}}>{KARTKOWKA.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i<ki?C.green:i===ki?C.accent:C.border}}/>)}</div>
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:10}}>{q.q}</div>
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'10px 18px',marginBottom:14,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div></div>}
      {mode==='trening'&&!done&&<div onClick={()=>setHint(h=>!h)} style={{background:'#FFF5EB',border:'1px solid #FDDCBA',borderRadius:8,padding:'9px 14px',marginBottom:12,fontSize:12,color:'#C05621',cursor:'pointer'}}>💡 {hint?q.hint:'Kliknij po podpowiedź'}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#F0FFF4';border='#00B894';color='#276749'}else if(i===sel){bg='#FFF5F5';border='#E17055';color='#9B2C2C'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setResults(p=>[...p,i===q.ans])}} style={{border:`1.5px solid ${border}`,borderRadius:8,padding:'11px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:15,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={()=>{if(ki<KARTKOWKA.length-1){setKi(k=>k+1);setSel(null);setDone(false);setHint(false)}else setKi(KARTKOWKA.length)}} style={btn({background:C.navy,color:'#fff',border:'none'})}>{ki<KARTKOWKA.length-1?'Dalej →':'Zakończ →'}</button></div>}
    </div>
  )
}

// ── ZADANIE CKE ───────────────────────────────────────────────────────────────
const CKE_ZADANIA = [
  {rok:2023,nr:5,pkt:2,tresc:'Rozwiąż równanie: 3(x + 2) = 2x + 10',wskazowka:'Rozwiń nawias, potem przenieś x na lewą stronę.',rozwiazanie:['3x + 6 = 2x + 10','3x − 2x = 10 − 6','x = 4'],odp:'x = 4',schemat:'Za poprawne rozwiązanie: 1 pkt. Za sprawdzenie: 1 pkt.'},
  {rok:2022,nr:7,pkt:2,tresc:'Suma dwóch kolejnych liczb naturalnych wynosi 47. Znajdź te liczby.',wskazowka:'Oznacz mniejszą liczbę przez x. Kolejna to x+1. Ułóż równanie z treści.',rozwiazanie:['x + (x+1) = 47','2x + 1 = 47','2x = 46','x = 23'],odp:'Szukane liczby to 23 i 24',schemat:'Za ułożenie równania: 1 pkt. Za obie liczby: 1 pkt.'},
  {rok:2024,nr:9,pkt:3,tresc:'Adam ma teraz 4 razy więcej pieniędzy niż Bartek. Za rok Adam dostanie 10 zł, a Bartek 20 zł i wtedy będą mieć razem 130 zł. Ile pieniędzy ma teraz Adam?',wskazowka:'Bartek = x, Adam = 4x. Za rok: (4x+10)+(x+20)=130.',rozwiazanie:['Bartek = x, Adam = 4x','(4x+10) + (x+20) = 130','5x + 30 = 130','5x = 100','x = 20, Adam = 4·20 = 80 zł'],odp:'Adam ma teraz 80 zł',schemat:'Za oznaczenie: 1 pkt. Za równanie: 1 pkt. Za wynik: 1 pkt.'},
]

function CKEContent({onComplete}) {
  const [revealed,setRevealed]=useState([]),[showSol,setShowSol]=useState(Array(CKE_ZADANIA.length).fill(false))
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'#185FA5',marginBottom:4}}>📝 Zadania z arkuszy CKE</div>
      <p style={{fontSize:13,color:C.text2,marginBottom:16,lineHeight:1.6}}>Autentyczne zadania z egzaminów ósmoklasisty. Spróbuj samodzielnie, potem sprawdź wzorcowe rozwiązanie ze schematem oceniania.</p>
      {CKE_ZADANIA.map((z,i)=>(
        <div key={i} style={{background:C.bg,borderRadius:12,border:`1px solid ${C.border}`,padding:'18px 20px',marginBottom:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <span style={{fontSize:12,fontWeight:600,background:'#EBF4FF',color:'#2B6CB0',padding:'3px 10px',borderRadius:20}}>CKE {z.rok}</span>
            <span style={{fontSize:12,color:C.text3}}>Zadanie {z.nr}</span>
            <span style={{fontSize:12,fontWeight:600,color:'#FDCB6E',marginLeft:'auto'}}>⚡ {z.pkt} pkt</span>
          </div>
          <div style={{fontSize:15,fontWeight:500,color:C.text,lineHeight:1.6,marginBottom:12}}>{z.tresc}</div>
          <div onClick={()=>setRevealed(r=>r.includes(i)?r:[...r,i])} style={{background:'#FFF5EB',border:'1px solid #FDDCBA',borderRadius:8,padding:'9px 14px',marginBottom:10,fontSize:12,color:'#C05621',cursor:'pointer'}}>
            💡 {revealed.includes(i)?z.wskazowka:'Kliknij po wskazówkę'}
          </div>
          <button onClick={()=>setShowSol(p=>p.map((v,j)=>j===i?!v:v))} style={btn({fontSize:12,padding:'8px 16px'})}>
            {showSol[i]?'▲ Ukryj rozwiązanie':'▼ Pokaż wzorcowe rozwiązanie'}
          </button>
          {showSol[i]&&(
            <div style={{marginTop:12,background:C.white,borderRadius:8,border:`1px solid ${C.border}`,padding:'14px 16px'}}>
              {z.rozwiazanie.map((s,j)=>(
                <div key={j} style={{display:'flex',gap:8,marginBottom:6,alignItems:'center'}}>
                  <div style={{width:20,height:20,background:C.navy,color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0}}>{j+1}</div>
                  <div style={{fontFamily:'monospace',fontSize:14,color:C.text}}>{s}</div>
                </div>
              ))}
              <div style={{background:'#F0FFF4',border:'1px solid #C6F6D5',borderRadius:8,padding:'8px 12px',marginTop:10,fontSize:13,color:'#276749',fontWeight:500}}>Odpowiedź: {z.odp}</div>
              <div style={{background:'#F5F3FF',border:'1px solid #C4B5FD',borderRadius:8,padding:'8px 12px',marginTop:8,fontSize:12,color:'#4C1D95'}}>📋 Schemat: {z.schemat}</div>
            </div>
          )}
        </div>
      ))}
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
        <button onClick={onComplete} style={btn({background:C.navy,color:'#fff',border:'none'})}>✓ Ukończyłem zadania CKE →</button>
      </div>
    </div>
  )
}

// ── RAPORT ────────────────────────────────────────────────────────────────────
function RaportContent({onComplete}) {
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'#854F0B',marginBottom:12}}>📊 Raport Maxa</div>
      <div style={{textAlign:'center',padding:'10px 0 20px'}}>
        <div style={{fontSize:52,marginBottom:8}}>🏆</div>
        <div style={{fontFamily:'Fraunces,serif',fontSize:24,fontWeight:900,color:C.text,marginBottom:4}}>Lekcja ukończona!</div>
        <div style={{fontSize:14,color:C.text2}}>Równania liniowe masz za sobą</div>
      </div>
      <div style={{background:C.navy,borderRadius:12,padding:'18px 20px',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#F5541E,#FF7A4D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🤖</div>
          <div style={{fontSize:13,fontWeight:600,color:'#fff'}}>Max — podsumowanie lekcji</div>
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.85)',lineHeight:1.75,marginBottom:12}}>Równania liniowe to fundament całej algebry. Na egzaminie CKE wychodzą w każdym arkuszu — w zadaniach zamkniętych i otwartych. Trzy zasady które musisz znać na pamięć:</div>
        {[['Zmiana strony = zmiana znaku','Przenosząc wyraz na drugą stronę zawsze zmieniaj znak. +3x → −3x.'],['Nawias z minusem','−(x+3) = −x−3, nie −x+3. Minus zmienia znak KAŻDEGO wyrazu w nawiasie.'],['Sprawdzenie obowiązkowe','W zadaniach otwartych CKE zawsze wpisz sprawdzenie. To dodatkowy punkt!']].map(([t,d],i)=>(
          <div key={i} style={{display:'flex',gap:8,marginBottom:8,fontSize:12,color:'rgba(255,255,255,.75)',lineHeight:1.6}}>
            <span style={{color:'#F5541E',flexShrink:0}}>→</span><span><strong>{t}:</strong> {d}</span>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        <button onClick={onComplete} style={btn({background:C.green,color:'#fff',border:'none'})}>✓ Oznacz jako ukończoną</button>
        <Link href="/kurs/dzial-3" style={{...btn(),textDecoration:'none',display:'inline-block'}}>← Wróć do działu 3</Link>
      </div>
    </div>
  )
}

// ── KONFIGURACJA ──────────────────────────────────────────────────────────────
const DZIAL_CONFIG = {
  n:3, title:'Równania i nierówności', href:'/kurs/dzial-3',
  lekcje:[
    {n:1,title:'Równania liniowe',href:'/kurs/rownania-liniowe',status:'active'},
    {n:2,title:'Układy równań',href:'/kurs/uklady-rownan',status:'locked'},
    {n:3,title:'Nierówności liniowe',href:'/kurs/nierownosci',status:'locked'},
    {n:4,title:'Zadania tekstowe',href:'/kurs/zadania-tekstowe',status:'locked'},
    {n:5,title:'Równania w geometrii',href:'/kurs/rownania-geometria',status:'locked'},
    {n:6,title:'Sprawdzian działu',href:'/kurs/sprawdzian-3',status:'locked',isTest:true},
  ],
}
const LEKCJA_CONFIG = {n:1,total:5,slug:'rownania-liniowe',title:'Równania liniowe z jedną niewiadomą',czas:'15 min',poziom:'Poziom: podstawowy',cke:true}
const XP_MAP = {teoria:40,quiz:50,fiszki:60,kartkowka:80,cke:60,raport:30}
const MAX_FAQ = [
  {q:'zmiana strony znak',a:'Gdy przenosisz wyraz na drugą stronę równania — zawsze zmieniaj znak! +3x po prawej staje się −3x po lewej. Pamiętaj: "zmiana strony = zmiana znaku".'},
  {q:'nawias minus',a:'Minus przed nawiasem zmienia znaki WSZYSTKICH wyrazów w środku: −(x+3) = −x−3, NIE −x+3. To jeden z najczęstszych błędów na egzaminie!'},
  {q:'sprawdzenie',a:'Sprawdzenie: podstaw znalezione x do ORYGINALNEGO równania i oblicz obie strony. Jeśli są równe — dobrze! W zadaniach otwartych CKE sprawdzenie = dodatkowy punkt.'},
  {q:'zadanie tekstowe',a:'Strategia: 1) Oznacz x (zwykle mniejszą lub nieznaną wielkość). 2) Wyraź resztę przez x. 3) Ułóż równanie z treści. 4) Rozwiąż. 5) Sprawdź czy wynik ma sens w kontekście zadania.'},
]

export default function RownaniaTiLesson() {
  const segments = [
    {id:'teoria',icon:'📖',label:'Teoria',content:({onComplete})=><TeoriaContent onComplete={onComplete}/>},
    {id:'quiz',icon:'🧠',label:'Quiz',content:({onComplete})=><QuizContent onComplete={onComplete}/>},
    {id:'fiszki',icon:'🃏',label:'Fiszki',content:({onComplete})=><FiszkiContent onComplete={onComplete}/>},
    {id:'kartkowka',icon:'✏️',label:'Kartkówka',content:({onComplete})=><KartkowkaContent onComplete={onComplete}/>},
    {id:'cke',icon:'📝',label:'Zadanie CKE',content:({onComplete})=><CKEContent onComplete={onComplete}/>},
    {id:'raport',icon:'📊',label:'Raport',content:({onComplete})=><RaportContent onComplete={onComplete}/>},
  ]
  return <LessonShell dzial={DZIAL_CONFIG} lekcja={LEKCJA_CONFIG} segments={segments} xpMap={XP_MAP} maxFaq={MAX_FAQ}/>
}
