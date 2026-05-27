'use client'
import LessonShell from '../LessonShell'
import { useState } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA 1: Równania liniowe z jedną niewiadomą
// Oparcie: podręcznik Abeka Pre-Algebra 3.11-3.17 + wymagania CKE 2025
// ─────────────────────────────────────────────────────────────────────────────

const C = { navy:'#0F1729',accent:'#F5541E',green:'#00B894',purple:'#6C5CE7',blue:'#185FA5',bg:'#F7F8FC',white:'#fff',border:'#E2E8F0',text:'#0F1729',text2:'#4A5568',text3:'#8896A5' }
const card = { background:C.white, borderRadius:14, border:`0.5px solid ${C.border}`, padding:24 }
const btn = (x={}) => ({ padding:'10px 22px', fontSize:13, fontWeight:500, borderRadius:8, cursor:'pointer', fontFamily:'inherit', border:`0.5px solid ${C.border}`, background:C.white, color:C.text, transition:'all .15s', ...x })

const SH = ({children}) => (
  <div style={{fontSize:14,fontWeight:500,color:C.text,margin:'22px 0 10px',paddingBottom:8,borderBottom:`0.5px solid ${C.border}`,display:'flex',alignItems:'center',gap:8}}>
    <span style={{width:3,height:16,background:C.purple,borderRadius:2,display:'inline-block',flexShrink:0}}/>
    {children}
  </div>
)

// Krok rozwiązania (pionowa lista kroków z linią oddzielającą)
const Step = ({n,text,result,hi,note}) => (
  <div style={{display:'flex',gap:10}}>
    <div style={{width:22,height:22,background:C.navy,color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0,marginTop:10}}>{n}</div>
    <div style={{flex:1,padding:'8px 0',borderBottom:`0.5px solid ${C.border}`}}>
      <div style={{fontSize:13,color:C.text2,marginBottom:result?5:0,lineHeight:1.55}}>{text}</div>
      {result&&<div style={hi
        ?{background:'#EAF3DE',borderLeft:'3px solid #3B6D11',padding:'7px 12px',borderRadius:'0 7px 7px 0',fontFamily:'monospace',fontSize:14,color:'#27500A',fontWeight:600,display:'inline-block'}
        :{background:C.bg,padding:'6px 10px',borderRadius:6,fontFamily:'monospace',fontSize:13,color:C.text,display:'inline-block'}}>
        {result}
      </div>}
      {note&&<div style={{fontSize:11,color:C.text3,marginTop:4,fontStyle:'italic'}}>{note}</div>}
    </div>
  </div>
)

// Blok zadania z kolorowym badge poziomem trudności
const Task = ({level,label,eq,sub}) => {
  const b={basic:{bg:'#EAF3DE',c:'#27500A',txt:'Podstawowy'},med:{bg:'#FAEEDA',c:'#633806',txt:'Średni'},hard:{bg:'#FCEBEB',c:'#791F1F',txt:'Trudny'},cke:{bg:'#EEEDFE',c:'#3C3489',txt:'Typ CKE'}}[level]||{bg:'#EAF3DE',c:'#27500A',txt:'Podstawowy'}
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

// Odpowiedź końcowa
const Ans = ({val,note,type='ok'}) => (
  <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:8,marginTop:10,background:type==='ok'?'#EAF3DE':type==='none'?'#FCEBEB':'#E6F1FB',border:`0.5px solid ${type==='ok'?'#C0DD97':type==='none'?'#F7C1C1':'#B5D4F4'}`}}>
    <div style={{width:28,height:28,borderRadius:'50%',background:type==='ok'?'#3B6D11':type==='none'?'#A32D2D':'#185FA5',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:13,color:'#fff',fontWeight:700}}>{type==='ok'?'✓':type==='none'?'∅':'∞'}</div>
    <div>
      <div style={{fontFamily:'monospace',fontSize:15,fontWeight:500,color:type==='ok'?'#27500A':type==='none'?'#791F1F':'#0C447C'}}>{val}</div>
      {note&&<div style={{fontSize:12,color:type==='ok'?'#3B6D11':type==='none'?'#A32D2D':'#185FA5',marginTop:2}}>{note}</div>}
    </div>
  </div>
)

// Callout box
const Rule = ({type,children}) => {
  const m={warn:{bg:'#FAEEDA',bl:'#854F0B',c:'#633806'},tip:{bg:'#EAF3DE',bl:'#3B6D11',c:'#27500A'},info:{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'},err:{bg:'#FCEBEB',bl:'#A32D2D',c:'#791F1F'}}[type]||{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'}
  return <div style={{background:m.bg,borderLeft:`3px solid ${m.bl}`,borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:m.c,lineHeight:1.75,margin:'14px 0'}}>{children}</div>
}

// Tabela działań odwrotnych
function InverseOpsTable() {
  const rows = [
    ['+  (dodawanie)',    '−  (odejmowanie)',   'x + 7 = 15',  'x = 15 − 7 = 8'],
    ['−  (odejmowanie)', '+  (dodawanie)',      'x − 3 = 12',  'x = 12 + 3 = 15'],
    ['×  (mnożenie)',    '÷  (dzielenie)',      '5x = 35',     'x = 35 ÷ 5 = 7'],
    ['÷  (dzielenie)',   '×  (mnożenie)',       'x ÷ 4 = 5',   'x = 5 × 4 = 20'],
  ]
  return (
    <div style={{overflowX:'auto',margin:'14px 0'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead>
          <tr style={{background:C.navy}}>
            {['Masz','Używasz','Przykład','Wynik'].map(h=>(
              <th key={h} style={{padding:'10px 14px',textAlign:'left',color:'rgba(255,255,255,.75)',fontSize:11,fontWeight:500,letterSpacing:'.05em'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([m,u,p,w],i)=>(
            <tr key={i} style={{background:i%2===0?C.white:C.bg}}>
              <td style={{padding:'8px 14px',fontFamily:'monospace',fontWeight:600,color:C.accent,borderBottom:`0.5px solid ${C.border}`}}>{m}</td>
              <td style={{padding:'8px 14px',fontFamily:'monospace',fontWeight:600,color:C.green,borderBottom:`0.5px solid ${C.border}`}}>{u}</td>
              <td style={{padding:'8px 14px',fontFamily:'monospace',color:C.text,borderBottom:`0.5px solid ${C.border}`}}>{p}</td>
              <td style={{padding:'8px 14px',fontFamily:'monospace',fontWeight:600,color:'#27500A',borderBottom:`0.5px solid ${C.border}`}}>{w}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Interaktywna waga — wizualizacja złotej zasady
function Balance({left, right, solved}) {
  return (
    <div style={{textAlign:'center',padding:'20px 0',margin:'14px 0',background:C.bg,borderRadius:12,border:`0.5px solid ${C.border}`}}>
      <div style={{fontSize:12,color:C.text3,marginBottom:10,textTransform:'uppercase',letterSpacing:'.06em'}}>Złota zasada — waga równowagi</div>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:0}}>
        {/* Lewa szalka */}
        <div style={{textAlign:'center'}}>
          <div style={{background:solved?'#EAF3DE':'#E6F1FB',border:`2px solid ${solved?'#3B6D11':'#185FA5'}`,borderRadius:8,padding:'10px 20px',marginBottom:4,fontFamily:'monospace',fontSize:16,fontWeight:700,color:solved?'#27500A':'#0C447C',minWidth:80}}>{left}</div>
          <div style={{fontSize:10,color:C.text3}}>Lewa strona</div>
        </div>
        {/* Belka wagi */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',margin:'0 8px',paddingBottom:20}}>
          <div style={{width:120,height:4,background:C.navy,borderRadius:2,position:'relative'}}>
            <div style={{position:'absolute',top:-10,left:'50%',transform:'translateX(-50%)',fontSize:18}}>⚖️</div>
          </div>
        </div>
        {/* Prawa szalka */}
        <div style={{textAlign:'center'}}>
          <div style={{background:solved?'#EAF3DE':'#E6F1FB',border:`2px solid ${solved?'#3B6D11':'#185FA5'}`,borderRadius:8,padding:'10px 20px',marginBottom:4,fontFamily:'monospace',fontSize:16,fontWeight:700,color:solved?'#27500A':'#0C447C',minWidth:80}}>{right}</div>
          <div style={{fontSize:10,color:C.text3}}>Prawa strona</div>
        </div>
      </div>
      {solved&&<div style={{fontSize:12,color:'#3B6D11',marginTop:8,fontWeight:500}}>✓ Waga w równowadze — równanie rozwiązane!</div>}
    </div>
  )
}

// ── TEORIA — 6 sekcji ─────────────────────────────────────────────────────────
const TTABS = [
  {id:'def',     label:'Czym jest równanie?'},
  {id:'zasady',  label:'Złota zasada i operacje'},
  {id:'proste',  label:'Równania ax + b = c'},
  {id:'obu',     label:'x po obu stronach'},
  {id:'ulamki',  label:'★ Ułamki i dziesiętne'},
  {id:'slowa',   label:'Zadania tekstowe CKE'},
]

function TeoriaContent({onComplete}) {
  const [tab, setTab] = useState('def')
  const [balanceStep, setBalanceStep] = useState(0)

  const CONTENT = {

    def: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        <strong style={{color:C.text}}>Równanie</strong> to matematyczna waga. Znak <strong style={{fontFamily:'monospace',color:C.text}}>= </strong> mówi, że lewa strona waży dokładnie tyle samo, co prawa. <strong style={{color:C.text}}>Niewiadoma</strong> (najczęściej <em>x</em>) to ukryta liczba, którą musimy odkryć — jak detektyw.
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'18px 24px',marginBottom:16,textAlign:'center'}}>
        <div style={{fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:10}}>Przykład z podręcznika (Abeka 3.11)</div>
        <div style={{fontFamily:'monospace',fontSize:22,color:'#fff',lineHeight:2}}>
          n + 6 = 9
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.5)',marginTop:4}}>n + 6 i 9 to dwie strony wagi. Szukamy n.</div>
      </div>

      <SH>Cztery zasady przekształcania równań (Abeka 3.11)</SH>
      <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:14}}>
        {[
          ['1','Tę samą liczbę możemy DODAĆ do obu stron','Równość zostaje zachowana'],
          ['2','Tę samą liczbę możemy ODJĄĆ od obu stron','Równość zostaje zachowana'],
          ['3','Obie strony możemy POMNOŻYĆ przez tę samą liczbę','Równość zostaje zachowana'],
          ['4','Obie strony możemy PODZIELIĆ przez tę samą liczbę (≠ 0)','Równość zostaje zachowana'],
        ].map(([n,t,d])=>(
          <div key={n} style={{display:'flex',gap:12,padding:'10px 14px',background:C.bg,borderRadius:8,border:`0.5px solid ${C.border}`,alignItems:'flex-start'}}>
            <div style={{width:24,height:24,borderRadius:'50%',background:C.navy,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{n}</div>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:2}}>{t}</div>
              <div style={{fontSize:12,color:C.text3}}>{d}</div>
            </div>
          </div>
        ))}
      </div>
      <Rule type="info"><strong>Złota zasada (Abeka):</strong> "Whatever is done to one side of an equation must be done to the other side." — Co robisz po jednej stronie, musisz zrobić po drugiej.</Rule>

      <SH>Ile rozwiązań może mieć równanie liniowe?</SH>
      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {[
          ['Dokładnie jedno','ax + b = c, a≠0','Typowy przypadek — x = konkretna liczba','#EAF3DE','#27500A'],
          ['Brak (∅)','Równanie sprzeczne','Po uproszczeniu: 5 = −2 (zawsze fałsz)','#FCEBEB','#791F1F'],
          ['Nieskończenie wiele (ℝ)','Równanie tożsamościowe','Po uproszczeniu: 0 = 0 (zawsze prawda)','#E6F1FB','#0C447C'],
        ].map(([t,p,d,bg,c])=>(
          <div key={t} style={{display:'flex',gap:12,padding:'10px 14px',background:bg,borderRadius:8,alignItems:'center'}}>
            <div style={{fontSize:13,fontWeight:500,color:c,minWidth:190,flexShrink:0}}>{t}</div>
            <div>
              <div style={{fontFamily:'monospace',fontSize:12,color:c,marginBottom:2}}>{p}</div>
              <div style={{fontSize:12,color:C.text2}}>{d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>,

    zasady: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Aby wyizolować x, używamy <strong style={{color:C.text}}>działań odwrotnych</strong> — działania po przeciwnych stronach znoszą się. Cel zawsze ten sam: doprowadzić do postaci <strong style={{fontFamily:'monospace',color:C.text}}>x = liczba</strong>.
      </p>

      <SH>Tabela działań odwrotnych</SH>
      <InverseOpsTable/>

      <SH>Interaktywna waga — jak działa złota zasada</SH>
      <p style={{fontSize:13,color:C.text2,marginBottom:10}}>Rozwiążemy równanie <span style={{fontFamily:'monospace',fontWeight:600}}>4x + 3 = 15</span> krok po kroku:</p>
      <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap'}}>
        {['Start','Krok 1: odejmij 3','Krok 2: podziel przez 4','Rozwiązanie'].map((l,i)=>(
          <button key={i} onClick={()=>setBalanceStep(i)} style={{padding:'6px 14px',fontSize:12,borderRadius:20,border:`0.5px solid ${balanceStep===i?C.navy:C.border}`,background:balanceStep===i?C.navy:C.white,color:balanceStep===i?'#fff':C.text2,cursor:'pointer',fontFamily:'inherit'}}>
            {l}
          </button>
        ))}
      </div>
      {balanceStep===0&&<Balance left="4x + 3" right="15" solved={false}/>}
      {balanceStep===1&&<Balance left="4x + 3 − 3 = 4x" right="15 − 3 = 12" solved={false}/>}
      {balanceStep===2&&<Balance left="4x ÷ 4 = x" right="12 ÷ 4 = 3" solved={false}/>}
      {balanceStep===3&&<Balance left="x" right="3" solved={true}/>}

      <SH>Przenoszenie wyrazów — skrótowa technika</SH>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:10}}>
        Zamiast pisać "odejmuję od obu stron", mówimy że <strong style={{color:C.text}}>przenosimy wyraz i zmieniamy znak</strong>. To skrót, ale wynik jest identyczny.
      </p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        <div style={{background:C.bg,borderRadius:8,padding:'14px',border:`0.5px solid ${C.border}`}}>
          <div style={{fontSize:11,color:C.text3,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>Zapis formalny</div>
          <div style={{fontFamily:'monospace',fontSize:13,color:C.text,lineHeight:2.4}}>
            3x + 5 = 14<br/>
            3x + 5 − 5 = 14 − 5<br/>
            3x = 9<br/>
            3x ÷ 3 = 9 ÷ 3<br/>
            x = 3
          </div>
        </div>
        <div style={{background:C.bg,borderRadius:8,padding:'14px',border:`0.5px solid ${C.border}`}}>
          <div style={{fontSize:11,color:C.text3,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>Zapis skrótowy (praktyczny)</div>
          <div style={{fontFamily:'monospace',fontSize:13,color:C.text,lineHeight:2.4}}>
            3x + 5 = 14<br/>
            3x = 14 − 5<br/>
            3x = 9<br/>
            x = 3
          </div>
        </div>
      </div>
      <Rule type="warn"><strong>Zmiana strony = zmiana znaku:</strong> +5 po lewej → −5 po prawej · −7 po prawej → +7 po lewej · +3x po prawej → −3x po lewej. Bez wyjątków.</Rule>
    </div>,

    proste: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Równanie <strong style={{color:C.text}}>ax + b = c</strong> rozwiązujemy w dwóch krokach: izolujemy stałą (dodaj/odejmij), potem izolujemy x (pomnóż/podziel). Zawsze sprawdzamy wynik!
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'16px 24px',marginBottom:16,textAlign:'center'}}>
        <div style={{fontFamily:'monospace',fontSize:16,color:'#fff',lineHeight:2.4}}>
          ax + b = c &nbsp;→&nbsp; ax = c − b &nbsp;→&nbsp; x = (c − b) ÷ a
        </div>
      </div>

      <Task level="basic" label="Krok 1: odejmowanie (Abeka 3.11a)" eq="x + 5 = 20/2" />
      <Step n={1} text="Upraszczamy prawą stronę:" result="x + 5 = 10" />
      <Step n={2} text="Odejmujemy 5 od obu stron:" result="x = 10 − 5 = 5" hi />
      <Ans val="x = 5" note="Sprawdzenie: 5 + 5 = 20/2 → 10 = 10 ✓" />

      <Task level="basic" label="Krok 2: mnożenie i odejmowanie (Abeka 3.11b)" eq="4x + 3 = 21 − 6" />
      <Step n={1} text="Upraszczamy prawą stronę: 21 − 6 = 15" result="4x + 3 = 15" />
      <Step n={2} text="Odejmujemy 3 od obu stron:" result="4x = 12" />
      <Step n={3} text="Dzielimy przez 4:" result="x = 3" hi />
      <Ans val="x = 3" note="Sprawdzenie: 4·3 + 3 = 21 − 6 → 15 = 15 ✓" />

      <Task level="med" label="Łączenie wyrazów podobnych (Abeka 3.11c)" eq="3y + 2y = 15" />
      <Step n={1} text="Łączymy wyrazy podobne po lewej: 3y + 2y = 5y" result="5y = 15" />
      <Step n={2} text="Dzielimy przez 5:" result="y = 3" hi />
      <Ans val="y = 3" note="Sprawdzenie: 3·3 + 2·3 = 9 + 6 = 15 ✓" />

      <Task level="med" label="Wynik ułamkowy — normalny wynik na CKE!" eq="4x + 5 = 14" />
      <Step n={1} text="Odejmujemy 5:" result="4x = 9" />
      <Step n={2} text="Dzielimy przez 4:" result="x = 9/4 = 2,25" hi />
      <Ans val="x = 9/4" note="Na egzaminie CKE wynik ułamkowy jest w pełni poprawny!" />

      <Task level="hard" label="Ujemny współczynnik przy x" eq="−3x + 7 = −2" />
      <Step n={1} text="Odejmujemy 7:" result="−3x = −9" />
      <Step n={2} text="Dzielimy przez −3 (ujemna — tylko wynik zmienia znak):" result="x = 3" hi />
      <Ans val="x = 3" note="Sprawdzenie: −3·3 + 7 = −9 + 7 = −2 ✓" />

      <Rule type="err"><strong>Najczęstszy błąd na CKE:</strong> zapomnienie o sprawdzeniu. W zadaniach otwartych sprawdzenie to osobny punkt! Zawsze podstaw wynik do ORYGINALNEGO równania.</Rule>
    </div>,

    obu: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Gdy x pojawia się po <strong style={{color:C.text}}>obu stronach</strong>, przenosimy wszystkie wyrazy z x na lewą, liczby na prawą. Zasada przenoszenia (zmiana znaku) obowiązuje tak samo.
      </p>

      <Task level="basic" label="Standardowy typ (Abeka: 6x + 4 = 4x + 12)" eq="6x + 4 = 4x + 12" />
      <Step n={1} text="Przenosimy 4x na lewą (odejmujemy 4x od obu stron):" result="2x + 4 = 12" />
      <Step n={2} text="Przenosimy 4 na prawą:" result="2x = 8" />
      <Step n={3} text="Dzielimy przez 2:" result="x = 4" hi />
      <Ans val="x = 4" note="Sprawdzenie: 6·4+4=28 i 4·4+12=28 ✓" />

      <Task level="med" label="Ujemne współczynniki po obu stronach" eq="2 − 3x = 5 − 7x" />
      <Step n={1} text="Przenosimy −7x na lewą (dodajemy 7x do obu stron):" result="2 + 4x = 5" />
      <Step n={2} text="Przenosimy 2 na prawą:" result="4x = 3" />
      <Step n={3} text="Dzielimy przez 4:" result="x = 3/4" hi />
      <Ans val="x = 3/4" note="Sprawdzenie: 2−3·(3/4)=2−9/4=−1/4 i 5−7·(3/4)=5−21/4=−1/4 ✓" />

      <Task level="hard" label="Nawiasy + x po obu stronach (Abeka: 2(x−3)=10)" eq="2(x − 3) = 10" />
      <Step n={1} text="Rozwijamy nawias:" result="2x − 6 = 10" />
      <Step n={2} text="Przenosimy −6 na prawą:" result="2x = 16" />
      <Step n={3} text="Dzielimy przez 2:" result="x = 8" hi />
      <Ans val="x = 8" note="Sprawdzenie: 2·(8−3)=2·5=10 ✓" />

      <Task level="cke" label="Weryfikacja przekształcenia — typ CKE (zadanie zamknięte)" eq="Które przekształcenie 5x − 3 = 2 jest BŁĘDNE?" sub="Wskaż błędne działanie" />
      <div style={{display:'flex',flexDirection:'column',gap:6,margin:'12px 0 14px'}}>
        {[
          ['A','5x = 2 + 3','Poprawne — dodano 3 do obu stron'],
          ['B','5x = 5','Poprawne — 2+3=5'],
          ['C','x = 1','Poprawne — 5÷5=1'],
          ['D','5x − 5 = 0','BŁĘDNE — odjęto 5 tylko od lewej strony!'],
        ].map(([l,eq,d],i)=>(
          <div key={l} style={{display:'flex',gap:10,padding:'10px 14px',borderRadius:8,background:i===3?'#FCEBEB':C.bg,border:`0.5px solid ${i===3?'#F7C1C1':C.border}`}}>
            <span style={{fontWeight:700,color:i===3?'#A32D2D':C.text3,flexShrink:0,minWidth:16}}>{l}.</span>
            <span style={{fontFamily:'monospace',color:i===3?'#791F1F':C.text,flex:1}}>{eq}</span>
            <span style={{fontSize:12,color:i===3?'#A32D2D':C.text3}}>{d}</span>
          </div>
        ))}
      </div>

      <SH>Tabela typowych błędów przy przenoszeniu</SH>
      {[
        ['Nie zmieniono znaku','3x + 2 = x + 10 → 3x + x = 10 ✗','3x − x = 10 − 2 → x = 4 ✓'],
        ['Przeniesiono x, ale zapomniano o liczbie','3x + 2 = x + 10 → 3x − x + 2 = 10 ✗','3x − x = 10 − 2 ✓'],
        ['Dzielenie tylko jednej strony','4x = 20 → 4x ÷ 4 = 20 ✗','4x ÷ 4 = 20 ÷ 4 → x = 5 ✓'],
      ].map(([b,w,ok])=>(
        <div key={b} style={{background:C.bg,borderRadius:8,padding:'12px 14px',marginBottom:8,borderLeft:'3px solid #A32D2D',border:`0.5px solid ${C.border}`,borderLeftWidth:3}}>
          <div style={{fontSize:12,fontWeight:500,color:C.text,marginBottom:5}}>⚠️ {b}</div>
          <div style={{fontFamily:'monospace',fontSize:12,color:'#A32D2D',marginBottom:4}}>{w}</div>
          <div style={{fontFamily:'monospace',fontSize:12,color:'#27500A'}}>✓ {ok}</div>
        </div>
      ))}
    </div>,

    ulamki: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Ułamki i dziesiętne w równaniach eliminujemy przez pomnożenie przez <strong style={{color:C.text}}>NWW mianowników</strong> lub przez odpowiednią potęgę 10. To pozwala wrócić do znajomego równania bez ułamków. Metoda pochodzi wprost z podręcznika Abeka (Lekcja 3.13 i 3.14).
      </p>

      <SH>Eliminowanie ułamków — mnożenie przez NWW (Abeka 3.13)</SH>
      <Task level="basic" label="Jeden mianownik" eq="(2/3)y = 8" />
      <Step n={1} text="Mnożymy przez odwrotność 2/3, czyli przez 3/2 (metoda Abeka):" result="y = 8 · (3/2) = 12" hi />
      <Ans val="y = 12" note="Sprawdzenie: (2/3)·12 = 8 ✓" />

      <Task level="med" label="Dwa różne mianowniki (Abeka 3.13a)" eq="(1/2)x + (1/5)x = 14" sub="NWW mianowników 2 i 5 = 10" />
      <Step n={1} text="Mnożymy każdy wyraz przez 10 (NWW mianowników 2 i 5):" result="5x + 2x = 140" />
      <Step n={2} text="Łączymy: 7x = 140, dzielimy przez 7:" result="x = 20" hi />
      <Ans val="x = 20" note="Sprawdzenie: (1/2)·20 + (1/5)·20 = 10 + 4 = 14 ✓" />

      <Task level="hard" label="Ułamki z wyrażeniami (Abeka 3.13b i 3.13c)" eq="(2/3)x = 1/2" sub="NWW = 6" />
      <Step n={1} text="Mnożymy każdy wyraz przez 6:" result="4x = 3" />
      <Step n={2} text="Dzielimy przez 4:" result="x = 3/4" hi />
      <Ans val="x = 3/4" note="Sprawdzenie: (2/3)·(3/4) = 6/12 = 1/2 ✓" />

      <SH>Eliminowanie dziesiętnych — mnożenie przez potęgę 10 (Abeka 3.14)</SH>
      <Rule type="info"><strong>Strategia Abeka 3.14:</strong> Dziesiętne eliminujesz przez pomnożenie przez 10 (jedna cyfra po przecinku), 100 (dwie cyfry) itp. To zamienia dziesiętne w liczby całkowite.</Rule>

      <Task level="basic" label="Jeden dziesiętny współczynnik (Abeka 3.14a)" eq="0,3x = 21" sub="0,3 = dziesiąte → mnożymy przez 10" />
      <Step n={1} text="Mnożymy obie strony przez 10:" result="3x = 210" />
      <Step n={2} text="Dzielimy przez 3:" result="x = 70" hi />
      <Ans val="x = 70" note="Sprawdzenie: 0,3·70 = 21 ✓" />

      <Task level="med" label="Dwa dziesiętne (Abeka 3.14b)" eq="0,05x = 2,5" sub="setne → mnożymy przez 100" />
      <Step n={1} text="Mnożymy przez 100:" result="5x = 250" />
      <Step n={2} text="Dzielimy przez 5:" result="x = 50" hi />
      <Ans val="x = 50" note="Sprawdzenie: 0,05·50 = 2,5 ✓" />

      <Task level="hard" label="Mieszane: ułamki i dziesiętne (Abeka 3.16)" eq="0,4x + 0,03x = 7,31" sub="setne → mnożymy przez 100" />
      <Step n={1} text="Mnożymy każdy wyraz przez 100:" result="40x + 3x = 731" />
      <Step n={2} text="Łączymy: 43x = 731, dzielimy przez 43:" result="x = 17" hi />
      <Ans val="x = 17" note="Sprawdzenie: 0,4·17 + 0,03·17 = 6,8 + 0,51 = 7,31 ✓" />

      <Task level="cke" label="Złożone: ułamki i dziesiętne po obu stronach" eq="(5/6)x + (1/2)x = 10 − 3" sub="NWW(6,2) = 6 → mnożymy przez 6" />
      <Step n={1} text="Upraszczamy prawą: 10−3=7. Mnożymy przez 6:" result="5x + 3x = 42" />
      <Step n={2} text="8x = 42, dzielimy przez 8:" result="x = 42/8 = 21/4 = 5,25" hi />
      <Ans val="x = 21/4" note="Sprawdzenie: (5/6)·(21/4) + (1/2)·(21/4) = 35/8 + 21/8 = 56/8 = 7 ✓" />
    </div>,

    slowa: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Zadania tekstowe to najważniejszy typ na egzaminie CKE — zwykle za 2-3 punkty. Podręcznik Abeka (Lekcje 3.15-3.16) pokazuje precyzyjny 5-krokowy algorytm, który działa na każde zadanie.
      </p>

      <SH>Algorytm 5 kroków — Abeka 3.16</SH>
      <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
        {[
          ['Przeczytaj zadanie uważnie','Wypisz dane. Co jest dane? Co szukamy?'],
          ['Oznacz niewiadomą','Wybierz x — zwykle to, o co pyta zadanie. Wyraź resztę przez x.'],
          ['Ułóż równanie','Przetłumacz treść zadania na równanie algebraiczne.'],
          ['Rozwiąż równanie','Standardowe kroki: przenieś, podziel, sprawdź.'],
          ['Odpowiedz na pytanie','Podaj odpowiedź w kontekście zadania (nie zawsze sam x!). Sprawdź czy ma sens.'],
        ].map(([t,d],i)=>(
          <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'10px 14px',background:C.bg,borderRadius:8,border:`0.5px solid ${C.border}`}}>
            <div style={{width:24,height:24,borderRadius:'50%',background:C.navy,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0,marginTop:1}}>{i+1}</div>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:2}}>{t}</div>
              <div style={{fontSize:13,color:C.text2,lineHeight:1.5}}>{d}</div>
            </div>
          </div>
        ))}
      </div>

      <SH>Słownik tłumaczeń: słowa → algebra</SH>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
        {[
          ['"powiększona o 5"','+ 5','x + 5'],
          ['"zmniejszona o 3"','− 3','x − 3'],
          ['"3 razy więcej"','× 3','3x'],
          ['"podzielona przez 4"','÷ 4','x/4'],
          ['"o 3 droższy niż x"','x + 3','cena = x + 3'],
          ['"suma dwóch liczb = 15"','x + (x+1) = 15','kolejne liczby'],
          ['"razem kosztują 15 zł"','suma = 15','x + y = 15'],
          ['"jest 10% starszym"','× 1,1','wiek = 1,1x'],
        ].map(([sl,zn,pr])=>(
          <div key={sl} style={{background:C.bg,borderRadius:8,padding:'10px 12px',border:`0.5px solid ${C.border}`}}>
            <div style={{fontSize:12,color:C.text3,marginBottom:4}}>{sl}</div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <span style={{fontFamily:'monospace',fontSize:13,fontWeight:600,color:C.accent}}>{zn}</span>
              <span style={{fontSize:11,color:C.text3}}>np. {pr}</span>
            </div>
          </div>
        ))}
      </div>

      <SH>Przykład 1 — zeszyt i długopis (z przesłanego materiału)</SH>
      <div style={{background:C.bg,borderRadius:8,padding:'14px 16px',marginBottom:12,border:`0.5px solid ${C.border}`}}>
        <div style={{fontSize:14,color:C.text2,lineHeight:1.75,fontStyle:'italic',marginBottom:10}}>"Zeszyt i długopis kosztują razem 15 zł. Długopis jest o 3 zł droższy od zeszytu. Ile kosztuje każde z nich?"</div>
        <Step n={1} text="Oznaczamy: x = cena zeszytu. Długopis = x + 3" result="" />
        <Step n={2} text="Równanie (razem = 15 zł):" result="x + (x + 3) = 15" />
        <Step n={3} text="Upraszczamy: 2x + 3 = 15 → 2x = 12" result="x = 6" hi />
      </div>
      <Ans val="Zeszyt: 6 zł · Długopis: 9 zł" note="Sprawdzenie: 6 + 9 = 15 ✓ · 9 − 6 = 3 ✓" />

      <SH>Przykład 2 — telefon (Abeka 3.12: Mrs. Greene)</SH>
      <div style={{background:C.bg,borderRadius:8,padding:'14px 16px',marginBottom:12,border:`0.5px solid ${C.border}`}}>
        <div style={{fontSize:14,color:C.text2,lineHeight:1.75,fontStyle:'italic',marginBottom:10}}>"Rozmowa trwała 23 minuty. Pierwsze 3 minuty kosztują 0,95 zł, każda następna minuta 0,15 zł. Ile kosztowała rozmowa?"</div>
        <Step n={1} text="Dodatkowe minuty (po pierwszych 3): 23 − 3 = 20 minut" result="" />
        <Step n={2} text="Koszt dodatkowych minut: 20 × 0,15 = 3,00 zł" result="" />
        <Step n={3} text="Koszt całkowity: 0,95 + 3,00 = 3,95 zł" result="" hi />
      </div>
      <Ans val="Koszt rozmowy: 3,95 zł" note="Źródło: Abeka Pre-Algebra, Lesson 57" />

      <SH>Przykład 3 — bilety CKE (typ zadania otwartego, 3 pkt)</SH>
      <div style={{background:C.bg,borderRadius:8,padding:'14px 16px',marginBottom:12,border:`0.5px solid ${C.border}`}}>
        <div style={{fontSize:14,color:C.text2,lineHeight:1.75,fontStyle:'italic',marginBottom:10}}>"Cena biletu do teatru jest o 64 zł większa od ceny biletu do kina. Za 4 bilety do teatru i 5 biletów do kina zapłacono 400 zł. Oblicz cenę biletu do teatru." <strong style={{color:C.text}}>(CKE 2023, Zadanie 16, 2 pkt)</strong></div>
        <Step n={1} text="Oznaczamy: bilet do teatru = x · bilet do kina = x − 64" result="" />
        <Step n={2} text="Równanie z treści:" result="4x + 5(x − 64) = 400" />
        <Step n={3} text="Rozwijamy: 4x + 5x − 320 = 400 → 9x = 720" result="x = 80" hi />
      </div>
      <Ans val="Bilet do teatru: 80 zł" note="Sprawdzenie: 4·80 + 5·(80−64) = 320 + 80 = 400 ✓" />

      <Rule type="tip"><strong>Złota rada CKE:</strong> W zadaniach otwartych zawsze zapisuj każdy krok. Egzaminatorzy przyznają punkty za tok rozwiązania, nawet przy błędzie rachunkowym na końcu!</Rule>
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

// ── QUIZ (10 pytań, wzorowane na Abeka + CKE) ─────────────────────────────────
const QUIZ = [
  {q:'Rozwiąż:', eq:'x − 8 = 12', opts:['x=4','x=20','x=−4','x=−20'], ans:1, dlaczego:'Dodajemy 8 do obu stron: x = 12 + 8 = 20.'},
  {q:'Jaki pierwszy krok w rozwiązaniu?', eq:'3x + 4 = 19', opts:['Podziel przez 3','Dodaj 4','Odejmij 4','Pomnóż przez 3'], ans:2, dlaczego:'Najpierw izolujemy wyrazy z x przez odjęcie 4 od obu stron: 3x = 15. Potem dzielimy przez 3.'},
  {q:'Rozwiąż (Abeka 3.11):', eq:'5x = 35', opts:['x=30','x=8','x=7','x=40'], ans:2, dlaczego:'Dzielimy obie strony przez 5: x = 35÷5 = 7. Sprawdzenie: 5·7=35 ✓'},
  {q:'Rozwiąż:', eq:'x/4 = 5', opts:['x=1','x=9','x=20','x=1,25'], ans:2, dlaczego:'Mnożymy obie strony przez 4 (działanie odwrotne do ÷4): x = 5·4 = 20.'},
  {q:'Rozwiąż z nawiasem (Abeka):', eq:'2(x − 3) = 10', opts:['x=5','x=8','x=2','x=−2'], ans:1, dlaczego:'Rozwijamy: 2x−6=10 → 2x=16 → x=8. Sprawdzenie: 2·(8−3)=2·5=10 ✓'},
  {q:'Rozwiąż z ujemnym wynikiem:', eq:'x + 15 = 8', opts:['x=7','x=23','x=−7','x=−23'], ans:2, dlaczego:'Odejmujemy 15 od obu stron: x = 8−15 = −7. Sprawdzenie: −7+15=8 ✓'},
  {q:'Zbierz wyrazy podobne i rozwiąż:', eq:'2x + 3x = 25', opts:['x=5','x=25','x=12,5','x=10'], ans:0, dlaczego:'2x+3x=5x. Równanie: 5x=25 → x=25÷5=5.'},
  {q:'Rozwiąż (Abeka 3.13a — ułamki):', eq:'(1/2)x + (1/5)x = 14', opts:['x=28','x=10','x=20','x=14'], ans:2, dlaczego:'NWW(2,5)=10. Mnożymy przez 10: 5x+2x=140 → 7x=140 → x=20. Sprawdzenie: 10+4=14 ✓'},
  {q:'Rozwiąż (Abeka 3.14 — dziesiętne):', eq:'0,05x = 2,5', opts:['x=12,5','x=50','x=0,125','x=5'], ans:1, dlaczego:'Mnożymy przez 100 (setne): 5x=250 → x=50. Sprawdzenie: 0,05·50=2,5 ✓'},
  {q:'Zeszyt i długopis kosztują razem 15 zł. Długopis jest o 3 zł droższy. Cena zeszytu:', eq:'', opts:['x=6 zł','x=9 zł','x=12 zł','x=3 zł'], ans:0, dlaczego:'x+(x+3)=15 → 2x+3=15 → 2x=12 → x=6. Zeszyt: 6 zł, długopis: 9 zł.'},
]

function QuizContent({onComplete}) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([])
  if(qi>=QUIZ.length){const ok=results.filter(r=>r).length;return(
    <div style={card}>
      <div style={{textAlign:'center',padding:'16px 0 24px'}}>
        <div style={{fontSize:48,marginBottom:8}}>{ok>=9?'🎯':ok>=7?'👍':'📚'}</div>
        <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>{ok}/{QUIZ.length} poprawnych</div>
        <div style={{fontSize:14,color:C.text2}}>{ok>=9?'Doskonale!':ok>=7?'Dobry wynik!':'Wróć do teorii.'}</div>
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
        <button onClick={()=>{setQi(0);setSel(null);setDone(false);setResults([])}} style={btn()}>Powtórz quiz</button>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Fiszki →</button>
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
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:12,lineHeight:1.55}}>{q.q}</div>
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'11px 18px',marginBottom:14,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:20,color:'#fff'}}>{q.eq}</div></div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#EAF3DE';border='#3B6D11';color='#27500A'}else if(i===sel){bg='#FCEBEB';border='#A32D2D';color='#791F1F'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setResults(p=>[...p,i===q.ans])}} style={{border:`0.5px solid ${border}`,borderRadius:8,padding:'12px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:14,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
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

// ── FISZKI (15 kart) ──────────────────────────────────────────────────────────
const FISZKI = [
  {q:'Czym jest równanie? (Abeka 3.11)',a:'Zdanie matematyczne stwierdzające, że dwie wielkości są równe. Znak = to waga — obie strony muszą ważyć tyle samo.',f:'n + 6 = 9 · 4x + 3 = 15'},
  {q:'Złota zasada równań (Abeka 3.11)',a:'"Co robisz po jednej stronie, musisz zrobić po drugiej." Tylko wtedy równość zostaje zachowana.',f:'Whatever is done to one side must be done to the other.'},
  {q:'Działanie odwrotne do dodawania',a:'Odejmowanie. Jeśli masz x+7=15, odejmujesz 7 od obu stron.',f:'x + 7 = 15 → x = 15 − 7 = 8'},
  {q:'Działanie odwrotne do mnożenia',a:'Dzielenie. Jeśli masz 5x=35, dzielisz obie strony przez 5.',f:'5x = 35 → x = 35 ÷ 5 = 7'},
  {q:'Zasada przenoszenia wyrazu na drugą stronę',a:'Zmiana strony = zmiana znaku. To skrót od wykonania działania odwrotnego po obu stronach.',f:'+5 po lewej → −5 po prawej\n−7 po prawej → +7 po lewej'},
  {q:'Jak rozwiązać 4x + 3 = 15?',a:'Krok 1: odejmij 3 (4x=12). Krok 2: podziel przez 4 (x=3). Krok 3: sprawdź.',f:'4·3+3=15 ✓',note:'Sprawdzenie jest obowiązkowe na CKE!'},
  {q:'Jak eliminować ułamki z równania? (Abeka 3.13)',a:'Pomnóż każdy wyraz przez NWW wszystkich mianowników.',f:'(1/2)x + (1/5)x = 14 ×10: 5x+2x=140',note:'NWW(2,5)=10. Mnożysz KAŻDY wyraz, też liczby całkowite.'},
  {q:'Jak eliminować dziesiętne z równania? (Abeka 3.14)',a:'Pomnóż przez odpowiednią potęgę 10: tenths×10, hundredths×100.',f:'0,3x = 21 ×10: 3x=210 → x=70'},
  {q:'Co to jest równanie sprzeczne?',a:'Nie ma żadnego rozwiązania. Po uproszczeniu daje fałszywe zdanie (np. 5=−2). Zbiór: ∅',f:'3(2x+1)−6x=5 → 3=5 ✗'},
  {q:'Co to jest równanie tożsamościowe?',a:'Każda liczba jest rozwiązaniem. Po uproszczeniu daje prawdziwe zdanie (0=0). Zbiór: ℝ',f:'3(x+2)=3x+6 → 0=0 ✓'},
  {q:'Algorytm 5 kroków dla zadań tekstowych (Abeka 3.16)',a:'1. Czytaj uważnie. 2. Oznacz x. 3. Ułóż równanie. 4. Rozwiąż. 5. Odpowiedz na pytanie (sprawdź!).',note:'Nie zawsze x to odpowiedź — zadanie może pytać o inną wielkość!'},
  {q:'Zeszyt i długopis kosztują 15 zł. Długopis o 3 zł droższy. Równanie?',a:'x + (x+3) = 15 → 2x+3=15 → 2x=12 → x=6. Zeszyt: 6, długopis: 9.',f:'x + (x+3) = 15'},
  {q:'Jak sprawdzić wynik równania na egzaminie CKE?',a:'Podstaw wynik do ORYGINALNEGO równania. Oblicz obie strony osobno. Jeśli LS=PS → poprawnie. To dodatkowy punkt na CKE!',f:'x=4 w 4x+3=19: 4·4+3=19 ✓'},
  {q:'Kiedy wynik jest ułamkiem — czy to błąd?',a:'Absolutnie nie! Ułamek to poprawna odpowiedź. Na CKE oba zapisy (ułamkowy i dziesiętny) są akceptowane.',f:'4x+5=14 → x=9/4=2,25'},
  {q:'Bilety CKE 2023: teatr o 64 zł droższy niż kino. 4 teatr + 5 kino = 400 zł. Cena teatru?',a:'Teatr=x, kino=x−64. Równanie: 4x+5(x−64)=400 → 9x=720 → x=80 zł.',f:'4x + 5(x−64) = 400'},
]

function FiszkiContent({onComplete}) {
  const [deck,setDeck]=useState(FISZKI.map((f,i)=>({...f,id:i}))),[flipped,setFlipped]=useState(false),[mastered,setMastered]=useState(0)
  if(deck.length===0)return(
    <div style={{...card,textAlign:'center'}}>
      <div style={{fontSize:48,marginBottom:8}}>🎴</div>
      <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>Wszystkie {FISZKI.length} kart opanowane!</div>
      <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:16}}>
        <button onClick={()=>{setDeck(FISZKI.map((f,i)=>({...f,id:i})));setFlipped(false);setMastered(0)}} style={btn()}>Powtórz fiszki</button>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Kartkówka →</button>
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
      <div style={{fontSize:12,color:C.text3,textAlign:'center',marginBottom:12}}>Pozostało: {deck.length} · kliknij żeby obrócić</div>
      <div onClick={()=>setFlipped(f=>!f)} style={{cursor:'pointer',minHeight:180,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',padding:28,textAlign:'center',background:flipped?C.white:C.navy,border:`0.5px solid ${flipped?C.border:'rgba(255,255,255,.08)'}`,transition:'background .3s',marginBottom:14}}>
        {!flipped
          ?<div><div style={{fontSize:11,color:'rgba(255,255,255,.25)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Fiszka {mastered+1}/{FISZKI.length}</div><div style={{fontSize:16,fontWeight:500,color:'#fff',lineHeight:1.6}}>{c.q}</div><div style={{fontSize:11,color:'rgba(255,255,255,.25)',marginTop:12}}>kliknij żeby zobaczyć odpowiedź</div></div>
          :<div><div style={{fontSize:14,color:C.text,lineHeight:1.7,marginBottom:8}}>{c.a}</div>{c.f&&<div style={{fontFamily:'monospace',fontSize:13,color:C.accent,fontWeight:600,margin:'8px 0',whiteSpace:'pre-line'}}>{c.f}</div>}{c.note&&<div style={{fontSize:12,color:C.text3,marginTop:4}}>{c.note}</div>}</div>}
      </div>
      {flipped&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlipped(false)}} style={btn({background:'#FCEBEB',color:'#791F1F',border:'0.5px solid #F7C1C1',textAlign:'center'})}>Trudna — powtórz</button>
        <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlipped(false)}} style={btn({background:'#EAF3DE',color:'#27500A',border:'0.5px solid #C0DD97',textAlign:'center'})}>Opanowana — następna</button>
      </div>}
    </div>
  )
}

// ── KARTKÓWKA (15 pytań — Abeka + CKE) ───────────────────────────────────────
const KQ = [
  {q:'Rozwiąż:', eq:'x − 3 = 12', opts:['x=9','x=15','x=−9','x=36'], ans:1, hint:'Dodaj 3 do obu stron.'},
  {q:'Rozwiąż:', eq:'y + 6 = 20 + 5', opts:['y=19','x=31','y=25','y=11'], ans:0, hint:'Najpierw uprość prawą stronę: 20+5=25.'},
  {q:'Rozwiąż:', eq:'3m = 9', opts:['m=27','m=3','m=6','m=12'], ans:1, hint:'Podziel obie strony przez 3.'},
  {q:'Rozwiąż (Abeka 3.11d):', eq:'(2/3)y = 8', opts:['y=12','y=6','y=16','y=24'], ans:0, hint:'Mnóż przez odwrotność: y = 8 · (3/2).'},
  {q:'Rozwiąż:', eq:'x + 2x = 15', opts:['x=7,5','x=5','x=15','x=3'], ans:1, hint:'2x+x=3x. Podziel 15 przez 3.'},
  {q:'Rozwiąż (x po obu stronach):', eq:'4x = x + 12', opts:['x=4','x=3','x=12','x=6'], ans:0, hint:'Przenieś x na lewą: 4x−x=3x=12.'},
  {q:'Rozwiąż (ułamkowe):', eq:'(2/3)x = 1/2', opts:['x=3/4','x=1/3','x=4/3','x=1'], ans:0, hint:'NWW(3,2)=6. Mnóż przez 6: 4x=3.'},
  {q:'Rozwiąż (dziesiętne, Abeka 3.14):', eq:'0,4x + 0,03x = 7,31', opts:['x=17','x=10','x=20','x=7,31'], ans:0, hint:'×100: 40x+3x=731 → 43x=731.'},
  {q:'Rozwiąż z nawiasem:', eq:'3(2x − 1) = 15', opts:['x=3','x=8','x=2','x=4'], ans:0, hint:'Rozwiń: 6x−3=15 → 6x=18 → x=3.'},
  {q:'Pewna liczba powiększona o 5 wynosi 18. To równanie:', eq:'', opts:['5x=18','x−5=18','x+5=18','x/5=18'], ans:2, hint:'"Powiększona o 5" = +5. "Wynosi 18" = =18.'},
  {q:'Ania ma 2 razy więcej monet niż Bartek. Razem mają 36. Ile ma Bartek?', eq:'', opts:['12','24','18','6'], ans:0, hint:'Bartek=x, Ania=2x. x+2x=36 → 3x=36.'},
  {q:'Sprawdź podstawiając: czy x=3 jest rozwiązaniem?', eq:'4x + 2 = 5x − 1', opts:['Tak','Nie'], ans:0, hint:'Lewa: 4·3+2=14. Prawa: 5·3−1=14. Porównaj.'},
  {q:'Rozwiąż:', eq:'7x − 4 = 3x + 16', opts:['x=5','x=3','x=8','x=4'], ans:0, hint:'Przenieś: 7x−3x=16+4 → 4x=20.'},
  {q:'Co wychodzi? (sprzeczne czy tożsamościowe?):', eq:'3(2x+1) − 2(3x−4) = 15', opts:['x=2','Brak rozwiązań','Każda liczba','x=0'], ans:1, hint:'Rozwiń: 6x+3−6x+8=15 → 11=15.'},
  {q:'Bilety CKE 2023: teatr o 64 zł droższy niż kino. 4 teatr + 5 kino = 400 zł. Cena teatru:', eq:'', opts:['80 zł','72 zł','96 zł','64 zł'], ans:0, hint:'Teatr=x, kino=x−64. Równanie: 4x+5(x−64)=400.'},
]

function KartkowkaContent({onComplete}) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([]),[hint,setHint]=useState(false)
  if(!mode)return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.blue,display:'inline-block'}}/>
        Kartkówka — 15 pytań · Abeka + CKE
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
        {[['trening','🏋️','Tryb trening','Podpowiedzi dostępne'],['egzamin','🎯','Tryb egzamin','Jak na prawdziwym CKE']].map(([m,ico,t,d])=>(
          <div key={m} onClick={()=>setMode(m)} style={{border:`0.5px solid ${mode===m?C.navy:C.border}`,borderRadius:12,padding:16,cursor:'pointer',background:mode===m?C.navy:C.white,textAlign:'center',transition:'all .15s'}}>
            <div style={{fontSize:24,marginBottom:8}}>{ico}</div>
            <div style={{fontSize:14,fontWeight:500,color:mode===m?'#fff':C.text,marginBottom:4}}>{t}</div>
            <div style={{fontSize:12,color:mode===m?'rgba(255,255,255,.5)':C.text3}}>{d}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>mode&&setKi(0)} disabled={!mode} style={btn({width:'100%',textAlign:'center',background:mode?C.navy:C.bg,color:mode?'#fff':C.text3,border:'none',padding:'13px',cursor:mode?'pointer':'not-allowed'})}>Zacznij kartkówkę →</button>
    </div>
  )
  if(ki>=KQ.length){const ok=results.filter(r=>r).length;return(
    <div style={{...card,textAlign:'center'}}>
      <div style={{fontSize:52,marginBottom:8}}>{ok>=13?'🏆':ok>=10?'⭐':'📚'}</div>
      <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>{ok}/15 poprawnych</div>
      <div style={{fontSize:14,color:C.text2,marginBottom:20}}>Ocena: {ok>=14?'A':ok>=11?'B':ok>=8?'C':'D'}</div>
      <div style={{display:'flex',justifyContent:'center',gap:8}}>
        <button onClick={()=>{setMode(null);setKi(0);setSel(null);setDone(false);setResults([])}} style={btn()}>Powtórz</button>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Zadania CKE →</button>
      </div>
    </div>
  )}
  const q=KQ[ki]
  return(
    <div style={card}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue}}>Kartkówka {ki+1}/{KQ.length}</div>
        <span style={{fontSize:11,background:C.bg,color:C.text3,padding:'3px 10px',borderRadius:20,border:`0.5px solid ${C.border}`}}>{mode==='trening'?'🏋️ Trening':'🎯 Egzamin'}</span>
      </div>
      <div style={{display:'flex',gap:2,marginBottom:14}}>{KQ.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i<ki?C.green:i===ki?C.accent:C.border}}/>)}</div>
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:10,lineHeight:1.5}}>{q.q}</div>
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'10px 18px',marginBottom:14,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:20,color:'#fff'}}>{q.eq}</div></div>}
      {mode==='trening'&&!done&&<div onClick={()=>setHint(h=>!h)} style={{background:'#FAEEDA',border:'0.5px solid #FAC775',borderRadius:8,padding:'9px 14px',marginBottom:12,fontSize:12,color:'#633806',cursor:'pointer'}}>💡 {hint?q.hint:'Kliknij po wskazówkę'}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#EAF3DE';border='#3B6D11';color='#27500A'}else if(i===sel){bg='#FCEBEB';border='#A32D2D';color='#791F1F'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setResults(p=>[...p,i===q.ans])}} style={{border:`0.5px solid ${border}`,borderRadius:8,padding:'11px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={()=>{if(ki<KQ.length-1){setKi(k=>k+1);setSel(null);setDone(false);setHint(false)}else setKi(KQ.length)}} style={btn({background:C.navy,color:'#fff',border:'none'})}>{ki<KQ.length-1?'Dalej →':'Zakończ →'}</button></div>}
    </div>
  )
}

// ── ZADANIE CKE ───────────────────────────────────────────────────────────────
const CKE_Z = [
  {rok:'CKE 2023',nr:16,pkt:2,
   tresc:'Cena jednego biletu do teatru jest o 64 zł większa od ceny jednego biletu do kina. Za 4 bilety do teatru i 5 biletów do kina zapłacono 400 zł. Oblicz cenę jednego biletu do teatru.',
   wsk:'Oznacz cenę biletu do teatru jako x. Cena biletu do kina to x−64. Ułóż równanie z drugiego warunku.',
   rozw:['Oznaczamy: bilet do teatru = x · bilet do kina = x − 64','Równanie: 4x + 5(x − 64) = 400','Rozwijamy: 4x + 5x − 320 = 400','9x = 720','x = 80'],
   odp:'Cena jednego biletu do teatru wynosi 80 zł.',
   schemat:'Za oznaczenie i ułożenie równania: 1 pkt. Za wynik z odpowiedzią: 1 pkt.'},
  {rok:'CKE 2022',nr:17,pkt:2,
   tresc:'Suma dwóch kolejnych liczb naturalnych wynosi 47. Znajdź te liczby.',
   wsk:'Mniejsza = x, następna = x+1. Ułóż równanie z warunku "suma = 47".',
   rozw:['Mniejsza = x · następna = x + 1','Równanie: x + (x + 1) = 47','2x + 1 = 47 → 2x = 46','x = 23','Liczby: 23 i 24'],
   odp:'Szukane liczby to 23 i 24.',
   schemat:'Za ułożenie równania: 1 pkt. Za obie liczby z odpowiedzią: 1 pkt.'},
  {rok:'Styl CKE',nr:'weryfikacja',pkt:1,
   tresc:'Sprawdź, czy liczba x = 3 jest rozwiązaniem równania: 4x + 2 = 5x − 1. Zapisz obliczenia.',
   wsk:'Podstaw x=3 do OBUEQUATIONS stron i oblicz każdą osobno. Porównaj wyniki.',
   rozw:['Podstawiamy x = 3 do lewej strony: 4·3 + 2 = 12 + 2 = 14','Podstawiamy x = 3 do prawej strony: 5·3 − 1 = 15 − 1 = 14','Lewa strona = Prawa strona: 14 = 14'],
   odp:'Tak, x = 3 jest rozwiązaniem równania.',
   schemat:'Za obliczenie obu stron i porównanie: 1 pkt.'},
]

function CKEContent({onComplete}) {
  const [rev,setRev]=useState([]),[sol,setSol]=useState(Array(CKE_Z.length).fill(false))
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:4,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.blue,display:'inline-block'}}/>
        Zadania z arkuszy CKE
      </div>
      <p style={{fontSize:13,color:C.text2,marginBottom:16,lineHeight:1.65}}>Autentyczne i wzorcowe zadania egzaminacyjne. Spróbuj samodzielnie, potem sprawdź rozwiązanie ze schematem oceniania.</p>
      {CKE_Z.map((z,i)=>(
        <div key={i} style={{background:C.bg,borderRadius:12,border:`0.5px solid ${C.border}`,padding:'18px 20px',marginBottom:14}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <span style={{fontSize:12,fontWeight:500,background:'#E6F1FB',color:'#0C447C',padding:'3px 10px',borderRadius:20}}>{z.rok}</span>
            <span style={{fontSize:12,color:C.text3}}>Zadanie {z.nr}</span>
            <span style={{fontSize:12,fontWeight:500,color:'#633806',background:'#FAEEDA',padding:'3px 9px',borderRadius:20,marginLeft:'auto'}}>{z.pkt} {z.pkt===1?'punkt':'punkty'}</span>
          </div>
          <div style={{fontSize:15,fontWeight:500,color:C.text,lineHeight:1.65,marginBottom:14}}>{z.tresc}</div>
          <div onClick={()=>setRev(r=>r.includes(i)?r:[...r,i])} style={{background:'#FAEEDA',border:'0.5px solid #FAC775',borderRadius:8,padding:'9px 14px',marginBottom:10,fontSize:12,color:'#633806',cursor:'pointer',lineHeight:1.6}}>
            💡 {rev.includes(i)?z.wsk:'Kliknij po wskazówkę'}
          </div>
          <button onClick={()=>setSol(p=>p.map((v,j)=>j===i?!v:v))} style={btn({fontSize:12,padding:'8px 16px'})}>{sol[i]?'▲ Ukryj rozwiązanie':'▼ Pokaż wzorcowe rozwiązanie'}</button>
          {sol[i]&&(
            <div style={{marginTop:14,background:C.white,borderRadius:8,border:`0.5px solid ${C.border}`,padding:'16px'}}>
              {z.rozw.map((s,j)=>(
                <div key={j} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:j<z.rozw.length-1?`0.5px solid ${C.border}`:'none',alignItems:'center'}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:C.navy,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:500,flexShrink:0}}>{j+1}</div>
                  <div style={{fontFamily:'monospace',fontSize:13,color:C.text,lineHeight:1.5}}>{s}</div>
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
        <div style={{fontSize:14,color:C.text2}}>Równania liniowe — od podstaw Abeka do poziomu CKE</div>
      </div>
      <div style={{background:C.navy,borderRadius:12,padding:'20px',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#F5541E,#FF7A4D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>🤖</div>
          <div><div style={{fontSize:14,fontWeight:500,color:'#fff'}}>Max</div><div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>podsumowanie lekcji</div></div>
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.8)',lineHeight:1.8,marginBottom:14}}>Równania to absolutny fundament egzaminu ósmoklasisty — pojawiają się w każdym arkuszu CKE. Sześć zasad które muszą być automatyczne:</div>
        {[['Złota zasada','Co robisz po jednej stronie, robisz po drugiej. Bez wyjątków.'],['Zmiana strony = zmiana znaku','Przenosząc wyraz — zawsze zmieniasz znak.'],['Działanie odwrotne','Od +7 odejmujesz 7. Od ×5 dzielisz przez 5.'],['Ułamki i dziesiętne','Pomnóż przez NWW lub potęgę 10 żeby je wyeliminować.'],['Sprawdzenie jest obowiązkowe','Na CKE to osobny punkt. Podstaw wynik do oryginału.'],['Algorytm 5 kroków','Czytaj → oznacz x → ułóż równanie → rozwiąż → odpowiedz.']].map(([t,d],i)=>(
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
  {n:1,title:'Równania liniowe',       href:'/kurs/rownania-liniowe',  status:'active'},
  {n:2,title:'Układy równań',          href:'/kurs/uklady-rownan',     status:'done'},
  {n:3,title:'Nierówności liniowe',    href:'/kurs/nierownosci',       status:'done'},
  {n:4,title:'Zadania tekstowe',       href:'/kurs/zadania-tekstowe',  status:'locked'},
  {n:5,title:'Równania w geometrii',   href:'/kurs/rownania-geometria',status:'locked'},
  {n:6,title:'Sprawdzian działu',      href:'/kurs/sprawdzian-3',      status:'locked',isTest:true},
]}
const LEKCJA={n:1,total:5,slug:'rownania-liniowe',title:'Równania liniowe z jedną niewiadomą',czas:'30 min',poziom:'Poziom: podstawowy–CKE',cke:true}
const XP_MAP={teoria:80,quiz:60,fiszki:80,kartkowka:100,cke:70,raport:40}
const MAX_FAQ=[
  {q:'równanie co to złota zasada',a:'Złota zasada: co robisz po jednej stronie, robisz po drugiej. Waga musi być w równowadze. Jeśli odejmujesz 5 po lewej — odejmujesz 5 po prawej.'},
  {q:'ułamki równanie jak',a:'Przy ułamkach: pomnóż każdy wyraz przez NWW mianowników. Ułamki znikają i wracasz do normalnego równania. Np. (1/2)x + (1/5)x = 14, ×10: 5x+2x=140.'},
  {q:'zmiana strony znak',a:'Przenosząc wyraz na drugą stronę — zawsze zmieniasz znak. +5 po lewej → −5 po prawej. To jest skrót od "odejmowania po obu stronach".'},
  {q:'sprawdzenie jak',a:'Podstaw wynik do ORYGINALNEGO równania. Oblicz lewą i prawą stronę osobno. Jeśli LS=PS — dobrze. Na CKE sprawdzenie to osobny punkt!'},
  {q:'zadanie tekstowe jak zacząć',a:'Algorytm 5 kroków: 1. Czytaj uważnie. 2. Oznacz x. 3. Ułóż równanie. 4. Rozwiąż. 5. Odpowiedz na pytanie (sprawdź czy ma sens!).'},
  {q:'sprzeczne tożsamościowe',a:'Po uproszczeniu wychodzi FAŁSZ (np. 5=−2) → brak rozwiązań, zbiór ∅. Wychodzi PRAWDA (np. 0=0) → nieskończenie wiele, zbiór ℝ.'},
]

export default function RownaniaTiLesson() {
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
