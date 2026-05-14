'use client'
import LessonShell from '../LessonShell'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const C = { navy:'#0F1729',accent:'#F5541E',green:'#00B894',purple:'#6C5CE7',bg:'#F7F8FC',white:'#fff',border:'#E2E8F0',text:'#0F1729',text2:'#4A5568',text3:'#8896A5' }
const card = { background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }
const btn = (x={}) => ({ padding:'10px 22px', fontSize:13, fontWeight:500, borderRadius:8, cursor:'pointer', fontFamily:'inherit', border:`1.5px solid ${C.border}`, background:C.white, color:C.text, ...x })
const Step = ({n,text,result,hi}) => (
  <div style={{display:'flex',gap:10,marginBottom:10}}>
    <div style={{width:22,height:22,background:C.navy,color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0,marginTop:2}}>{n}</div>
    <div>
      <div style={{fontSize:13,color:C.text2,marginBottom:4,lineHeight:1.5}}>{text}</div>
      <div style={hi?{background:'#F0FFF4',borderLeft:'3px solid #00B894',padding:'7px 12px',borderRadius:'0 7px 7px 0',fontFamily:'monospace',fontSize:14,color:'#276749',fontWeight:600}:{background:C.bg,padding:'6px 10px',borderRadius:6,fontFamily:'monospace',fontSize:13,color:C.text,display:'inline-block'}}>{result}</div>
    </div>
  </div>
)

// TEORIA
const TTABS = [{id:'def',label:'Co to nierówność'},{id:'solve',label:'Rozwiązywanie'},{id:'flip',label:'⚠️ Zasada znaku'},{id:'axis',label:'Oś liczbowa'},{id:'word',label:'Zadania tekstowe'}]

function TeoriaContent({onComplete}) {
  const [tab,setTab] = useState('def')
  const CONTENT = {
    def:<div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}><strong style={{color:C.text}}>Nierówność</strong> to zdanie matematyczne stwierdzające, że jedna wartość jest <strong style={{color:C.text}}>większa lub mniejsza</strong> od drugiej. Rozwiązaniem jest <strong style={{color:C.text}}>nieskończony zbiór liczb</strong> — cały przedział.</p>
      <div style={{background:C.navy,borderRadius:10,padding:'16px 20px',textAlign:'center',marginBottom:14}}>
        <div style={{fontFamily:'monospace',fontSize:20,color:'#fff',lineHeight:2}}><span style={{color:'#FF7A4D'}}>a</span> {'<'} <span style={{color:'#FF7A4D'}}>b</span>{' · '}<span style={{color:'#FF7A4D'}}>a</span> {'>'} <span style={{color:'#FF7A4D'}}>b</span>{' · '}<span style={{color:'#FF7A4D'}}>a</span> ≤ <span style={{color:'#FF7A4D'}}>b</span>{' · '}<span style={{color:'#FF7A4D'}}>a</span> ≥ <span style={{color:'#FF7A4D'}}>b</span></div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:4}}>Cztery rodzaje nierówności</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        <div style={{background:'#F5F3FF',borderLeft:'3px solid #6C5CE7',borderRadius:'0 8px 8px 0',padding:'12px 14px',fontSize:13,color:'#4C1D95',lineHeight:1.65}}><strong>{'< i >'} — ostra</strong><br/>Granica <strong>nie należy</strong><br/>Na osi: kółko puste ○</div>
        <div style={{background:'#F0FFF4',borderLeft:'3px solid #00B894',borderRadius:'0 8px 8px 0',padding:'12px 14px',fontSize:13,color:'#276749',lineHeight:1.65}}><strong>≤ i ≥ — nieostra</strong><br/>Granica <strong>należy</strong><br/>Na osi: kółko pełne ●</div>
      </div>
    </div>,
    solve:<div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}>Nierówność rozwiązujemy jak równanie — <strong style={{color:C.text}}>te same działania po obu stronach</strong>.</p>
      <div style={{background:'linear-gradient(135deg,#FFF5EB,#FFFAF5)',border:'1px solid #FDDCBA',borderRadius:8,padding:'12px 16px',marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:600,color:C.accent,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Przykład 1</div>
        <div style={{fontFamily:'monospace',fontSize:18,color:C.text,fontWeight:500}}>x + 3 {'>'} 7</div>
      </div>
      <Step n={1} text="Odejmujemy 3 od obu stron:" result="x > 4 ✓" hi />
      <div style={{background:'#F0FFF4',borderLeft:'3px solid #00B894',borderRadius:'0 8px 8px 0',padding:'10px 14px',fontSize:13,color:'#276749',margin:'10px 0'}}>✅ Sprawdzenie: x=5 → 5+3=8{'>'} 7 ✓ · x=3 → 3+3=6, 6 nie {'>'} 7 ✗</div>
      <div style={{background:'linear-gradient(135deg,#FFF5EB,#FFFAF5)',border:'1px solid #FDDCBA',borderRadius:8,padding:'12px 16px',margin:'14px 0'}}>
        <div style={{fontSize:11,fontWeight:600,color:C.accent,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Przykład 2 — dzielenie przez liczbę DODATNIĄ</div>
        <div style={{fontFamily:'monospace',fontSize:18,color:C.text,fontWeight:500}}>2x ≤ 10</div>
      </div>
      <Step n={1} text="Dzielimy przez 2 (liczba dodatnia — znak bez zmian):" result="x ≤ 5 ✓" hi />
    </div>,
    flip:<div>
      <div style={{background:'#FFF5F5',borderLeft:'3px solid #E17055',borderRadius:'0 8px 8px 0',padding:'14px 16px',marginBottom:14,fontSize:13,color:'#9B2C2C',lineHeight:1.75}}>
        <strong>⚠️ KLUCZOWA ZASADA — najczęstszy błąd na egzaminie!</strong><br/><br/>
        Gdy mnożymy lub dzielimy przez <strong>liczbę ujemną</strong>, musimy <strong>odwrócić znak</strong>.<br/>
        {'<'} → {'>'} · {'>'} → {'<'} · ≤ → ≥ · ≥ → ≤
      </div>
      <div style={{background:C.navy,borderRadius:10,padding:'14px 20px',textAlign:'center',margin:'14px 0'}}>
        <div style={{fontFamily:'monospace',fontSize:18,color:'#fff',lineHeight:2}}>jeśli <span style={{color:'#FF7A4D'}}>a</span> {'<'} <span style={{color:'#FF7A4D'}}>b</span>, to <span style={{color:'#FF7A4D'}}>−a</span> <span style={{color:'#00B894'}}>{'>'}</span> <span style={{color:'#FF7A4D'}}>−b</span></div>
      </div>
      <div style={{background:'linear-gradient(135deg,#FFF5EB,#FFFAF5)',border:'1px solid #FDDCBA',borderRadius:8,padding:'12px 16px',marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:600,color:C.accent,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Przykład — UWAGA!</div>
        <div style={{fontFamily:'monospace',fontSize:18,color:C.text,fontWeight:500}}>−2x {'>'} 8</div>
      </div>
      <Step n={1} text="Dzielimy przez −2 (ujemna!) — ODWRACAMY > na <:" result="x < −4 ✓" hi />
      <div style={{background:'#FFF5EB',borderLeft:'3px solid #F5541E',borderRadius:'0 8px 8px 0',padding:'10px 14px',fontSize:13,color:'#C05621',margin:'10px 0'}}>💡 Tip: Pomyśl że odwracasz oś liczbową — co było większe, staje się mniejsze.</div>
      <div style={{background:'linear-gradient(135deg,#FFF5EB,#FFFAF5)',border:'1px solid #FDDCBA',borderRadius:8,padding:'12px 16px',margin:'14px 0'}}>
        <div style={{fontSize:11,fontWeight:600,color:C.accent,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Przykład 2 — typ CKE</div>
        <div style={{fontFamily:'monospace',fontSize:18,color:C.text,fontWeight:500}}>5 − x {'>'} 2</div>
      </div>
      <Step n={1} text="Odejmujemy 5:" result="−x > −3" />
      <Step n={2} text="Mnożymy przez −1 — ODWRACAMY znak:" result="x < 3 ✓" hi />
    </div>,
    axis:<div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}>Rozwiązanie zaznaczamy na osi. Kluczowa różnica: <strong style={{color:C.text}}>kółko puste</strong> (ostra) vs <strong style={{color:C.text}}>pełne</strong> (nieostra).</p>
      {[
        {label:'x > 4 — kółko puste ○ (4 nie należy)',d:'←———————○══════════→',sub:'0              4              8',c:'#6C5CE7',bg:'#F5F3FF'},
        {label:'x ≤ 4 — kółko pełne ● (4 należy)',d:'←══════════●———————→',sub:'0              4              8',c:'#276749',bg:'#F0FFF4'},
        {label:'−3 ≤ x < 5 — przedział obustronny',d:'←———●══════════○———→',sub:'-3              0              5',c:'#185FA5',bg:'#EBF4FF'},
      ].map((it,i)=>(
        <div key={i} style={{marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:6}}>{it.label}</div>
          <div style={{background:it.bg,borderRadius:8,padding:'12px 16px',fontFamily:'monospace',fontSize:13,color:it.c,textAlign:'center',lineHeight:1.8}}>
            {it.d}<br/><span style={{fontSize:11,fontFamily:'sans-serif',color:C.text3}}>{it.sub}</span>
          </div>
        </div>
      ))}
      <div style={{background:'#FFF5EB',borderLeft:'3px solid #F5541E',borderRadius:'0 8px 8px 0',padding:'10px 14px',fontSize:13,color:'#C05621'}}>💡 <strong>Zapis przedziałowy:</strong> x {'>'} 4 → (4,+∞) · x ≤ 4 → (−∞,4] · −3 ≤ x {'<'} 5 → [−3,5)</div>
    </div>,
    word:<div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}>Na egzaminie musisz <strong style={{color:C.text}}>przetłumaczyć słowa na znaki nierówności</strong>.</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
        {[['co najmniej n','≥ n','#F0FFF4','#276749'],['co najwyżej n','≤ n','#EBF4FF','#185FA5'],['więcej niż n','> n','#FAEEDA','#633806'],['mniej niż n','< n','#F5F3FF','#4C1D95'],['nie mniej niż n','≥ n','#F0FFF4','#276749'],['nie więcej niż n','≤ n','#EBF4FF','#185FA5']].map(([t,s,bg,c])=>(
          <div key={t} style={{background:bg,borderRadius:8,padding:'10px 12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:12,color:c}}>{t}</span>
            <span style={{fontFamily:'monospace',fontSize:16,fontWeight:700,color:c}}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{background:'linear-gradient(135deg,#FFF5EB,#FFFAF5)',border:'1px solid #FDDCBA',borderRadius:8,padding:'14px 16px'}}>
        <div style={{fontSize:11,fontWeight:600,color:C.accent,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>Przykład z arkusza CKE</div>
        <div style={{fontSize:14,color:C.text2,lineHeight:1.75,marginBottom:10}}><em>"Do autobusu wchodzi co najmniej 3 razy więcej pasażerów niż do tramwaju (24 osoby). Ile co najmniej jedzie autobusem?"</em></div>
        <Step n={1} text="x = liczba osób w autobusie" result="" />
        <Step n={2} text='"Co najmniej 3 razy więcej niż 24":' result="x ≥ 72 ✓" hi />
      </div>
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

// QUIZ
const QUIZ=[
  {q:'Rozwiąż nierówność:',eq:'x + 5 > 9',opts:['x > 4','x > 14','x < 4','x > −4'],ans:0,dlaczego:'Odejmujemy 5 od obu stron: x > 9−5 = 4. Dodawanie NIE zmienia znaku nierówności.'},
  {q:'Rozwiąż nierówność:',eq:'3x ≤ 12',opts:['x ≤ 36','x ≤ 9','x ≤ 4','x ≥ 4'],ans:2,dlaczego:'Dzielimy przez 3 (liczba dodatnia — znak bez zmian): x ≤ 4.'},
  {q:'Rozwiąż nierówność (uwaga na znak!):',eq:'−2x > 8',opts:['x > −4','x > 4','x < −4','x < 4'],ans:2,dlaczego:'Dzielimy przez −2 — ODWRACAMY ZNAK! > zamienia się w <. x < −4.'},
  {q:'Które x NIE spełnia nierówności 2x − 1 < 7?',eq:'',opts:['x = 0','x = 3','x = 4','x = 2'],ans:2,dlaczego:'Rozwiązanie: x < 4. Dla x=4: 2·4−1=7, a 7<7 jest fałszem.'},
  {q:'Kacper musi zaoszczędzić co najmniej 80 zł. Ma już 35 zł. Ile jeszcze musi odłożyć?',eq:'',opts:['x > 45','x ≥ 45','x ≤ 45','35+x=80'],ans:1,dlaczego:'"Co najmniej 80" → ≥ 80. Równanie: 35+x ≥ 80, x ≥ 45.'},
]
function QuizContent({onComplete}) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([])
  if(qi>=QUIZ.length){const ok=results.filter(r=>r).length;return(
    <div style={card}>
      <div style={{textAlign:'center',padding:'16px 0 24px'}}>
        <div style={{fontSize:48,marginBottom:8}}>{ok>=4?'🎯':ok>=3?'👍':'📚'}</div>
        <div style={{fontFamily:'Fraunces,serif',fontSize:24,fontWeight:900,color:C.text,marginBottom:6}}>{ok}/{QUIZ.length} poprawnych</div>
        <div style={{fontSize:14,color:C.text2}}>{ok>=4?'Świetnie! Czas na fiszki.':'Powtórz teorię i spróbuj jeszcze raz.'}</div>
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

// FISZKI
const FISZKI=[
  {q:'Czym różni się nierówność od równania?',a:'Równanie ma skończoną liczbę rozwiązań. Nierówność — nieskończony zbiór (cały przedział).',f:'x = 3 vs x > 3 (nieskończenie wiele)'},
  {q:'Jakie są 4 rodzaje nierówności?',a:'<, >, ≤, ≥',note:'Ostra: granica NIE należy. Nieostra: granica NALEŻY.'},
  {q:'Co się dzieje ze znakiem gdy dodajesz/odejmujesz?',a:'Nic — znak NIE zmienia się.',f:'a < b ⟹ a + c < b + c'},
  {q:'⚠️ Co się dzieje gdy mnożysz/dzielisz przez ujemną?',a:'Znak ODWRACA SIĘ!',f:'a < b ⟹ −a > −b',note:'Najczęstszy błąd na egzaminie!'},
  {q:'Jak zaznaczyć x > 4 na osi?',a:'Puste kółko przy 4 i strzałka w prawo.',f:'———○══════→',note:'Ostra (>) = kółko puste ○'},
  {q:'Jak zaznaczyć x ≤ 4 na osi?',a:'Pełne kółko przy 4 i strzałka w lewo.',f:'←══════●———',note:'Nieostra (≤) = kółko pełne ●'},
  {q:'Jak rozwiązać −3x < 9?',a:'Dzielimy przez −3 i odwracamy < na >. Wynik: x > −3.',f:'−3x < 9 ⟹ x > −3'},
  {q:'"Co najmniej n" to jaki znak?',a:'"Co najmniej n" = ≥ n',f:'co najmniej 5 → x ≥ 5',note:'"Co najwyżej" → ≤. "Więcej niż" → >. "Mniej niż" → <.'},
  {q:'Jak sprawdzić rozwiązanie nierówności?',a:'Podstaw liczbę z rozwiązania I liczbę spoza rozwiązania.',f:'x>3: testuj x=5 (✓) i x=2 (✗)'},
  {q:'Jak zapisać x ≥ −2 jako przedział?',a:'[−2, +∞)',note:'[ ] = domknięty. ( ) = otwarty. ∞ zawsze w ( ).'},
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
          :<div><div style={{fontSize:14,fontWeight:500,color:C.text,lineHeight:1.6,marginBottom:8}}>{c.a}</div>{c.f&&<div style={{fontFamily:'monospace',fontSize:16,color:C.accent,fontWeight:600,margin:'8px 0'}}>{c.f}</div>}{c.note&&<div style={{fontSize:12,color:C.text3}}>{c.note}</div>}</div>}
      </div>
      {flipped&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlipped(false)}} style={btn({background:'#E17055',color:'#fff',border:'none',textAlign:'center'})}>😅 Trudna — powtórz</button>
        <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlipped(false)}} style={btn({background:C.green,color:'#fff',border:'none',textAlign:'center'})}>✅ Łatwa — następna</button>
      </div>}
    </div>
  )
}

// KARTKÓWKA
const KARTKOWKA=[
  {q:'Rozwiąż:',eq:'x − 3 < 5',opts:['x < 8','x < 2','x > 8','x < −2'],ans:0,hint:'Dodaj 3 do obu stron.'},
  {q:'Rozwiąż:',eq:'4x > 20',opts:['x > 80','x > 16','x > 5','x < 5'],ans:2,hint:'Podziel przez 4 (liczba dodatnia).'},
  {q:'Rozwiąż (uwaga!):',eq:'−2x ≥ 6',opts:['x ≥ −3','x ≤ −3','x ≤ 3','x ≥ 3'],ans:1,hint:'Dzielisz przez −2 → odwróć znak!'},
  {q:'Rozwiąż:',eq:'2x + 1 ≤ 9',opts:['x ≤ 4','x ≤ 5','x ≥ 4','x ≤ 8'],ans:0,hint:'Odejmij 1, potem podziel przez 2.'},
  {q:'Rozwiąż (uwaga!):',eq:'5 − x > 2',opts:['x > −3','x < 3','x > 3','x < −3'],ans:1,hint:'Odejmij 5: −x>−3. Pomnóż przez −1 → odwróć.'},
  {q:'Rozwiąż:',eq:'x + 2 ≥ 0',opts:['x ≥ −2','x ≥ 2','x ≤ 2','x > −2'],ans:0,hint:'Odejmij 2.'},
  {q:'Która liczba całkowita spełnia 3x < 15?',eq:'',opts:['x = 5','x = 6','x = 4','x = 7'],ans:2,hint:'Rozwiąż: x < 5. Która jest mniejsza od 5?'},
  {q:'Ola ma więcej złotych niż Bartek (12 zł). Nierówność:',eq:'',opts:['x < 12','x ≤ 12','x > 12','x ≥ 12'],ans:2,hint:'"Więcej niż" = >'},
  {q:'Rozwiąż (uwaga!):',eq:'−x + 4 ≤ 10',opts:['x ≤ −6','x ≥ −6','x ≤ 6','x ≥ 6'],ans:1,hint:'Odejmij 4: −x≤6. Pomnóż przez −1 → odwróć.'},
  {q:'Które stwierdzenie o x ≥ 7 jest FAŁSZYWE?',eq:'',opts:['x=7 spełnia','x=6 spełnia','x=100 spełnia','x=7.5 spełnia'],ans:1,hint:'≥ = "większy lub równy".'},
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
      <button onClick={()=>{}} style={btn({width:'100%',textAlign:'center',background:mode?C.navy:'#E2E8F0',color:mode?'#fff':C.text3,border:'none',padding:'13px',cursor:mode?'pointer':'not-allowed'})}>Zacznij kartkówkę →</button>
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

// ZADANIE CKE
const CKE_ZADANIA=[
  {rok:2023,nr:8,pkt:2,tresc:'Rozwiąż nierówność: 3(x − 2) > x + 4',wskazowka:'Rozwiń nawias, przenieś x na lewą, liczby na prawą.',rozwiazanie:['3x − 6 > x + 4','3x − x > 4 + 6','2x > 10','x > 5'],odp:'x > 5, czyli x ∈ (5, +∞)',schemat:'Za rozwiązanie: 1 pkt. Za poprawny zapis przedziałowy: 1 pkt.'},
  {rok:2022,nr:11,pkt:2,tresc:'Ania myśli o pewnej liczbie naturalnej. Jej potrójna wartość jest mniejsza niż 20. Podaj wszystkie takie liczby.',wskazowka:'Ułóż nierówność: 3x < 20. Pamiętaj że x musi być NATURALNĄ.',rozwiazanie:['3x < 20','x < 20/3 = 6,6...','x ∈ {1, 2, 3, 4, 5, 6}'],odp:'Szukane liczby: 1, 2, 3, 4, 5, 6',schemat:'Za poprawną nierówność: 1 pkt. Za wszystkie liczby naturalne: 1 pkt.'},
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

// RAPORT
function RaportContent({onComplete}) {
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'#854F0B',marginBottom:12}}>📊 Raport Maxa</div>
      <div style={{textAlign:'center',padding:'10px 0 20px'}}>
        <div style={{fontSize:52,marginBottom:8}}>🏆</div>
        <div style={{fontFamily:'Fraunces,serif',fontSize:24,fontWeight:900,color:C.text,marginBottom:4}}>Lekcja ukończona!</div>
        <div style={{fontSize:14,color:C.text2}}>Przeszedłeś przez wszystkie segmenty</div>
      </div>
      <div style={{background:C.navy,borderRadius:12,padding:'18px 20px',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#F5541E,#FF7A4D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🤖</div>
          <div style={{fontSize:13,fontWeight:600,color:'#fff'}}>Max — podsumowanie lekcji</div>
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.85)',lineHeight:1.75,marginBottom:12}}>Nierówności liniowe — ważny temat, zwykle 1-2 zadania w arkuszu CKE. Trzy rzeczy które musisz pamiętać:</div>
        {[['Zasada znaku ⚠️','Mnożenie/dzielenie przez ujemną ODWRACA znak nierówności.'],['Słowa kluczowe','co najmniej = ≥ · co najwyżej = ≤ · więcej niż = > · mniej niż = <'],['Sprawdzanie','Zawsze testuj liczbę z rozwiązania I liczbę spoza — oba muszą dać oczekiwany wynik.']].map(([t,d],i)=>(
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

// KONFIGURACJA
const DZIAL_CONFIG={
  n:3,title:'Równania i nierówności',href:'/kurs/dzial-3',
  lekcje:[
    {n:1,title:'Równania liniowe',href:'/kurs/rownania-liniowe',status:'done'},
    {n:2,title:'Układy równań',href:'/kurs/uklady-rownan',status:'done'},
    {n:3,title:'Nierówności liniowe',href:'/kurs/nierownosci',status:'active'},
    {n:4,title:'Zadania tekstowe',href:'/kurs/zadania-tekstowe',status:'locked'},
    {n:5,title:'Równania w geometrii',href:'/kurs/rownania-geometria',status:'locked'},
    {n:6,title:'Sprawdzian działu',href:'/kurs/sprawdzian-3',status:'locked',isTest:true},
  ],
}
const LEKCJA_CONFIG={n:3,total:5,slug:'nierownosci',title:'Nierówności liniowe',czas:'15 min',poziom:'Poziom: podstawowy+',cke:true}
const XP_MAP={teoria:40,quiz:50,fiszki:60,kartkowka:80,cke:60,raport:30}
const MAX_FAQ=[
  {q:'zasada znaku ujemna',a:'Gdy dzielisz lub mnożysz przez UJEMNĄ — odwróć znak! < staje się >, ≤ staje się ≥. Przykład: −2x > 8 → x < −4.'},
  {q:'kółko oś liczbowa',a:'Kółko PUSTE (○) = granica NIE należy (znaki ostre < i >). Kółko PEŁNE (●) = granica NALEŻY (znaki nieostre ≤ i ≥).'},
  {q:'co najmniej co najwyżej',a:'"Co najmniej n" → ≥ n. "Co najwyżej n" → ≤ n. "Więcej niż" → >. "Mniej niż" → <.'},
  {q:'sprawdzić wynik',a:'Podstaw liczbę Z rozwiązania i liczbę SPOZA. Dla x>3: testuj x=5 (5>3 ✓) i x=1 (1>3 ✗).'},
]

export default function NierownosciLesson() {
  const segments=[
    {id:'teoria',icon:'📖',label:'Teoria',content:({onComplete})=><TeoriaContent onComplete={onComplete}/>},
    {id:'quiz',icon:'🧠',label:'Quiz',content:({onComplete})=><QuizContent onComplete={onComplete}/>},
    {id:'fiszki',icon:'🃏',label:'Fiszki',content:({onComplete})=><FiszkiContent onComplete={onComplete}/>},
    {id:'kartkowka',icon:'✏️',label:'Kartkówka',content:({onComplete})=><KartkowkaContent onComplete={onComplete}/>},
    {id:'cke',icon:'📝',label:'Zadanie CKE',content:({onComplete})=><CKEContent onComplete={onComplete}/>},
    {id:'raport',icon:'📊',label:'Raport',content:({onComplete})=><RaportContent onComplete={onComplete}/>},
  ]
  return <LessonShell dzial={DZIAL_CONFIG} lekcja={LEKCJA_CONFIG} segments={segments} xpMap={XP_MAP} maxFaq={MAX_FAQ}/>
}
