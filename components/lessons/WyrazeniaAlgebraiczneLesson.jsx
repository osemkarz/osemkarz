'use client'
import LessonShell from '../LessonShell'
import { useState } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA: Wyrażenia algebraiczne — upraszczanie, prawa, nawiasy
// Dział 2 — Wyrażenia algebraiczne | Oparcie: Abeka Pre-Algebra + materiał CKE
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

const Step = ({n,text,result,hi}) => (
  <div style={{display:'flex',gap:10}}>
    <div style={{width:22,height:22,background:C.navy,color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0,marginTop:10}}>{n}</div>
    <div style={{flex:1,padding:'8px 0',borderBottom:`0.5px solid ${C.border}`}}>
      <div style={{fontSize:13,color:C.text2,marginBottom:result?5:0,lineHeight:1.55}}>{text}</div>
      {result&&<div style={hi
        ?{background:'#EAF3DE',borderLeft:'3px solid #3B6D11',padding:'7px 12px',borderRadius:'0 7px 7px 0',fontFamily:'monospace',fontSize:14,color:'#27500A',fontWeight:600,display:'inline-block'}
        :{background:C.bg,padding:'6px 10px',borderRadius:6,fontFamily:'monospace',fontSize:13,color:C.text,display:'inline-block'}}>
        {result}
      </div>}
    </div>
  </div>
)

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
        <div style={{fontFamily:'monospace',fontSize:18,color:C.text,fontWeight:500,lineHeight:1.6}}>{eq}</div>
      </div>
    </div>
  )
}

const Ans = ({val,note}) => (
  <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:8,marginTop:10,background:'#EAF3DE',border:'0.5px solid #C0DD97'}}>
    <div style={{width:28,height:28,borderRadius:'50%',background:'#3B6D11',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:13,color:'#fff',fontWeight:700}}>✓</div>
    <div>
      <div style={{fontFamily:'monospace',fontSize:15,fontWeight:500,color:'#27500A'}}>{val}</div>
      {note&&<div style={{fontSize:12,color:'#3B6D11',marginTop:2}}>{note}</div>}
    </div>
  </div>
)

const Rule = ({type,children}) => {
  const m={warn:{bg:'#FAEEDA',bl:'#854F0B',c:'#633806'},tip:{bg:'#EAF3DE',bl:'#3B6D11',c:'#27500A'},info:{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'},err:{bg:'#FCEBEB',bl:'#A32D2D',c:'#791F1F'}}[type]||{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'}
  return <div style={{background:m.bg,borderLeft:`3px solid ${m.bl}`,borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:m.c,lineHeight:1.75,margin:'14px 0'}}>{children}</div>
}

// ── TEORIA — 5 sekcji ─────────────────────────────────────────────────────────
const TTABS = [
  {id:'slownik',  label:'Słownik pojęć'},
  {id:'prawa',    label:'Trzy prawa algebry'},
  {id:'redukcja', label:'Redukcja wyrazów'},
  {id:'nawiasy',  label:'Nawiasy i znaki'},
  {id:'zagniezd', label:'★ Zagnieżdżone nawiasy'},
]

function TeoriaContent({onComplete}) {
  const [tab,setTab] = useState('slownik')

  const CONTENT = {

    slownik: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Zanim zaczniemy upraszczać wyrażenia, musimy poznać słownik algebry. Każde z tych pojęć będzie się pojawiać na egzaminie CKE.
      </p>

      <SH>Kluczowe pojęcia</SH>
      <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:16}}>
        {[
          ['Zmienna (niewiadoma)','Litera zastępująca nieznaną liczbę.','x, y, a, b, n'],
          ['Współczynnik liczbowy','Liczba stojąca przed zmienną.','W 5x współczynnik to 5. W −3ab to −3.'],
          ['Jednomian','Liczba, zmienna lub ich iloczyn — BEZ sumy i różnicy.','4x²y, −7ab, 12, x³'],
          ['Wielomian','Suma lub różnica jednomianów.','3x² + 2x − 5, a + b'],
          ['Wyrazy podobne','Jednomiany z IDENTYCZNĄ częścią literową (te same zmienne, te same potęgi).','4x²y i −7x²y są podobne · 3xy² i 3x²y NIE są podobne'],
          ['Element neutralny (+)','Dodanie 0 nic nie zmienia.','x + 0 = x'],
          ['Element neutralny (×)','Pomnożenie przez 1 nic nie zmienia.','1 · x = x'],
        ].map(([t,d,p])=>(
          <div key={t} style={{background:C.bg,borderRadius:8,padding:'12px 14px',border:`0.5px solid ${C.border}`}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:3}}>{t}</div>
                <div style={{fontSize:13,color:C.text2,lineHeight:1.5}}>{d}</div>
              </div>
              <div style={{fontFamily:'monospace',fontSize:12,color:C.blue,flexShrink:0,textAlign:'right',maxWidth:200,lineHeight:1.6}}>{p}</div>
            </div>
          </div>
        ))}
      </div>

      <SH>Budowa wyrażenia algebraicznego</SH>
      <div style={{background:C.navy,borderRadius:10,padding:'18px 24px',textAlign:'center'}}>
        <div style={{fontFamily:'monospace',fontSize:22,color:'#fff',letterSpacing:'0.05em',marginBottom:12}}>
          <span style={{color:'#FDCB6E'}}>4</span><span style={{color:'#FF7A4D'}}>x</span><span style={{color:'#74B9FF'}}>²</span>
          <span style={{color:'rgba(255,255,255,.4)'}}> + </span>
          <span style={{color:'#FDCB6E'}}>−3</span><span style={{color:'#FF7A4D'}}>x</span>
          <span style={{color:'rgba(255,255,255,.4)'}}> − </span>
          <span style={{color:'#FDCB6E'}}>7</span>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:28,fontSize:11,color:'rgba(255,255,255,.4)'}}>
          <span><span style={{color:'#FDCB6E'}}>■</span> współczynnik</span>
          <span><span style={{color:'#FF7A4D'}}>■</span> zmienna</span>
          <span><span style={{color:'#74B9FF'}}>■</span> potęga</span>
        </div>
      </div>

      <Rule type="warn"><strong>Pułapka CKE:</strong> 3xy² i 3x²y to NIE są wyrazy podobne! Zmienne muszą być podniesione do IDENTYCZNYCH potęg. Tutaj w pierwszym y jest do kwadratu, w drugim x jest do kwadratu — to różne wyrazy.</Rule>
    </div>,

    prawa: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Trzy fundamentalne prawa algebry uzasadniają każde przekształcenie. Egzamin CKE czasem pyta wprost — "jakie prawo tu zastosowano?".
      </p>

      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:14}}>
        {[
          {
            n:'1', name:'Prawo przemienności', eng:'Commutative Principle',
            def:'Kolejność dodawanych składników nie zmienia sumy. Kolejność mnożonych czynników nie zmienia iloczynu.',
            wzor:'a + b = b + a    ·    a × b = b × a',
            przyk:'3x + 5y = 5y + 3x    ·    4 · x = x · 4',
            uwaga:'NIE działa dla odejmowania i dzielenia! a − b ≠ b − a',
            color:C.blue
          },
          {
            n:'2', name:'Prawo łączności', eng:'Associative Principle',
            def:'Składniki dodawania lub czynniki mnożenia możemy grupować dowolnie bez zmiany wyniku.',
            wzor:'(a + b) + c = a + (b + c)',
            przyk:'(2x + 3y) + 4x = 2x + (3y + 4x) = 6x + 3y',
            uwaga:'NIE działa dla odejmowania i dzielenia!',
            color:C.purple
          },
          {
            n:'3', name:'Prawo rozdzielności', eng:'Distributive Principle',
            def:'Mnożąc sumę przez liczbę, możemy pomnożyć każdy składnik sumy osobno przez tę liczbę.',
            wzor:'a(b + c) = ab + ac    ·    a(b − c) = ab − ac',
            przyk:'5(x + 2) = 5x + 10    ·    −3(2x − 4) = −6x + 12',
            uwaga:'To NAJWAŻNIEJSZE prawo przy opuszczaniu nawiasów!',
            color:C.accent
          },
        ].map(p=>(
          <div key={p.n} style={{borderRadius:10,border:`1px solid ${p.color}22`,overflow:'hidden'}}>
            <div style={{background:p.color,padding:'10px 16px',display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:26,height:26,borderRadius:'50%',background:'rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',flexShrink:0}}>{p.n}</div>
              <div>
                <div style={{fontWeight:600,color:'#fff',fontSize:14}}>{p.name}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,.6)'}}>{p.eng}</div>
              </div>
            </div>
            <div style={{padding:'14px 16px',background:C.white}}>
              <div style={{fontSize:13,color:C.text2,lineHeight:1.6,marginBottom:8}}>{p.def}</div>
              <div style={{fontFamily:'monospace',fontSize:13,color:p.color,background:`${p.color}11`,padding:'8px 12px',borderRadius:6,marginBottom:6}}>{p.wzor}</div>
              <div style={{fontFamily:'monospace',fontSize:12,color:C.text,marginBottom:6}}>{p.przyk}</div>
              <div style={{fontSize:12,color:'#A32D2D',fontWeight:500}}>⚠️ {p.uwaga}</div>
            </div>
          </div>
        ))}
      </div>
    </div>,

    redukcja: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Redukcja wyrazów podobnych to podstawowa operacja upraszczania — zbieramy wyrazy z identyczną częścią literową i dodajemy ich współczynniki.
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'16px 24px',marginBottom:14,textAlign:'center'}}>
        <div style={{fontFamily:'monospace',fontSize:15,color:'rgba(255,255,255,.6)',marginBottom:6}}>zasada</div>
        <div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>na·x + nb·x = (na + nb)·x</div>
        <div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginTop:4}}>Dodajesz TYLKO współczynniki — część literowa zostaje bez zmian</div>
      </div>

      <SH>Algorytm redukcji — 3 kroki</SH>
      <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:14}}>
        {[
          ['Zidentyfikuj wyrazy podobne','Takie same zmienne, te same potęgi. Wyraz wolny (samo liczba) to osobna kategoria.'],
          ['Pogrupuj je razem','Korzystając z prawa przemienności, możesz zmienić kolejność wyrazów.'],
          ['Dodaj/odejmij współczynniki','Część literowa zostaje. Wyniki zapisujesz jako jeden wyraz.'],
        ].map(([t,d],i)=>(
          <div key={i} style={{display:'flex',gap:10,padding:'10px 14px',background:C.bg,borderRadius:8,border:`0.5px solid ${C.border}`}}>
            <div style={{width:22,height:22,borderRadius:'50%',background:C.navy,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:2}}>{t}</div>
              <div style={{fontSize:12,color:C.text2}}>{d}</div>
            </div>
          </div>
        ))}
      </div>

      <Task level="basic" label="Jeden typ wyrazów podobnych" eq="4a² − 3ab + 2a² + 7ab − b²" />
      <Step n={1} text="Grupujemy wyrazy podobne (prawo przemienności):" result="(4a² + 2a²) + (−3ab + 7ab) − b²" />
      <Step n={2} text="Dodajemy współczynniki w każdej grupie:" result="6a² + 4ab − b²" hi />
      <Ans val="6a² + 4ab − b²" note="b² zostało samo — brak podobnych, więc przepisujemy bez zmian" />

      <Task level="med" label="Ułamki i dziesiętne (zadanie z kartkówki)" eq="(1/2)x²y − 3xy + 1,5x²y + 4xy − 5" />
      <Step n={1} text="Grupy wyrazów podobnych: x²y → (1/2 + 1,5)·x²y i xy → (−3 + 4)·xy i wyraz wolny: −5" result="" />
      <Step n={2} text="1/2 + 1,5 = 0,5 + 1,5 = 2; −3 + 4 = 1" result="2x²y + 1xy − 5" />
      <Step n={3} text="1xy upraszczamy do xy (współczynnik 1 pomijamy):" result="2x²y + xy − 5" hi />
      <Ans val="2x²y + xy − 5" />

      <Rule type="err"><strong>Najczęstszy błąd:</strong> Próba redukcji wyrazów niepodobnych. x² i x to NIE są wyrazy podobne. 4x² + 3x ≠ 7x². Możesz je tylko zapisać obok siebie: 4x² + 3x.</Rule>
    </div>,

    nawiasy: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Opuszczanie nawiasów to zastosowanie prawa rozdzielności. Kluczowe znaczenie ma <strong style={{color:C.text}}>znak przed nawiasem</strong> — to on decyduje, czy znaki wewnątrz się zmieniają.
      </p>

      <SH>Reguła znaku przed nawiasem</SH>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        <div style={{background:'#EAF3DE',borderLeft:'3px solid #3B6D11',borderRadius:'0 8px 8px 0',padding:'14px'}}>
          <div style={{fontSize:12,fontWeight:600,color:'#27500A',marginBottom:6}}>+ przed nawiasem</div>
          <div style={{fontSize:13,color:C.text2,lineHeight:1.6,marginBottom:6}}>Znaki wewnątrz się NIE zmieniają. Nawiasy po prostu znikają.</div>
          <div style={{fontFamily:'monospace',fontSize:13,color:'#27500A'}}>+(2x − 5) = 2x − 5</div>
        </div>
        <div style={{background:'#FCEBEB',borderLeft:'3px solid #A32D2D',borderRadius:'0 8px 8px 0',padding:'14px'}}>
          <div style={{fontSize:12,fontWeight:600,color:'#791F1F',marginBottom:6}}>− przed nawiasem</div>
          <div style={{fontSize:13,color:C.text2,lineHeight:1.6,marginBottom:6}}>Znaki wewnątrz się ODWRACAJĄ. + staje się −, − staje się +.</div>
          <div style={{fontFamily:'monospace',fontSize:13,color:'#791F1F'}}>−(2x − 5) = −2x + 5</div>
        </div>
      </div>

      <Rule type="info"><strong>Dlaczego?</strong> Minus przed nawiasem to tak naprawdę mnożenie przez −1. Prawo rozdzielności: −1·(2x − 5) = −2x + 5. Każdy wyraz zmienia znak.</Rule>

      <Task level="basic" label="Mnożnik + nawiasy (jeden nawias)" eq="5(x − 2y) − 3(x + y)" />
      <Step n={1} text="Rozwijamy pierwszy nawias: 5·x + 5·(−2y) =" result="5x − 10y" />
      <Step n={2} text="Rozwijamy drugi nawias: −3·x + (−3)·y =" result="−3x − 3y" />
      <Step n={3} text="Łączymy i redukujemy wyrazy podobne:" result="(5x − 3x) + (−10y − 3y) = 2x − 13y" hi />
      <Ans val="2x − 13y" />

      <Task level="med" label="Minus przed nawiasem — klasyczna pułapka (zadanie z quizu)" eq="7x − (2x − 5)" />
      <Step n={1} text="Minus przed nawiasem zmienia znaki: −(2x − 5) = −2x + 5" result="7x − 2x + 5" />
      <Step n={2} text="Redukujemy x:" result="5x + 5" hi />
      <Ans val="5x + 5" note="Najczęstszy błąd: napisanie 5x − 5 (nie zmieniono znaku przy −5)" />

      <Task level="hard" label="Trzy nawiasy z różnymi mnożnikami (zadanie z kartkówki)" eq="4(a − 2b) − 3(2a − b) + 2(a + b)" />
      <Step n={1} text="Rozwijamy: 4a − 8b" result="" />
      <Step n={2} text="Rozwijamy: −6a + 3b" result="" />
      <Step n={3} text="Rozwijamy: 2a + 2b" result="" />
      <Step n={4} text="Wszystko razem: 4a − 8b − 6a + 3b + 2a + 2b" result="" />
      <Step n={5} text="Redukujemy a: (4a − 6a + 2a) = 0 i b: (−8b + 3b + 2b) = −3b" result="0a − 3b = −3b" hi />
      <Ans val="−3b" note="Wyrazy z a zniosły się — wynik zawiera tylko b!" />
    </div>,

    zagniezd: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Wielokrotnie zagnieżdżone nawiasy to trudniejszy typ zadań, ale mają prostą regułę: <strong style={{color:C.text}}>zawsze zaczynaj od najbardziej wewnętrznego nawiasu</strong> i pracuj na zewnątrz.
      </p>

      <SH>Typy nawiasów — kolejność działania</SH>
      <div style={{display:'flex',gap:8,marginBottom:14,alignItems:'center',justifyContent:'center'}}>
        {[['( )', 'Nawiasy okrągłe','Najpierw'],['[ ]','Nawiasy kwadratowe','Potem'],['{ }','Nawiasy klamrowe','Na końcu']].map(([sym,n,o],i)=>(
          <div key={i} style={{textAlign:'center',padding:'12px 16px',background:C.bg,borderRadius:8,border:`0.5px solid ${C.border}`,flex:1}}>
            <div style={{fontFamily:'monospace',fontSize:22,fontWeight:700,color:C.navy,marginBottom:4}}>{sym}</div>
            <div style={{fontSize:12,fontWeight:500,color:C.text,marginBottom:2}}>{n}</div>
            <div style={{fontSize:11,color:C.accent,fontWeight:600}}>{o}</div>
          </div>
        ))}
      </div>

      <Task level="hard" label="Dwa poziomy zagnieżdżenia (zadanie z lekcji)" eq="2x − [3x − 2(x − 4)]" />
      <Step n={1} text="Zaczynamy od nawiasu OKRĄGŁEGO — rozwijamy 2(x − 4):" result="2x − [3x − 2x + 8]" />
      <Step n={2} text="Redukujemy WEWNĄTRZ nawiasu kwadratowego: 3x − 2x = x" result="2x − [x + 8]" />
      <Step n={3} text="Rozwijamy nawias kwadratowy (minus zmienia znaki):" result="2x − x − 8" />
      <Step n={4} text="Redukujemy wyrazy podobne:" result="x − 8" hi />
      <Ans val="x − 8" />

      <Task level="cke" label="Trzy poziomy — zadanie na szóstkę (kartkówka)" eq="5m − {2n + 3[m − 2(n − m)]}" />
      <Step n={1} text="Poziom 1: rozwijamy nawiasy okrągłe −2(n − m) = −2n + 2m:" result="5m − {2n + 3[m − 2n + 2m]}" />
      <Step n={2} text="Poziom 2: redukujemy wewnątrz nawiasu kwadratowego: m + 2m = 3m:" result="5m − {2n + 3[3m − 2n]}" />
      <Step n={3} text="Poziom 2: rozwijamy nawias kwadratowy 3(3m − 2n) = 9m − 6n:" result="5m − {2n + 9m − 6n}" />
      <Step n={4} text="Poziom 3: redukujemy wewnątrz klamry: 2n − 6n = −4n:" result="5m − {9m − 4n}" />
      <Step n={5} text="Poziom 3: rozwijamy klamrę (minus zmienia znaki):" result="5m − 9m + 4n" />
      <Step n={6} text="Redukujemy wyrazy podobne:" result="−4m + 4n" hi />
      <Ans val="−4m + 4n" note="Można też zapisać jako 4(n − m)" />

      <Rule type="tip"><strong>Strategia zdającego CKE:</strong> Na egzaminie zawsze zaznaczaj nawiasy do usunięcia małym krzyżykiem po rozwinięciu. Unikasz podwójnego rozwijania. Po każdym kroku sprawdź czy liczba nawiasów zgadza się z oczekiwaną.</Rule>
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
          const isDone=i<idx,isActive=t.id===tab
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

// ── QUIZ (8 pytań) ────────────────────────────────────────────────────────────
const QUIZ = [
  {q:'Które z tych wyrażeń to jednomian?',eq:'',opts:['3x + 2','4x²y','x − y','a + b + c'],ans:1,dlaczego:'Jednomian to wyrażenie BEZ sumy/różnicy — pojedyncza liczba, zmienna lub ich iloczyn. 4x²y to iloczyn liczby 4 i zmiennych x² i y.'},
  {q:'Jakie prawo uzasadnia: 5(x + 2) = 5x + 10?',eq:'',opts:['Prawo przemienności','Prawo łączności','Prawo rozdzielności','Prawo elementu neutralnego'],ans:2,dlaczego:'Prawo rozdzielności (Distributive Principle): a(b+c) = ab + ac. Mnożymy liczbę przez każdy składnik sumy osobno.'},
  {q:'Czy wyrazy 3xy² i 3x²y są PODOBNE?',eq:'',opts:['Tak, mają te same zmienne','Nie, zmienne mają różne potęgi','Tak, mają ten sam współczynnik','Nie, mają różne współczynniki'],ans:1,dlaczego:'Wyrazy podobne wymagają IDENTYCZNEJ części literowej — te same zmienne podniesione do tych samych potęg. Tu: xy² ≠ x²y (w pierwszym y², w drugim x²).'},
  {q:'Uprość w pamięci:',eq:'7x − (2x − 5)',opts:['5x − 5','5x + 5','9x + 5','9x − 5'],ans:1,dlaczego:'Minus przed nawiasem zmienia znaki: −(2x−5) = −2x+5. Wynik: 7x − 2x + 5 = 5x + 5. Częsty błąd: 5x−5 (zapomnienie zmiany znaku przy −5).'},
  {q:'Uprość:',eq:'4a² − 3ab + 2a² + 7ab − b²',opts:['6a² + 10ab − b²','6a² + 4ab − b²','6a² − 4ab + b²','2a² + 4ab'],ans:1,dlaczego:'Grupujemy: a² → 4+2=6, ab → −3+7=4, b² zostaje. Wynik: 6a² + 4ab − b².'},
  {q:'Które działanie NIE jest przemienne?',eq:'',opts:['Dodawanie','Mnożenie','Odejmowanie','Dodawanie i mnożenie są przemienne'],ans:2,dlaczego:'Prawo przemienności działa dla DODAWANIA i MNOŻENIA. Odejmowanie i dzielenie nie są przemienne: 5−3≠3−5.'},
  {q:'Jaki jest wynik?',eq:'−3(2x − 4y) + 5(x − y)',opts:['−x + 7y','11x + 7y','−x − 7y','x + 7y'],ans:0,dlaczego:'−3·2x=−6x, −3·(−4y)=+12y, 5·x=5x, 5·(−y)=−5y. Razem: −6x+12y+5x−5y = (−6+5)x + (12−5)y = −x + 7y.'},
  {q:'Uprość zagnieżdżone nawiasy:',eq:'2x − [3x − 2(x − 4)]',opts:['x − 8','x + 8','−x − 8','3x − 8'],ans:0,dlaczego:'Krok1: 2(x−4)=2x−8 → 2x−[3x−2x+8]. Krok2: redukcja w []: 3x−2x=x → 2x−[x+8]. Krok3: −[x+8]=−x−8 → 2x−x−8=x−8.'},
]

function QuizContent({onComplete}) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([])
  if(qi>=QUIZ.length){const ok=results.filter(r=>r).length;return(
    <div style={card}>
      <div style={{textAlign:'center',padding:'16px 0 24px'}}>
        <div style={{fontSize:48,marginBottom:8}}>{ok>=7?'🎯':ok>=5?'👍':'📚'}</div>
        <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>{ok}/{QUIZ.length} poprawnych</div>
        <div style={{fontSize:14,color:C.text2}}>{ok>=7?'Doskonale!':ok>=5?'Dobry wynik!':'Wróć do teorii.'}</div>
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
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#EAF3DE';border='#3B6D11';color='#27500A'}else if(i===sel){bg='#FCEBEB';border='#A32D2D';color='#791F1F'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setResults(p=>[...p,i===q.ans])}} style={{border:`0.5px solid ${border}`,borderRadius:8,padding:'12px 14px',cursor:done?'default':'pointer',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<>
        <div style={{padding:'12px 16px',borderRadius:8,marginBottom:10,display:'flex',gap:10,alignItems:'flex-start',background:sel===q.ans?'#EAF3DE':'#FCEBEB',border:`0.5px solid ${sel===q.ans?'#C0DD97':'#F7C1C1'}`,color:sel===q.ans?'#27500A':'#791F1F'}}>
          <span style={{fontSize:16,flexShrink:0}}>{sel===q.ans?'✓':'✗'}</span>
          <div style={{fontSize:13,lineHeight:1.7}}><strong>{sel===q.ans?'Poprawnie!':'Błędna odpowiedź.'}</strong>
            <div style={{background:'#EEEDFE',borderRadius:6,padding:'8px 12px',marginTop:8,fontSize:12,color:'#3C3489',lineHeight:1.7}}>{q.dlaczego}</div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button onClick={()=>{if(qi<QUIZ.length-1){setQi(q=>q+1);setSel(null);setDone(false)}else setQi(QUIZ.length)}} style={btn({background:C.navy,color:'#fff',border:'none'})}>{qi<QUIZ.length-1?'Następne →':'Zobacz wynik →'}</button>
        </div>
      </>}
    </div>
  )
}

// ── FISZKI (14 kart) ──────────────────────────────────────────────────────────
const FISZKI = [
  {q:'Co to jest jednomian?',a:'Wyrażenie algebraiczne będące pojedynczą liczbą, zmienną lub ich iloczynem — BEZ sumy i różnicy.',f:'4x²y · −7ab · 12 · x³',note:'Gdy masz dodawanie lub odejmowanie → to już wielomian, nie jednomian.'},
  {q:'Co to są wyrazy podobne?',a:'Jednomiany z IDENTYCZNĄ częścią literową — te same zmienne podniesione do tych samych potęg.',f:'4x²y i −7x²y są podobne\n3xy² i 3x²y NIE są podobne'},
  {q:'Prawo przemienności — treść i ograniczenia',a:'Kolejność dodawanych składników / mnożonych czynników nie zmienia wyniku.',f:'a + b = b + a · a·b = b·a',note:'NIE działa dla odejmowania i dzielenia!'},
  {q:'Prawo łączności — treść i ograniczenia',a:'Składniki dodawania / czynniki mnożenia można dowolnie grupować.',f:'(a+b)+c = a+(b+c)',note:'NIE działa dla odejmowania i dzielenia!'},
  {q:'Prawo rozdzielności — wzór',a:'Mnożąc sumę przez liczbę, mnożymy każdy składnik osobno.',f:'a(b + c) = ab + ac\na(b − c) = ab − ac'},
  {q:'Jak opuścić nawias z PLUSEM przed nim?',a:'Znaki wewnątrz nawiasu NIE zmieniają się. Nawiasy znikają.',f:'+(2x − 5y) = 2x − 5y'},
  {q:'Jak opuścić nawias z MINUSEM przed nim?',a:'Każdy znak wewnątrz nawiasu ZMIENIA SIĘ na przeciwny.',f:'−(2x − 5y) = −2x + 5y',note:'Dlaczego? To mnożenie przez −1: (−1)·(2x−5y) = −2x+5y'},
  {q:'Jak redukować wyrazy podobne?',a:'Dodajesz/odejmujesz tylko współczynniki liczbowe. Część literowa pozostaje bez zmian.',f:'4a² + 2a² = 6a² · −3ab + 7ab = 4ab'},
  {q:'Jaki wynik dla −3(2x − 4y)?',a:'Mnożymy przez −3 każdy wyraz: −3·2x = −6x i −3·(−4y) = +12y.',f:'−3(2x − 4y) = −6x + 12y',note:'Minus razy minus daje plus!'},
  {q:'Jak uprościć wielokrotnie zagnieżdżone nawiasy?',a:'Zawsze zacznij od NAJBARDZIEJ WEWNĘTRZNEGO nawiasu i pracuj na zewnątrz.',f:'() → [ ] → { }',note:'Po każdym kroku sprawdź znak — to najczęstsze miejsce błędu.'},
  {q:'Uprość: 7x − (2x − 5)',a:'Minus zmienia znaki: −2x+5. Łączysz: 7x − 2x + 5 = 5x + 5.',f:'7x − (2x − 5) = 5x + 5'},
  {q:'Co to jest wyraz wolny?',a:'Wyraz bez żadnej zmiennej — sama liczba. Redukuje się wyłącznie z innymi wyrazami wolnymi.',f:'W: 3x² + 2x − 5, wyraz wolny to −5'},
  {q:'Kiedy współczynnik 1 pomijamy?',a:'Gdy wyraz wychodzi 1·x, zapisujemy po prostu x. Gdy −1·x, zapisujemy −x.',f:'1·xy = xy · −1·ab = −ab'},
  {q:'Uprość: 4(a−2b) − 3(2a−b) + 2(a+b)',a:'4a−8b − 6a+3b + 2a+2b = (4−6+2)a + (−8+3+2)b = 0a − 3b = −3b.',f:'4(a−2b) − 3(2a−b) + 2(a+b) = −3b'},
]

function FiszkiContent({onComplete}) {
  const [deck,setDeck]=useState(FISZKI.map((f,i)=>({...f,id:i}))),[flipped,setFlipped]=useState(false),[mastered,setMastered]=useState(0)
  if(deck.length===0)return(
    <div style={{...card,textAlign:'center'}}>
      <div style={{fontSize:48,marginBottom:8}}>🎴</div>
      <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>Wszystkie {FISZKI.length} kart opanowane!</div>
      <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:16}}>
        <button onClick={()=>{setDeck(FISZKI.map((f,i)=>({...f,id:i})));setFlipped(false);setMastered(0)}} style={btn()}>Powtórz</button>
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
      <div style={{fontSize:12,color:C.text3,textAlign:'center',marginBottom:12}}>Pozostało: {deck.length} kart · kliknij żeby obrócić</div>
      <div onClick={()=>setFlipped(f=>!f)} style={{cursor:'pointer',minHeight:180,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',padding:28,textAlign:'center',background:flipped?C.white:C.navy,border:`0.5px solid ${flipped?C.border:'rgba(255,255,255,.08)'}`,transition:'background .3s',marginBottom:14}}>
        {!flipped
          ?<div><div style={{fontSize:11,color:'rgba(255,255,255,.25)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Fiszka {mastered+1}/{FISZKI.length}</div><div style={{fontSize:16,fontWeight:500,color:'#fff',lineHeight:1.6}}>{c.q}</div><div style={{fontSize:11,color:'rgba(255,255,255,.25)',marginTop:12}}>kliknij żeby zobaczyć odpowiedź</div></div>
          :<div><div style={{fontSize:14,color:C.text,lineHeight:1.7,marginBottom:8}}>{c.a}</div>{c.f&&<div style={{fontFamily:'monospace',fontSize:13,color:C.accent,fontWeight:600,margin:'8px 0',whiteSpace:'pre-line'}}>{c.f}</div>}{c.note&&<div style={{fontSize:12,color:C.text3,marginTop:4}}>{c.note}</div>}</div>}
      </div>
      {flipped&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlipped(false)}} style={btn({background:'#FCEBEB',color:'#791F1F',border:'0.5px solid #F7C1C1',textAlign:'center'})}>Trudna — powtórz</button>
        <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlipped(false)}} style={btn({background:'#EAF3DE',color:'#27500A',border:'0.5px solid #C0DD97',textAlign:'center'})}>Opanowana →</button>
      </div>}
    </div>
  )
}

// ── KARTKÓWKA (12 pytań) ──────────────────────────────────────────────────────
const KQ = [
  {q:'Wskaż jednomian:',eq:'',opts:['3x + 2','4x²y','a − b','2x + y − 1'],ans:1,hint:'Jednomian = BEZ sumy/różnicy.'},
  {q:'Które wyrazy są podobne?',eq:'',opts:['3x² i 3x','4xy² i 5xy²','2x²y i 2xy²','ab i ab²'],ans:1,hint:'Identyczna część literowa — te same zmienne, te same potęgi.'},
  {q:'Jakie prawo uzasadnia a + b = b + a?',eq:'',opts:['Łączności','Przemienności','Rozdzielności','Elementu neutralnego'],ans:1,hint:'Zamiana kolejności składników.'},
  {q:'Opuść nawias:',eq:'−(3a − 5b)',opts:['−3a − 5b','3a − 5b','−3a + 5b','3a + 5b'],ans:2,hint:'Minus zmienia KAŻDY znak wewnątrz.'},
  {q:'Uprość:',eq:'5x − 3x + 2y − y',opts:['2x + y','8x + y','2x + 3y','3x + y'],ans:0,hint:'Redukuj x osobno, y osobno.'},
  {q:'Rozwiń i uprość:',eq:'3(2x − y) − 2(x − 3y)',opts:['4x + 3y','8x − 9y','4x − 3y','8x + 3y'],ans:0,hint:'3·2x=6x, 3·(−y)=−3y, −2·x=−2x, −2·(−3y)=+6y.'},
  {q:'Uprość (ułamki i dziesiętne):',eq:'(1/2)x²y + 1,5x²y − 3xy + 4xy − 5',opts:['2x²y + xy − 5','2x²y − xy + 5','x²y + xy − 5','2x²y + xy + 5'],ans:0,hint:'0,5 + 1,5 = 2 dla x²y. −3 + 4 = 1 dla xy.'},
  {q:'Uprość zagnieżdżone:',eq:'2x − [3x − 2(x − 4)]',opts:['x − 8','−x + 8','x + 8','3x − 8'],ans:0,hint:'Najpierw () potem []. Minus przed [] zmienia znaki.'},
  {q:'Uprość:',eq:'4(a − 2b) − 3(2a − b) + 2(a + b)',opts:['−3b','3b','3a − 3b','0'],ans:0,hint:'Wyrazy z a znoszą się: 4−6+2=0.'},
  {q:'Jakie jest prawo a·(b+c) = a·b + a·c?',eq:'',opts:['Przemienności','Łączności','Rozdzielności','Elementu neutralnego'],ans:2,hint:'Mnożenie sumy przez liczbę.'},
  {q:'Uprość:',eq:'5m − {2n + 3[m − 2(n − m)]}',opts:['−4m + 4n','4m − 4n','−4m − 4n','4m + 4n'],ans:0,hint:'Krok1: −2(n−m) = −2n+2m. Krok2: 3[3m−2n] = 9m−6n.'},
  {q:'Czy odejmowanie jest łączne?',eq:'(10 − 4) − 2 vs 10 − (4 − 2)',opts:['Tak, wyniki są równe','Nie: 4 ≠ 8','Tak, zawsze','Nie, bo (10−4)−2=4 i 10−(4−2)=8'],ans:3,hint:'Sprawdź oba obliczenia.'},
]

function KartkowkaContent({onComplete}) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([]),[hint,setHint]=useState(false)
  if(!mode)return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:12}}>Kartkówka — 12 pytań</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
        {[['trening','🏋️','Tryb trening','Podpowiedzi dostępne'],['egzamin','🎯','Tryb egzamin','Bez podpowiedzi — jak CKE']].map(([m,ico,t,d])=>(
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
      <div style={{fontSize:52,marginBottom:8}}>{ok>=11?'🏆':ok>=9?'⭐':'📚'}</div>
      <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>{ok}/12 poprawnych</div>
      <div style={{fontSize:14,color:C.text2,marginBottom:20}}>{ok>=11?'A — doskonały':ok>=9?'B — dobry':ok>=7?'C — zadowalający':'D — wróć do teorii'}</div>
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
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'10px 18px',marginBottom:14,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div></div>}
      {mode==='trening'&&!done&&<div onClick={()=>setHint(h=>!h)} style={{background:'#FAEEDA',border:'0.5px solid #FAC775',borderRadius:8,padding:'9px 14px',marginBottom:12,fontSize:12,color:'#633806',cursor:'pointer'}}>💡 {hint?q.hint:'Kliknij po wskazówkę'}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#EAF3DE';border='#3B6D11';color='#27500A'}else if(i===sel){bg='#FCEBEB';border='#A32D2D';color='#791F1F'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setResults(p=>[...p,i===q.ans])}} style={{border:`0.5px solid ${border}`,borderRadius:8,padding:'11px 14px',cursor:done?'default':'pointer',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={()=>{if(ki<KQ.length-1){setKi(k=>k+1);setSel(null);setDone(false);setHint(false)}else setKi(KQ.length)}} style={btn({background:C.navy,color:'#fff',border:'none'})}>{ki<KQ.length-1?'Dalej →':'Zakończ →'}</button></div>}
    </div>
  )
}

// ── ZADANIE CKE ───────────────────────────────────────────────────────────────
const CKE_Z = [
  {rok:'styl CKE',nr:8,pkt:2,
   tresc:'Uprość wyrażenie: −3(2x − 4y) + 5(x − y). Zapisz obliczenia.',
   wsk:'Rozwiń każdy nawias osobno, pamiętaj o znakach. Potem redukuj wyrazy podobne.',
   rozw:['Rozwijamy pierwszy nawias: −3·2x = −6x, −3·(−4y) = +12y → −6x + 12y','Rozwijamy drugi nawias: 5·x = 5x, 5·(−y) = −5y → 5x − 5y','Łączymy: −6x + 12y + 5x − 5y','Redukujemy: (−6+5)x + (12−5)y = −x + 7y'],
   odp:'−x + 7y',
   schemat:'Za poprawne rozwinięcie nawiasów: 1 pkt. Za poprawny wynik z redukcją: 1 pkt.'},
  {rok:'styl CKE',nr:11,pkt:3,
   tresc:'Uprość wyrażenie: 2x − [3x − 2(x − 4)]. Zapisz kolejne kroki przekształcenia.',
   wsk:'Zagnieżdżone nawiasy — zacznij od nawiasu okrągłego, potem kwadratowy. Przy każdym nawiasie sprawdź znak.',
   rozw:['Krok 1: Rozwijamy nawias okrągły: −2(x−4) = −2x+8','Wstawiamy: 2x − [3x − 2x + 8]','Krok 2: Redukujemy wewnątrz []: 3x − 2x = x → 2x − [x + 8]','Krok 3: Rozwijamy nawias kwadratowy (minus zmienia znaki): 2x − x − 8','Krok 4: Redukujemy: (2−1)x − 8 = x − 8'],
   odp:'x − 8',
   schemat:'Za prawidłowe wykonanie kroku 1: 1 pkt. Za prawidłowe kroki 2-3: 1 pkt. Za wynik x−8 z odpowiedzią: 1 pkt.'},
  {rok:'styl CKE',nr:14,pkt:3,
   tresc:'Uprość wyrażenie: 5m − {2n + 3[m − 2(n − m)]}. Zapisz obliczenia.',
   wsk:'Trzy poziomy zagnieżdżenia: () → [] → {}. Pracuj od środka na zewnątrz.',
   rozw:['Poziom 1: −2(n−m) = −2n+2m','Wstawiamy: 5m − {2n + 3[m − 2n + 2m]}','Poziom 2 (wewnątrz []): m + 2m = 3m → 3[3m − 2n] = 9m − 6n','Wstawiamy: 5m − {2n + 9m − 6n}','Poziom 3 (wewnątrz {}): 2n − 6n = −4n → {9m − 4n}','Rozwijamy {}: minus zmienia znaki → 5m − 9m + 4n','Wynik: −4m + 4n'],
   odp:'−4m + 4n',
   schemat:'Za poprawny poziom 1: 1 pkt. Za poprawny poziom 2 i 3: 1 pkt. Za końcowy wynik −4m+4n: 1 pkt.'},
]

function CKEContent({onComplete}) {
  const [rev,setRev]=useState([]),[sol,setSol]=useState(Array(CKE_Z.length).fill(false))
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:4,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.blue,display:'inline-block'}}/>
        Zadania z arkuszy CKE
      </div>
      <p style={{fontSize:13,color:C.text2,marginBottom:16,lineHeight:1.65}}>Zadania otwarte wzorowane na egzaminie ósmoklasisty. Spróbuj samodzielnie — każdy krok to punkty!</p>
      {CKE_Z.map((z,i)=>(
        <div key={i} style={{background:C.bg,borderRadius:12,border:`0.5px solid ${C.border}`,padding:'18px 20px',marginBottom:14}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <span style={{fontSize:12,fontWeight:500,background:'#E6F1FB',color:'#0C447C',padding:'3px 10px',borderRadius:20}}>{z.rok}</span>
            <span style={{fontSize:12,color:C.text3}}>Zadanie {z.nr}</span>
            <span style={{fontSize:12,fontWeight:500,color:'#633806',background:'#FAEEDA',padding:'3px 9px',borderRadius:20,marginLeft:'auto'}}>{z.pkt} punkty</span>
          </div>
          <div style={{fontSize:15,fontWeight:500,color:C.text,lineHeight:1.65,marginBottom:14}}>{z.tresc}</div>
          <div onClick={()=>setRev(r=>r.includes(i)?r:[...r,i])} style={{background:'#FAEEDA',border:'0.5px solid #FAC775',borderRadius:8,padding:'9px 14px',marginBottom:10,fontSize:12,color:'#633806',cursor:'pointer',lineHeight:1.6}}>
            💡 {rev.includes(i)?z.wsk:'Kliknij po wskazówkę'}
          </div>
          <button onClick={()=>setSol(p=>p.map((v,j)=>j===i?!v:v))} style={btn({fontSize:12,padding:'8px 16px'})}>{sol[i]?'▲ Ukryj':'▼ Wzorcowe rozwiązanie'}</button>
          {sol[i]&&(
            <div style={{marginTop:14,background:C.white,borderRadius:8,border:`0.5px solid ${C.border}`,padding:'16px'}}>
              {z.rozw.map((s,j)=>(
                <div key={j} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:j<z.rozw.length-1?`0.5px solid ${C.border}`:'none',alignItems:'center'}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:C.navy,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:500,flexShrink:0}}>{j+1}</div>
                  <div style={{fontFamily:'monospace',fontSize:13,color:C.text,lineHeight:1.5}}>{s}</div>
                </div>
              ))}
              <div style={{background:'#EAF3DE',borderRadius:8,padding:'10px 14px',marginTop:12,fontSize:13,color:'#27500A',fontWeight:500}}>Odpowiedź: {z.odp}</div>
              <div style={{background:'#EEEDFE',borderRadius:8,padding:'10px 14px',marginTop:8,fontSize:12,color:'#3C3489',lineHeight:1.6}}><strong>Schemat:</strong> {z.schemat}</div>
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
        <div style={{fontSize:14,color:C.text2}}>Wyrażenia algebraiczne — od podstaw do zagnieżdżonych nawiasów</div>
      </div>
      <div style={{background:C.navy,borderRadius:12,padding:'20px',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#F5541E,#FF7A4D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>🤖</div>
          <div><div style={{fontSize:14,fontWeight:500,color:'#fff'}}>Max</div><div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>podsumowanie</div></div>
        </div>
        {[
          ['Wyrazy podobne','Identyczna część literowa — te same zmienne, te same potęgi. 3xy² ≠ 3x²y!'],
          ['Trzy prawa algebry','Przemienności, łączności, rozdzielności. Pierwsze dwa nie działają na odejmowaniu!'],
          ['Minus przed nawiasem','Zmienia KAŻDY znak wewnątrz. To najczęstsze miejsce błędu na CKE.'],
          ['Zagnieżdżone nawiasy','Zawsze od najbardziej wewnętrznego: () → [] → {}. Po każdym kroku sprawdź znak.'],
          ['Tok rozwiązania','Na CKE zapisuj każdy krok — egzaminator przyznaje punkty za tok, nie tylko wynik.'],
        ].map(([t,d],i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:8,fontSize:13,color:'rgba(255,255,255,.75)',lineHeight:1.6}}>
            <span style={{color:'#F5541E',flexShrink:0}}>→</span>
            <span><strong style={{color:'rgba(255,255,255,.95)'}}>{t}:</strong> {d}</span>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Oznacz jako ukończoną</button>
        <Link href="/kurs/dzial-2" style={{...btn(),textDecoration:'none',display:'inline-block'}}>← Dział 2</Link>
      </div>
    </div>
  )
}

// ── KONFIGURACJA ──────────────────────────────────────────────────────────────
const DZIAL={n:2,title:'Wyrażenia algebraiczne',href:'/kurs/dzial-2',lekcje:[
  {n:1,title:'Zmienne i wyrażenia',href:'#',status:'locked'},
  {n:2,title:'Upraszczanie wyrażeń',href:'/kurs/wyrazenia-algebraiczne',status:'active'},
  {n:3,title:'Wzory skróconego mnożenia',href:'#',status:'locked'},
  {n:4,title:'Wyłączanie przed nawias',href:'#',status:'locked'},
  {n:5,title:'Wielomiany',href:'#',status:'locked'},
  {n:6,title:'Sprawdzian działu',href:'#',status:'locked',isTest:true},
]}
const LEKCJA={n:2,total:5,slug:'wyrazenia-algebraiczne',title:'Upraszczanie wyrażeń algebraicznych',czas:'25 min',poziom:'Poziom: podstawowy–zaawansowany',cke:true}
const XP_MAP={teoria:80,quiz:60,fiszki:80,kartkowka:100,cke:70,raport:40}
const MAX_FAQ=[
  {q:'wyrazy podobne co to jak rozpoznać',a:'Wyrazy podobne mają IDENTYCZNĄ część literową — te same zmienne podniesione do tych samych potęg. 4x²y i −7x²y są podobne. 3xy² i 3x²y NIE są podobne (różne potęgi).'},
  {q:'minus przed nawiasem co robić znaki',a:'Minus przed nawiasem zmienia KAŻDY znak wewnątrz na przeciwny. Dlaczego? To mnożenie przez −1. −(2x−5) = −2x+5. Najczęstszy błąd na CKE!'},
  {q:'prawo rozdzielności jak zastosować',a:'a(b+c) = ab + ac. Mnożysz liczbę przez KAŻDY wyraz w nawiasie. Uwaga: pamiętaj o znakach! −3(2x−4y) = −6x+12y (minus · minus = plus).'},
  {q:'zagnieżdżone nawiasy od czego zacząć',a:'Zawsze od najbardziej wewnętrznego nawiasu: () → [] → {}. Po każdym kroku sprawdź znak przed nawiasem który właśnie rozwijasz.'},
  {q:'redukcja wyrazów jak redukować',a:'Redukujesz tylko wyrazy z identyczną częścią literową. Dodajesz/odejmujesz TYLKO współczynniki, część literowa zostaje. 4a² + 2a² = 6a².'},
]

export default function WyrazeniaAlgebraiczneLesson() {
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
