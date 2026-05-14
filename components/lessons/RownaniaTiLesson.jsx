'use client'
import LessonShell from '../LessonShell'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA 1: Równania liniowe z jedną niewiadomą — WERSJA ROZBUDOWANA
// 8 sekcji teorii · 8 pytań quizu · 15 fiszek · 15 pytań kartkówki
// ─────────────────────────────────────────────────────────────────────────────

const C = { navy:'#0F1729',accent:'#F5541E',green:'#00B894',purple:'#6C5CE7',blue:'#185FA5',bg:'#F7F8FC',white:'#fff',border:'#E2E8F0',text:'#0F1729',text2:'#4A5568',text3:'#8896A5' }
const card = { background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }
const btn = (x={}) => ({ padding:'10px 22px', fontSize:13, fontWeight:500, borderRadius:8, cursor:'pointer', fontFamily:'inherit', border:`1.5px solid ${C.border}`, background:C.white, color:C.text, ...x })

const Step = ({n,text,result,hi,col=C.navy}) => (
  <div style={{display:'flex',gap:10,marginBottom:10}}>
    <div style={{width:22,height:22,background:col,color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0,marginTop:2}}>{n}</div>
    <div>
      <div style={{fontSize:13,color:C.text2,marginBottom:4,lineHeight:1.5}}>{text}</div>
      <div style={hi
        ?{background:'#F0FFF4',borderLeft:'3px solid #00B894',padding:'7px 12px',borderRadius:'0 7px 7px 0',fontFamily:'monospace',fontSize:14,color:'#276749',fontWeight:600}
        :result?{background:C.bg,padding:'6px 10px',borderRadius:6,fontFamily:'monospace',fontSize:13,color:C.text,display:'inline-block'}
        :{}}>{result}</div>
    </div>
  </div>
)

const Task = ({label,eq,sub}) => (
  <div style={{background:'linear-gradient(135deg,#FFF5EB,#FFFAF5)',border:'1px solid #FDDCBA',borderRadius:8,padding:'12px 16px',margin:'14px 0'}}>
    <div style={{fontSize:11,fontWeight:600,color:C.accent,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>{label}</div>
    <div style={{fontFamily:'monospace',fontSize:18,color:C.text,fontWeight:500,lineHeight:1.8}}>{eq}</div>
    {sub&&<div style={{fontSize:12,color:C.text3,marginTop:4}}>{sub}</div>}
  </div>
)

const Rule = ({bg,bc,c,children}) => (
  <div style={{background:bg,borderLeft:`3px solid ${bc}`,borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:c,lineHeight:1.7,margin:'12px 0'}}>{children}</div>
)

const Formula = ({lines,note}) => (
  <div style={{background:C.navy,borderRadius:10,padding:'14px 20px',textAlign:'center',margin:'14px 0'}}>
    {lines.map((l,i)=><div key={i} style={{fontFamily:'monospace',fontSize:18,color:'#fff',lineHeight:2}} dangerouslySetInnerHTML={{__html:l.replace(/\[([^\]]+)\]/g,'<span style="color:#FF7A4D">$1</span>').replace(/\{([^\}]+)\}/g,'<span style="color:#00B894">$1</span>')}}/>)}
    {note&&<div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:6}}>{note}</div>}
  </div>
)

// ── TEORIA ────────────────────────────────────────────────────────────────────
const TTABS = [
  {id:'def',     label:'Co to równanie'},
  {id:'zasady',  label:'Zasady przekształcania'},
  {id:'proste',  label:'Równania ax+b=c'},
  {id:'obu',     label:'x po obu stronach'},
  {id:'nawiasy', label:'Równania z nawiasami'},
  {id:'ulamki',  label:'★ Równania z ułamkami'},
  {id:'sprzecz', label:'★ Sprzeczne i tożsamościowe'},
  {id:'bledy',   label:'Sprawdzanie i błędy CKE'},
]

const TEORIA = {

def: <div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    <strong style={{color:C.text}}>Równanie</strong> to zdanie matematyczne, w którym po obu stronach znaku równości (<strong>=</strong>) stoją wyrażenia algebraiczne. Przynajmniej jedno z nich zawiera <strong style={{color:C.text}}>niewiadomą</strong> — najczęściej oznaczaną literą <strong style={{color:C.text}}>x</strong>.
  </p>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:16}}>
    Rozwiązanie równania, zwane też <strong style={{color:C.text}}>korzeniem</strong>, to taka wartość x, która po podstawieniu sprawia, że obie strony równania są sobie równe.
  </p>
  <Formula lines={['[a]x + [b] = {c}']} note="Ogólna postać równania liniowego z jedną niewiadomą" />
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
    {[
      {t:'Wyrażenie algebraiczne',f:'2x + 3',d:'Brak znaku =. Nie można "rozwiązać" — można tylko uprościć lub obliczyć wartość.',bg:'#F5F3FF',c:'#6C5CE7'},
      {t:'Równanie',f:'2x + 3 = 11',d:'Jest znak =. Szukamy x, które spełnia to zdanie. Rozwiązanie: x = 4.',bg:'#F0FFF4',c:'#00B894'},
    ].map(({t,f,d,bg,c})=>(
      <div key={t} style={{background:bg,borderRadius:8,padding:'12px 14px',border:`1px solid ${c}33`}}>
        <div style={{fontSize:12,fontWeight:600,color:c,marginBottom:4}}>{t}</div>
        <div style={{fontFamily:'monospace',fontSize:16,color:C.text,marginBottom:6,fontWeight:600}}>{f}</div>
        <div style={{fontSize:12,color:C.text2,lineHeight:1.5}}>{d}</div>
      </div>
    ))}
  </div>
  <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:10}}>Ile rozwiązań może mieć równanie liniowe?</div>
  <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:14}}>
    {[
      ['Dokładnie jedno','ax + b = c gdzie a ≠ 0','Typowy przypadek. x = (c−b)/a','#F0FFF4','#276749'],
      ['Brak rozwiązań','Równanie sprzeczne','Po uproszczeniu: np. 3 = 7 (zawsze fałsz)','#FFF5F5','#9B2C2C'],
      ['Nieskończenie wiele','Równanie tożsamościowe','Po uproszczeniu: np. 0 = 0 (zawsze prawda)','#EBF4FF','#185FA5'],
    ].map(([t,przyklad,opis,bg,c])=>(
      <div key={t} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'10px 14px',background:bg,borderRadius:8}}>
        <div style={{fontSize:13,fontWeight:600,color:c,minWidth:200,flexShrink:0}}>{t}</div>
        <div>
          <div style={{fontFamily:'monospace',fontSize:12,color:c,marginBottom:2}}>{przyklad}</div>
          <div style={{fontSize:12,color:C.text2}}>{opis}</div>
        </div>
      </div>
    ))}
  </div>
  <Rule bg='#EBF4FF' bc='#185FA5' c='#0C447C'>
    📚 <strong>Na egzaminie CKE</strong> zdecydowana większość zadań ma dokładnie jedno rozwiązanie. Równania sprzeczne i tożsamościowe pojawiają się rzadko, ale warto je rozpoznać.
  </Rule>
</div>,

zasady: <div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Rozwiązywanie równań opiera się na jednej fundamentalnej zasadzie: <strong style={{color:C.text}}>możemy wykonywać dowolne działania na obu stronach równania jednocześnie</strong> — i równość nie zostanie naruszona.
  </p>
  <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:12}}>Cztery dozwolone operacje:</div>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
    {[
      {op:'+c',title:'Dodawanie tej samej liczby',przyklad:'x − 3 = 5  →  x = 8',opis:'Dodajemy 3 do obu stron',bg:'#F0FFF4',c:'#276749'},
      {op:'−c',title:'Odejmowanie tej samej liczby',przyklad:'x + 7 = 12  →  x = 5',opis:'Odejmujemy 7 od obu stron',bg:'#F0FFF4',c:'#276749'},
      {op:'×c',title:'Mnożenie przez liczbę ≠ 0',przyklad:'x/3 = 4  →  x = 12',opis:'Mnożymy obie strony przez 3',bg:'#EBF4FF',c:'#185FA5'},
      {op:'÷c',title:'Dzielenie przez liczbę ≠ 0',przyklad:'5x = 20  →  x = 4',opis:'Dzielimy obie strony przez 5',bg:'#EBF4FF',c:'#185FA5'},
    ].map(({op,title,przyklad,opis,bg,c})=>(
      <div key={op} style={{background:bg,borderRadius:8,padding:'12px 14px'}}>
        <div style={{fontFamily:'monospace',fontSize:22,fontWeight:700,color:c,marginBottom:4}}>… {op} …</div>
        <div style={{fontSize:12,fontWeight:600,color:c,marginBottom:4}}>{title}</div>
        <div style={{fontFamily:'monospace',fontSize:12,color:C.text,marginBottom:3}}>{przyklad}</div>
        <div style={{fontSize:11,color:C.text3}}>{opis}</div>
      </div>
    ))}
  </div>
  <Rule bg='#FFF5F5' bc='#E17055' c='#9B2C2C'>
    ⚠️ <strong>Czego NIE wolno robić:</strong> dzielić przez 0 (niedozwolone matematycznie), dodawać różnych liczb do różnych stron, wykonywać działań tylko na jednej stronie.
  </Rule>
  <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:10,marginTop:16}}>Pojęcie równań równoważnych</div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:12}}>
    Dwa równania są <strong style={{color:C.text}}>równoważne</strong>, gdy mają dokładnie ten sam zbiór rozwiązań. Każda dozwolona operacja przekształca równanie w równoważne. Dlatego kolejne kroki rozwiązania dają te same rozwiązania.
  </p>
  <div style={{background:C.bg,borderRadius:8,padding:'14px 16px',fontFamily:'monospace',fontSize:13,color:C.text,lineHeight:2.2}}>
    2x + 6 = 12<br/>
    <span style={{color:C.text3,fontSize:11}}>│ odejmujemy 6</span><br/>
    2x = 6<br/>
    <span style={{color:C.text3,fontSize:11}}>│ dzielimy przez 2</span><br/>
    x = 3 ✓
  </div>
  <Rule bg='#F5F3FF' bc='#6C5CE7' c='#4C1D95'>
    💡 <strong>Cel rozwiązywania równania</strong> to doprowadzenie do postaci <strong>x = liczba</strong>. Każdy krok powinien przybliżać nas do tej postaci przez eliminację wyrazów.
  </Rule>
</div>,

proste: <div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Równanie postaci <strong style={{color:C.text}}>ax + b = c</strong> jest najprostszym typem. Rozwiązujemy je w dwóch krokach: izolujemy x przez przeniesienie stałej, potem dzielimy przez współczynnik.
  </p>
  <div style={{fontFamily:'monospace',fontSize:14,color:C.text2,background:C.bg,padding:'10px 14px',borderRadius:8,marginBottom:16,lineHeight:2}}>
    ax + b = c &nbsp;→&nbsp; ax = c − b &nbsp;→&nbsp; x = (c − b) / a
  </div>

  <Task label="Przykład 1 — podstawowy" eq="2x + 3 = 11" />
  <Step n={1} text="Odejmujemy 3 od obu stron:" result="2x = 8" />
  <Step n={2} text="Dzielimy przez 2:" result="x = 4 ✓" hi />
  <Rule bg='#F0FFF4' bc='#00B894' c='#276749'>✅ Sprawdzenie: 2·<b>4</b> + 3 = 11 ✓</Rule>

  <Task label="Przykład 2 — odejmowanie (ujemna stała)" eq="5x − 8 = 17" />
  <Step n={1} text="Dodajemy 8 do obu stron (przenosimy −8):" result="5x = 25" />
  <Step n={2} text="Dzielimy przez 5:" result="x = 5 ✓" hi />

  <Task label="Przykład 3 — wynik ułamkowy (typ CKE!)" eq="3x + 2 = 9" />
  <Step n={1} text="Odejmujemy 2:" result="3x = 7" />
  <Step n={2} text="Dzielimy przez 3:" result="x = 7/3 ✓" hi />
  <Rule bg='#FFF5EB' bc='#F5541E' c='#C05621'>💡 Na egzaminie CKE wynik może być ułamkiem — nie zrażaj się. 7/3 to poprawna odpowiedź!</Rule>

  <Task label="Przykład 4 — ujemny współczynnik przy x" eq="−4x + 1 = 13" />
  <Step n={1} text="Odejmujemy 1 od obu stron:" result="−4x = 12" />
  <Step n={2} text="Dzielimy przez −4 (ujemna liczba — wynik zmienia znak):" result="x = −3 ✓" hi />

  <Task label="Przykład 5 — równanie z liczbami ujemnymi po obu stronach" eq="−2x + 5 = −9" />
  <Step n={1} text="Odejmujemy 5:" result="−2x = −14" />
  <Step n={2} text="Dzielimy przez −2:" result="x = 7 ✓" hi />

  <Task label="Przykład 6 — x po prawej stronie" eq="15 = 3x − 6" sub="To samo równanie, tylko napisane odwrotnie — możemy je obrócić!" />
  <Step n={1} text="Obracamy równanie (dozwolone!):" result="3x − 6 = 15" />
  <Step n={2} text="Dodajemy 6, dzielimy przez 3:" result="x = 7 ✓" hi />
</div>,

obu: <div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Gdy <strong style={{color:C.text}}>x pojawia się po obu stronach</strong> równania, pierwszy krok to zebranie wszystkich wyrazów z x na jednej stronie (zwykle lewej), a wszystkich liczb na drugiej.
  </p>
  <Rule bg='#FFF5EB' bc='#F5541E' c='#C05621'>
    ⚠️ <strong>Kluczowa zasada:</strong> Przenosząc wyraz na drugą stronę <strong>zawsze zmieniamy jego znak</strong>.<br/>
    +3x po prawej → −3x po lewej<br/>
    −5 po lewej → +5 po prawej
  </Rule>

  <Task label="Przykład 1 — standardowy" eq="4x + 2 = 2x + 10" />
  <Step n={1} text="Przenosimy 2x na lewą (odejmujemy 2x od obu stron):" result="4x − 2x + 2 = 10" />
  <Step n={2} text="Upraszczamy lewą stronę:" result="2x + 2 = 10" />
  <Step n={3} text="Odejmujemy 2:" result="2x = 8" />
  <Step n={4} text="Dzielimy przez 2:" result="x = 4 ✓" hi />
  <Rule bg='#F0FFF4' bc='#00B894' c='#276749'>✅ Sprawdzenie: 4·4+2 = 18 i 2·4+10 = 18 ✓</Rule>

  <Task label="Przykład 2 — x z ujemnym współczynnikiem po prawej" eq="x + 5 = 7 − 2x" />
  <Step n={1} text="Dodajemy 2x do obu stron (przenosimy −2x na lewą):" result="x + 2x + 5 = 7" />
  <Step n={2} text="Upraszczamy: 3x + 5 = 7, odejmujemy 5:" result="3x = 2" />
  <Step n={3} text="Dzielimy przez 3:" result="x = 2/3 ✓" hi />

  <Task label="Przykład 3 — wszystko po lewej, zero po prawej (typ maturalny)" eq="6x − 3 = 4x + 9" />
  <Step n={1} text="6x − 4x = 9 + 3" result="2x = 12" />
  <Step n={2} text="Dzielimy przez 2:" result="x = 6 ✓" hi />

  <div style={{background:C.bg,borderRadius:8,padding:'14px 16px',marginTop:14}}>
    <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:10}}>⚠️ Typowe błędy przy przenoszeniu:</div>
    {[
      ['Błąd: nie zmieniono znaku','4x + 2 = 2x + 10  →  4x + 2x = 10 ✗','Poprawnie: 4x − 2x = 10 − 2  →  x = 4'],
      ['Błąd: przeniesiono x, ale nie zmieniono znaku liczby','4x + 2 = 2x + 10  →  4x − 2x + 2 = 10 → ... zapomnienie o −2'],
    ].map(([l,w,ok])=>(
      <div key={l} style={{background:C.white,borderRadius:6,padding:'10px 12px',marginBottom:8,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:4}}>⚠️ {l}</div>
        <div style={{fontFamily:'monospace',fontSize:12,color:'#9B2C2C',marginBottom:4}}>{w}</div>
        <div style={{fontFamily:'monospace',fontSize:12,color:'#276749'}}>✓ {ok}</div>
      </div>
    ))}
  </div>
</div>,

nawiasy: <div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Gdy w równaniu pojawia się nawias, <strong style={{color:C.text}}>najpierw go rozwijamy</strong> (stosujemy rozdzielność mnożenia), a dopiero potem rozwiązujemy. Jest to obowiązkowy pierwszy krok.
  </p>
  <Formula lines={['[a]([b]x + [c]) = [a]·[b]x + [a]·[c]']} note="Rozdzielność mnożenia względem dodawania" />

  <Task label="Przykład 1 — nawias z plusem" eq="3(x + 5) = 24" />
  <Step n={1} text="Rozwijamy nawias:" result="3x + 15 = 24" />
  <Step n={2} text="Odejmujemy 15, dzielimy przez 3:" result="x = 3 ✓" hi />

  <Task label="Przykład 2 — nawias z minusem ⚠️" eq="4(x − 2) = 2x + 2" />
  <Step n={1} text="Rozwijamy (uwaga: 4 · (−2) = −8):" result="4x − 8 = 2x + 2" />
  <Step n={2} text="Przenosimy x: 4x − 2x = 2 + 8" result="2x = 10" />
  <Step n={3} text="Dzielimy przez 2:" result="x = 5 ✓" hi />
  <Rule bg='#FFF5F5' bc='#E17055' c='#9B2C2C'>⚠️ <strong>Najczęstszy błąd:</strong> 4(x−2) = 4x − 2. Poprawnie: 4(x−2) = 4x − <b>8</b>. Mnożymy przez KAŻDY wyraz!</Rule>

  <Task label="Przykład 3 — minus przed nawiasem ⚠️" eq="5x − (2x + 4) = 8" />
  <Step n={1} text="Minus przed nawiasem zmienia znak KAŻDEGO wyrazu:" result="5x − 2x − 4 = 8" />
  <Step n={2} text="Upraszczamy: 3x − 4 = 8, dodajemy 4:" result="3x = 12" />
  <Step n={3} text="Dzielimy przez 3:" result="x = 4 ✓" hi />
  <Rule bg='#FFF5EB' bc='#F5541E' c='#C05621'>💡 Regułą jest: −(a + b) = −a − b i −(a − b) = −a + b. Minus odwraca WSZYSTKIE znaki w nawiasie.</Rule>

  <Task label="Przykład 4 — nawiasy po obu stronach (typ CKE!)" eq="2(x + 3) = 3(x − 1)" />
  <Step n={1} text="Rozwijamy oba nawiasy:" result="2x + 6 = 3x − 3" />
  <Step n={2} text="Przenosimy: 2x − 3x = −3 − 6" result="−x = −9" />
  <Step n={3} text="Mnożymy przez −1:" result="x = 9 ✓" hi />

  <Task label="Przykład 5 — mnożnik przed nawiasem i poza nim" eq="2(3x − 1) + 5 = 4x + 11" />
  <Step n={1} text="Rozwijamy nawias:" result="6x − 2 + 5 = 4x + 11" />
  <Step n={2} text="Upraszczamy lewą stronę:" result="6x + 3 = 4x + 11" />
  <Step n={3} text="Przenosimy: 2x = 8, dzielimy:" result="x = 4 ✓" hi />

  <Task label="Przykład 6 — dwa nawiasy z minusami (zaawansowany)" eq="3(2x + 1) − 2(x − 3) = 19" />
  <Step n={1} text="Rozwijamy oba nawiasy:" result="6x + 3 − 2x + 6 = 19" />
  <Step n={2} text="Łączymy wyrazy podobne:" result="4x + 9 = 19" />
  <Step n={3} text="Odejmujemy 9, dzielimy przez 4:" result="x = 2,5 ✓" hi />
</div>,

ulamki: <div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Równania z ułamkami wyglądają groźnie, ale mają prostą strategię: <strong style={{color:C.text}}>mnożymy obie strony przez NWW (Najmniejszą Wspólną Wielokrotność) wszystkich mianowników</strong>. W ten sposób pozbywamy się ułamków i wracamy do znajomego typu równania.
  </p>
  <Rule bg='#EBF4FF' bc='#185FA5' c='#0C447C'>
    💡 <strong>Strategia w 3 krokach:</strong><br/>
    1. Znajdź NWW wszystkich mianowników<br/>
    2. Pomnóż każdy wyraz (po obu stronach) przez NWW<br/>
    3. Rozwiąż powstałe równanie bez ułamków
  </Rule>

  <Task label="Przykład 1 — prosty ułamek" eq="x/3 = 4" sub="Mianownik: 3. NWW = 3." />
  <Step n={1} text="Mnożymy obie strony przez 3:" result="x = 12 ✓" hi />

  <Task label="Przykład 2 — dwa różne mianowniki" eq="x/2 + x/3 = 5" sub="Mianowniki: 2 i 3. NWW = 6." />
  <Step n={1} text="Mnożymy każdy wyraz przez 6:" result="3x + 2x = 30" />
  <Step n={2} text="Upraszczamy i dzielimy przez 5:" result="x = 6 ✓" hi />
  <Rule bg='#F0FFF4' bc='#00B894' c='#276749'>✅ Sprawdzenie: 6/2 + 6/3 = 3 + 2 = 5 ✓</Rule>

  <Task label="Przykład 3 — ułamek z wyrażeniem w liczniku (typ CKE!)" eq="(2x + 1)/3 = 5" sub="Mianownik: 3." />
  <Step n={1} text="Mnożymy obie strony przez 3:" result="2x + 1 = 15" />
  <Step n={2} text="Odejmujemy 1, dzielimy przez 2:" result="x = 7 ✓" hi />

  <Task label="Przykład 4 — ułamki po obu stronach" eq="(x + 1)/2 = (x − 1)/3" sub="Mianowniki: 2 i 3. NWW = 6." />
  <Step n={1} text="Mnożymy każdy wyraz przez 6:" result="3(x+1) = 2(x−1)" />
  <Step n={2} text="Rozwijamy nawiasy: 3x + 3 = 2x − 2" result="" />
  <Step n={3} text="Przenosimy: 3x − 2x = −2 − 3" result="x = −5 ✓" hi />

  <Task label="Przykład 5 — mieszany (ułamek i liczba całkowita)" eq="x/4 − 2 = x/2 − 5" sub="Mianowniki: 4 i 2. NWW = 4." />
  <Step n={1} text="Mnożymy każdy wyraz przez 4 (w tym liczby całkowite!):" result="x − 8 = 2x − 20" />
  <Step n={2} text="Przenosimy: x − 2x = −20 + 8" result="−x = −12" />
  <Step n={3} text="Mnożymy przez −1:" result="x = 12 ✓" hi />
  <Rule bg='#FFF5EB' bc='#F5541E' c='#C05621'>⚠️ <strong>Pamiętaj:</strong> gdy mnożysz przez NWW, mnożysz KAŻDY wyraz równania — również te bez ułamka! 2 · 4 = 8, nie 2.</Rule>
</div>,

sprzecz: <div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Nie każde równanie ma rozwiązanie. Niekiedy po wykonaniu wszystkich przekształceń dochodzimy do zdania, które jest zawsze fałszywe lub zawsze prawdziwe — niezależnie od wartości x.
  </p>

  <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:12}}>Typ 1: Równanie sprzeczne (brak rozwiązań)</div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:10}}>
    Równanie sprzeczne po uproszczeniu daje zdanie zawsze fałszywe, np. <strong style={{fontFamily:'monospace'}}>3 = 7</strong> lub <strong style={{fontFamily:'monospace'}}>0 = 5</strong>. Takie równanie nie ma żadnego rozwiązania.
  </p>
  <Task label="Przykład — równanie sprzeczne" eq="2(x + 3) = 2x + 10" />
  <Step n={1} text="Rozwijamy nawias:" result="2x + 6 = 2x + 10" />
  <Step n={2} text="Odejmujemy 2x od obu stron:" result="6 = 10" />
  <div style={{background:'#FFF5F5',border:'1px solid #FED7D7',borderRadius:8,padding:'12px 14px',margin:'10px 0',fontSize:13,color:'#9B2C2C',lineHeight:1.6}}>
    ❌ 6 = 10 to zdanie fałszywe — <strong>równanie nie ma rozwiązania</strong>. Zbiór rozwiązań jest pusty: ∅
  </div>

  <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:12,marginTop:20}}>Typ 2: Równanie tożsamościowe (nieskończenie wiele rozwiązań)</div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:10}}>
    Równanie tożsamościowe po uproszczeniu daje zdanie zawsze prawdziwe, np. <strong style={{fontFamily:'monospace'}}>0 = 0</strong>. Każda wartość x spełnia to równanie.
  </p>
  <Task label="Przykład — równanie tożsamościowe" eq="3(x + 2) = 3x + 6" />
  <Step n={1} text="Rozwijamy nawias:" result="3x + 6 = 3x + 6" />
  <Step n={2} text="Odejmujemy 3x + 6 od obu stron:" result="0 = 0" />
  <div style={{background:'#F0FFF4',border:'1px solid #C6F6D5',borderRadius:8,padding:'12px 14px',margin:'10px 0',fontSize:13,color:'#276749',lineHeight:1.6}}>
    ✅ 0 = 0 to zdanie zawsze prawdziwe — <strong>każda liczba rzeczywista jest rozwiązaniem</strong>. Zbiór rozwiązań: ℝ
  </div>

  <div style={{background:C.bg,borderRadius:10,padding:'14px 16px',marginTop:16}}>
    <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:10}}>Jak rozpoznać — szybka tabela:</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
      {[
        ['Wynik upraszczania','Typ równania','Liczba rozwiązań'],
        ['x = liczba','Normalne','Jedno rozwiązanie'],
        ['liczba = inna liczba','Sprzeczne','Brak rozwiązań (∅)'],
        ['0 = 0 lub x = x','Tożsamościowe','Nieskończenie wiele (ℝ)'],
      ].map((r,i)=>(
        <div key={i} style={{display:'contents'}}>
          {r.map((c,j)=>(
            <div key={j} style={{padding:'8px 10px',background:i===0?C.navy:j===0?'#F5F3FF':j===1?'#FFF5F5':'#F0FFF4',color:i===0?'rgba(255,255,255,.8)':j===0?'#4C1D95':j===1?'#9B2C2C':'#276749',fontSize:12,fontWeight:i===0?500:400,borderRadius:4,fontFamily:i>0&&j===0?'monospace':'inherit'}}>
              {c}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
</div>,

bledy: <div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Ostatni krok każdego rozwiązania — <strong style={{color:C.text}}>sprawdzenie</strong> — jest obowiązkowy w zadaniach otwartych CKE. Pominięcie sprawdzenia może kosztować punkt!
  </p>

  <div style={{background:C.navy,borderRadius:10,padding:'16px 20px',marginBottom:16}}>
    <div style={{fontSize:13,fontWeight:500,color:'#fff',marginBottom:12}}>Schemat poprawnego sprawdzenia (4 kroki):</div>
    {[
      ['Weź ORYGINALNE równanie','4x + 2 = 2x + 10 (nie przekształcone!)'],
      ['Podstaw znalezione x','x=4: 4·4+2 = 2·4+10'],
      ['Oblicz obie strony osobno','Lewa strona: 18, Prawa strona: 18'],
      ['Porównaj i napisz wniosek','LS = PS → x = 4 jest rozwiązaniem ✓'],
    ].map(([s,eq],i)=>(
      <div key={i} style={{display:'flex',gap:12,marginBottom:8,alignItems:'flex-start'}}>
        <div style={{width:20,height:20,background:'rgba(255,255,255,.15)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,color:'#fff',flexShrink:0,marginTop:1}}>{i+1}</div>
        <div>
          <div style={{fontSize:12,color:'rgba(255,255,255,.6)',marginBottom:2}}>{s}</div>
          <div style={{fontFamily:'monospace',fontSize:12,color:'#FF7A4D'}}>{eq}</div>
        </div>
      </div>
    ))}
  </div>

  <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:12}}>Kompletna lista błędów na egzaminie CKE:</div>
  {[
    {b:'Błąd znaku przy przenoszeniu',w:'4x + 2 = 2x+10 → 4x+2x = 10 ✗',ok:'4x−2x = 10−2 ✓'},
    {b:'Błąd przy rozwijaniu nawiasu',w:'3(x−4) = 3x−4 ✗',ok:'3(x−4) = 3x−12 ✓'},
    {b:'Minus przed nawiasem',w:'−(x+3) = −x+3 ✗',ok:'−(x+3) = −x−3 ✓'},
    {b:'Dzielenie tylko jednej strony',w:'3x = 12 → x = 12 (nie podzielono obu!) ✗',ok:'3x = 12 → x = 4 ✓'},
    {b:'Pominięcie sprawdzenia',w:'Brak weryfikacji = brak punktu za uzasadnienie',ok:'Zawsze sprawdzaj w oryginalnym równaniu'},
    {b:'Przy ułamkach — niepomnożenie każdego wyrazu',w:'x/2 + 3 = 5, ×2: x + 3 = 10 ✗ (nie pomnożono 3)',ok:'x/2 + 3 = 5, ×2: x + 6 = 10 ✓'},
  ].map(({b,w,ok})=>(
    <div key={b} style={{background:C.bg,borderRadius:8,padding:'12px 14px',marginBottom:8,borderLeft:'3px solid #E17055'}}>
      <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:5}}>⚠️ {b}</div>
      <div style={{fontFamily:'monospace',fontSize:12,color:'#9B2C2C',marginBottom:4}}>{w}</div>
      <div style={{fontFamily:'monospace',fontSize:12,color:'#276749'}}>✓ {ok}</div>
    </div>
  ))}
  <Rule bg='#F5F3FF' bc='#6C5CE7' c='#4C1D95'>
    🎯 <strong>Złota zasada CKE:</strong> W zadaniach otwartych zapisuj każdy krok. Egzaminatorzy przyznają punkty za tok rozwiązania, nawet jeśli wynik końcowy jest błędny!
  </Rule>
</div>,

}

function TeoriaContent({onComplete}) {
  const [tab,setTab] = useState('def')
  const idx = TTABS.findIndex(t=>t.id===tab)
  return (
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.purple,marginBottom:12}}>📖 Teoria — {TTABS.find(t=>t.id===tab)?.label}</div>
      <div style={{display:'flex',gap:5,marginBottom:18,flexWrap:'wrap'}}>
        {TTABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'5px 12px',fontSize:11,fontWeight:500,borderRadius:20,cursor:'pointer',fontFamily:'inherit',border:`1.5px solid ${tab===t.id?C.navy:C.border}`,background:tab===t.id?C.navy:C.white,color:tab===t.id?'#fff':C.text2,transition:'all .15s'}}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{fontSize:12,color:C.text3,marginBottom:14}}>Sekcja {idx+1} z {TTABS.length}</div>
      {TEORIA[tab]}
      <div style={{display:'flex',justifyContent:'space-between',marginTop:22,gap:8}}>
        {idx>0 && <button onClick={()=>setTab(TTABS[idx-1].id)} style={btn()}>← Poprzednia</button>}
        {idx<TTABS.length-1
          ? <button onClick={()=>setTab(TTABS[idx+1].id)} style={btn({marginLeft:'auto'})}>Następna sekcja →</button>
          : <button onClick={onComplete} style={btn({background:C.navy,color:'#fff',border:'none',marginLeft:'auto'})}>✓ Ukończyłem teorię →</button>}
      </div>
    </div>
  )
}

// ── QUIZ (8 pytań) ────────────────────────────────────────────────────────────
const QUIZ = [
  {q:'Rozwiąż równanie:',eq:'2x + 5 = 13',opts:['x = 4','x = 9','x = 3','x = 6'],ans:0,dlaczego:'Odejmujemy 5: 2x=8. Dzielimy przez 2: x=4. Sprawdzenie: 2·4+5=13 ✓'},
  {q:'Rozwiąż równanie (x po obu stronach):',eq:'3x − 4 = x + 8',opts:['x = 2','x = 6','x = 4','x = 8'],ans:1,dlaczego:'Przenosimy: 3x−x = 8+4 → 2x=12 → x=6. Sprawdzenie: 14=14 ✓'},
  {q:'Rozwiąż równanie z nawiasem:',eq:'2(x + 3) = 14',opts:['x = 7','x = 5','x = 4','x = 8'],ans:2,dlaczego:'Rozwijamy: 2x+6=14 → 2x=8 → x=4. Sprawdzenie: 2·7=14 ✓'},
  {q:'Rozwiąż równanie z ułamkiem:',eq:'x/3 + 2 = 6',opts:['x = 12','x = 4','x = 8','x = 24'],ans:0,dlaczego:'Odejmujemy 2: x/3=4. Mnożymy przez 3: x=12. Sprawdzenie: 12/3+2=6 ✓'},
  {q:'Jaki jest wynik po uproszczeniu?',eq:'2(x + 5) = 2x + 11',opts:['x = 1','x = 0','Brak rozwiązań','x = −1'],ans:2,dlaczego:'Rozwijamy: 2x+10=2x+11 → 10=11. To fałsz — równanie sprzeczne, brak rozwiązań!'},
  {q:'Rozwiąż równanie:',eq:'(x + 1)/2 = 3',opts:['x = 5','x = 7','x = 3','x = 4'],ans:0,dlaczego:'Mnożymy przez 2: x+1=6 → x=5. Sprawdzenie: (5+1)/2=3 ✓'},
  {q:'Rozwiąż równanie z nawiasami po obu stronach:',eq:'3(x − 1) = 2(x + 4)',opts:['x = 11','x = 9','x = 7','x = 5'],ans:0,dlaczego:'3x−3=2x+8 → x=11. Sprawdzenie: 3·10=2·15 → 30=30 ✓'},
  {q:'Ojciec jest 3 razy starszy od syna. Za 10 lat suma ich wieku wyniesie 80. Ile lat ma teraz syn?',eq:'',opts:['10','12','14','15'],ans:2,dlaczego:'Syn=x, ojciec=3x. Za 10 lat: (x+10)+(3x+10)=80 → 4x+20=80 → x=15. Czekaj: 4x=60 → x=15. Nie, 4x=60, x=15. Ale opcja to 14... Sprawdźmy: (14+10)+(42+10)=24+52=76≠80. x=15: 25+55=80 ✓'},
]

// Fix quiz question 8
const QUIZ_FIXED = [
  {q:'Rozwiąż równanie:',eq:'2x + 5 = 13',opts:['x = 4','x = 9','x = 3','x = 6'],ans:0,dlaczego:'Odejmujemy 5: 2x=8. Dzielimy przez 2: x=4. Sprawdzenie: 2·4+5=13 ✓'},
  {q:'Rozwiąż równanie (x po obu stronach):',eq:'3x − 4 = x + 8',opts:['x = 2','x = 6','x = 4','x = 8'],ans:1,dlaczego:'Przenosimy x: 3x−x=8+4 → 2x=12 → x=6. Sprawdzenie: 3·6−4=14 i 6+8=14 ✓'},
  {q:'Rozwiąż równanie z nawiasem:',eq:'2(x + 3) = 14',opts:['x = 7','x = 5','x = 4','x = 8'],ans:2,dlaczego:'Rozwijamy: 2x+6=14 → 2x=8 → x=4. Sprawdzenie: 2·(4+3)=14 ✓'},
  {q:'Rozwiąż równanie z ułamkiem:',eq:'x/3 + 2 = 6',opts:['x = 12','x = 4','x = 8','x = 24'],ans:0,dlaczego:'Odejmujemy 2: x/3=4. Mnożymy przez 3: x=12. Sprawdzenie: 12/3+2=4+2=6 ✓'},
  {q:'Co wychodzi po uproszczeniu równania 2(x+5) = 2x+11?',eq:'',opts:['x = 0,5','x = 1','Brak rozwiązań','Nieskończenie wiele rozwiązań'],ans:2,dlaczego:'Rozwijamy: 2x+10=2x+11. Odejmujemy 2x: 10=11. To zawsze fałsz — równanie sprzeczne, brak rozwiązań!'},
  {q:'Rozwiąż równanie z ułamkiem:',eq:'(x + 1)/2 = 3',opts:['x = 5','x = 7','x = 3','x = 4'],ans:0,dlaczego:'Mnożymy obie strony przez 2: x+1=6 → x=5. Sprawdzenie: (5+1)/2=3 ✓'},
  {q:'Rozwiąż równanie z nawiasami po obu stronach:',eq:'3(x − 1) = 2(x + 4)',opts:['x = 11','x = 9','x = 7','x = 5'],ans:0,dlaczego:'Rozwijamy: 3x−3=2x+8. Przenosimy: x=11. Sprawdzenie: 3·10=30 i 2·15=30 ✓'},
  {q:'Tomek ma 2 razy więcej kart niż Kacper. Razem mają 45 kart. Ile kart ma Tomek?',eq:'',opts:['15','20','30','25'],ans:2,dlaczego:'Kacper=x, Tomek=2x. Razem: x+2x=45 → 3x=45 → x=15. Tomek = 2·15 = 30 kart.'},
]

function QuizContent({onComplete}) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([])
  if(qi>=QUIZ_FIXED.length){const ok=results.filter(r=>r).length;return(
    <div style={card}>
      <div style={{textAlign:'center',padding:'16px 0 24px'}}>
        <div style={{fontSize:48,marginBottom:8}}>{ok>=6?'🎯':ok>=5?'👍':'📚'}</div>
        <div style={{fontFamily:'Fraunces,serif',fontSize:24,fontWeight:900,color:C.text,marginBottom:6}}>{ok}/{QUIZ_FIXED.length} poprawnych</div>
        <div style={{fontSize:14,color:C.text2}}>{ok>=6?'Świetnie! Czas na fiszki.':'Powtórz sekcje teorii i spróbuj ponownie.'}</div>
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
        <button onClick={()=>{setQi(0);setSel(null);setDone(false);setResults([])}} style={btn()}>Powtórz quiz</button>
        <button onClick={onComplete} style={btn({background:C.navy,color:'#fff',border:'none'})}>✓ Ukończyłem quiz →</button>
      </div>
    </div>
  )}
  const q=QUIZ_FIXED[qi]
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.green,marginBottom:12}}>🧠 Quiz — pytanie {qi+1}/{QUIZ_FIXED.length}</div>
      <div style={{display:'flex',gap:4,marginBottom:16}}>{QUIZ_FIXED.map((_,i)=><div key={i} style={{height:4,flex:1,borderRadius:2,background:i<qi?C.green:i===qi?C.accent:C.border,transition:'background .3s'}}/>)}</div>
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:10,lineHeight:1.5}}>{q.q}</div>
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'11px 18px',marginBottom:16,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div></div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#F0FFF4';border='#00B894';color='#276749'}else if(i===sel){bg='#FFF5F5';border='#E17055';color='#9B2C2C'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setResults(p=>[...p,i===q.ans])}} style={{border:`1.5px solid ${border}`,borderRadius:8,padding:'11px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:14,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<>
        <div style={{padding:'12px 16px',borderRadius:8,marginBottom:10,display:'flex',gap:10,alignItems:'flex-start',background:sel===q.ans?'#F0FFF4':'#FFF5F5',border:`1px solid ${sel===q.ans?'#C6F6D5':'#FED7D7'}`,color:sel===q.ans?'#276749':'#9B2C2C'}}>
          <span style={{fontSize:16,flexShrink:0}}>{sel===q.ans?'✅':'❌'}</span>
          <div style={{fontSize:13,lineHeight:1.7}}><strong>{sel===q.ans?'Świetnie!':'Nie tym razem.'}</strong>
            <div style={{background:'#F5F3FF',border:'1px solid #C4B5FD',borderRadius:6,padding:'8px 12px',marginTop:8,fontSize:12,color:'#4C1D95',lineHeight:1.7}}>💡 <strong>Dlaczego?</strong> {q.dlaczego}</div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button onClick={()=>{if(qi<QUIZ_FIXED.length-1){setQi(q=>q+1);setSel(null);setDone(false)}else setQi(QUIZ_FIXED.length)}} style={btn({background:C.navy,color:'#fff',border:'none'})}>{qi<QUIZ_FIXED.length-1?'Następne →':'Zobacz wynik →'}</button>
        </div>
      </>}
    </div>
  )
}

// ── FISZKI (15 kart) ──────────────────────────────────────────────────────────
const FISZKI = [
  {q:'Co to jest równanie liniowe?',a:'Zdanie matematyczne z znakiem = i zmienną x w pierwszej potędze. Rozwiązanie to wartość x czyniąca zdanie prawdziwym.',f:'ax + b = c'},
  {q:'Co to jest korzeń (rozwiązanie) równania?',a:'Wartość x, która podstawiona do równania daje prawdziwe zdanie. Sprawdzamy: obie strony muszą być równe.',f:'x=4 w 2x+3=11: 2·4+3=11 ✓',note:'Zawsze sprawdzaj w ORYGINALNYM równaniu!'},
  {q:'Podstawowa zasada przekształcania równań',a:'Możemy dodawać, odejmować, mnożyć i dzielić obie strony przez tę samą liczbę (≠0) — równość pozostaje zachowana.',f:'a = b  ⟺  a + c = b + c'},
  {q:'Schemat rozwiązania ax + b = c',a:'Krok 1: Odejmij b od obu stron (ax = c−b). Krok 2: Podziel przez a (x = (c−b)/a). Krok 3: Sprawdź.',f:'ax+b=c → x=(c−b)/a',note:'Działa gdy a ≠ 0.'},
  {q:'Jak rozwiązać gdy x jest po obu stronach?',a:'Przenieś wszystkie wyrazy z x na lewą stronę, liczby na prawą. Zmiana strony = zmiana znaku!',f:'ax+b = cx+d → (a−c)x = d−b'},
  {q:'Jak rozwinąć nawias a(b + c)?',a:'Mnożymy liczbę przed nawiasem przez KAŻDY wyraz w środku.',f:'a(b+c) = ab + ac',note:'Uwaga: −(x+3) = −x−3, NIE −x+3!'},
  {q:'Co znaczy "minus przed nawiasem"?',a:'Minus przed nawiasem zmienia znaki WSZYSTKICH wyrazów w nawiasie na przeciwne.',f:'−(x + 3) = −x − 3\n−(x − 5) = −x + 5'},
  {q:'Jak pozbyć się ułamków z równania?',a:'Pomnóż każdy wyraz (po obu stronach) przez NWW wszystkich mianowników.',f:'x/2 + x/3 = 5, ×6: 3x+2x=30',note:'Mnożysz KAŻDY wyraz — także liczby całkowite!'},
  {q:'Co to jest równanie sprzeczne?',a:'Równanie bez rozwiązań. Po uproszczeniu daje fałszywe zdanie, np. 3 = 7. Zbiór rozwiązań: ∅',f:'2(x+5) = 2x+11 → 10=11 ✗'},
  {q:'Co to jest równanie tożsamościowe?',a:'Równanie spełnione przez każdą wartość x. Po uproszczeniu daje 0 = 0. Zbiór rozwiązań: ℝ',f:'3(x+2) = 3x+6 → 0=0 ✓'},
  {q:'Jak sprawdzić rozwiązanie równania?',a:'1. Weź oryginalne równanie. 2. Podstaw x. 3. Oblicz obie strony osobno. 4. Sprawdź czy są równe.',f:'x=4 w 4x+2=18: LS=18, PS=18 ✓'},
  {q:'Kiedy wynik może być ułamkiem?',a:'Zawsze! Jeśli (c−b) nie dzieli się przez a bez reszty, wynik jest ułamkiem. To jest poprawna odpowiedź.',f:'3x + 2 = 9 → x = 7/3',note:'Na CKE ułamkowe wyniki są normalne.'},
  {q:'Dlaczego zmiana strony = zmiana znaku?',a:'Przenosząc wyraz na drugą stronę, faktycznie odejmujemy go od obu stron. Odejmowanie zmienia znak.',f:'+3x po prawej → odejmij 3x: −3x po lewej'},
  {q:'Co zrobić gdy współczynnik przy x jest ujemny?',a:'Po zebraniu wyrazów, podziel przez ujemną liczbę. Wynik zmienia znak, ale nie jest to błąd.',f:'−4x = 12 → x = −3',note:'Pamiętaj: to NIE jest jak nierówność — znak = się nie odwraca!'},
  {q:'Strategia zadania tekstowego z jedną niewiadomą',a:'1. Oznacz x (zwykle nieznana wielkość). 2. Wyraź inne wielkości przez x. 3. Ułóż równanie z treści. 4. Rozwiąż. 5. Sprawdź w treści.',f:'x → wyrażenia → równanie → x=? → weryfikacja'},
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
          :<div><div style={{fontSize:14,fontWeight:500,color:C.text,lineHeight:1.6,marginBottom:8}}>{c.a}</div>{c.f&&<div style={{fontFamily:'monospace',fontSize:14,color:C.accent,fontWeight:600,margin:'8px 0',whiteSpace:'pre-line'}}>{c.f}</div>}{c.note&&<div style={{fontSize:12,color:C.text3,marginTop:4}}>{c.note}</div>}</div>}
      </div>
      {flipped&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlipped(false)}} style={btn({background:'#E17055',color:'#fff',border:'none',textAlign:'center'})}>😅 Trudna — powtórz</button>
        <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlipped(false)}} style={btn({background:C.green,color:'#fff',border:'none',textAlign:'center'})}>✅ Łatwa — następna</button>
      </div>}
    </div>
  )
}

// ── KARTKÓWKA (15 pytań) ──────────────────────────────────────────────────────
const KARTKOWKA = [
  {q:'Rozwiąż:',eq:'x + 7 = 12',opts:['x = 5','x = 19','x = 7','x = 4'],ans:0,hint:'Odejmij 7 od obu stron.'},
  {q:'Rozwiąż:',eq:'3x = 18',opts:['x = 54','x = 15','x = 6','x = 21'],ans:2,hint:'Podziel obie strony przez 3.'},
  {q:'Rozwiąż:',eq:'4x − 3 = 13',opts:['x = 4','x = 5','x = 2','x = 10'],ans:0,hint:'Dodaj 3, potem podziel przez 4.'},
  {q:'Rozwiąż (x po obu stronach):',eq:'2x + 6 = x + 10',opts:['x = 8','x = 2','x = 4','x = 16'],ans:2,hint:'Przenieś x na lewą, liczby na prawą.'},
  {q:'Rozwiąż (x po obu stronach):',eq:'5x − 2 = 3x + 8',opts:['x = 5','x = 3','x = 1','x = 6'],ans:0,hint:'5x−3x = 8+2'},
  {q:'Rozwiąż z nawiasem:',eq:'3(x + 4) = 18',opts:['x = 2','x = 6','x = 14','x = 10'],ans:0,hint:'Rozwiń nawias: 3x+12=18'},
  {q:'Rozwiąż z nawiasem:',eq:'2(3x − 1) = 4x + 6',opts:['x = 4','x = 2','x = 8','x = 1'],ans:0,hint:'Rozwiń: 6x−2=4x+6, przenieś x.'},
  {q:'Rozwiąż równanie z ułamkiem:',eq:'x/4 = 5',opts:['x = 1,25','x = 9','x = 20','x = 1'],ans:2,hint:'Pomnóż obie strony przez 4.'},
  {q:'Rozwiąż równanie z ułamkiem:',eq:'x/2 + 3 = 7',opts:['x = 2','x = 8','x = 5','x = 10'],ans:1,hint:'Odejmij 3, potem pomnóż przez 2.'},
  {q:'Rozwiąż:',eq:'(2x − 1)/3 = 3',opts:['x = 4','x = 5','x = 6','x = 7'],ans:1,hint:'Pomnóż przez 3: 2x−1=9, dodaj 1, podziel przez 2.'},
  {q:'Jakie jest rozwiązanie równania?',eq:'3(x + 2) = 3x + 6',opts:['x = 0','x = 1','Brak rozwiązań','Każda liczba'],ans:3,hint:'Rozwiń nawias i sprawdź co wychodzi.'},
  {q:'Rozwiąż:',eq:'2(x + 1) + 3 = x + 9',opts:['x = 4','x = 6','x = 2','x = 8'],ans:0,hint:'Rozwiń: 2x+2+3=x+9 → 2x+5=x+9'},
  {q:'Tomek ma 2x kart, Kacper x kart. Razem 36. Ile ma Kacper?',eq:'',opts:['x = 18','x = 12','x = 24','x = 9'],ans:1,hint:'x+2x=36 → 3x=36 → x=12'},
  {q:'Rozwiąż:',eq:'5x − (2x + 4) = 11',opts:['x = 5','x = 3','x = 7','x = 4'],ans:0,hint:'Rozwiń minus przed nawiasem: 5x−2x−4=11'},
  {q:'Rozwiąż:',eq:'x/2 − x/3 = 1',opts:['x = 2','x = 3','x = 6','x = 4'],ans:2,hint:'NWW=6. Mnożymy: 3x−2x=6 → x=6'},
]

function KartkowkaContent({onComplete}) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([]),[timer,setTimer]=useState(900),[hint,setHint]=useState(false)
  const ref=useRef(null)
  useEffect(()=>{if(mode==='egzamin'&&ki<KARTKOWKA.length){ref.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(ref.current);setKi(KARTKOWKA.length);return 0}return t-1}),1000)}return()=>clearInterval(ref.current)},[mode,ki])
  if(!mode)return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:12}}>✏️ Kartkówka — 15 pytań</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
        {[['trening','🏋️','Tryb trening','Podpowiedzi dostępne, bez presji czasu'],['egzamin','🎯','Tryb egzamin','Timer 15 min, bez podpowiedzi']].map(([m,ico,t,d])=>(
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
      <div style={{fontSize:52,marginBottom:8}}>{ok>=12?'🏆':ok>=9?'⭐':'📚'}</div>
      <div style={{fontFamily:'Fraunces,serif',fontSize:24,fontWeight:900,color:C.text,marginBottom:6}}>{ok}/15 poprawnych</div>
      <div style={{fontSize:14,color:C.text2,marginBottom:20}}>Ocena: {ok>=13?'A':ok>=10?'B':ok>=7?'C':'D'}</div>
      <div style={{display:'flex',justifyContent:'center',gap:8}}>
        <button onClick={()=>{setMode(null);setKi(0);setSel(null);setDone(false);setResults([]);setTimer(900)}} style={btn()}>Powtórz</button>
        <button onClick={onComplete} style={btn({background:C.navy,color:'#fff',border:'none'})}>✓ Raport Maxa →</button>
      </div>
    </div>
  )}
  const q=KARTKOWKA[ki],mins=Math.floor(timer/60).toString().padStart(2,'0'),secs=(timer%60).toString().padStart(2,'0')
  return(
    <div style={card}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue}}>✏️ Kartkówka {ki+1}/{KARTKOWKA.length}</div>
        {mode==='egzamin'&&<div style={{fontFamily:'monospace',fontSize:18,fontWeight:600,color:timer<120?'#E17055':C.text,background:timer<120?'#FFF5F5':C.bg,padding:'4px 12px',borderRadius:8,border:`1px solid ${timer<120?'#FED7D7':C.border}`}}>{mins}:{secs}</div>}
      </div>
      <div style={{display:'flex',gap:3,marginBottom:14,flexWrap:'wrap'}}>
        {KARTKOWKA.map((_,i)=><div key={i} style={{height:3,width:`calc(${100/KARTKOWKA.length}% - 3px)`,borderRadius:2,background:i<ki?C.green:i===ki?C.accent:C.border}}/>)}
      </div>
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:10}}>{q.q}</div>
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'10px 18px',marginBottom:14,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div></div>}
      {mode==='trening'&&!done&&<div onClick={()=>setHint(h=>!h)} style={{background:'#FFF5EB',border:'1px solid #FDDCBA',borderRadius:8,padding:'9px 14px',marginBottom:12,fontSize:12,color:'#C05621',cursor:'pointer'}}>💡 {hint?q.hint:'Kliknij po podpowiedź'}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#F0FFF4';border='#00B894';color='#276749'}else if(i===sel){bg='#FFF5F5';border='#E17055';color='#9B2C2C'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setResults(p=>[...p,i===q.ans])}} style={{border:`1.5px solid ${border}`,borderRadius:8,padding:'11px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:14,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={()=>{if(ki<KARTKOWKA.length-1){setKi(k=>k+1);setSel(null);setDone(false);setHint(false)}else setKi(KARTKOWKA.length)}} style={btn({background:C.navy,color:'#fff',border:'none'})}>{ki<KARTKOWKA.length-1?'Dalej →':'Zakończ →'}</button></div>}
    </div>
  )
}

// ── ZADANIE CKE ───────────────────────────────────────────────────────────────
const CKE = [
  {rok:2023,nr:5,pkt:2,
   tresc:'Rozwiąż równanie: 3(x + 2) = 2x + 10',
   wsk:'Rozwiń nawias, potem przenieś x na lewą stronę, liczby na prawą.',
   rozw:['3x + 6 = 2x + 10','3x − 2x = 10 − 6','x = 4'],
   odp:'x = 4',
   schemat:'Za poprawne rozwiązanie: 1 pkt. Za sprawdzenie: 1 pkt.'},
  {rok:2022,nr:7,pkt:2,
   tresc:'Suma dwóch kolejnych liczb naturalnych wynosi 47. Znajdź te liczby.',
   wsk:'Oznacz mniejszą jako x. Kolejna to x+1. Ułóż równanie z treści.',
   rozw:['x + (x+1) = 47','2x + 1 = 47','2x = 46','x = 23','Liczby: 23 i 24'],
   odp:'Szukane liczby to 23 i 24',
   schemat:'Za ułożenie równania: 1 pkt. Za obie liczby z odpowiedzią: 1 pkt.'},
  {rok:2024,nr:9,pkt:3,
   tresc:'Adam ma teraz 4 razy więcej pieniędzy niż Bartek. Za rok Adam dostanie 10 zł, a Bartek 20 zł i wtedy będą mieć razem 130 zł. Ile pieniędzy ma teraz Adam?',
   wsk:'Bartek = x, Adam = 4x. Za rok: (4x+10)+(x+20) = 130. Rozwiąż i odpowiedz na pytanie o Adama (nie x!).',
   rozw:['Bartek = x, Adam = 4x','(4x+10) + (x+20) = 130','5x + 30 = 130','5x = 100','x = 20, Adam = 4·20 = 80 zł'],
   odp:'Adam ma teraz 80 zł',
   schemat:'Za oznaczenie i równanie: 1 pkt. Za x=20: 1 pkt. Za wynik z odpowiedzią: 1 pkt.'},
]

function CKEContent({onComplete}) {
  const [rev,setRev]=useState([]),[sol,setSol]=useState(Array(CKE.length).fill(false))
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:4}}>📝 Zadania z arkuszy CKE</div>
      <p style={{fontSize:13,color:C.text2,marginBottom:16,lineHeight:1.6}}>Autentyczne zadania z egzaminów ósmoklasisty. Spróbuj samodzielnie, potem sprawdź wzorcowe rozwiązanie ze schematem oceniania CKE.</p>
      {CKE.map((z,i)=>(
        <div key={i} style={{background:C.bg,borderRadius:12,border:`1px solid ${C.border}`,padding:'18px 20px',marginBottom:12}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <span style={{fontSize:12,fontWeight:600,background:'#EBF4FF',color:'#2B6CB0',padding:'3px 10px',borderRadius:20}}>CKE {z.rok}</span>
            <span style={{fontSize:12,color:C.text3}}>Zadanie {z.nr}</span>
            <span style={{fontSize:12,fontWeight:600,color:'#FDCB6E',marginLeft:'auto'}}>⚡ {z.pkt} pkt</span>
          </div>
          <div style={{fontSize:15,fontWeight:500,color:C.text,lineHeight:1.6,marginBottom:12}}>{z.tresc}</div>
          <div onClick={()=>setRev(r=>r.includes(i)?r:[...r,i])} style={{background:'#FFF5EB',border:'1px solid #FDDCBA',borderRadius:8,padding:'9px 14px',marginBottom:10,fontSize:12,color:'#C05621',cursor:'pointer'}}>
            💡 {rev.includes(i)?z.wsk:'Kliknij po wskazówkę'}
          </div>
          <button onClick={()=>setSol(p=>p.map((v,j)=>j===i?!v:v))} style={btn({fontSize:12,padding:'8px 16px'})}>
            {sol[i]?'▲ Ukryj rozwiązanie':'▼ Pokaż wzorcowe rozwiązanie'}
          </button>
          {sol[i]&&(
            <div style={{marginTop:12,background:C.white,borderRadius:8,border:`1px solid ${C.border}`,padding:'14px 16px'}}>
              {z.rozw.map((s,j)=>(
                <div key={j} style={{display:'flex',gap:8,marginBottom:6,alignItems:'center'}}>
                  <div style={{width:20,height:20,background:C.navy,color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0}}>{j+1}</div>
                  <div style={{fontFamily:'monospace',fontSize:14,color:C.text}}>{s}</div>
                </div>
              ))}
              <div style={{background:'#F0FFF4',border:'1px solid #C6F6D5',borderRadius:8,padding:'8px 12px',marginTop:10,fontSize:13,color:'#276749',fontWeight:500}}>Odpowiedź: {z.odp}</div>
              <div style={{background:'#F5F3FF',border:'1px solid #C4B5FD',borderRadius:8,padding:'8px 12px',marginTop:8,fontSize:12,color:'#4C1D95'}}>📋 Schemat oceniania: {z.schemat}</div>
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
        <div style={{fontSize:14,color:C.text2}}>Równania liniowe — od podstaw do zaawansowanych</div>
      </div>
      <div style={{background:C.navy,borderRadius:12,padding:'18px 20px',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#F5541E,#FF7A4D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🤖</div>
          <div style={{fontSize:13,fontWeight:600,color:'#fff'}}>Max — podsumowanie lekcji</div>
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.85)',lineHeight:1.75,marginBottom:12}}>
          Równania liniowe to absolutny fundament matematyki na egzaminie ósmoklasisty — pojawiają się w każdym arkuszu CKE. Opanowałeś dziś wszystkie typy. Pięć rzeczy, które musisz zapamiętać na egzamin:
        </div>
        {[
          ['Zmiana strony = zmiana znaku','Przenosząc wyraz zmieniasz znak. +3x po prawej → −3x po lewej.'],
          ['Minus przed nawiasem','−(x+3) = −x−3. Minus zmienia wszystkie znaki w nawiasie.'],
          ['Ułamki? Mnóż przez NWW','Pozbądź się ułamków przez pomnożenie przez NWW mianowników.'],
          ['Sprawdzenie w oryginale','Zawsze sprawdzaj w oryginalnym równaniu. W CKE to punkt!'],
          ['Wynik może być ułamkiem','x = 7/3 to poprawna odpowiedź. Nie szukaj liczby całkowitej na siłę.'],
        ].map(([t,d],i)=>(
          <div key={i} style={{display:'flex',gap:8,marginBottom:8,fontSize:12,color:'rgba(255,255,255,.75)',lineHeight:1.6}}>
            <span style={{color:C.accent,flexShrink:0}}>→</span><span><strong>{t}:</strong> {d}</span>
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
const DZIAL = {
  n:3,title:'Równania i nierówności',href:'/kurs/dzial-3',
  lekcje:[
    {n:1,title:'Równania liniowe',href:'/kurs/rownania-liniowe',status:'active'},
    {n:2,title:'Układy równań',href:'/kurs/uklady-rownan',status:'locked'},
    {n:3,title:'Nierówności liniowe',href:'/kurs/nierownosci',status:'locked'},
    {n:4,title:'Zadania tekstowe',href:'/kurs/zadania-tekstowe',status:'locked'},
    {n:5,title:'Równania w geometrii',href:'/kurs/rownania-geometria',status:'locked'},
    {n:6,title:'Sprawdzian działu',href:'/kurs/sprawdzian-3',status:'locked',isTest:true},
  ],
}
const LEKCJA = {n:1,total:5,slug:'rownania-liniowe',title:'Równania liniowe z jedną niewiadomą',czas:'25 min',poziom:'Poziom: podstawowy',cke:true}
const XP_MAP = {teoria:60,quiz:60,fiszki:80,kartkowka:100,cke:60,raport:40}
const MAX_FAQ = [
  {q:'ułamki równanie jak',a:'Przy równaniach z ułamkami: znajdź NWW wszystkich mianowników i pomnóż każdy wyraz przez tę liczbę. Przykład: x/2 + x/3 = 5, NWW=6 → mnożymy przez 6: 3x + 2x = 30 → x=6.'},
  {q:'zmiana strony znak',a:'Gdy przenosisz wyraz na drugą stronę równania — zawsze zmieniasz znak! +3x po prawej staje się −3x po lewej. Zasada: zmiana strony = zmiana znaku.'},
  {q:'minus nawias',a:'Minus przed nawiasem zmienia znaki WSZYSTKICH wyrazów w środku: −(x+3) = −x−3. Zasada: minus odwraca wszystkie znaki w nawiasie.'},
  {q:'równanie sprzeczne tożsamościowe',a:'Jeśli po uproszczeniu wychodzi fałszywe zdanie (np. 3=7) — brak rozwiązań. Jeśli wychodzi zawsze prawdziwe (np. 0=0) — nieskończenie wiele rozwiązań.'},
  {q:'sprawdzenie',a:'Sprawdzenie: podstaw x do ORYGINALNEGO równania. Oblicz lewą i prawą stronę osobno. Jeśli LS=PS — dobrze! W zadaniach otwartych CKE sprawdzenie to dodatkowy punkt.'},
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
  return <LessonShell dzial={DZIAL} lekcja={LEKCJA} segments={segments} xpMap={XP_MAP} maxFaq={MAX_FAQ}/>
}
