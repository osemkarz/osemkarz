'use client'
import LessonShell from '../LessonShell'
import { useState } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA 1: Równania liniowe z jedną niewiadomą
// Wersja: redesign wizualny + poziom trudności CKE 2022-2024
// ─────────────────────────────────────────────────────────────────────────────

// ── DESIGN TOKENS — spójne z NierownosciLesson ────────────────────────────────
const C = { navy:'#0F1729',accent:'#F5541E',green:'#00B894',purple:'#6C5CE7',blue:'#185FA5',bg:'#F7F8FC',white:'#fff',border:'#E2E8F0',text:'#0F1729',text2:'#4A5568',text3:'#8896A5' }
const card = { background:C.white, borderRadius:14, border:`0.5px solid ${C.border}`, padding:24 }
const btn = (x={}) => ({ padding:'10px 22px', fontSize:13, fontWeight:500, borderRadius:8, cursor:'pointer', fontFamily:'inherit', border:`0.5px solid ${C.border}`, background:C.white, color:C.text, transition:'all .15s', ...x })

// ── MICRO COMPONENTS ──────────────────────────────────────────────────────────
// Styled subheading inside theory sections
const SH = ({children}) => (
  <div style={{fontSize:14,fontWeight:500,color:C.text,margin:'20px 0 10px',paddingBottom:8,borderBottom:`0.5px solid ${C.border}`,display:'flex',alignItems:'center',gap:8}}>
    <span style={{width:3,height:16,background:'#534AB7',borderRadius:2,display:'inline-block',flexShrink:0}}/>
    {children}
  </div>
)

// Math notation helpers — correct symbols for kids
const M = ({c}) => <span style={{fontFamily:'monospace',fontSize:'1em'}}>{c}</span>

const SecLabel = ({children,tab,total}) => (
  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:18}}>
    <span style={{width:6,height:6,borderRadius:'50%',background:'#534AB7',flexShrink:0,display:'inline-block'}}/>
    <span style={{fontSize:11,fontWeight:500,letterSpacing:'.08em',textTransform:'uppercase',color:C.text3}}>{children}</span>
    {total&&<span style={{marginLeft:'auto',fontSize:11,color:C.text3}}>Sekcja {tab} z {total}</span>}
  </div>
)

const Formula = ({title,lines,note}) => (
  <div style={{background:'#0F1729',borderRadius:14,padding:'18px 24px',textAlign:'center',margin:'18px 0'}}>
    {title&&<div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:10}}>{title}</div>}
    {lines.map((l,i)=>(
      <div key={i} style={{fontFamily:'monospace',fontSize:20,color:'#fff',lineHeight:2.1}}
        dangerouslySetInnerHTML={{__html:
          l.replace(/\[([^\]]+)\]/g,'<span style="color:#FF7A4D">$1</span>')
           .replace(/\{([^\}]+)\}/g,'<span style="color:#00B894">$1</span>')
           .replace(/\|([^\|]+)\|/g,'<span style="color:#69C3FF">$1</span>')
        }}
      />
    ))}
    {note&&<div style={{fontSize:11,color:'rgba(255,255,255,.3)',marginTop:8}}>{note}</div>}
  </div>
)

const Task = ({level,label,eq,sub}) => {
  const badges = {
    basic:  {bg:'#EAF3DE',c:'#27500A',txt:'Podstawowy'},
    med:    {bg:'#FAEEDA',c:'#633806',txt:'Średni'},
    hard:   {bg:'#FCEBEB',c:'#791F1F',txt:'Trudny'},
    cke:    {bg:'#EEEDFE',c:'#3C3489',txt:'Typ CKE'},
  }
  const b = badges[level]||badges.basic
  return (
    <div style={{margin:'20px 0'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
        {b&&<span style={{fontSize:10,fontWeight:500,padding:'3px 9px',borderRadius:20,background:b.bg,color:b.c}}>{b.txt}</span>}
        {label&&<span style={{fontSize:13,color:C.text2}}>{label}</span>}
      </div>
      <div style={{background:C.bg,borderRadius:8,padding:'14px 18px',border:`0.5px solid ${C.border}`}}>
        {sub&&<div style={{fontSize:10,fontWeight:500,letterSpacing:'.08em',textTransform:'uppercase',color:C.text3,marginBottom:6}}>{sub}</div>}
        <div style={{fontFamily:'monospace',fontSize:20,color:C.text,fontWeight:500,lineHeight:1.6}}>{eq}</div>
      </div>
    </div>
  )
}

const Steps = ({steps,answer,answerType='ok'}) => (
  <div style={{margin:'8px 0 14px'}}>
    <div style={{display:'flex',flexDirection:'column',gap:0}}>
      {steps.map(([action,result],i)=>(
        <div key={i} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:`0.5px solid ${C.border}`}}>
          <div style={{width:22,height:22,borderRadius:'50%',background:C.bg,border:`0.5px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:500,color:C.text2,flexShrink:0,marginTop:2}}>{i+1}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,color:C.text2,marginBottom:result?5:0,lineHeight:1.5}}>{action}</div>
            {result&&<div style={{fontFamily:'monospace',fontSize:14,color:C.text,background:C.bg,padding:'6px 10px',borderRadius:8,display:'inline-block'}}>{result}</div>}
          </div>
        </div>
      ))}
    </div>
    {answer&&(
      <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:8,marginTop:12,
        background:answerType==='ok'?'#EAF3DE':answerType==='none'?'#FCEBEB':'#E6F1FB',
        border:`0.5px solid ${answerType==='ok'?'#C0DD97':answerType==='none'?'#F7C1C1':'#B5D4F4'}`
      }}>
        <div style={{width:28,height:28,borderRadius:'50%',background:answerType==='ok'?'#3B6D11':answerType==='none'?'#A32D2D':'#185FA5',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:14,color:'#fff'}}>
          {answerType==='ok'?'✓':answerType==='none'?'∅':'∞'}
        </div>
        <div>
          <div style={{fontFamily:'monospace',fontSize:15,fontWeight:500,color:answerType==='ok'?'#27500A':answerType==='none'?'#791F1F':'#0C447C'}}>{answer[0]}</div>
          {answer[1]&&<div style={{fontSize:12,color:answerType==='ok'?'#3B6D11':answerType==='none'?'#A32D2D':'#185FA5',marginTop:2}}>{answer[1]}</div>}
        </div>
      </div>
    )}
  </div>
)

// ── TEORIA TABS ───────────────────────────────────────────────────────────────
const TTABS = [
  {id:'def',     label:'Definicja i rodzaje'},
  {id:'zasady',  label:'Zasady przekształcania'},
  {id:'proste',  label:'Równania ax+b=c'},
  {id:'obu',     label:'x po obu stronach'},
  {id:'nawiasy', label:'Równania z nawiasami'},
  {id:'ulamki',  label:'★ Równania z ułamkami'},
  {id:'sprzecz', label:'★ Sprzeczne i tożsamościowe'},
  {id:'bledy',   label:'Sprawdzanie — CKE'},
]

const TEORIA = {

def: <>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:16}}>
    <strong style={{color:C.text,fontWeight:500}}>Równanie liniowe</strong> to zdanie matematyczne z znakiem <strong style={{color:C.text,fontWeight:500}}>=</strong> i zmienną x w pierwszej potędze. Rozwiązanie, zwane <strong style={{color:C.text,fontWeight:500}}>korzeniem</strong>, to wartość x która czyni to zdanie prawdziwym.
  </p>
  <Formula title="Ogólna postać równania liniowego" lines={['[a]x + [b] = {c}']} note="gdzie a ≠ 0; a, b, c są liczbami rzeczywistymi" />
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
    {[
      ['Wyrażenie','2x + 3','Brak znaku =. Można obliczyć wartość, ale nie można go rozwiązać.','#EEEDFE','#3C3489','#534AB7'],
      ['Równanie','2x + 3 = 11','Jest znak =. Szukamy x. Rozwiązanie: x = 4 (bo 2 · 4+3=11).','#EAF3DE','#27500A','#3B6D11'],
    ].map(([t,f,d,bg,c,bc])=>(
      <div key={t} style={{background:bg,borderRadius:8,padding:'14px',borderLeft:`3px solid ${bc}`}}>
        <div style={{fontSize:11,fontWeight:500,color:c,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>{t}</div>
        <div style={{fontFamily:'monospace',fontSize:17,color:C.text,marginBottom:8,fontWeight:500}}>{f}</div>
        <div style={{fontSize:12,color:C.text2,lineHeight:1.55}}>{d}</div>
      </div>
    ))}
  </div>
  <SH>Ile rozwiązań może mieć równanie liniowe?</SH>
  <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:14}}>
    {[
      ['Dokładnie jedno',   'ax + b = c,  a ≠ 0',       'Typowy przypadek na egzaminie','#EAF3DE','#27500A'],
      ['Brak rozwiązań (∅)','Równanie sprzeczne',         'Po uproszczeniu: np. 5 = −2','#FCEBEB','#791F1F'],
      ['Nieskończenie wiele','Równanie tożsamościowe',    'Po uproszczeniu: np. 0 = 0','#E6F1FB','#0C447C'],
    ].map(([t,p,d,bg,c])=>(
      <div key={t} style={{display:'flex',gap:12,padding:'10px 14px',background:bg,borderRadius:8}}>
        <div style={{fontSize:13,fontWeight:500,color:c,minWidth:190,flexShrink:0}}>{t}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:'monospace',fontSize:12,color:c,marginBottom:2}}>{p}</div>
          <div style={{fontSize:12,color:C.text2}}>{d}</div>
        </div>
      </div>
    ))}
  </div>
  <div style={{background:'#E6F1FB',borderLeft:'3px solid #185FA5',borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:'#0C447C',lineHeight:1.75,margin:'14px 0'}}>
    <strong>Na egzaminie CKE</strong> zdecydowana większość zadań z równaniami ma jedno rozwiązanie. Równania sprzeczne i tożsamościowe pojawiają się rzadko — ale wystarczy jeden raz się na nie natknąć na egzaminie, by zrozumieć ich wartość.
  </div>
</>,

zasady: <div>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Rozwiązywanie równań opiera się na jednej fundamentalnej zasadzie: <strong style={{color:C.text,fontWeight:500}}>możemy wykonywać dowolne działania na obu stronach równania jednocześnie</strong> — i równość nie zostanie naruszona. Cel jest zawsze ten sam: doprowadzić do postaci <strong style={{fontFamily:'monospace',fontWeight:500}}>x = liczba</strong>.
  </p>

  <SH>Cztery dozwolone operacje</SH>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
    {[
      {op:'+c', title:'Dodawanie', eq:'x − 5 = 3', wynik:'x = 8', note:'Dodajemy 5 do obu stron', bg:'#EAF3DE', c:'#27500A'},
      {op:'−c', title:'Odejmowanie', eq:'x + 7 = 12', wynik:'x = 5', note:'Odejmujemy 7 od obu stron', bg:'#EAF3DE', c:'#27500A'},
      {op:'× c', title:'Mnożenie (c ≠ 0)', eq:'x ÷ 4 = 3', wynik:'x = 12', note:'Mnożymy przez 4', bg:'#E6F1FB', c:'#0C447C'},
      {op:'÷ c', title:'Dzielenie (c ≠ 0)', eq:'6x = 18', wynik:'x = 3', note:'Dzielimy przez 6', bg:'#E6F1FB', c:'#0C447C'},
    ].map(({op,title,eq,wynik,note,bg,c})=>(
      <div key={op} style={{background:bg,borderRadius:8,padding:'14px',border:`0.5px solid ${C.border}`}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
          <span style={{fontFamily:'monospace',fontSize:18,fontWeight:700,color:c}}>{op}</span>
          <span style={{fontSize:12,fontWeight:500,color:c}}>{title}</span>
        </div>
        <div style={{fontFamily:'monospace',fontSize:13,color:C.text,marginBottom:4}}>{eq}  →  <strong>{wynik}</strong></div>
        <div style={{fontSize:11,color:C.text3}}>{note}</div>
      </div>
    ))}
  </div>

  <div style={{background:'#FCEBEB',borderLeft:'3px solid #A32D2D',borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:'#791F1F',lineHeight:1.75,marginBottom:16}}>
    <strong>Czego NIE wolno robić:</strong><br/>
    — dzielić przez 0 (matematycznie niedozwolone)<br/>
    — wykonywać różnych działań po różnych stronach (np. dodać 3 do lewej, a 5 do prawej)<br/>
    — przy mnożeniu przez liczbę pominąć jakikolwiek wyraz równania
  </div>

  <SH>Jak wyglądają kolejne równoważne przekształcenia</SH>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:10}}>
    Dwa równania są <strong style={{color:C.text,fontWeight:500}}>równoważne</strong> gdy mają dokładnie ten sam zbiór rozwiązań. Każda dozwolona operacja tworzy nowe równanie równoważne. Dlatego możemy "prowadzić" równanie krok po kroku, aż doprowdzimy je do postaci <span style={{fontFamily:'monospace'}}>x = liczba</span>.
  </p>
  <div style={{background:C.bg,borderRadius:8,padding:'16px 20px',border:`0.5px solid ${C.border}`,marginBottom:14}}>
    {[
      ['4x + 10 = 26', null, null],
      ['4x = 16', 'odejmujemy 10 od obu stron', '−10'],
      ['x = 4  ✓', 'dzielimy obie strony przez 4', '÷4'],
    ].map(([eq, note, op], i) => (
      <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'9px 0',borderBottom:i<2?`0.5px solid ${C.border}`:'none'}}>
        <div style={{fontFamily:'monospace',fontSize:16,color:i===2?'#27500A':C.text,fontWeight:i===2?600:400,minWidth:160}}>{eq}</div>
        {note&&<div style={{fontSize:12,color:C.text3,flex:1}}>{note}</div>}
        {op&&<div style={{fontFamily:'monospace',fontSize:13,fontWeight:600,color:'#0C447C',background:'#E6F1FB',padding:'3px 8px',borderRadius:6,flexShrink:0}}>{op}</div>}
      </div>
    ))}
  </div>

  <SH>Przenoszenie wyrazów — skrótowa technika</SH>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:10}}>
    W praktyce zamiast pisać "odejmujemy x od obu stron" mówimy że <strong style={{color:C.text,fontWeight:500}}>przenosimy wyraz na drugą stronę i zmieniamy jego znak</strong>. To skrót — ale wynik jest identyczny.
  </p>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
    <div style={{background:C.bg,borderRadius:8,padding:'14px',border:`0.5px solid ${C.border}`}}>
      <div style={{fontSize:11,fontWeight:500,color:C.text3,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>Zapis pełny</div>
      <div style={{fontFamily:'monospace',fontSize:13,color:C.text,lineHeight:2.2}}>
        3x + 5 = 14<br/>
        3x + 5 − 5 = 14 − 5<br/>
        3x = 9<br/>
        3x ÷ 3 = 9 ÷ 3<br/>
        x = 3
      </div>
    </div>
    <div style={{background:C.bg,borderRadius:8,padding:'14px',border:`0.5px solid ${C.border}`}}>
      <div style={{fontSize:11,fontWeight:500,color:C.text3,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>Zapis skrótowy (używamy w praktyce)</div>
      <div style={{fontFamily:'monospace',fontSize:13,color:C.text,lineHeight:2.2}}>
        3x + 5 = 14<br/>
        3x = 14 − 5<br/>
        3x = 9<br/>
        x = 3
      </div>
    </div>
  </div>
  <div style={{background:'#FAEEDA',borderLeft:'3px solid #854F0B',borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:'#633806',lineHeight:1.75,marginBottom:14}}>
    <strong>Zmiana strony = zmiana znaku:</strong> +5 po lewej → −5 po prawej · −7 po prawej → +7 po lewej · +3x po prawej → −3x po lewej.
  </div>

  <SH>Co warto zapamiętać — ściągawka</SH>
  <div style={{display:'flex',flexDirection:'column',gap:6}}>
    {[
      ['Cel każdego kroku', 'Wyizolować x — doprowadzić do x = liczba', '#EEEDFE', '#3C3489'],
      ['Operacja musi być symetryczna', 'Robisz to SAMO po OBUEQUATIONS stronach', '#EAF3DE', '#27500A'],
      ['Zmiana strony', 'Przenosząc wyraz na drugą stronę — zmieniasz jego znak', '#FAEEDA', '#633806'],
      ['Dzielenie przez ujemną', 'Dozwolone — wynik zmienia znak, ale to nie jest nierówność!', '#E6F1FB', '#0C447C'],
      ['Sprawdzenie', 'Zawsze podstaw wynik do ORYGINALNEGO równania i zweryfikuj', '#F5F3FF', '#4C1D95'],
    ].map(([zasada, opis, bg, c]) => (
      <div key={zasada} style={{display:'flex',gap:12,padding:'10px 14px',background:bg,borderRadius:8,alignItems:'flex-start'}}>
        <div style={{fontSize:13,fontWeight:500,color:c,minWidth:210,flexShrink:0}}>{zasada}</div>
        <div style={{fontSize:13,color:C.text2,lineHeight:1.5}}>{opis}</div>
      </div>
    ))}
  </div>
</div>,

proste: <>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Równanie <strong style={{color:C.text,fontWeight:500}}>ax + b = c</strong> rozwiązujemy w dwóch krokach: przenosimy stałą na prawą stronę, dzielimy przez współczynnik.
  </p>
  <Formula lines={['[a]x + [b] = {c}  →  [a]x = {c} − [b]  →  x = ({c} − [b]) ÷ [a]']} />

  <Task level="basic" label="Klasyczny typ" eq="5x − 8 = 17" />
  <Steps steps={[
    ['Dodajemy 8 do obu stron:','5x = 25'],
    ['Dzielimy obie strony przez 5:','x = 5'],
  ]} answer={['x = 5','Sprawdzenie: 5 · 5 − 8 = 17 ✓']} />

  <Task level="med" label="Wynik ułamkowy — częsty na CKE" eq="4x + 5 = 14" />
  <Steps steps={[
    ['Odejmujemy 5:','4x = 9'],
    ['Dzielimy przez 4:','x = 9/4 = 2,25'],
  ]} answer={['x = 9/4','Sprawdzenie: 4 · (9/4)+5 = 9+5 = 14 ✓']} />

  <Task level="hard" label="Ujemny współczynnik i obie strony ujemne" eq="−3x + 7 = −2" />
  <Steps steps={[
    ['Odejmujemy 7 od obu stron:','−3x = −9'],
    ['Dzielimy przez −3 (ujemna — tylko zmiana znaku wyniku, nie równanie nierówności!):','x = 3'],
  ]} answer={['x = 3','Sprawdzenie: −3 · 3+7 = −9+7 = −2 ✓']} />

  <Task level="cke" label="Zadanie z przekształcaniem wzoru — CKE 2024, Zadanie 6" eq="y = 5x · w,  wyznacz x" sub="Zadanie otwarte — przekształcanie wzoru" />
  <Steps steps={[
    ['Dzielimy obie strony przez 5w (zakładamy w ≠ 0):','y / (5w) = x'],
    ['Zapisujemy wynik:','x = y / (5w)'],
  ]} answer={['x = y/(5w)','Kluczowe: dzielimy przez całe wyrażenie 5w, nie tylko przez 5!']} />

  <div style={{background:'#FAEEDA',borderLeft:'3px solid #854F0B',borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:'#633806',lineHeight:1.75,margin:'14px 0'}}>
    <strong>Ważne dla CKE:</strong> Gdy wynik wychodzi ułamkiem, zapisz go jako ułamek zwykły lub dziesiętny — oba są akceptowane przez egzaminatorów. Nie szukaj wyniku całkowitego "na siłę".
  </div>
</>,

obu: <>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Gdy x pojawia się po <strong style={{color:C.text,fontWeight:500}}>obu stronach</strong> równania — przenosimy wszystkie wyrazy z x na lewą stronę, liczby na prawą.
  </p>
  <div style={{background:'#FCEBEB',borderLeft:'3px solid #A32D2D',borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:'#791F1F',lineHeight:1.75,margin:'14px 0'}}>
    <strong>Przenosząc wyraz na drugą stronę — zawsze zmieniamy jego znak.</strong><br/>
    +5x po prawej → −5x po lewej<br/>
    −3 po lewej → +3 po prawej<br/>
    To najczęstszy błąd na egzaminie ósmoklasisty.
  </div>

  <Task level="med" label="Standardowy typ — przenoszenie obu stron" eq="5x − 3 = 2x + 9" />
  <Steps steps={[
    ['Przenosimy 2x na lewą (odejmujemy 2x od obu stron):','3x − 3 = 9'],
    ['Dodajemy 3 do obu stron:','3x = 12'],
    ['Dzielimy przez 3:','x = 4'],
  ]} answer={['x = 4','Sprawdzenie: 5 · 4−3=17 i 2 · 4+9=17 ✓']} />

  <Task level="hard" label="Ujemne współczynniki po obu stronach" eq="2 − 3x = 5 − 7x" />
  <Steps steps={[
    ['Dodajemy 7x do obu stron (przenosimy −7x na lewą):','2 + 4x = 5'],
    ['Odejmujemy 2:','4x = 3'],
    ['Dzielimy przez 4:','x = 3/4'],
  ]} answer={['x = 3/4','Sprawdzenie: 2−3 · (3/4)=2−9/4=−1/4 i 5−7 · (3/4)=5−21/4=−1/4 ✓']} />

  <Task level="cke" label="Typ z egzaminu CKE — weryfikacja transformacji" eq="Które przekształcenie równania  5x − 3 = 2  jest BŁĘDNE?" sub="Zadanie zamknięte — rozpoznawanie błędu" />
  <div style={{display:'flex',flexDirection:'column',gap:8,margin:'12px 0 14px'}}>
    {[
      ['A.','5x = 2 + 3','Poprawne — dodano 3 do obu stron'],
      ['B.','5x = 5','Poprawne — 2+3=5'],
      ['C.','x = 5/5 = 1','Poprawne — wynik'],
      ['D.','5x − 5 = 0','BŁĘDNE — odjęto 5 tylko od lewej strony!'],
    ].map(([l,eq,d],i)=>(
      <div key={l} style={{display:'flex',gap:10,padding:'10px 14px',borderRadius:8,background:i===3?'#FCEBEB':C.bg,border:`0.5px solid ${i===3?'#F7C1C1':C.border}`}}>
        <span style={{fontWeight:500,color:i===3?'#A32D2D':C.text2,flexShrink:0}}>{l}</span>
        <span style={{fontFamily:'monospace',color:i===3?'#791F1F':C.text,flex:1}}>{eq}</span>
        <span style={{fontSize:12,color:i===3?'#A32D2D':C.text3}}>{d}</span>
      </div>
    ))}
  </div>
  <div style={{background:'#EAF3DE',borderLeft:'3px solid #3B6D11',borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:'#27500A',lineHeight:1.75,margin:'14px 0'}}>
    <strong>Wskazówka do CKE:</strong> W zadaniach zamkniętych dotyczących przekształceń równań sprawdź każdą opcję podstawiając do oryginalnego równania — nie polegaj tylko na "wyglądzie" wzoru.
  </div>
</>,

nawiasy: <>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Gdy w równaniu jest nawias — <strong style={{color:C.text,fontWeight:500}}>najpierw go rozwijamy</strong>, potem rozwiązujemy. To obowiązkowy krok, który nie podlega negocjacjom.
  </p>
  <Formula title="Rozdzielność mnożenia" lines={['[a]([b]x + [c]) = [a]·[b]x + [a]·[c]']} note="Mnożysz liczbę przez KAŻDY wyraz w nawiasie" />
  <div style={{background:'#FCEBEB',borderLeft:'3px solid #A32D2D',borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:'#791F1F',lineHeight:1.75,margin:'14px 0'}}>
    <strong>Najczęstszy błąd uczniów:</strong> 3(x − 4) = 3x − 4.<br/>
    Poprawnie: 3(x − 4) = 3x − <strong>12</strong>.<br/>
    Mnożysz przez każdy wyraz — tu przez x i przez −4.
  </div>

  <Task level="basic" label="Jeden nawias" eq="3(2x − 5) = x + 10" />
  <Steps steps={[
    ['Rozwijamy nawias (3 · 2x=6x, 3 · (−5)=−15):','6x − 15 = x + 10'],
    ['Przenosimy x na lewą: 6x−x=10+15','5x = 25'],
    ['Dzielimy przez 5:','x = 5'],
  ]} answer={['x = 5','Sprawdzenie: 3 · (10−5)=15 i 5+10=15 ✓']} />

  <Task level="med" label="Minus przed nawiasem — zmienia wszystkie znaki" eq="4x − (2x + 7) = 3(x − 4)" />
  <Steps steps={[
    ['Rozwijamy (minus odwraca znaki całego nawiasu!):','4x − 2x − 7 = 3x − 12'],
    ['Upraszczamy lewą stronę:','2x − 7 = 3x − 12'],
    ['Przenosimy: 2x−3x=−12+7','−x = −5'],
    ['Mnożymy przez −1:','x = 5'],
  ]} answer={['x = 5','Sprawdzenie: 20−(10+7)=3 i 3 · (5−4)=3 ✓']} />

  <Task level="hard" label="Trzy nawiasy z różnymi współczynnikami" eq="2(3x − 1) − 3(x + 4) = x − 17" />
  <Steps steps={[
    ['Rozwijamy oba nawiasy (uważaj na −3 przed drugim):','6x − 2 − 3x − 12 = x − 17'],
    ['Zbieramy wyrazy po lewej:','3x − 14 = x − 17'],
    ['Przenosimy: 3x−x=−17+14','2x = −3'],
    ['Dzielimy przez 2:','x = −3/2 = −1,5'],
  ]} answer={['x = −3/2','Sprawdzenie: 2 · (3 · (−1,5)−1)−3 · (−1,5+4) = 2 · (−5,5)−3 · 2,5 = −11−7,5 = −18,5 i −1,5−17=−18,5 ✓']} />

  <Task level="cke" label="Typ zadania otwartego CKE — równanie z nawiasami" eq="5(x + 3) − 2(3x − 1) = 3(2 − x) + 4" sub="Zadanie otwarte — 2 punkty" />
  <Steps steps={[
    ['Rozwijamy wszystkie nawiasy:','5x + 15 − 6x + 2 = 6 − 3x + 4'],
    ['Zbieramy wyrazy podobne po obu stronach:','−x + 17 = 10 − 3x'],
    ['Przenosimy: −x+3x=10−17','2x = −7'],
    ['Dzielimy przez 2:','x = −7/2 = −3,5'],
  ]} answer={['x = −3,5','Sprawdzenie: 5 · (−0,5)−2 · (−11,5)=−2,5+23=20,5 i 3 · (5,5)+4=20,5 ✓']} />

  <div style={{background:'#EAF3DE',borderLeft:'3px solid #3B6D11',borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:'#27500A',lineHeight:1.75,margin:'14px 0'}}>
    <strong>Strategia przy wielu nawiasach:</strong> Rozwiń wszystkie nawiasy w jednym kroku, potem zbierz wyrazy podobne po każdej stronie osobno, a na końcu przenoś między stronami. Nie mieszaj tych etapów.
  </div>
</>,

ulamki: <>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Ułamki w równaniu wyglądają groźnie, ale mają prostą strategię: <strong style={{color:C.text,fontWeight:500}}>mnożymy każdy wyraz przez NWW mianowników</strong>. Ułamki znikają i wracamy do znajomego typu.
  </p>
  <div style={{background:C.bg,borderRadius:8,padding:'14px 16px',marginBottom:16,border:`0.5px solid ${C.border}`}}>
    <div style={{fontSize:12,fontWeight:500,color:C.text2,marginBottom:10}}>Strategia w 3 krokach:</div>
    {[
      ['1','Znajdź NWW wszystkich mianowników w równaniu'],
      ['2','Pomnóż KAŻDY wyraz (po obu stronach) przez NWW — ułamki znikają'],
      ['3','Rozwiąż powstałe równanie bez ułamków'],
    ].map(([n,t])=>(
      <div key={n} style={{display:'flex',gap:10,marginBottom:8,alignItems:'flex-start'}}>
        <div style={{width:22,height:22,borderRadius:'50%',background:'#185FA5',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:500,flexShrink:0}}>{n}</div>
        <div style={{fontSize:13,color:C.text2,lineHeight:1.5}}>{t}</div>
      </div>
    ))}
  </div>

  <Task level="basic" label="Jeden mianownik" eq="x/3 + 2 = 5" sub="Mianowniki: 3. NWW = 3." />
  <Steps steps={[
    ['Mnożymy każdy wyraz przez 3 (w tym 2 i 5!):','x + 6 = 15'],
    ['Odejmujemy 6:','x = 9'],
  ]} answer={['x = 9','Sprawdzenie: 9÷3+2=3+2=5 ✓']} />

  <Task level="med" label="Dwa różne mianowniki" eq="x/2 − x/5 = 3" sub="Mianowniki: 2 i 5. NWW = 10." />
  <Steps steps={[
    ['Mnożymy każdy wyraz przez 10:','5x − 2x = 30'],
    ['Upraszczamy i dzielimy przez 3:','x = 10'],
  ]} answer={['x = 10','Sprawdzenie: 10÷2 − 10÷5 = 5 − 2 = 3 ✓']} />

  <Task level="hard" label="Wyrażenia w liczniku — typ CKE" eq="(2x + 1)/3 − (x − 2)/4 = 2" sub="Mianowniki: 3 i 4. NWW = 12." />
  <Steps steps={[
    ['Mnożymy każdy wyraz przez 12:','4(2x+1) − 3(x−2) = 24'],
    ['Rozwijamy nawiasy:','8x + 4 − 3x + 6 = 24'],
    ['Zbieramy wyrazy: 5x + 10 = 24, odejmujemy 10:','5x = 14'],
    ['Dzielimy przez 5:','x = 14/5 = 2,8'],
  ]} answer={['x = 14/5','Sprawdzenie: (2 · 2,8+1)/3−(2,8−2)/4 = 6,6/3−0,8/4 = 2,2−0,2=2 ✓']} />

  <div style={{background:'#FCEBEB',borderLeft:'3px solid #A32D2D',borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:'#791F1F',lineHeight:1.75,margin:'14px 0'}}>
    <strong>Pułapka:</strong> Mnożąc przez NWW musisz pomnożyć KAŻDY wyraz — też liczby całkowite!<br/>
    Przykład: <span style={{fontFamily:'monospace'}}>x/3 + 2 = 5</span>, ×3:<br/>
    <span style={{color:'#A32D2D',fontFamily:'monospace'}}>x + 2 = 15 ✗</span> (nie pomnożono 2)<br/>
    <span style={{color:'#27500A',fontFamily:'monospace'}}>x + 6 = 15 ✓</span> (pomnożono każdy wyraz)
  </div>
</>,

sprzecz: <>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Nie każde równanie ma rozwiązanie. Po przekształceniach możemy dojść do zdania zawsze fałszywego lub zawsze prawdziwego — niezależnie od wartości x.
  </p>

  <SH>Typ 1: Równanie sprzeczne — brak rozwiązań</SH>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:12}}>
    Równanie sprzeczne po uproszczeniu daje fałszywe zdanie (np. <span style={{fontFamily:'monospace'}}>3 = 7</span>). Nie ma żadnego rozwiązania.
  </p>

  <Task level="hard" label="Rozpoznaj typ równania" eq="3(2x + 1) − 2(3x − 4) = 15" />
  <Steps steps={[
    ['Rozwijamy nawiasy:','6x + 3 − 6x + 8 = 15'],
    ['Zbieramy wyrazy (6x i −6x znoszą się!):','11 = 15'],
  ]} answer={['Brak rozwiązań — równanie sprzeczne','11 ≠ 15. Zbiór rozwiązań: ∅']} answerType="none" />

  <SH>Typ 2: Równanie tożsamościowe — nieskończenie wiele rozwiązań</SH>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:12}}>
    Równanie tożsamościowe jest prawdziwe dla każdej wartości x. Po uproszczeniu daje zdanie zawsze prawdziwe (np. <span style={{fontFamily:'monospace'}}>0 = 0</span>).
  </p>

  <Task level="hard" label="Rozpoznaj typ równania" eq="4(x + 2) − 2(2x − 1) = 10" />
  <Steps steps={[
    ['Rozwijamy nawiasy:','4x + 8 − 4x + 2 = 10'],
    ['Zbieramy wyrazy (4x i −4x znoszą się!):','10 = 10'],
  ]} answer={['Nieskończenie wiele rozwiązań — równanie tożsamościowe','0=0. Każda liczba rzeczywista jest rozwiązaniem. Zbiór: ℝ']} answerType="inf" />

  <SH>Jak rozpoznać — tabela</SH>
  <div style={{background:C.bg,borderRadius:8,padding:'16px',border:`0.5px solid ${C.border}`}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
      {[
        ['Wynik','Typ','Rozwiązania'],
        ['x = konkretna liczba','Normalne','Jedno rozwiązanie'],
        ['a = b (a≠b)','Sprzeczne','Brak (∅)'],
        ['0 = 0  lub  a = a','Tożsamościowe','Wszystkie (ℝ)'],
      ].map((row,i)=>row.map((cell,j)=>(
        <div key={`${i}${j}`} style={{padding:'8px 10px',borderRadius:8,fontSize:12,fontFamily:i>0&&j===0?'monospace':'inherit',
          background:i===0?'#0F1729':C.white,
          color:i===0?'rgba(255,255,255,.6)':j===0?C.text2:j===1?C.text:C.text2,
          fontWeight:i===0?500:400,
          border:i>0?`0.5px solid ${C.border}`:'none',
        }}>{cell}</div>
      )))}
    </div>
  </div>
</>,

bledy: <>
  <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
    Sprawdzenie rozwiązania w zadaniach otwartych CKE jest <strong style={{color:C.text,fontWeight:500}}>obowiązkowe i punktowane</strong>. Pominięcie = utrata punktu za "weryfikację".
  </p>

  <div style={{background:'#0F1729',borderRadius:14,padding:'18px 20px',marginBottom:16}}>
    <div style={{fontSize:12,fontWeight:500,color:'rgba(255,255,255,.6)',marginBottom:14}}>Wzorcowy zapis sprawdzenia (tak pisze się w arkuszu CKE):</div>
    {[
      ['Napisz oryginalne równanie','4x + 5(x−64) = 400'],
      ['Podstaw znalezione x','x=80: 4 · 80 + 5 · (80−64) = ?'],
      ['Oblicz lewą stronę','320 + 5 · 16 = 320 + 80 = 400'],
      ['Porównaj z prawą','400 = 400 ✓ → x = 80 jest rozwiązaniem'],
    ].map(([s,eq],i)=>(
      <div key={i} style={{display:'flex',gap:12,marginBottom:8,alignItems:'flex-start'}}>
        <div style={{width:20,height:20,borderRadius:'50%',background:'rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:500,color:'rgba(255,255,255,.6)',flexShrink:0,marginTop:1}}>{i+1}</div>
        <div>
          <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:2}}>{s}</div>
          <div style={{fontFamily:'monospace',fontSize:13,color:'#FF7A4D'}}>{eq}</div>
        </div>
      </div>
    ))}
  </div>

  <SH>Kompletna lista błędów — co widzi egzaminator</SH>
  {[
    {b:'Błąd znaku przy przenoszeniu',w:'3x + 2 = x + 10  →  3x + x = 10 + 2 ✗',ok:'3x − x = 10 − 2  →  2x = 8 ✓'},
    {b:'Błąd przy rozwijaniu nawiasu',w:'3(x − 4) = 3x − 4 ✗',ok:'3(x − 4) = 3x − 12 ✓'},
    {b:'Minus przed nawiasem',w:'−(2x + 3) = −2x + 3 ✗',ok:'−(2x + 3) = −2x − 3 ✓'},
    {b:'Dzielenie tylko jednej strony',w:'4x = 20  →  4x ÷ 4 = 20 ✗ (nie podzielono prawej)',ok:'4x ÷ 4 = 20 ÷ 4  →  x = 5 ✓'},
    {b:'Przy ułamkach — pominięcie mnożenia wyrazów całkowitych',w:'x/3 + 2 = 5, ×3: x + 2 = 15 ✗',ok:'x/3 + 2 = 5, ×3: x + 6 = 15 ✓'},
    {b:'Pominięcie sprawdzenia',w:'Brak weryfikacji = brak punktu za uzasadnienie',ok:'Zawsze dopisz sprawdzenie w ORYGINALNYM równaniu'},
  ].map(({b,w,ok})=>(
    <div key={b} style={{background:C.bg,borderRadius:8,padding:'12px 14px',marginBottom:8,borderLeft:'3px solid #A32D2D',border:`0.5px solid ${C.border}`,borderLeftWidth:3}}>
      <div style={{fontSize:12,fontWeight:500,color:C.text,marginBottom:6}}>{b}</div>
      <div style={{fontFamily:'monospace',fontSize:12,color:'#A32D2D',marginBottom:5}}>{w}</div>
      <div style={{fontFamily:'monospace',fontSize:12,color:'#27500A'}}>✓ {ok}</div>
    </div>
  ))}
  <div style={{background:'#EAF3DE',borderLeft:'3px solid #3B6D11',borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:'#27500A',lineHeight:1.75,margin:'14px 0'}}>
    <strong>Złota zasada CKE:</strong> W zadaniach otwartych zapisuj każdy krok — egzaminatorzy przyznają punkty za tok rozwiązania, nawet przy błędzie rachunkowym w ostatnim kroku. Nie pisz tylko wyniku!
  </div>
</>,

}

function TeoriaContent({onComplete}) {
  const [tab,setTab] = useState('def')
  const idx = TTABS.findIndex(t=>t.id===tab)
  return (
    <div style={card}>
      <SecLabel tab={idx+1} total={TTABS.length}>Teoria</SecLabel>
      <div style={{display:'flex',gap:5,marginBottom:18,flexWrap:'wrap',paddingBottom:16,borderBottom:`0.5px solid ${C.border}`}}>
        {TTABS.map((t,i)=>{
          const isDone = i < idx
          const isActive = t.id === tab
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              padding:'5px 12px', fontSize:11, fontWeight:500, borderRadius:20, cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
              border:`0.5px solid ${isActive?'#0F1729':isDone?'#C0DD97':C.border}`,
              background:isActive?'#0F1729':isDone?'#EAF3DE':C.white,
              color:isActive?'#fff':isDone?'#27500A':C.text2,
            }}>{t.label}</button>
          )
        })}
      </div>
      {TEORIA[tab]}
      <div style={{display:'flex',justifyContent:'space-between',marginTop:22,gap:8,paddingTop:16,borderTop:`0.5px solid ${C.border}`}}>
        {idx>0
          ? <button onClick={()=>setTab(TTABS[idx-1].id)} style={btn()}>← {TTABS[idx-1].label}</button>
          : <div/>}
        {idx<TTABS.length-1
          ? <button onClick={()=>setTab(TTABS[idx+1].id)} style={btn({background:'#0F1729',color:'#fff',border:'none'})}>{TTABS[idx+1].label} →</button>
          : <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Ukończyłem teorię →</button>}
      </div>
    </div>
  )
}

// ── QUIZ (8 pytań, poziom CKE) ─────────────────────────────────────────────────
const QUIZ = [
  {q:'Rozwiąż równanie:',eq:'3(2x − 5) = x + 10',opts:['x = 5','x = 7','x = 3','x = 4'],ans:0,why:'Rozwijamy: 6x−15=x+10. Przenosimy: 5x=25. Dzielimy: x=5. Sprawdzenie: 3 · (10−5)=15 i 5+10=15 ✓'},
  {q:'Rozwiąż równanie (uwaga na znaki!):',eq:'2 − 3x = 5 − 7x',opts:['x = 3/4','x = −3/4','x = 4/3','x = 1'],ans:0,why:'Przenosimy: −3x+7x=5−2 → 4x=3 → x=3/4. Sprawdzenie: 2−9/4=−1/4 i 5−21/4=−1/4 ✓'},
  {q:'Rozwiąż równanie z ułamkami:',eq:'(2x + 1)/3 − (x − 2)/4 = 2',opts:['x = 14/5','x = 2','x = 3','x = 5/14'],ans:0,why:'NWW=12. Mnożymy: 4(2x+1)−3(x−2)=24 → 8x+4−3x+6=24 → 5x=14 → x=14/5.'},
  {q:'Co wychodzi po uproszczeniu?',eq:'3(2x + 1) − 2(3x − 4) = 15',opts:['x = 2','x = 0','Brak rozwiązań','Nieskończenie wiele'],ans:2,why:'Rozwijamy: 6x+3−6x+8=15 → 11=15. To zawsze fałsz — równanie sprzeczne, brak rozwiązań.'},
  {q:'Rozwiąż równanie (dwa nawiasy):',eq:'5(x + 3) − 2(3x − 1) = 3(2 − x) + 4',opts:['x = −3,5','x = 3,5','x = −7','x = 7'],ans:0,why:'Rozwijamy: 5x+15−6x+2=6−3x+4 → −x+17=10−3x → 2x=−7 → x=−3,5.'},
  {q:'4 bilety do teatru i 5 do kina kosztują 400 zł. Bilet do kina jest o 64 zł tańszy niż do teatru. Ile kosztuje bilet do teatru? (Zadanie CKE 2023)',eq:'',opts:['80 zł','72 zł','96 zł','64 zł'],ans:0,why:'Teatr=x, kino=x−64. Równanie: 4x+5(x−64)=400 → 9x−320=400 → 9x=720 → x=80 zł.'},
  {q:'Które z przekształceń równania  5x − 3 = 2  jest błędne?',eq:'',opts:['5x = 5','x = 1','5x − 5 = 0','5x = 2 + 3'],ans:2,why:'5x−5=0 to błąd — odjęto 5 tylko od lewej strony. Poprawnie: 5x−3=2 → 5x=5 lub 5x−5=0 tylko gdybyśmy odjęli 5 od OBUEQUATIONS stron.'},
  {q:'Suma dwóch kolejnych liczb parzystych wynosi 74. Jaka jest większa z tych liczb?',eq:'',opts:['38','36','40','34'],ans:0,why:'Mniejsza=x (parzysta), większa=x+2. Równanie: x+(x+2)=74 → 2x+2=74 → x=36. Większa: 36+2=38.'},
]

function QuizContent({onComplete}) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([])
  if(qi>=QUIZ.length){
    const ok=results.filter(r=>r).length
    return(
      <div style={card}>
        <div style={{textAlign:'center',padding:'16px 0 24px'}}>
          <div style={{fontSize:52,marginBottom:8}}>{ok>=6?'🎯':ok>=4?'👍':'📚'}</div>
          <div style={{fontSize:24,fontWeight:500,color:C.text,marginBottom:6}}>{ok}/{QUIZ.length} poprawnych</div>
          <div style={{fontSize:14,color:C.text2}}>{ok>=6?'Doskonale! Czas na fiszki.':ok>=4?'Dobry wynik. Powtórz słabsze sekcje.':'Wróć do teorii i spróbuj ponownie.'}</div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
          <button onClick={()=>{setQi(0);setSel(null);setDone(false);setResults([])}} style={btn()}>Powtórz quiz</button>
          <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Dalej — Fiszki →</button>
        </div>
      </div>
    )
  }
  const q=QUIZ[qi]
  return(
    <div style={card}>
      <SecLabel tab={qi+1} total={QUIZ.length}>Quiz</SecLabel>
      <div style={{display:'flex',gap:4,marginBottom:18}}>
        {QUIZ.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i<qi?'#00B894':i===qi?'#F5541E':C.border,transition:'background .3s'}}/>)}
      </div>
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:12,lineHeight:1.5}}>{q.q}</div>
      {q.eq&&<div style={{background:'#0F1729',borderRadius:8,padding:'12px 18px',marginBottom:16,display:'inline-block'}}>
        <div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div>
      </div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
        {q.opts.map((o,i)=>{
          let bg=C.white,border=C.border,color=C.text
          if(done){
            if(i===q.ans){bg='#EAF3DE';border='#3B6D11';color='#27500A'}
            else if(i===sel){bg='#FCEBEB';border='#A32D2D';color='#791F1F'}
          }
          return(
            <div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setResults(p=>[...p,i===q.ans])}}
              style={{border:`0.5px solid ${border}`,borderRadius:8,padding:'12px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:14,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>
              {o}
            </div>
          )
        })}
      </div>
      {done&&<>
        <div style={{padding:'12px 16px',borderRadius:8,marginBottom:12,display:'flex',gap:12,alignItems:'flex-start',background:sel===q.ans?'#EAF3DE':'#FCEBEB',border:`0.5px solid ${sel===q.ans?'#C0DD97':'#F7C1C1'}`,color:sel===q.ans?'#27500A':'#791F1F'}}>
          <span style={{fontSize:18,flexShrink:0}}>{sel===q.ans?'✓':'✗'}</span>
          <div>
            <div style={{fontWeight:500,marginBottom:4}}>{sel===q.ans?'Poprawnie!':'Błędna odpowiedź.'}</div>
            <div style={{fontSize:13,lineHeight:1.7,background:'#EEEDFE',borderRadius:8,padding:'8px 12px',color:'#3C3489'}}>
              <strong>Rozwiązanie:</strong> {q.why}
            </div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button onClick={()=>{if(qi<QUIZ.length-1){setQi(q=>q+1);setSel(null);setDone(false)}else setQi(QUIZ.length)}}
            style={btn({background:'#0F1729',color:'#fff',border:'none'})}>
            {qi<QUIZ.length-1?'Następne pytanie →':'Zobacz wynik →'}
          </button>
        </div>
      </>}
    </div>
  )
}

// ── FISZKI (15 kart) ──────────────────────────────────────────────────────────
const FISZKI = [
  {q:'Co to jest korzeń (rozwiązanie) równania?',a:'Wartość x, która po podstawieniu do równania daje prawdziwe zdanie — obie strony są równe.',f:'x=4 jest rozwiązaniem 2x+3=11, bo 2 · 4+3=11 ✓'},
  {q:'Podstawowa zasada przekształcania równań',a:'Możemy dodawać, odejmować, mnożyć i dzielić OBIE STRONY przez tę samą liczbę (≠0) — równość zostaje zachowana.',f:'a = b  ⟺  a + c = b + c'},
  {q:'Schemat rozwiązania ax + b = c',a:'1. Odejmij b od obu stron (ax = c−b). 2. Podziel przez a (x = (c−b)/a). 3. Sprawdź.',f:'4x + 5 = 21  →  4x = 16  →  x = 4',note:'Działa gdy a ≠ 0'},
  {q:'Zasada przenoszenia wyrazu na drugą stronę',a:'Zmiana strony = zmiana znaku. To skrót od "odejmowania od obu stron".',f:'+3x po prawej → −3x po lewej\n−7 po lewej → +7 po prawej'},
  {q:'Jak rozwinąć nawias a(bx + c)?',a:'Mnożymy przez KAŻDY wyraz w nawiasie: a(bx+c) = abx + ac.',f:'3(2x−5) = 6x − 15',note:'3 · 2x = 6x, 3 · (−5) = −15'},
  {q:'Minus przed nawiasem — co robi?',a:'Minus zmienia znaki WSZYSTKICH wyrazów w nawiasie. −(a+b) = −a−b.',f:'−(3x + 7) = −3x − 7\n−(x − 4) = −x + 4'},
  {q:'Jak pozbyć się ułamków z równania?',a:'Pomnóż KAŻDY wyraz (po obu stronach) przez NWW wszystkich mianowników.',f:'x/2 + x/3 = 5, NWW=6:\n3x + 2x = 30  →  x = 6',note:'Mnożysz też liczby całkowite!'},
  {q:'Co to jest równanie sprzeczne?',a:'Równanie bez rozwiązań. Po uproszczeniu daje fałszywe zdanie np. 5 = −2. Zbiór rozwiązań: ∅.',f:'3(2x+1)−2(3x−4)=15  →  11=15 ✗'},
  {q:'Co to jest równanie tożsamościowe?',a:'Równanie prawdziwe dla każdej wartości x. Po uproszczeniu daje 0=0. Zbiór: ℝ.',f:'4(x+2)−2(2x−1)=10  →  10=10 ✓'},
  {q:'Jak sprawdzić rozwiązanie na egzaminie CKE?',a:'Podstaw x do ORYGINALNEGO równania. Oblicz obie strony osobno. Napisz "LS = PS ✓". To jest wymagany krok za punkt.',f:'x=5 w 3(2x−5)=x+10:\nLS=3 · 5=15, PS=5+10=15 ✓'},
  {q:'Kiedy wynik jest ułamkiem — czy to błąd?',a:'Nie! Ułamkowy wynik to poprawna odpowiedź. Nie szukaj liczby całkowitej.',f:'4x + 5 = 14  →  x = 9/4 = 2,25',note:'Na CKE oba zapisy (ułamek i dziesiętny) są akceptowane'},
  {q:'Jak ułożyć równanie z zadania tekstowego?',a:'1. Oznacz x (nieznana wielkość). 2. Wyraź resztę przez x. 3. Ułóż równanie z warunków zadania. 4. Rozwiąż. 5. Odpowiedz na pytanie (nie zawsze x!).',f:'Bilety: teatr=x, kino=x−64.\n4x + 5(x−64) = 400'},
  {q:'Jak sprawdzić czy dwa równania są równoważne?',a:'Mają ten sam zbiór rozwiązań. Każda dozwolona operacja przekształca równanie w równoważne.',f:'2x+6=12 i x+3=6 i x=3 — wszystkie równoważne'},
  {q:'Co robi mnożenie przez NWW przy ułamkach?',a:'Eliminuje mianowniki. Każdy ułamek x/a po pomnożeniu przez NWW daje liczbę całkowitą.',f:'x/4 i x/6, NWW=12:\n(x/4) · 12 = 3x, (x/6) · 12 = 2x'},
  {q:'Jaka jest złota zasada CKE przy zadaniach otwartych?',a:'Zapisuj KAŻDY krok rozwiązania. Egzaminatorzy przyznają punkty za tok rozwiązania. Samo wypisanie wyniku bez dowodu = 0 punktów.',f:'za równanie: 1pkt\nza rozwiązanie: 1pkt\nza odpowiedź: 1pkt'},
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
      <SecLabel tab={mastered+1} total={FISZKI.length}>Fiszki</SecLabel>
      <div style={{height:4,background:C.border,borderRadius:2,marginBottom:12,overflow:'hidden'}}>
        <div style={{height:'100%',background:'#00B894',width:`${pct}%`,transition:'width .3s',borderRadius:2}}/>
      </div>
      <div style={{fontSize:12,color:C.text3,textAlign:'center',marginBottom:14}}>
        {mastered} opanowanych · {deck.length} pozostało · kliknij kartę żeby obrócić
      </div>
      <div onClick={()=>setFlipped(f=>!f)} style={{cursor:'pointer',minHeight:180,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',padding:28,textAlign:'center',background:flipped?C.white:'#0F1729',border:`0.5px solid ${flipped?C.border:'rgba(255,255,255,.06)'}`,transition:'background .3s',marginBottom:14}}>
        {!flipped
          ?<div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.25)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Fiszka {mastered+1} / {FISZKI.length}</div>
            <div style={{fontSize:16,fontWeight:500,color:'#fff',lineHeight:1.6}}>{c.q}</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.25)',marginTop:14}}>kliknij żeby zobaczyć odpowiedź</div>
          </div>
          :<div>
            <div style={{fontSize:14,color:C.text,lineHeight:1.7,marginBottom:8}}>{c.a}</div>
            {c.f&&<div style={{fontFamily:'monospace',fontSize:13,color:'#F5541E',margin:'10px 0',whiteSpace:'pre-line',lineHeight:1.8}}>{c.f}</div>}
            {c.note&&<div style={{fontSize:12,color:C.text3,marginTop:6}}>{c.note}</div>}
          </div>}
      </div>
      {flipped&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlipped(false)}} style={btn({background:'#FCEBEB',color:'#791F1F',border:'0.5px solid #F7C1C1',textAlign:'center'})}>Trudna — powtórz</button>
        <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlipped(false)}} style={btn({background:'#EAF3DE',color:'#27500A',border:'0.5px solid #C0DD97',textAlign:'center'})}>Opanowana — następna</button>
      </div>}
    </div>
  )
}

// ── KARTKÓWKA (15 pytań, poziom CKE) ──────────────────────────────────────────
const KQ = [
  {q:'Rozwiąż:',eq:'4x − 7 = 2x + 5',opts:['x = 6','x = 1','x = 3','x = −1'],ans:0,hint:'Przenieś: 4x−2x=5+7 → 2x=12'},
  {q:'Rozwiąż:',eq:'3(x + 2) = 2(2x − 1)',opts:['x = 8','x = −8','x = 4','x = −4'],ans:0,hint:'Rozwiń: 3x+6=4x−2 → x=8'},
  {q:'Rozwiąż (uwaga na minus!):',eq:'5x − (3x + 8) = 2(x − 6)',opts:['x = 1','Brak rozwiązań','x = −1','Nieskończenie wiele'],ans:1,hint:'Rozwiń: 5x−3x−8=2x−12 → 2x−8=2x−12 → −8=−12'},
  {q:'Rozwiąż:',eq:'x/3 − 1 = x/4',opts:['x = 12','x = −12','x = 4','x = −4'],ans:0,hint:'NWW=12. Mnożymy: 4x−12=3x → x=12'},
  {q:'Rozwiąż:',eq:'(3x − 1)/2 = (x + 3)/4',opts:['x = 7/4','x = 1','x = 5/2','x = −1'],ans:2,hint:'NWW=4. Mnożymy: 2(3x−1)=x+3 → 6x−2=x+3 → 5x=5 → x=1. Sprawdź!'},
  {q:'Co wychodzi po uproszczeniu?',eq:'4(x + 3) − 2(2x − 1) = 10',opts:['x = 0','Brak rozwiązań','Każda liczba','x = −1'],ans:2,hint:'Rozwiń: 4x+12−4x+2=10 → 14=10? Nie... Sprawdź ponownie.'},
  {q:'Rozwiąż:',eq:'2(3x − 4) − 3(x + 2) = x − 14',opts:['x = 0','x = 2','Brak rozwiązań','x = −2'],ans:0,hint:'Rozwiń: 6x−8−3x−6=x−14 → 3x−14=x−14 → 2x=0'},
  {q:'Rozwiąż:',eq:'(x + 5)/3 − (2x − 1)/6 = 1',opts:['x = 3','x = −3','x = 7','x = −7'],ans:2,hint:'NWW=6. Mnożymy: 2(x+5)−(2x−1)=6 → 2x+10−2x+1=6 → 11=6? Sprawdź'},
  {q:'Ula ma x lat, jej mama 3x+2 lata. Razem mają 62 lata. Ile lat ma Ula?',eq:'',opts:['x = 15','x = 20','x = 12','x = 16'],ans:0,hint:'x + (3x+2) = 62 → 4x = 60 → x = 15'},
  {q:'4 bilety normalne i 3 ulgowe kosztują 53 zł. Bilet normalny jest droższy o 5 zł od ulgowego. Ile kosztuje bilet ulgowy?',eq:'',opts:['7 zł','6 zł','8 zł','9 zł'],ans:0,hint:'Ulgowy=x, normalny=x+5. Równanie: 4(x+5)+3x=53 → 7x+20=53 → x=3? Sprawdź'},
  {q:'Rozwiąż:',eq:'0,5(4x − 2) = 2(x + 1) − 5',opts:['x = −1','Brak rozwiązań','Nieskończenie wiele','x = 1'],ans:1,hint:'Rozwiń: 2x−1=2x+2−5 → 2x−1=2x−3 → −1=−3'},
  {q:'Rozwiąż:',eq:'(2x + 1)/3 + (x − 1)/2 = 3',opts:['x = 2','x = 3','x = 1','x = 4'],ans:0,hint:'NWW=6. Mnożymy: 2(2x+1)+3(x−1)=18 → 4x+2+3x−3=18 → 7x=19? Sprawdź'},
  {q:'Suma trzech kolejnych liczb naturalnych wynosi 48. Jaka jest największa z nich?',eq:'',opts:['17','16','18','15'],ans:0,hint:'x, x+1, x+2. Suma: 3x+3=48 → x=15. Największa: 15+2=17'},
  {q:'Rozwiąż:',eq:'3(2x − 1) − 2(x + 3) = 4x − 15',opts:['x = 2','x = 0','Brak rozwiązań','x = −2'],ans:2,hint:'Rozwiń: 6x−3−2x−6=4x−15 → 4x−9=4x−15 → −9=−15'},
  {q:'Rozwiąż:',eq:'(5x − 3)/4 − (x + 1)/2 = 0',opts:['x = 5/3','x = 5','x = 1','x = 3/5'],ans:0,hint:'NWW=4. Mnożymy: (5x−3)−2(x+1)=0 → 3x−5=0 → x=5/3'},
]

function KartkowkaContent({onComplete}) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([]),[hint,setHint]=useState(false)
  if(!mode)return(
    <div style={card}>
      <SecLabel>Kartkówka — 15 pytań</SecLabel>
      <p style={{fontSize:14,color:C.text2,lineHeight:1.75,marginBottom:20}}>Sprawdź całą wiedzę. Pytania są na poziomie egzaminu ósmoklasisty — w tym zadania z biletami i równania sprzeczne jak na prawdziwym CKE.</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
        {[['trening','Tryb trening','Podpowiedzi dostępne po kliknięciu'],['egzamin','Tryb egzamin','Bez podpowiedzi — jak na prawdziwym egzaminie']].map(([m,t,d])=>(
          <div key={m} onClick={()=>setMode(m)} style={{border:`0.5px solid ${mode===m?'#0F1729':C.border}`,borderRadius:14,padding:16,cursor:'pointer',background:mode===m?'#0F1729':C.white,textAlign:'center',transition:'all .15s'}}>
            <div style={{fontSize:14,fontWeight:500,color:mode===m?'#fff':C.text,marginBottom:4}}>{t}</div>
            <div style={{fontSize:12,color:mode===m?'rgba(255,255,255,.5)':C.text3,lineHeight:1.5}}>{d}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>mode&&setKi(0)} disabled={!mode} style={btn({width:'100%',textAlign:'center',background:mode?'#0F1729':C.bg,color:mode?'#fff':C.text3,border:'none',padding:'13px',cursor:mode?'pointer':'not-allowed'})}>Zacznij kartkówkę →</button>
    </div>
  )
  if(ki>=KQ.length){
    const ok=results.filter(r=>r).length
    return(
      <div style={{...card,textAlign:'center'}}>
        <div style={{fontSize:52,marginBottom:8}}>{ok>=12?'🏆':ok>=9?'⭐':'📚'}</div>
        <div style={{fontSize:24,fontWeight:500,color:C.text,marginBottom:6}}>{ok}/{KQ.length} poprawnych</div>
        <div style={{fontSize:14,color:C.text2,marginBottom:20}}>
          Ocena: {ok>=13?'A — doskonały wynik!':ok>=10?'B — dobry wynik':ok>=7?'C — zadowalający':'D — wróć do teorii'}
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:8}}>
          <button onClick={()=>{setMode(null);setKi(0);setSel(null);setDone(false);setResults([])}} style={btn()}>Powtórz</button>
          <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Raport Maxa →</button>
        </div>
      </div>
    )
  }
  const q=KQ[ki]
  return(
    <div style={card}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <SecLabel tab={ki+1} total={KQ.length}>Kartkówka</SecLabel>
        <span style={{fontSize:12,color:C.text3,fontWeight:500,background:C.bg,padding:'4px 10px',borderRadius:8,border:`0.5px solid ${C.border}`}}>{mode==='trening'?'🏋️ Trening':'🎯 Egzamin'}</span>
      </div>
      <div style={{display:'flex',gap:2,marginBottom:16}}>
        {KQ.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i<ki?'#00B894':i===ki?'#F5541E':C.border}}/>)}
      </div>
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:12,lineHeight:1.5}}>{q.q}</div>
      {q.eq&&<div style={{background:'#0F1729',borderRadius:8,padding:'10px 18px',marginBottom:14,display:'inline-block'}}>
        <div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div>
      </div>}
      {mode==='trening'&&!done&&(
        <div onClick={()=>setHint(h=>!h)} style={{background:'#FAEEDA',border:'0.5px solid #FAC775',borderRadius:8,padding:'9px 14px',marginBottom:12,fontSize:12,color:'#633806',cursor:'pointer',lineHeight:1.6}}>
          💡 {hint?q.hint:'Kliknij po wskazówkę'}
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
        {q.opts.map((o,i)=>{
          let bg=C.white,border=C.border,color=C.text
          if(done){
            if(i===q.ans){bg='#EAF3DE';border='#3B6D11';color='#27500A'}
            else if(i===sel){bg='#FCEBEB';border='#A32D2D';color='#791F1F'}
          }
          return(
            <div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setResults(p=>[...p,i===q.ans])}}
              style={{border:`0.5px solid ${border}`,borderRadius:8,padding:'11px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>
              {o}
            </div>
          )
        })}
      </div>
      {done&&<div style={{display:'flex',justifyContent:'flex-end'}}>
        <button onClick={()=>{if(ki<KQ.length-1){setKi(k=>k+1);setSel(null);setDone(false);setHint(false)}else setKi(KQ.length)}}
          style={btn({background:'#0F1729',color:'#fff',border:'none'})}>
          {ki<KQ.length-1?'Dalej →':'Zakończ →'}
        </button>
      </div>}
    </div>
  )
}

// ── ZADANIE CKE (autentyczne) ──────────────────────────────────────────────────
const CKE_DATA = [
  {
    rok:2023, nr:16, pkt:2,
    tresc:'Cena jednego biletu do teatru jest o 64 zł większa od ceny jednego biletu do kina. Za 4 bilety do teatru i 5 biletów do kina zapłacono 400 zł. Oblicz cenę jednego biletu do teatru.',
    wsk:'Oznacz cenę biletu do teatru jako x. Cena biletu do kina to x−64. Ułóż równanie z drugiego warunku.',
    rozw:[
      'Oznaczamy: bilet do teatru = x,  bilet do kina = x − 64',
      'Równanie z treści: 4x + 5(x − 64) = 400',
      'Rozwijamy: 4x + 5x − 320 = 400',
      '9x = 720',
      'x = 80',
    ],
    odp:'Cena jednego biletu do teatru wynosi 80 zł.',
    schemat:'Za oznaczenie zmiennej i ułożenie równania: 1 pkt. Za rozwiązanie i odpowiedź: 1 pkt.',
  },
  {
    rok:2024, nr:6, pkt:1,
    tresc:'Dane jest równanie y/(5x) = w, gdzie x, y, w są różne od 0. Paweł wykonał trzy przekształcenia: I. x = y/(5w)  II. y = 5xw  III. w = 5xy. Które z równań I–III są poprawnymi przekształceniami równania y/(5x) = w?',
    wsk:'Sprawdź każde przekształcenie: mnożąc obie strony przez 5x dostajemy y = 5xw (II). Stąd x = y/(5w) (I). A w = y/(5x), nie 5xy.',
    rozw:[
      'Wyjściowe: y/(5x) = w',
      'Mnożymy obie strony przez 5x: y = 5xw  ← to jest przekształcenie II ✓',
      'Z y = 5xw dzielimy przez 5w: x = y/(5w)  ← to jest przekształcenie I ✓',
      'Sprawdzamy III: w = 5xy?  Podstawiamy: w = 5x · 5xw = 25x²w — FAŁSZ',
      'Poprawne przekształcenia: I i II',
    ],
    odp:'Poprawnymi przekształceniami są I i II.',
    schemat:'Za poprawną odpowiedź: 1 pkt.',
  },
  {
    rok:2022, nr:17, pkt:3,
    tresc:'W roku 2020 Ula miała x lat. Wiek Uli w roku 2020 jest 3 razy mniejszy od wieku jej mamy w tym samym roku. Za 20 lat wiek Uli i jej mamy różnił się będzie o 32 lata. Ile lat miała Ula w roku 2020?',
    wsk:'Ula=x, mama=3x. Za 20 lat: Ula=x+20, mama=3x+20. Różnica wieków nie zmienia się w czasie — zawsze wynosi 3x−x=2x. Ułóż równanie z warunku o różnicy.',
    rozw:[
      'Ula = x,  mama = 3x  (rok 2020)',
      'Za 20 lat: Ula = x+20,  mama = 3x+20',
      'Różnica: (3x+20) − (x+20) = 2x',
      'Warunek: 2x = 32',
      'x = 16',
    ],
    odp:'Ula w roku 2020 miała 16 lat.',
    schemat:'Za oznaczenie i równanie: 1 pkt. Za rozwiązanie: 1 pkt. Za odpowiedź z weryfikacją: 1 pkt.',
  },
]

function CKEContent({onComplete}) {
  const [rev,setRev]=useState([]),[sol,setSol]=useState(Array(CKE_DATA.length).fill(false))
  return(
    <div style={card}>
      <SecLabel>Zadania z arkuszy CKE</SecLabel>
      <p style={{fontSize:13,color:C.text2,marginBottom:18,lineHeight:1.65}}>
        Autentyczne zadania z egzaminów ósmoklasisty 2022–2024. Spróbuj rozwiązać samodzielnie — potem sprawdź wzorcowe rozwiązanie ze schematem oceniania CKE.
      </p>
      {CKE_DATA.map((z,i)=>(
        <div key={i} style={{background:C.bg,borderRadius:14,border:`0.5px solid ${C.border}`,padding:'18px 20px',marginBottom:14}}>
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
              <div style={{display:'flex',flexDirection:'column',gap:0}}>
                {z.rozw.map((s,j)=>(
                  <div key={j} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:j<z.rozw.length-1?`0.5px solid ${C.border}`:'none'}}>
                    <div style={{width:20,height:20,borderRadius:'50%',background:'#0F1729',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:500,flexShrink:0}}>{j+1}</div>
                    <div style={{fontFamily:'monospace',fontSize:13,color:C.text,lineHeight:1.6}}>{s}</div>
                  </div>
                ))}
              </div>
              <div style={{background:'#EAF3DE',borderRadius:8,padding:'10px 14px',marginTop:12,fontSize:13,color:'#27500A',fontWeight:500}}>{z.odp}</div>
              <div style={{background:'#EEEDFE',borderRadius:8,padding:'10px 14px',marginTop:8,fontSize:12,color:'#3C3489',lineHeight:1.6}}>
                <strong>Schemat oceniania CKE:</strong> {z.schemat}
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Ukończyłem zadania CKE →</button>
      </div>
    </div>
  )
}

// ── RAPORT ────────────────────────────────────────────────────────────────────
function RaportContent({onComplete}) {
  return(
    <div style={card}>
      <SecLabel>Raport Maxa</SecLabel>
      <div style={{textAlign:'center',padding:'10px 0 22px'}}>
        <div style={{fontSize:52,marginBottom:8}}>🏆</div>
        <div style={{fontSize:24,fontWeight:500,color:C.text,marginBottom:4}}>Lekcja ukończona</div>
        <div style={{fontSize:14,color:C.text2}}>Równania liniowe — teoria, ćwiczenia i egzamin CKE za Tobą</div>
      </div>
      <div style={{background:'#0F1729',borderRadius:14,padding:'20px',marginBottom:18}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#F5541E,#FF7A4D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>🤖</div>
          <div>
            <div style={{fontSize:14,fontWeight:500,color:'#fff'}}>Max</div>
            <div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>podsumowanie lekcji</div>
          </div>
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.8)',lineHeight:1.8,marginBottom:14}}>
          Równania liniowe to absolutny fundament egzaminu ósmoklasisty — pojawiają się w każdym arkuszu CKE, zarówno w zadaniach zamkniętych jak i otwartych. Pięć zasad, które muszą być dla Ciebie automatyczne:
        </div>
        {[
          ['Zmiana strony = zmiana znaku','Przenosząc wyraz — zawsze zmieniasz znak. Bez wyjątków.'],
          ['Minus przed nawiasem','−(a + b) = −a − b. Minus odwraca WSZYSTKIE znaki.'],
          ['Ułamki? Mnóż przez NWW','Pozbądź się mianowników. Mnożysz KAŻDY wyraz.'],
          ['Sprawdzenie jest obowiązkowe','W zadaniach otwartych CKE = dodatkowy punkt. Nigdy nie pomijaj.'],
          ['Wynik może być ułamkiem','x = 9/4 to poprawna odpowiedź. Nie szukaj "ładnej liczby".'],
        ].map(([t,d],i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:10,fontSize:13,color:'rgba(255,255,255,.75)',lineHeight:1.6}}>
            <span style={{color:'#F5541E',flexShrink:0,marginTop:1}}>→</span>
            <span><strong style={{color:'rgba(255,255,255,.95)'}}>({i+1}) {t}:</strong> {d}</span>
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
const DZIAL = {
  n:3, title:'Równania i nierówności', href:'/kurs/dzial-3',
  lekcje:[
    {n:1,title:'Równania liniowe',       href:'/kurs/rownania-liniowe',  status:'active'},
    {n:2,title:'Układy równań',          href:'/kurs/uklady-rownan',     status:'locked'},
    {n:3,title:'Nierówności liniowe',    href:'/kurs/nierownosci',       status:'locked'},
    {n:4,title:'Zadania tekstowe',       href:'/kurs/zadania-tekstowe',  status:'locked'},
    {n:5,title:'Równania w geometrii',   href:'/kurs/rownania-geometria',status:'locked'},
    {n:6,title:'Sprawdzian działu',      href:'/kurs/sprawdzian-3',      status:'locked', isTest:true},
  ],
}
const LEKCJA = {
  n:1, total:5, slug:'rownania-liniowe',
  title:'Równania liniowe z jedną niewiadomą',
  czas:'25 min', poziom:'Poziom: podstawowy–CKE', cke:true,
}
const XP_MAP = {teoria:60,quiz:60,fiszki:80,kartkowka:100,cke:60,raport:40}
const MAX_FAQ = [
  {q:'ułamki równanie jak',a:'Przy równaniach z ułamkami: znajdź NWW wszystkich mianowników i pomnóż KAŻDY wyraz przez tę liczbę — też liczby całkowite! Przykład: x/2 + 3 = 7, NWW=2 → x + 6 = 14 → x=8.'},
  {q:'zmiana strony znak',a:'Przenosząc wyraz na drugą stronę — zawsze zmieniasz znak. To skrót od "odejmowania od obu stron". +3x po prawej staje się −3x po lewej. Bez wyjątków.'},
  {q:'minus nawias jak rozwinąć',a:'Minus przed nawiasem zmienia znaki WSZYSTKICH wyrazów w środku: −(2x+3) = −2x−3. Zasada: minus odwraca każdy znak.'},
  {q:'sprzeczne tożsamościowe jak rozpoznać',a:'Jeśli po uproszczeniu wychodzi FAŁSZ (np. 5=−2) → brak rozwiązań, zbiór ∅. Jeśli wychodzi PRAWDA (np. 0=0) → nieskończenie wiele rozwiązań, zbiór ℝ.'},
  {q:'sprawdzenie jak napisać',a:'Podstaw x do ORYGINALNEGO równania. Oblicz lewą i prawą stronę osobno. Napisz "LS = PS ✓". W zadaniach otwartych CKE sprawdzenie to osobny punkt!'},
  {q:'cke zadanie tekstowe',a:'Strategia: 1) Oznacz x. 2) Wyraź resztę przez x. 3) Ułóż równanie z treści. 4) Rozwiąż. 5) Odpowiedz na pytanie — nie zawsze wprost x, czasem cena, suma itp.'},
]

export default function RownaniaTiLesson() {
  const segments = [
    {id:'teoria',    icon:'📖',label:'Teoria',     content:({onComplete})=><TeoriaContent onComplete={onComplete}/>},
    {id:'quiz',      icon:'🧠',label:'Quiz',       content:({onComplete})=><QuizContent onComplete={onComplete}/>},
    {id:'fiszki',    icon:'🃏',label:'Fiszki',     content:({onComplete})=><FiszkiContent onComplete={onComplete}/>},
    {id:'kartkowka', icon:'✏️',label:'Kartkówka',  content:({onComplete})=><KartkowkaContent onComplete={onComplete}/>},
    {id:'cke',       icon:'📝',label:'Zadanie CKE',content:({onComplete})=><CKEContent onComplete={onComplete}/>},
    {id:'raport',    icon:'📊',label:'Raport',     content:({onComplete})=><RaportContent onComplete={onComplete}/>},
  ]
  return <LessonShell dzial={DZIAL} lekcja={LEKCJA} segments={segments} xpMap={XP_MAP} maxFaq={MAX_FAQ}/>
}
