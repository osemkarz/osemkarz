'use client'
import LessonShell from '../LessonShell'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const C = { navy:'#0F1729',accent:'#F5541E',green:'#00B894',purple:'#6C5CE7',blue:'#185FA5',bg:'#F7F8FC',white:'#fff',border:'#E2E8F0',text:'#0F1729',text2:'#4A5568',text3:'#8896A5' }
const card = { background:C.white, borderRadius:14, border:`0.5px solid ${C.border}`, padding:24 }
const btn = (x={}) => ({ padding:'10px 22px', fontSize:13, fontWeight:500, borderRadius:8, cursor:'pointer', fontFamily:'inherit', border:`0.5px solid ${C.border}`, background:C.white, color:C.text, ...x })

const SH = ({children}) => (
  <div style={{fontSize:14,fontWeight:500,color:C.text,margin:'20px 0 10px',paddingBottom:8,borderBottom:`0.5px solid ${C.border}`,display:'flex',alignItems:'center',gap:8}}>
    <span style={{width:3,height:16,background:C.purple,borderRadius:2,display:'inline-block',flexShrink:0}}/>
    {children}
  </div>
)

const Step = ({n,text,result,hi}) => (
  <div style={{display:'flex',gap:10}}>
    <div style={{width:22,height:22,background:C.navy,color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0,marginTop:10}}>{n}</div>
    <div style={{flex:1,padding:'8px 0',borderBottom:`0.5px solid ${C.border}`}}>
      <div style={{fontSize:13,color:C.text2,marginBottom:result?5:0,lineHeight:1.5}}>{text}</div>
      {result&&<div style={hi?{background:'#EAF3DE',borderLeft:'3px solid #3B6D11',padding:'7px 12px',borderRadius:'0 7px 7px 0',fontFamily:'monospace',fontSize:14,color:'#27500A',fontWeight:600,display:'inline-block'}:{background:C.bg,padding:'6px 10px',borderRadius:6,fontFamily:'monospace',fontSize:13,color:C.text,display:'inline-block'}}>{result}</div>}
    </div>
  </div>
)

const Task = ({level,label,eq,sub}) => {
  const b = {basic:{bg:'#EAF3DE',c:'#27500A',txt:'Podstawowy'},med:{bg:'#FAEEDA',c:'#633806',txt:'Średni'},hard:{bg:'#FCEBEB',c:'#791F1F',txt:'Trudny'},cke:{bg:'#EEEDFE',c:'#3C3489',txt:'Typ CKE'}}[level]||{bg:'#EAF3DE',c:'#27500A',txt:'Podstawowy'}
  return (
    <div style={{margin:'18px 0'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
        <span style={{fontSize:10,fontWeight:500,padding:'3px 9px',borderRadius:20,background:b.bg,color:b.c}}>{b.txt}</span>
        {label&&<span style={{fontSize:13,color:C.text2}}>{label}</span>}
      </div>
      <div style={{background:C.bg,borderRadius:8,padding:'14px 18px',border:`0.5px solid ${C.border}`}}>
        {sub&&<div style={{fontSize:10,fontWeight:500,letterSpacing:'.08em',textTransform:'uppercase',color:C.text3,marginBottom:6}}>{sub}</div>}
        <div style={{fontFamily:'monospace',fontSize:20,color:C.text,fontWeight:500,lineHeight:1.6}}>{eq}</div>
      </div>
    </div>
  )
}

const Ans = ({val,note,type='ok'}) => (
  <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:8,marginTop:10,background:type==='ok'?'#EAF3DE':'#FCEBEB',border:`0.5px solid ${type==='ok'?'#C0DD97':'#F7C1C1'}`}}>
    <div style={{width:28,height:28,borderRadius:'50%',background:type==='ok'?'#3B6D11':'#A32D2D',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:13,color:'#fff',fontWeight:700}}>{type==='ok'?'✓':'∅'}</div>
    <div>
      <div style={{fontFamily:'monospace',fontSize:15,fontWeight:500,color:type==='ok'?'#27500A':'#791F1F'}}>{val}</div>
      {note&&<div style={{fontSize:12,color:type==='ok'?'#3B6D11':'#A32D2D',marginTop:2}}>{note}</div>}
    </div>
  </div>
)

const Rule = ({type,children}) => {
  const m = {warn:{bg:'#FAEEDA',bl:'#854F0B',c:'#633806'},tip:{bg:'#EAF3DE',bl:'#3B6D11',c:'#27500A'},info:{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'},err:{bg:'#FCEBEB',bl:'#A32D2D',c:'#791F1F'}}[type]||{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'}
  return <div style={{background:m.bg,borderLeft:`3px solid ${m.bl}`,borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:m.c,lineHeight:1.75,margin:'14px 0'}}>{children}</div>
}

// ── TEORIA ────────────────────────────────────────────────────────────────────
const TTABS = [
  {id:'def',   label:'Co to nierówność'},
  {id:'solve', label:'Rozwiązywanie krok po kroku'},
  {id:'flip',  label:'⚠️ Zasada znaku'},
  {id:'axis',  label:'Oś liczbowa i przedziały'},
  {id:'word',  label:'Zadania tekstowe — CKE'},
]

function TeoriaContent({onComplete}) {
  const [tab,setTab] = useState('def')

  const CONTENT = {
    def: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}><strong style={{color:C.text}}>Nierówność</strong> to zdanie matematyczne stwierdzające, że jedna wartość jest <strong style={{color:C.text}}>większa lub mniejsza</strong> od drugiej. W odróżnieniu od równania, rozwiązaniem nierówności jest <strong style={{color:C.text}}>nieskończony zbiór liczb</strong> — cały przedział liczbowy.</p>
      <div style={{background:C.navy,borderRadius:10,padding:'18px 24px',textAlign:'center',marginBottom:16}}>
        <div style={{fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:10}}>Cztery rodzaje nierówności</div>
        <div style={{fontFamily:'monospace',fontSize:22,color:'#fff',lineHeight:2.2}}>
          <span style={{color:'#FF7A4D'}}>a</span> {'<'} <span style={{color:'#FF7A4D'}}>b</span>&nbsp;·&nbsp;<span style={{color:'#FF7A4D'}}>a</span> {'>'} <span style={{color:'#FF7A4D'}}>b</span>&nbsp;·&nbsp;<span style={{color:'#FF7A4D'}}>a</span> ≤ <span style={{color:'#FF7A4D'}}>b</span>&nbsp;·&nbsp;<span style={{color:'#FF7A4D'}}>a</span> ≥ <span style={{color:'#FF7A4D'}}>b</span>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
        <div style={{background:'#F5F3FF',borderLeft:'3px solid #6C5CE7',borderRadius:'0 8px 8px 0',padding:'14px',lineHeight:1.7}}>
          <div style={{fontSize:12,fontWeight:600,color:'#4C1D95',marginBottom:4}}>{'< i >'} — nierówność ostra</div>
          <div style={{fontSize:13,color:C.text2}}>Liczba graniczna <strong>nie należy</strong> do rozwiązań.</div>
          <div style={{fontSize:12,color:'#6C5CE7',marginTop:6,fontFamily:'monospace'}}>Na osi: kółko puste ○</div>
        </div>
        <div style={{background:'#F0FFF4',borderLeft:'3px solid #00B894',borderRadius:'0 8px 8px 0',padding:'14px',lineHeight:1.7}}>
          <div style={{fontSize:12,fontWeight:600,color:'#276749',marginBottom:4}}>≤ i ≥ — nierówność nieostra</div>
          <div style={{fontSize:13,color:C.text2}}>Liczba graniczna <strong>należy</strong> do rozwiązań.</div>
          <div style={{fontSize:12,color:'#00B894',marginTop:6,fontFamily:'monospace'}}>Na osi: kółko pełne ●</div>
        </div>
      </div>
      <SH>Różnica między równaniem a nierównością</SH>
      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {[['Równanie  2x = 8','x = 4','jedno rozwiązanie','#EAF3DE','#27500A'],
          ['Nierówność  2x > 8','x > 4','nieskończenie wiele: (4; +∞)','#E6F1FB','#0C447C'],
          ['Nierówność  2x ≤ 8','x ≤ 4','nieskończenie wiele: (−∞; 4]','#EEEDFE','#3C3489']
        ].map(([eq,w,d,bg,c])=>(
          <div key={eq} style={{display:'flex',gap:12,padding:'10px 14px',background:bg,borderRadius:8,alignItems:'center'}}>
            <div style={{fontFamily:'monospace',fontSize:13,color:c,minWidth:185,fontWeight:500}}>{eq}</div>
            <div style={{fontFamily:'monospace',fontSize:13,color:c,minWidth:80}}>{w}</div>
            <div style={{fontSize:12,color:C.text2}}>{d}</div>
          </div>
        ))}
      </div>
      <Rule type="info"><strong>Na egzaminie CKE</strong> nierówności pojawiają się w zadaniach zamkniętych i otwartych. Najczęstsze typy: rozwiązanie nierówności liniowej, zaznaczenie na osi liczbowej i zadania tekstowe z "co najmniej" / "co najwyżej".</Rule>
    </div>,

    solve: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>Nierówność liniową rozwiązujemy analogicznie do równania — <strong style={{color:C.text}}>te same działania na obu stronach</strong>, żeby wyizolować x. Istnieje jeden ważny wyjątek przy mnożeniu przez ujemną (kolejna sekcja).</p>

      <SH>Krok 1 — przenoszenie wyrazów (zmiana strony = zmiana znaku)</SH>
      <Task level="basic" label="Dodawanie i odejmowanie" eq="x + 5 > 9" />
      <Step n={1} text="Odejmujemy 5 od obu stron — znak > NIE zmienia się:" result="x > 4 ✓" hi />
      <Ans val="x > 4" note="Sprawdzenie: x=6 → 6+5=11>9 ✓ · x=3 → 3+5=8, 8 nie > 9 ✗" />

      <Task level="basic" label="Nierówność z x po prawej" eq="5 < x − 3" />
      <Step n={1} text="Dodajemy 3 do obu stron:" result="8 < x" />
      <Step n={2} text="Obracamy nierówność (zamieniamy strony — znak się odwraca!):" result="x > 8 ✓" hi />

      <SH>Krok 2 — dzielenie przez liczbę DODATNIĄ (znak bez zmian)</SH>
      <Task level="basic" label="Jeden krok" eq="3x ≤ 12" />
      <Step n={1} text="Dzielimy przez 3 (liczba dodatnia — znak ≤ bez zmian):" result="x ≤ 4 ✓" hi />

      <Task level="med" label="Pełne rozwiązanie — dwa kroki" eq="2x + 6 > 14" />
      <Step n={1} text="Odejmujemy 6 od obu stron:" result="2x > 8" />
      <Step n={2} text="Dzielimy przez 2 (liczba dodatnia):" result="x > 4 ✓" hi />
      <Ans val="x > 4" note="Sprawdzenie: x=5 → 2·5+6=16>14 ✓ · x=4 → 2·4+6=14, 14 nie > 14 ✗ (ostra!)" />

      <Task level="med" label="x po obu stronach nierówności" eq="4x − 3 ≥ 2x + 7" />
      <Step n={1} text="Przenosimy 2x na lewą stronę:" result="2x − 3 ≥ 7" />
      <Step n={2} text="Dodajemy 3 do obu stron:" result="2x ≥ 10" />
      <Step n={3} text="Dzielimy przez 2:" result="x ≥ 5 ✓" hi />
      <Ans val="x ≥ 5" note="Sprawdzenie: x=5 → 4·5−3=17 ≥ 2·5+7=17 ✓ (granica należy!)" />

      <Task level="hard" label="Nierówność z nawiasem — typ CKE" eq="3(x + 2) > 2(x − 1) + 9" />
      <Step n={1} text="Rozwijamy oba nawiasy:" result="3x + 6 > 2x − 2 + 9" />
      <Step n={2} text="Upraszczamy prawą stronę:" result="3x + 6 > 2x + 7" />
      <Step n={3} text="Przenosimy 2x na lewą:" result="x + 6 > 7" />
      <Step n={4} text="Odejmujemy 6:" result="x > 1 ✓" hi />
      <Ans val="x > 1" note="Sprawdzenie: x=2 → 3·4=12 > 2·1+9=11 ✓ · x=1 → 3·3=9 > 9 ✗ (ostra!)" />

      <SH>Typowe błędy przy rozwiązywaniu nierówności</SH>
      {[{b:'Zapomnienie o zmianie znaku przy przenoszeniu',w:'x + 3 > 7 → x > 7 + 3 ✗',ok:'x + 3 > 7 → x > 7 − 3 → x > 4 ✓'},
        {b:'Mylenie ostrej i nieostrej nierówności przy sprawdzaniu',w:'"x > 4" i "x ≥ 4" to to samo ✗',ok:'x > 4: liczba 4 NIE spełnia. x ≥ 4: liczba 4 SPEŁNIA. Zasadnicza różnica!'},
      ].map(({b,w,ok})=>(
        <div key={b} style={{background:C.bg,borderRadius:8,padding:'12px 14px',marginBottom:8,borderLeft:'3px solid #A32D2D'}}>
          <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:5}}>⚠️ {b}</div>
          <div style={{fontFamily:'monospace',fontSize:12,color:'#A32D2D',marginBottom:4}}>{w}</div>
          <div style={{fontFamily:'monospace',fontSize:12,color:'#27500A'}}>✓ {ok}</div>
        </div>
      ))}
    </div>,

    flip: <div>
      <Rule type="err"><strong>⚠️ KLUCZOWA ZASADA — najczęstszy błąd na egzaminie!</strong><br/><br/>
        Gdy mnożymy lub dzielimy przez <strong>liczbę ujemną</strong>, musimy <strong>odwrócić znak nierówności</strong>.<br/><br/>
        {'<'} → {'>'} &nbsp;·&nbsp; {'>'} → {'<'} &nbsp;·&nbsp; ≤ → ≥ &nbsp;·&nbsp; ≥ → ≤</Rule>

      <SH>Dlaczego znak się odwraca?</SH>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:12}}>Weźmy <span style={{fontFamily:'monospace'}}>2 {'<'} 5</span> (prawda). Mnożymy przez −1: −2 i −5. Która jest większa? <strong>−2 {'>'} −5</strong>. Znak się odwrócił — bo na osi liczbowej liczby ujemne działają "odwrotnie".</p>
      <div style={{background:C.navy,borderRadius:10,padding:'16px 24px',textAlign:'center',margin:'16px 0'}}>
        <div style={{fontFamily:'monospace',fontSize:18,color:'#fff',lineHeight:2.2}}>
          jeśli <span style={{color:'#FF7A4D'}}>a</span> {'<'} <span style={{color:'#FF7A4D'}}>b</span> i <span style={{color:'#FF7A4D'}}>c {'<'} 0</span>, to <span style={{color:'#FF7A4D'}}>a · c</span> <span style={{color:'#00B894'}}>{'>'}</span> <span style={{color:'#FF7A4D'}}>b · c</span>
        </div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.35)',marginTop:8}}>Mnożenie przez liczbę ujemną odwraca porządek na osi</div>
      </div>

      <SH>Przykłady</SH>
      <Task level="basic" label="Ujemny współczynnik przy x" eq="−2x > 8" />
      <Step n={1} text="Dzielimy przez −2 (ujemna!) — ODWRACAMY > na <:" result="x < 8 ÷ (−2)" />
      <Step n={2} text="Obliczamy:" result="x < −4 ✓" hi />
      <Ans val="x < −4" note="Sprawdzenie: x=−5 → −2·(−5)=10>8 ✓ · x=−3 → −2·(−3)=6>8 ✗" />

      <Task level="med" label="x po prawej — przenoszenie i ujemna" eq="5 − x > 2" />
      <Step n={1} text="Odejmujemy 5 od obu stron:" result="−x > −3" />
      <Step n={2} text="Mnożymy przez −1 — ODWRACAMY > na <:" result="x < 3 ✓" hi />
      <Ans val="x < 3" note="Sprawdzenie: x=2 → 5−2=3>2 ✓ · x=3 → 5−3=2, 2 nie > 2 ✗ (ostra!)" />

      <Task level="hard" label="Dwukrokowe z ujemną i nawiasem — typ CKE" eq="−3(x + 2) ≥ −x + 4" />
      <Step n={1} text="Rozwijamy nawias:" result="−3x − 6 ≥ −x + 4" />
      <Step n={2} text="Przenosimy −x na lewą:" result="−2x − 6 ≥ 4" />
      <Step n={3} text="Dodajemy 6:" result="−2x ≥ 10" />
      <Step n={4} text="Dzielimy przez −2 — ODWRACAMY ≥ na ≤:" result="x ≤ −5 ✓" hi />
      <Ans val="x ≤ −5" note="Sprawdzenie: x=−5 → −3·(−3)=9 ≥ −(−5)+4=9 ✓ (granica należy!)" />

      <Rule type="tip"><strong>Jak zapamiętać:</strong> Wyobraź sobie odwracanie osi liczbowej. To co było "w prawo" (większe) staje się "w lewo" (mniejsze). Mnożenie przez ujemną = odwracanie osi = odwracanie znaku.</Rule>
    </div>,

    axis: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>Rozwiązanie nierówności możemy przedstawić na osi liczbowej lub zapisać jako <strong style={{color:C.text}}>przedział liczbowy</strong>. Kluczowa różnica: kółko puste ○ vs kółko pełne ●.</p>

      <SH>Zapis na osi liczbowej</SH>
      {[{label:'x > 4',desc:'ostra — kółko puste, kierunek prawy',d:'←—————————○══════════→',sub:'...  2  3  4  5  6  ...',c:'#6C5CE7',bg:'#F5F3FF'},
        {label:'x ≤ 4',desc:'nieostra — kółko pełne, kierunek lewy',d:'←══════════●—————————→',sub:'...  2  3  4  5  6  ...',c:'#276749',bg:'#EAF3DE'},
        {label:'x ≥ −3',desc:'nieostra — kółko pełne, kierunek prawy',d:'←——●══════════════════→',sub:' ... −5  −4  −3  −2  ...',c:'#185FA5',bg:'#E6F1FB'},
        {label:'−2 < x ≤ 5',desc:'przedział — lewe puste, prawe pełne',d:'←————○══════════●————→',sub:'...  −2  0  2  4  5  6  ...',c:'#633806',bg:'#FAEEDA'},
      ].map((it,i)=>(
        <div key={i} style={{marginBottom:14}}>
          <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:6}}>
            <span style={{fontFamily:'monospace',fontSize:15,fontWeight:600,color:it.c}}>{it.label}</span>
            <span style={{fontSize:12,color:C.text3}}>{it.desc}</span>
          </div>
          <div style={{background:it.bg,borderRadius:8,padding:'12px 16px',border:`0.5px solid ${it.c}33`}}>
            <div style={{fontFamily:'monospace',fontSize:13,color:it.c,textAlign:'center',lineHeight:2}}>{it.d}</div>
            <div style={{fontSize:11,fontFamily:'sans-serif',color:C.text3,textAlign:'center'}}>{it.sub}</div>
          </div>
        </div>
      ))}

      <SH>Zapis przedziałowy</SH>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
        {[['x > 4','(4; +∞)','okrągły = granica nie należy'],
          ['x ≥ 4','[4; +∞)','kwadratowy = granica należy'],
          ['x < 4','(−∞; 4)','∞ zawsze w okrągłym'],
          ['x ≤ 4','(−∞; 4]','−∞ zawsze w okrągłym'],
          ['−2 < x ≤ 5','(−2; 5]','lewy otwarty, prawy domknięty'],
          ['−2 ≤ x < 5','[−2; 5)','lewy domknięty, prawy otwarty'],
        ].map(([n,p,o])=>(
          <div key={n} style={{background:C.bg,borderRadius:8,padding:'10px 12px',border:`0.5px solid ${C.border}`}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
              <span style={{fontFamily:'monospace',fontSize:14,color:C.text,fontWeight:500}}>{n}</span>
              <span style={{fontFamily:'monospace',fontSize:14,color:C.blue,fontWeight:500}}>{p}</span>
            </div>
            <div style={{fontSize:11,color:C.text3}}>{o}</div>
          </div>
        ))}
      </div>
      <Rule type="tip"><strong>Zapamiętaj:</strong> ∞ (nieskończoność) zawsze ma nawias okrągły. Nawiasy kwadratowe [ ] tylko przy konkretnych liczbach które należą do przedziału (znaki nieostre ≤ i ≥).</Rule>
    </div>,

    word: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>Zadania tekstowe z nierównościami to stały element egzaminu CKE. Kluczem jest przetłumaczenie słów na symbole matematyczne.</p>

      <SH>Słownik — jak tłumaczyć słowa na znaki</SH>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
        {[['co najmniej n','≥ n','#EAF3DE','#27500A','n lub więcej'],
          ['co najwyżej n','≤ n','#E6F1FB','#0C447C','n lub mniej'],
          ['więcej niż n','> n','#FAEEDA','#633806','ściśle więcej'],
          ['mniej niż n','< n','#EEEDFE','#3C3489','ściśle mniej'],
          ['nie mniej niż n','≥ n','#EAF3DE','#27500A','to samo co "co najmniej"'],
          ['nie więcej niż n','≤ n','#E6F1FB','#0C447C','to samo co "co najwyżej"'],
        ].map(([t,s,bg,c,p])=>(
          <div key={t} style={{background:bg,borderRadius:8,padding:'10px 12px',display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
            <div><div style={{fontSize:12,color:c,fontWeight:500}}>{t}</div><div style={{fontSize:11,color:C.text3,marginTop:2}}>{p}</div></div>
            <span style={{fontFamily:'monospace',fontSize:18,fontWeight:700,color:c,flexShrink:0}}>{s}</span>
          </div>
        ))}
      </div>

      <SH>Przykład 1 — oszczędzanie (podstawowy)</SH>
      <div style={{background:C.bg,borderRadius:8,padding:'14px 16px',marginBottom:12,border:`0.5px solid ${C.border}`}}>
        <div style={{fontSize:14,color:C.text2,lineHeight:1.75,fontStyle:'italic',marginBottom:12}}>"Kacper chce zaoszczędzić <strong style={{color:C.text}}>co najmniej 120 zł</strong>. Każdego tygodnia odkłada 15 zł. Ile tygodni musi odkładać?"</div>
        <Step n={1} text="Oznaczamy: x = liczba tygodni" result="" />
        <Step n={2} text='"Co najmniej 120 zł" → kwota ≥ 120. Kwota po x tygodniach = 15 · x:' result="15x ≥ 120" />
        <Step n={3} text="Dzielimy przez 15:" result="x ≥ 8 ✓" hi />
      </div>
      <Ans val="Co najmniej 8 tygodni" note="Po 8 tygodniach Kacper ma 15·8=120 zł ✓" />

      <SH>Przykład 2 — bilety i budżet (typ CKE, średni)</SH>
      <div style={{background:C.bg,borderRadius:8,padding:'14px 16px',marginBottom:12,border:`0.5px solid ${C.border}`}}>
        <div style={{fontSize:14,color:C.text2,lineHeight:1.75,fontStyle:'italic',marginBottom:12}}>"Bilet normalny kosztuje 12 zł, ulgowy 7 zł. Klasa kupuje 3 bilety normalne i x biletów ulgowych. Ma <strong style={{color:C.text}}>co najwyżej 70 zł</strong>. Ile biletów ulgowych może kupić?"</div>
        <Step n={1} text="Koszt całkowity: 3 · 12 + 7 · x = 36 + 7x" result="" />
        <Step n={2} text='"Co najwyżej 70 zł" → koszt ≤ 70:' result="36 + 7x ≤ 70" />
        <Step n={3} text="Odejmujemy 36:" result="7x ≤ 34" />
        <Step n={4} text="Dzielimy przez 7:" result="x ≤ 34/7 ≈ 4,86" hi />
      </div>
      <Ans val="Maksymalnie 4 bilety ulgowe" note="x musi być liczbą naturalną. 4,86 zaokrąglamy w dół bo musi być ≤ 4,86." />

      <Rule type="warn"><strong>Ważne dla CKE:</strong> Gdy wynik jest ułamkiem, a szukamy liczby całkowitej (sztuk, osób, dni) — zaokrąglamy zgodnie z warunkiem. Przy ≤ zaokrąglamy <strong>w dół</strong>, przy ≥ zaokrąglamy <strong>w górę</strong>.</Rule>
    </div>,
  }

  const idx = TTABS.findIndex(t=>t.id===tab)
  return (
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.purple,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.purple,display:'inline-block'}}/>
        Teoria — {TTABS.find(t=>t.id===tab)?.label}
        <span style={{marginLeft:'auto',fontWeight:400,color:C.text3}}>Sekcja {idx+1} z {TTABS.length}</span>
      </div>
      <div style={{display:'flex',gap:5,marginBottom:18,flexWrap:'wrap',paddingBottom:14,borderBottom:`0.5px solid ${C.border}`}}>
        {TTABS.map((t,i)=>{
          const isDone=i<idx, isActive=t.id===tab
          return <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'5px 12px',fontSize:11,fontWeight:500,borderRadius:20,cursor:'pointer',fontFamily:'inherit',transition:'all .15s',border:`0.5px solid ${isActive?C.navy:isDone?'#C0DD97':C.border}`,background:isActive?C.navy:isDone?'#EAF3DE':C.white,color:isActive?'#fff':isDone?'#27500A':C.text2}}>{t.label}</button>
        })}
      </div>
      {CONTENT[tab]}
      <div style={{display:'flex',justifyContent:'space-between',marginTop:22,gap:8,paddingTop:14,borderTop:`0.5px solid ${C.border}`}}>
        {idx>0?<button onClick={()=>setTab(TTABS[idx-1].id)} style={btn()}>← {TTABS[idx-1].label}</button>:<div/>}
        {idx<TTABS.length-1
          ?<button onClick={()=>setTab(TTABS[idx+1].id)} style={btn({background:C.navy,color:'#fff',border:'none'})}>{TTABS[idx+1].label} →</button>
          :<button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Ukończyłem teorię →</button>}
      </div>
    </div>
  )
}

// ── QUIZ ──────────────────────────────────────────────────────────────────────
const QUIZ=[
  {q:'Rozwiąż nierówność:',eq:'x + 5 > 9',opts:['x > 4','x > 14','x < 4','x > −4'],ans:0,dlaczego:'Odejmujemy 5 od obu stron: x > 9−5 = 4. Dodawanie NIE zmienia znaku nierówności.'},
  {q:'Rozwiąż nierówność:',eq:'3x ≤ 12',opts:['x ≤ 36','x ≤ 9','x ≤ 4','x ≥ 4'],ans:2,dlaczego:'Dzielimy przez 3 (liczba dodatnia — znak bez zmian): x ≤ 4.'},
  {q:'Rozwiąż nierówność (uwaga na znak!):',eq:'−2x > 8',opts:['x > −4','x > 4','x < −4','x < 4'],ans:2,dlaczego:'Dzielimy przez −2 — ODWRACAMY ZNAK! > zamienia się w <. x < −4.'},
  {q:'Które x NIE spełnia nierówności 2x − 1 < 7?',eq:'',opts:['x = 0','x = 3','x = 4','x = 2'],ans:2,dlaczego:'Rozwiązanie: x < 4. Dla x=4: 2·4−1=7, a 7<7 jest fałszem (ostra nierówność).'},
  {q:'Kacper musi zaoszczędzić co najmniej 80 zł. Ma już 35 zł. Ile jeszcze musi odłożyć?',eq:'',opts:['x > 45','x ≥ 45','x ≤ 45','35+x=80'],ans:1,dlaczego:'"Co najmniej 80" → ≥ 80. Równanie: 35+x ≥ 80, x ≥ 45.'},
]
function QuizContent({onComplete}) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([])
  if(qi>=QUIZ.length){const ok=results.filter(r=>r).length;return(
    <div style={card}>
      <div style={{textAlign:'center',padding:'16px 0 24px'}}>
        <div style={{fontSize:48,marginBottom:8}}>{ok>=4?'🎯':ok>=3?'👍':'📚'}</div>
        <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>{ok}/{QUIZ.length} poprawnych</div>
        <div style={{fontSize:14,color:C.text2}}>{ok>=4?'Świetnie! Czas na fiszki.':'Powtórz teorię i spróbuj ponownie.'}</div>
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
        <button onClick={()=>{setQi(0);setSel(null);setDone(false);setResults([])}} style={btn()}>Powtórz quiz</button>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Ukończyłem quiz →</button>
      </div>
    </div>
  )}
  const q=QUIZ[qi]
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.green,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.green,display:'inline-block'}}/>
        Quiz — pytanie {qi+1}/{QUIZ.length}
      </div>
      <div style={{display:'flex',gap:4,marginBottom:16}}>{QUIZ.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i<qi?C.green:i===qi?C.accent:C.border,transition:'background .3s'}}/>)}</div>
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:10,lineHeight:1.5}}>{q.q}</div>
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'11px 18px',marginBottom:16,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div></div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#EAF3DE';border='#3B6D11';color='#27500A'}else if(i===sel){bg='#FCEBEB';border='#A32D2D';color='#791F1F'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setResults(p=>[...p,i===q.ans])}} style={{border:`0.5px solid ${border}`,borderRadius:8,padding:'11px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:14,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<>
        <div style={{padding:'12px 16px',borderRadius:8,marginBottom:10,display:'flex',gap:10,alignItems:'flex-start',background:sel===q.ans?'#EAF3DE':'#FCEBEB',border:`0.5px solid ${sel===q.ans?'#C0DD97':'#F7C1C1'}`,color:sel===q.ans?'#27500A':'#791F1F'}}>
          <span style={{fontSize:16,flexShrink:0}}>{sel===q.ans?'✓':'✗'}</span>
          <div style={{fontSize:13,lineHeight:1.7}}><strong>{sel===q.ans?'Poprawnie!':'Błędna odpowiedź.'}</strong>
            <div style={{background:'#EEEDFE',borderRadius:6,padding:'8px 12px',marginTop:8,fontSize:12,color:'#3C3489',lineHeight:1.7}}><strong>Rozwiązanie:</strong> {q.dlaczego}</div>
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
const FISZKI=[
  {q:'Czym różni się nierówność od równania?',a:'Równanie ma skończoną liczbę rozwiązań. Nierówność — nieskończony zbiór (cały przedział).',f:'x = 3 (jedno) vs x > 3 (nieskończenie wiele)'},
  {q:'Jakie są 4 rodzaje nierówności?',a:'Mniejszy (<), większy (>), mniejszy lub równy (≤), większy lub równy (≥).',note:'Ostra: granica NIE należy. Nieostra: granica NALEŻY.'},
  {q:'Co się dzieje ze znakiem gdy dodajesz lub odejmujesz?',a:'Nic — znak NIE zmienia się. Bezpieczna operacja.',f:'a < b ⟹ a + c < b + c'},
  {q:'⚠️ Co się dzieje gdy mnożysz lub dzielisz przez ujemną?',a:'Znak ODWRACA SIĘ! < staje się >, ≤ staje się ≥.',f:'a < b ⟹ −a > −b',note:'Najczęstszy błąd na egzaminie!'},
  {q:'Jak zaznaczyć x > 4 na osi liczbowej?',a:'Puste kółko przy 4 (4 nie należy) i strzałka w prawo.',f:'———○══════→',note:'Ostra (>) = kółko puste ○'},
  {q:'Jak zaznaczyć x ≤ 4 na osi liczbowej?',a:'Pełne kółko przy 4 (4 należy) i strzałka w lewo.',f:'←══════●———',note:'Nieostra (≤) = kółko pełne ●'},
  {q:'Jak rozwiązać −3x < 9?',a:'Dzielimy przez −3 (ujemna!) i odwracamy < na >. Wynik: x > −3.',f:'−3x < 9  ⟹  x > −3'},
  {q:'"Co najmniej n" to jaki znak?',a:'"Co najmniej n" = n lub więcej → używamy ≥',f:'co najmniej 5 → x ≥ 5',note:'"Co najwyżej" → ≤. "Więcej niż" → >. "Mniej niż" → <.'},
  {q:'Jak sprawdzić rozwiązanie nierówności?',a:'Podstaw liczbę Z rozwiązania i liczbę SPOZA rozwiązania.',f:'x > 3: testuj x=5 (✓) i x=1 (✗)'},
  {q:'Jak zapisać x ≥ −2 jako przedział?',a:'Przedział domknięty od lewej: od −2 do plus nieskończoności.',f:'[−2; +∞)',note:'[ ] = domknięty (≤,≥). ( ) = otwarty (<,>). ∞ zawsze w ( ).'},
]
function FiszkiContent({onComplete}) {
  const [deck,setDeck]=useState(FISZKI.map((f,i)=>({...f,id:i}))),[flipped,setFlipped]=useState(false),[mastered,setMastered]=useState(0)
  if(deck.length===0)return(
    <div style={{...card,textAlign:'center'}}>
      <div style={{fontSize:48,marginBottom:8}}>🎴</div>
      <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>Wszystkie {FISZKI.length} kart opanowane!</div>
      <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:16}}>
        <button onClick={()=>{setDeck(FISZKI.map((f,i)=>({...f,id:i})));setFlipped(false);setMastered(0)}} style={btn()}>Powtórz fiszki</button>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Ukończyłem fiszki →</button>
      </div>
    </div>
  )
  const c=deck[0],pct=Math.round((mastered/FISZKI.length)*100)
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.accent,marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.accent,display:'inline-block'}}/>
        Fiszki — {mastered}/{FISZKI.length} opanowanych
      </div>
      <div style={{height:4,background:C.border,borderRadius:2,marginBottom:12,overflow:'hidden'}}><div style={{height:'100%',background:C.green,width:`${pct}%`,transition:'width .3s',borderRadius:2}}/></div>
      <div style={{fontSize:12,color:C.text3,textAlign:'center',marginBottom:12}}>Pozostało: {deck.length} kart · kliknij kartę żeby obrócić</div>
      <div onClick={()=>setFlipped(f=>!f)} style={{cursor:'pointer',minHeight:180,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',padding:28,textAlign:'center',background:flipped?C.white:C.navy,border:`0.5px solid ${flipped?C.border:'rgba(255,255,255,.08)'}`,transition:'background .3s',marginBottom:14}}>
        {!flipped
          ?<div><div style={{fontSize:11,color:'rgba(255,255,255,.25)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Fiszka {mastered+1}/{FISZKI.length}</div><div style={{fontSize:16,fontWeight:500,color:'#fff',lineHeight:1.6}}>{c.q}</div><div style={{fontSize:11,color:'rgba(255,255,255,.25)',marginTop:12}}>kliknij żeby zobaczyć odpowiedź</div></div>
          :<div><div style={{fontSize:14,color:C.text,lineHeight:1.7,marginBottom:8}}>{c.a}</div>{c.f&&<div style={{fontFamily:'monospace',fontSize:15,color:C.accent,fontWeight:600,margin:'8px 0'}}>{c.f}</div>}{c.note&&<div style={{fontSize:12,color:C.text3}}>{c.note}</div>}</div>}
      </div>
      {flipped&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlipped(false)}} style={btn({background:'#FCEBEB',color:'#791F1F',border:'0.5px solid #F7C1C1',textAlign:'center'})}>Trudna — powtórz</button>
        <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlipped(false)}} style={btn({background:'#EAF3DE',color:'#27500A',border:'0.5px solid #C0DD97',textAlign:'center'})}>Opanowana — następna</button>
      </div>}
    </div>
  )
}

// ── KARTKÓWKA ─────────────────────────────────────────────────────────────────
const KARTKOWKA=[
  {q:'Rozwiąż:',eq:'x − 3 < 5',opts:['x < 8','x < 2','x > 8','x < −2'],ans:0,hint:'Dodaj 3 do obu stron.'},
  {q:'Rozwiąż:',eq:'4x > 20',opts:['x > 80','x > 16','x > 5','x < 5'],ans:2,hint:'Podziel przez 4 (liczba dodatnia).'},
  {q:'Rozwiąż (uwaga!):',eq:'−2x ≥ 6',opts:['x ≥ −3','x ≤ −3','x ≤ 3','x ≥ 3'],ans:1,hint:'Dzielisz przez −2 → odwróć znak!'},
  {q:'Rozwiąż:',eq:'2x + 1 ≤ 9',opts:['x ≤ 4','x ≤ 5','x ≥ 4','x ≤ 8'],ans:0,hint:'Odejmij 1, potem podziel przez 2.'},
  {q:'Rozwiąż (uwaga!):',eq:'5 − x > 2',opts:['x > −3','x < 3','x > 3','x < −3'],ans:1,hint:'Odejmij 5: −x>−3. Pomnóż przez −1 → odwróć.'},
  {q:'Rozwiąż:',eq:'3(x + 2) > 2(x − 1) + 9',opts:['x > 1','x > 4','x < 1','x > 0'],ans:0,hint:'Rozwiń nawiasy, zbierz wyrazy.'},
  {q:'Która liczba całkowita spełnia 3x < 15?',eq:'',opts:['x = 5','x = 6','x = 4','x = 7'],ans:2,hint:'Rozwiąż: x < 5. Która jest mniejsza od 5?'},
  {q:'Ola ma więcej złotych niż Bartek (12 zł). Nierówność:',eq:'',opts:['x < 12','x ≤ 12','x > 12','x ≥ 12'],ans:2,hint:'"Więcej niż" = >'},
  {q:'Rozwiąż (uwaga!):',eq:'−3(x + 2) ≥ −x + 4',opts:['x ≤ −5','x ≥ −5','x ≤ 5','x ≥ 5'],ans:0,hint:'Rozwiń: −3x−6≥−x+4. Przenieś, podziel przez −2 → odwróć.'},
  {q:'Które stwierdzenie o x ≥ 7 jest FAŁSZYWE?',eq:'',opts:['x=7 spełnia','x=6 spełnia','x=100 spełnia','x=7.5 spełnia'],ans:1,hint:'≥ = "większy lub równy". Sprawdź każdą opcję.'},
]
function KartkowkaContent({onComplete}) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([]),[timer,setTimer]=useState(600),[hint,setHint]=useState(false)
  const ref=useRef(null)
  useEffect(()=>{if(mode==='egzamin'&&ki<KARTKOWKA.length){ref.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(ref.current);setKi(KARTKOWKA.length);return 0}return t-1}),1000)}return()=>clearInterval(ref.current)},[mode,ki])
  if(!mode)return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.blue,display:'inline-block'}}/>
        Kartkówka — 10 pytań
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
        {[['trening','🏋️','Tryb trening','Podpowiedzi dostępne, bez presji czasu'],['egzamin','🎯','Tryb egzamin','Bez podpowiedzi — jak na prawdziwym egzaminie']].map(([m,ico,t,d])=>(
          <div key={m} onClick={()=>setMode(m)} style={{border:`0.5px solid ${mode===m?C.navy:C.border}`,borderRadius:12,padding:16,cursor:'pointer',background:mode===m?C.navy:C.white,textAlign:'center',transition:'all .15s'}}>
            <div style={{fontSize:24,marginBottom:8}}>{ico}</div>
            <div style={{fontSize:14,fontWeight:500,color:mode===m?'#fff':C.text,marginBottom:4}}>{t}</div>
            <div style={{fontSize:12,color:mode===m?'rgba(255,255,255,.5)':C.text3}}>{d}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>mode&&setKi(0)} disabled={!mode} style={btn({width:'100%',textAlign:'center',background:mode?C.navy:'var(--color-background-secondary)',color:mode?'#fff':C.text3,border:'none',padding:'13px',cursor:mode?'pointer':'not-allowed'})}>Zacznij kartkówkę →</button>
    </div>
  )
  if(ki>=KARTKOWKA.length){const ok=results.filter(r=>r).length;return(
    <div style={{...card,textAlign:'center'}}>
      <div style={{fontSize:52,marginBottom:8}}>{ok>=8?'🏆':ok>=6?'⭐':'📚'}</div>
      <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>{ok}/10 poprawnych</div>
      <div style={{fontSize:14,color:C.text2,marginBottom:20}}>Ocena: {ok>=9?'A — doskonały':ok>=7?'B — dobry':ok>=5?'C — zadowalający':'D — wróć do teorii'}</div>
      <div style={{display:'flex',justifyContent:'center',gap:8}}>
        <button onClick={()=>{setMode(null);setKi(0);setSel(null);setDone(false);setResults([]);setTimer(600)}} style={btn()}>Powtórz</button>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Raport Maxa →</button>
      </div>
    </div>
  )}
  const q=KARTKOWKA[ki],mins=Math.floor(timer/60).toString().padStart(2,'0'),secs=(timer%60).toString().padStart(2,'0')
  return(
    <div style={card}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue}}>✏️ Kartkówka {ki+1}/{KARTKOWKA.length}</div>
        {mode==='egzamin'&&<div style={{fontFamily:'monospace',fontSize:18,fontWeight:600,color:timer<60?'#A32D2D':C.text,background:timer<60?'#FCEBEB':C.bg,padding:'4px 12px',borderRadius:8,border:`0.5px solid ${timer<60?'#F7C1C1':C.border}`}}>{mins}:{secs}</div>}
      </div>
      <div style={{display:'flex',gap:4,marginBottom:14}}>{KARTKOWKA.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i<ki?C.green:i===ki?C.accent:C.border}}/>)}</div>
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:10}}>{q.q}</div>
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'10px 18px',marginBottom:14,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div></div>}
      {mode==='trening'&&!done&&<div onClick={()=>setHint(h=>!h)} style={{background:'#FAEEDA',border:'0.5px solid #FAC775',borderRadius:8,padding:'9px 14px',marginBottom:12,fontSize:12,color:'#633806',cursor:'pointer'}}>💡 {hint?q.hint:'Kliknij po wskazówkę'}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#EAF3DE';border='#3B6D11';color='#27500A'}else if(i===sel){bg='#FCEBEB';border='#A32D2D';color='#791F1F'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setResults(p=>[...p,i===q.ans])}} style={{border:`0.5px solid ${border}`,borderRadius:8,padding:'11px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:14,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={()=>{if(ki<KARTKOWKA.length-1){setKi(k=>k+1);setSel(null);setDone(false);setHint(false)}else setKi(KARTKOWKA.length)}} style={btn({background:C.navy,color:'#fff',border:'none'})}>{ki<KARTKOWKA.length-1?'Dalej →':'Zakończ →'}</button></div>}
    </div>
  )
}

// ── ZADANIE CKE ───────────────────────────────────────────────────────────────
const CKE_Z=[
  {rok:2023,nr:8,pkt:2,tresc:'Rozwiąż nierówność: 3(x − 2) > x + 4',wsk:'Rozwiń nawias, przenieś x na lewą stronę, liczby na prawą.',rozw:['3x − 6 > x + 4','3x − x > 4 + 6','2x > 10','x > 5'],odp:'x > 5, czyli x ∈ (5; +∞)',schemat:'Za poprawne rozwiązanie: 1 pkt. Za poprawny zapis przedziałowy: 1 pkt.'},
  {rok:2022,nr:11,pkt:2,tresc:'Ania myśli o pewnej liczbie naturalnej. Jej potrójna wartość jest mniejsza niż 20. Podaj wszystkie takie liczby.',wsk:'Ułóż nierówność: 3x < 20. Pamiętaj że x musi być liczbą NATURALNĄ (całkowitą dodatnią).',rozw:['3x < 20','x < 20/3 = 6,6...','x ∈ {1, 2, 3, 4, 5, 6}'],odp:'Szukane liczby: 1, 2, 3, 4, 5, 6',schemat:'Za poprawną nierówność: 1 pkt. Za wszystkie liczby naturalne: 1 pkt.'},
]
function CKEContent({onComplete}) {
  const [rev,setRev]=useState([]),[sol,setSol]=useState(Array(CKE_Z.length).fill(false))
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:4,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.blue,display:'inline-block'}}/>
        Zadania z arkuszy CKE
      </div>
      <p style={{fontSize:13,color:C.text2,marginBottom:16,lineHeight:1.65}}>Autentyczne zadania z egzaminów ósmoklasisty. Spróbuj samodzielnie, potem sprawdź wzorcowe rozwiązanie ze schematem oceniania CKE.</p>
      {CKE_Z.map((z,i)=>(
        <div key={i} style={{background:C.bg,borderRadius:12,border:`0.5px solid ${C.border}`,padding:'18px 20px',marginBottom:14}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <span style={{fontSize:12,fontWeight:500,background:'#E6F1FB',color:'#0C447C',padding:'3px 10px',borderRadius:20}}>CKE {z.rok}</span>
            <span style={{fontSize:12,color:C.text3}}>Zadanie {z.nr}</span>
            <span style={{fontSize:12,fontWeight:500,color:'#633806',background:'#FAEEDA',padding:'3px 9px',borderRadius:20,marginLeft:'auto'}}>{z.pkt} {z.pkt===1?'punkt':'punkty'}</span>
          </div>
          <div style={{fontSize:15,fontWeight:500,color:C.text,lineHeight:1.65,marginBottom:14}}>{z.tresc}</div>
          <div onClick={()=>setRev(r=>r.includes(i)?r:[...r,i])} style={{background:'#FAEEDA',border:'0.5px solid #FAC775',borderRadius:8,padding:'9px 14px',marginBottom:10,fontSize:12,color:'#633806',cursor:'pointer',lineHeight:1.6}}>
            💡 {rev.includes(i)?z.wsk:'Kliknij po wskazówkę'}
          </div>
          <button onClick={()=>setSol(p=>p.map((v,j)=>j===i?!v:v))} style={btn({fontSize:12,padding:'8px 16px'})}>
            {sol[i]?'▲ Ukryj rozwiązanie':'▼ Pokaż wzorcowe rozwiązanie'}
          </button>
          {sol[i]&&(
            <div style={{marginTop:14,background:C.white,borderRadius:8,border:`0.5px solid ${C.border}`,padding:'16px'}}>
              {z.rozw.map((s,j)=>(
                <div key={j} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:j<z.rozw.length-1?`0.5px solid ${C.border}`:'none',alignItems:'center'}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:C.navy,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:500,flexShrink:0}}>{j+1}</div>
                  <div style={{fontFamily:'monospace',fontSize:14,color:C.text}}>{s}</div>
                </div>
              ))}
              <div style={{background:'#EAF3DE',borderRadius:8,padding:'10px 14px',marginTop:12,fontSize:13,color:'#27500A',fontWeight:500}}>Odpowiedź: {z.odp}</div>
              <div style={{background:'#EEEDFE',borderRadius:8,padding:'10px 14px',marginTop:8,fontSize:12,color:'#3C3489',lineHeight:1.6}}><strong>Schemat oceniania CKE:</strong> {z.schemat}</div>
            </div>
          )}
        </div>
      ))}
      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Ukończyłem zadania CKE →</button>
      </div>
    </div>
  )
}

// ── RAPORT ────────────────────────────────────────────────────────────────────
function RaportContent({onComplete}) {
  return(
    <div style={card}>
      <div style={{textAlign:'center',padding:'10px 0 20px'}}>
        <div style={{fontSize:52,marginBottom:8}}>🏆</div>
        <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:4}}>Lekcja ukończona</div>
        <div style={{fontSize:14,color:C.text2}}>Nierówności liniowe — teoria, ćwiczenia i egzamin CKE za Tobą</div>
      </div>
      <div style={{background:C.navy,borderRadius:12,padding:'20px',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#F5541E,#FF7A4D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>🤖</div>
          <div><div style={{fontSize:14,fontWeight:500,color:'#fff'}}>Max</div><div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>podsumowanie lekcji</div></div>
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.8)',lineHeight:1.8,marginBottom:14}}>Nierówności liniowe to 1–2 zadania w każdym arkuszu CKE. Cztery zasady które muszą być dla Ciebie automatyczne:</div>
        {[['Zmiana strony = zmiana znaku','Przenosząc wyraz — zawsze zmieniasz znak. Bez wyjątków.'],
          ['⚠️ Zasada znaku','Mnożenie/dzielenie przez ujemną ODWRACA znak nierówności.'],
          ['Słowa kluczowe','co najmniej=≥ · co najwyżej=≤ · więcej niż=> · mniej niż=<'],
          ['Sprawdzenie','Podstaw liczbę Z rozwiązania i SPOZA. Oba muszą dać oczekiwany wynik.'],
        ].map(([t,d],i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:8,fontSize:13,color:'rgba(255,255,255,.75)',lineHeight:1.6}}>
            <span style={{color:'#F5541E',flexShrink:0,marginTop:1}}>→</span>
            <span><strong style={{color:'rgba(255,255,255,.95)'}}>{t}:</strong> {d}</span>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Oznacz lekcję jako ukończoną</button>
        <Link href="/kurs/dzial-3" style={{...btn(),textDecoration:'none',display:'inline-block'}}>← Dział 3</Link>
      </div>
    </div>
  )
}

// ── KONFIGURACJA ──────────────────────────────────────────────────────────────
const DZIAL={n:3,title:'Równania i nierówności',href:'/kurs/dzial-3',lekcje:[
  {n:1,title:'Równania liniowe',href:'/kurs/rownania-liniowe',status:'done'},
  {n:2,title:'Układy równań',href:'/kurs/uklady-rownan',status:'done'},
  {n:3,title:'Nierówności liniowe',href:'/kurs/nierownosci',status:'active'},
  {n:4,title:'Zadania tekstowe',href:'/kurs/zadania-tekstowe',status:'locked'},
  {n:5,title:'Równania w geometrii',href:'/kurs/rownania-geometria',status:'locked'},
  {n:6,title:'Sprawdzian działu',href:'/kurs/sprawdzian-3',status:'locked',isTest:true},
]}
const LEKCJA={n:3,total:5,slug:'nierownosci',title:'Nierówności liniowe',czas:'15 min',poziom:'Poziom: podstawowy+',cke:true}
const XP_MAP={teoria:50,quiz:50,fiszki:60,kartkowka:80,cke:60,raport:40}
const MAX_FAQ=[
  {q:'zasada znaku ujemna',a:'Gdy dzielisz lub mnożysz przez UJEMNĄ — odwróć znak! < staje się >, ≤ staje się ≥. Przykład: −2x > 8 → x < −4.'},
  {q:'kółko oś liczbowa',a:'Kółko PUSTE (○) = granica NIE należy (znaki ostre < i >). Kółko PEŁNE (●) = granica NALEŻY (znaki nieostre ≤ i ≥).'},
  {q:'co najmniej co najwyżej',a:'"Co najmniej n" → ≥ n. "Co najwyżej n" → ≤ n. "Więcej niż" → >. "Mniej niż" → <.'},
  {q:'sprawdzić wynik',a:'Podstaw liczbę Z rozwiązania i liczbę SPOZA. Dla x>3: testuj x=5 (5>3 ✓) i x=1 (1>3 ✗).'},
]

export default function NierownosciLesson() {
  const segments=[
    {id:'teoria',    icon:'📖',label:'Teoria',     content:({onComplete})=><TeoriaContent onComplete={onComplete}/>},
    {id:'quiz',      icon:'🧠',label:'Quiz',       content:({onComplete})=><QuizContent onComplete={onComplete}/>},
    {id:'fiszki',    icon:'🃏',label:'Fiszki',     content:({onComplete})=><FiszkiContent onComplete={onComplete}/>},
    {id:'kartkowka', icon:'✏️',label:'Kartkówka',  content:({onComplete})=><KartkowkaContent onComplete={onComplete}/>},
    {id:'cke',       icon:'📝',label:'Zadanie CKE',content:({onComplete})=><CKEContent onComplete={onComplete}/>},
    {id:'raport',    icon:'📊',label:'Raport',     content:({onComplete})=><RaportContent onComplete={onComplete}/>},
  ]
  return <LessonShell dzial={DZIAL} lekcja={LEKCJA} segments={segments} xpMap={XP_MAP} maxFaq={MAX_FAQ}/>
}
