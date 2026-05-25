'use client'
import LessonShell from '../LessonShell'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA: Zastosowania procentów — wielokrotne zmiany, stężenia i lokaty
// Dział 4 — Procenty i statystyka
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
        <div style={{fontFamily:'monospace',fontSize:18,color:C.text,fontWeight:500,lineHeight:1.6}}>{eq}</div>
      </div>
    </div>
  )
}

const Ans = ({val,note,type='ok'}) => (
  <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:8,marginTop:10,background:type==='ok'?'#EAF3DE':'#FCEBEB',border:`0.5px solid ${type==='ok'?'#C0DD97':'#F7C1C1'}`}}>
    <div style={{width:28,height:28,borderRadius:'50%',background:type==='ok'?'#3B6D11':'#A32D2D',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:13,color:'#fff',fontWeight:700}}>{type==='ok'?'✓':'✗'}</div>
    <div>
      <div style={{fontFamily:'monospace',fontSize:15,fontWeight:500,color:type==='ok'?'#27500A':'#791F1F'}}>{val}</div>
      {note&&<div style={{fontSize:12,color:type==='ok'?'#3B6D11':'#A32D2D',marginTop:2}}>{note}</div>}
    </div>
  </div>
)

const Rule = ({type,children}) => {
  const m={warn:{bg:'#FAEEDA',bl:'#854F0B',c:'#633806'},tip:{bg:'#EAF3DE',bl:'#3B6D11',c:'#27500A'},info:{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'},err:{bg:'#FCEBEB',bl:'#A32D2D',c:'#791F1F'}}[type]||{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'}
  return <div style={{background:m.bg,borderLeft:`3px solid ${m.bl}`,borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:m.c,lineHeight:1.75,margin:'14px 0'}}>{children}</div>
}

const Remember = ({items}) => (
  <div style={{marginTop:16}}>
    <SH>Co warto zapamiętać</SH>
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      {items.map((it,i)=>(
        <div key={i} style={{display:'flex',gap:10,padding:'10px 14px',background:C.bg,borderRadius:8,border:`0.5px solid ${C.border}`,alignItems:'flex-start'}}>
          <span style={{color:C.purple,fontWeight:700,flexShrink:0,marginTop:1}}>→</span>
          <div style={{fontSize:13,color:C.text2,lineHeight:1.55}} dangerouslySetInnerHTML={{__html:it}}/>
        </div>
      ))}
    </div>
  </div>
)

const Mistakes = ({items}) => (
  <div style={{marginTop:16}}>
    <SH>Typowe błędy uczniów</SH>
    {items.map(([blad,pop,wyt],i)=>(
      <div key={i} style={{background:C.bg,borderRadius:8,padding:'12px 14px',marginBottom:8,borderLeft:'3px solid #A32D2D',border:`0.5px solid ${C.border}`,borderLeftWidth:3}}>
        <div style={{fontFamily:'monospace',fontSize:12,color:'#A32D2D',marginBottom:4}}>✗ BŁĄD: {blad}</div>
        <div style={{fontFamily:'monospace',fontSize:12,color:'#27500A',marginBottom:4}}>✓ POPRAWNIE: {pop}</div>
        <div style={{fontSize:12,color:C.text2,lineHeight:1.55}}>💡 {wyt}</div>
      </div>
    ))}
  </div>
)

// ── TEORIA ────────────────────────────────────────────────────────────────────
const TTABS = [
  {id:'mnozniki', label:'Mnożniki dziesiętne'},
  {id:'niewidoma', label:'Procent z niewiadomej'},
  {id:'pp', label:'Punkty procentowe'},
  {id:'stezenia', label:'Stężenia roztworów'},
  {id:'finanse', label:'Lokaty i odsetki'},
]

function TeoriaContent({onComplete}) {
  const [tab,setTab] = useState('mnozniki')

  const CONTENT = {

    mnozniki: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        W zadaniach egzaminacyjnych rzadko spotkasz jednokrotną zmianę ceny. Zazwyczaj towar najpierw drożeje, a potem tanieje — co wymaga bezbłędnego przeliczania. Zamiast liczyć procent i dodawać do bazy, używamy <strong style={{color:C.text}}>mnożników dziesiętnych</strong>, co skraca czas i minimalizuje ryzyko pomyłki.
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'18px 24px',marginBottom:16}}>
        <div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:10}}>Wzory ogólne</div>
        <div style={{fontFamily:'monospace',fontSize:16,color:'#fff',lineHeight:2.4}}>
          Podwyżka o p% &nbsp;→&nbsp; <span style={{color:'#FF7A4D'}}>mnożnik = 1 + p/100</span><br/>
          Obniżka o p% &nbsp;→&nbsp; <span style={{color:'#00B894'}}>mnożnik = 1 − p/100</span>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>
        {[['Podwyżka 15%','1,15','×1,15','#FAEEDA','#633806'],['Obniżka 20%','0,80','×0,80','#EAF3DE','#27500A'],['Obniżka 30%','0,70','×0,70','#EAF3DE','#27500A'],['Podwyżka 50%','1,50','×1,50','#FAEEDA','#633806'],['Obniżka 5%','0,95','×0,95','#EAF3DE','#27500A'],['Podwyżka 100%','2,00','×2,00','#FAEEDA','#633806']].map(([n,m,z,bg,c])=>(
          <div key={n} style={{background:bg,borderRadius:8,padding:'10px 12px',textAlign:'center'}}>
            <div style={{fontSize:11,color:c,fontWeight:500,marginBottom:4}}>{n}</div>
            <div style={{fontFamily:'monospace',fontSize:20,fontWeight:700,color:c}}>{m}</div>
            <div style={{fontSize:11,color:C.text3,marginTop:2}}>{z}</div>
          </div>
        ))}
      </div>

      <Task level="basic" label="Oblicz cenę po dwóch zmianach" eq="200 × 1,15 × 0,80 = ?" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Mnożnik dla podwyżki o 15%: 100%+15% = 115% = 1,15" result="cena po podwyżce: 200 · 1,15 = 230 zł" />
        <Step n={2} text="Mnożnik dla obniżki o 20%: 100%−20% = 80% = 0,80" result="cena po obniżce: 230 · 0,80 = 184 zł" />
      </div>
      <Ans val="Buty kosztują 184 zł" note="Sprawdzenie: 200 · 1,15 · 0,80 = 200 · 0,92 = 184 ✓" />

      <Task level="med" label="Znajdź cenę początkową z ceny końcowej" eq="x · 0,80 · 0,95 = 1520 zł" sub="Rower po dwóch obniżkach kosztuje 1520 zł — ile kosztował na początku?" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Mnożnik łączny: 0,80 · 0,95 = 0,76" result="równanie: 0,76 · x = 1520" />
        <Step n={2} text="Dzielimy obie strony przez 0,76:" result="x = 1520 ÷ 0,76 = 2000 zł" hi />
      </div>
      <Ans val="Cena początkowa: 2000 zł" note="Sprawdzenie: 2000 · 0,80 = 1600, 1600 · 0,95 = 1520 ✓" />

      <Task level="hard" label="Klasyczna pułapka CKE — powrót do ceny" eq="Cena obniżona o 20%. O ile % podnieść, by wrócić do oryginału?" sub="Zadanie otwarte — zapisz obliczenia" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Cena po obniżce o 20% wynosi 0,8x" result="szukamy mnożnika k takiego że: 0,8x · k = x" />
        <Step n={2} text="Dzielimy obie strony przez x:" result="0,8 · k = 1" />
        <Step n={3} text="Obliczamy k:" result="k = 1 ÷ 0,8 = 1,25" />
        <Step n={4} text="Mnożnik 1,25 to 125%, czyli wzrost o:" result="25% ✓" hi />
      </div>
      <Ans val="Cenę należy podnieść o 25%" note="Nie o 20%! Procenty nie są symetryczne." />

      <Mistakes items={[
        ['+10% a potem −10% = powrót do bazy','0,80 · 1,10 = 0,88x (spadek o 12%)','Druga zmiana liczona jest od NOWEJ kwoty — "zabiera" więcej niż "dała" podwyżka.'],
        ['Dodawanie mnożników: +20% i −30% = −10%','0,80 · 1,20 = 0,96 (spadek o 4%, nie 10%)','Mnożniki MNOŻYMY przez siebie, nie dodajemy.'],
      ]}/>
      <Remember items={[
        '<strong>Mnożnik podwyżki o p%</strong> = 1 + p/100 (np. +35% → 1,35)',
        '<strong>Mnożnik obniżki o p%</strong> = 1 − p/100 (np. −35% → 0,65)',
        'Wielokrotne zmiany = mnożenie kolejnych mnożników przez siebie',
        'Obniżka o p% a następnie podwyżka o p% NIGDY nie daje ceny początkowej',
        'Mając cenę końcową i znając zmiany — dzielimy przez łączny mnożnik',
      ]}/>
    </div>,

    niewidoma: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Procenty na egzaminie często ukrywają się w zadaniach geometrycznych (relacje długości boków) lub tekstowych o liczbach i osobach. Kluczem jest zapisanie zmiennych z użyciem <strong style={{color:C.text}}>współczynników dziesiętnych</strong>.
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'18px 24px',marginBottom:16}}>
        <div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:10}}>Wzór ogólny</div>
        <div style={{fontFamily:'monospace',fontSize:16,color:'#fff',lineHeight:2.2}}>
          A jest o p% większe od B &nbsp;→&nbsp; <span style={{color:'#FF7A4D'}}>A = (1 + p/100) · B</span><br/>
          A jest o p% mniejsze od B &nbsp;→&nbsp; <span style={{color:'#00B894'}}>A = (1 − p/100) · B</span>
        </div>
      </div>

      <Task level="basic" label="Geometria — procenty w obwodzie prostokąta" eq="2a + 2·(1,2a) = 44 cm" sub="Długość prostokąta jest o 20% większa od szerokości a, obwód = 44 cm" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Szerokość = a, długość = 1,2a (bo o 20% więcej)" result="równanie obwodu: 2a + 2·(1,2a) = 44" />
        <Step n={2} text="Upraszczamy lewą stronę:" result="2a + 2,4a = 4,4a = 44" />
        <Step n={3} text="Dzielimy przez 4,4:" result="a = 10 cm, długość = 12 cm ✓" hi />
      </div>
      <Ans val="Wymiary: 10 cm × 12 cm" note="Sprawdzenie: 12 = 1,2 · 10 ✓, obwód = 2·10 + 2·12 = 44 ✓" />

      <Task level="med" label="Klasa szkolna — układ równań z procentami" eq="0,4x + 4 = 0,6x" sub="Dziewcząt jest 60%, po dołączeniu 4 chłopców liczby się zrównają — ilu uczniów?" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Niech x = liczba wszystkich uczniów. Dziewczęta: 0,6x, chłopcy: 0,4x" result="" />
        <Step n={2} text="Warunek: chłopcy + 4 = dziewczęta:" result="0,4x + 4 = 0,6x" />
        <Step n={3} text="Przenosimy 0,4x na prawą:" result="4 = 0,2x" />
        <Step n={4} text="Dzielimy przez 0,2:" result="x = 20 uczniów ✓" hi />
      </div>
      <Ans val="Klasa liczy 20 uczniów" note="Dziewcząt: 12, chłopców: 8. Po dołączeniu 4: 12 = 12 ✓" />

      <Task level="hard" label="Monety — procentowy stosunek do zmieniającego się zbioru" eq="Tomek ma o 40% więcej monet niż Marek — ile % musi oddać, by się zrównać?" sub="Zadanie otwarte CKE" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Marek = x, Tomek = 1,4x. Razem = 2,4x" result="" />
        <Step n={2} text="Po podziale każdy ma połowę, czyli 1,2x" result="Tomek musi oddać: 1,4x − 1,2x = 0,2x" />
        <Step n={3} text="Jakim procentem monet Tomka (1,4x) jest 0,2x?" result="(0,2x ÷ 1,4x) · 100% = (1/7) · 100% ≈ 14,3%" hi />
      </div>
      <Ans val="Tomek musi oddać ≈ 14% swoich monet" note="Uwaga: liczymy od monet Tomka (1,4x), nie od sumy!" />

      <Mistakes items={[
        ['"A o 50% większe od B" → B o 50% mniejsze od A','"B o 33,3% mniejsze od A" (bo 50/150 = 1/3 ≈ 33,3%)','Procent zależy od bazy. Gdy zmieniamy punkt odniesienia, zmienia się mianownik.'],
        ['Procenty addytywne zamiast mnożnikowych','60% z x + 40% z x = x (to jest poprawne, ale nie dla sumy różnych baz)','Identyfikuj słowo "od" — ono wskazuje 100% (mianownik) w każdym obliczeniu.'],
      ]}/>
      <Remember items={[
        'Jeśli zadanie nie podaje konkretnych liczb — użyj x jako zmiennej',
        'Słowo <strong>"od"</strong> wskazuje liczbę, która trafia do mianownika (= 100%)',
        '"A jest większe od B" vs "A stanowi X% B" — dwa różne pytania, dwa różne równania',
        'W geometrii: boki wyrażaj przez x i używaj mnożnika dla relacji procentowych',
      ]}/>
    </div>,

    pp: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Pomyłka między <strong style={{color:C.text}}>punktem procentowym</strong> a <strong style={{color:C.text}}>procentem</strong> to klasyczna pułapka egzaminacyjna. Rozróżnienie tych pojęć to dowód matematycznej dojrzałości ósmoklasisty.
      </p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
        <div style={{background:'#E6F1FB',borderLeft:'3px solid #185FA5',borderRadius:'0 8px 8px 0',padding:'14px'}}>
          <div style={{fontSize:12,fontWeight:600,color:'#0C447C',marginBottom:6}}>Punkt procentowy (p.p.)</div>
          <div style={{fontSize:13,color:C.text2,lineHeight:1.65,marginBottom:8}}>Zwykła różnica dwóch wartości procentowych. Otrzymujemy ją przez odejmowanie.</div>
          <div style={{fontFamily:'monospace',fontSize:13,color:'#0C447C'}}>10% → 12% = +2 p.p.</div>
        </div>
        <div style={{background:'#FAEEDA',borderLeft:'3px solid #854F0B',borderRadius:'0 8px 8px 0',padding:'14px'}}>
          <div style={{fontSize:12,fontWeight:600,color:'#633806',marginBottom:6}}>Procent (%)</div>
          <div style={{fontSize:13,color:C.text2,lineHeight:1.65,marginBottom:8}}>Stosunek zmiany do wartości wyjściowej. Wymaga dzielenia przez bazę.</div>
          <div style={{fontFamily:'monospace',fontSize:13,color:'#633806'}}>10% → 12% = +20%</div>
        </div>
      </div>
      <div style={{background:C.bg,borderRadius:8,padding:'14px 16px',marginBottom:14,border:`0.5px solid ${C.border}`}}>
        <div style={{fontSize:12,fontWeight:500,color:C.text,marginBottom:8}}>Wzory:</div>
        <div style={{fontFamily:'monospace',fontSize:13,color:C.text,lineHeight:2.2}}>
          Zmiana w p.p. = Nowy% − Stary%<br/>
          Zmiana w % = (Różnica ÷ Stary%) × 100%
        </div>
      </div>

      <Task level="basic" label="Oprocentowanie lokaty wzrosło z 4% do 5%" eq="Zmiana = ? p.p. i ? %" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Zmiana w punktach procentowych (proste odejmowanie):" result="5% − 4% = 1 p.p." />
        <Step n={2} text="Zmiana w procentach (baza = 4):" result="(1 ÷ 4) · 100% = 25%" hi />
      </div>
      <Ans val="Wzrost o 1 p.p. = wzrost o 25%" note="Te dwie liczby ZAWSZE są różne (chyba że baza = 100)" />

      <Task level="med" label="Bezrobocie spadło z 8% do 6%" eq="O ile % (nie p.p.) spadło bezrobocie?" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Różnica to 2 p.p. Baza = 8" result="(2 ÷ 8) · 100% = 25%" hi />
      </div>
      <Ans val="Bezrobocie spadło o 25%" note="Nie o 2%! Spadek o 2 p.p. z bazy 8% to aż 25% spadek wartości." />

      <Task level="hard" label="Kobiety stanowiły 20% pracowników — po zatrudnieniu 10 kobiet udział wzrósł o 5 p.p." eq="0,2x + 10 = 0,25 · (x + 10)" sub="Ilu pracowników jest TERAZ?" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Niech x = pierwotna liczba pracowników. Kobiety: 0,2x" result="" />
        <Step n={2} text="Wzrost o 5 p.p.: 20% → 25%. Nowe równanie:" result="0,2x + 10 = 0,25(x + 10)" />
        <Step n={3} text="Rozwijamy i upraszczamy:" result="0,2x + 10 = 0,25x + 2,5 → 7,5 = 0,05x" />
        <Step n={4} text="Dzielimy przez 0,05 → x = 150. Pytamy o TERAZ:" result="150 + 10 = 160 pracowników ✓" hi />
      </div>
      <Ans val="Obecnie pracuje 160 osób" note="Uwaga: pytanie o aktualny stan (x+10), nie o pierwotny!" />

      <Mistakes items={[
        ['Wzrost z 20% do 40% to "wzrost o 20%"','Wzrost z 20% do 40% to wzrost o 20 p.p., ale o 100% (wartość się podwoiła)','Odejmowanie daje p.p. Dzielenie przez bazę daje %'],
        ['Mylenie p.p. i % w odpowiedzi','Zawsze sprawdź co pyta zadanie — "punkty procentowe" czy "procenty"','To różnica, która może kosztować cały punkt na egzaminie CKE!'],
      ]}/>
      <Remember items={[
        '"Punkty procentowe" = zwykłe odejmowanie wartości procentowych',
        '"O ile procent" = różnica ÷ wartość wyjściowa × 100%',
        'Na wykresach słupkowych różnica odczytana z osi = p.p.',
        'Wzrost z 10% do 15% to +5 p.p., ale +50% wzrostu wartości wskaźnika',
      ]}/>
    </div>,

    stezenia: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Zadania na roztwory wymagają żelaznej logiki: śledzimy <strong style={{color:C.text}}>masę czystej substancji</strong> (np. soli) w całkowitej <strong style={{color:C.text}}>masie roztworu</strong> (sól + woda). Kluczowa zasada: para woda — substancja zmieniają się razem.
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'18px 24px',marginBottom:16}}>
        <div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:10}}>Wzór na stężenie</div>
        <div style={{fontFamily:'monospace',fontSize:18,color:'#fff',lineHeight:2.4}}>
          Cp = (ms ÷ mr) × 100%<br/>
          <span style={{fontSize:14,color:'rgba(255,255,255,.5)'}}>gdzie: ms = masa substancji, mr = ms + mw (masa wody)</span>
        </div>
      </div>
      <Rule type="err"><strong>Najczęstszy błąd:</strong> dzielenie masy substancji przez masę <em>wody</em> zamiast przez masę <em>roztworu</em>!<br/>ms=20g, mw=180g → Cp = 20÷<strong>200</strong>×100% = 10% (NIE: 20÷180)</Rule>

      <Task level="basic" label="Oblicz stężenie roztworu" eq="20 g soli + 180 g wody = ?" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Masa roztworu (PUŁAPKA — nie samej wody!):" result="mr = 20 + 180 = 200 g" />
        <Step n={2} text="Stężenie:" result="Cp = (20 ÷ 200) · 100% = 10% ✓" hi />
      </div>
      <Ans val="Stężenie = 10%" note="Sprawdzenie: 10% z 200g = 20g soli ✓" />

      <Task level="med" label="Do roztworu dosypano sól — oblicz nowe stężenie" eq="4 kg (15%) + 1 kg czystej soli = ?" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Sól w pierwotnym roztworze: 15% z 4 kg:" result="ms1 = 0,15 · 4 = 0,6 kg" />
        <Step n={2} text="Nowa masa soli (dosypano 1 kg):" result="ms_nowe = 0,6 + 1 = 1,6 kg" />
        <Step n={3} text="Nowa masa roztworu (też wzrosła o 1 kg!):" result="mr_nowe = 4 + 1 = 5 kg" />
        <Step n={4} text="Nowe stężenie:" result="Cp = (1,6 ÷ 5) · 100% = 32% ✓" hi />
      </div>
      <Ans val="Nowe stężenie = 32%" note="Dosypana substancja zwiększa OBA: licznik i mianownik!" />

      <Task level="hard" label="Ile wody odparować, by zagęścić roztwór?" eq="20 kg (10%) → 25%. Ile kg wody odparować?" sub="Zadanie otwarte CKE — 3 punkty" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Masa soli w roztworze (ZOSTAJE, woda paruje!):" result="ms = 10% · 20 = 2 kg" />
        <Step n={2} text="Niech x = kg odparowanej wody. Nowe równanie:" result="0,25 · (20 − x) = 2" />
        <Step n={3} text="Rozwijamy: 5 − 0,25x = 2 → 0,25x = 3" result="x = 12 kg ✓" hi />
      </div>
      <Ans val="Należy odparować 12 kg wody" note="Sprawdzenie: (20−12) = 8 kg roztworu, 2÷8 · 100% = 25% ✓" />

      <Task level="cke" label="Mieszanie dwóch roztworów — klasyka CKE" eq="3 kg (20%) + 2 kg (40%) = ? %" sub="Zadanie z arkusza CKE 2022" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Cukier w roztworze 1: 20% z 3 kg:" result="0,2 · 3 = 0,6 kg" />
        <Step n={2} text="Cukier w roztworze 2: 40% z 2 kg:" result="0,4 · 2 = 0,8 kg" />
        <Step n={3} text="Łączna masa cukru: 0,6 + 0,8 = 1,4 kg. Łączna masa roztworu: 5 kg" result="Cp = (1,4 ÷ 5) · 100% = 28% ✓" hi />
      </div>
      <Ans val="Stężenie mieszaniny = 28%" />

      <Mistakes items={[
        ['Dzielenie przez masę wody zamiast roztworu','Cp = ms ÷ (ms + mw) × 100%','Stężenie mówi, jaką częścią CAŁOŚCI jest substancja.'],
        ['Zapomnienie, że dosypana substancja zwiększa masę roztworu','mr_nowe = mr_stare + masa_dosypanej_substancji','Każde "dosypanie" lub "dolanie" zmienia OBYDWA: licznik i mianownik.'],
      ]}/>
      <Remember items={[
        'Stężenie = (masa substancji ÷ masa roztworu) × 100%',
        'Masa roztworu = masa substancji + masa wody (mr = ms + mw)',
        'Przy odparowywaniu wody: masa substancji NIE ZMIENIA SIĘ',
        'Czysta substancja ma stężenie 100%. Czysta woda ma stężenie 0%',
        'Przy mieszaniu: dodaj masy substancji, dodaj masy roztworów',
      ]}/>
    </div>,

    finanse: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Zadania z lokatami sprawdzają czy rozumiesz, że oprocentowanie jest zawsze podawane <strong style={{color:C.text}}>"w skali roku" (p.a.)</strong>, a od zysku często odliczamy podatek. Ważne: podatek płacimy TYLKO od odsetek, nie od kapitału.
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'18px 24px',marginBottom:16}}>
        <div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:10}}>Wzory finansowe</div>
        <div style={{fontFamily:'monospace',fontSize:14,color:'#fff',lineHeight:2.4}}>
          Odsetki brutto = Kapitał × Oprocentowanie × (Miesiące ÷ 12)<br/>
          Odsetki netto = Odsetki brutto × (1 − podatek/100)<br/>
          <span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Przy podatku 19%: odsetki netto = odsetki brutto × 0,81</span>
        </div>
      </div>

      <Task level="basic" label="Lokata roczna — klasyczne obliczenie" eq="3000 zł × 6% = ? odsetek" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Odsetki (pełny rok, bez podatku):" result="6% z 3000 = 0,06 · 3000 = 180 zł" />
        <Step n={2} text="Kwota końcowa:" result="3000 + 180 = 3180 zł ✓" hi />
      </div>
      <Ans val="Odsetki: 180 zł, saldo: 3180 zł" note="Sprawdzenie: 3000 · 1,06 = 3180 ✓" />

      <Task level="med" label="Lokata krótsza niż rok — proporcja miesięczna" eq="4000 zł × 4% p.a. × (9/12) = ?" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="PUŁAPKA: 4% to oprocentowanie roczne, lokata trwa 9 miesięcy!" result="odsetki roczne: 0,04 · 4000 = 160 zł" />
        <Step n={2} text="Za 9 miesięcy (9/12 roku):" result="160 · (9/12) = 160 · 0,75 = 120 zł ✓" hi />
      </div>
      <Ans val="Odsetki za 9 miesięcy: 120 zł" note="Sprawdzenie: 3 miesiące = 40 zł, 9 miesięcy = 3 · 40 = 120 ✓" />

      <Task level="hard" label="Lokata z podatkiem + zakup z rabatem — zadanie złożone CKE" eq="10 000 zł × 5% − 20% podatku → czy starczy na kosiarkę 450 zł − 10%?" />
      <div style={{display:'flex',flexDirection:'column',marginBottom:8}}>
        <Step n={1} text="Odsetki brutto: 5% z 10 000 zł:" result="500 zł" />
        <Step n={2} text="Podatek 20% od odsetek (NIE od kapitału!):" result="odsetki netto = 500 · 0,80 = 400 zł" />
        <Step n={3} text="Cena kosiarki po rabacie 10%:" result="450 · 0,90 = 405 zł" />
        <Step n={4} text="Porównanie: 400 zł vs 405 zł:" result="400 < 405 — zabraknie 5 zł ✗" hi />
      </div>
      <Ans val="Zarobionych pieniędzy NIE wystarczy na kosiarkę" note="Zabraknie 5 zł. Podatek pobierany jest tylko od zysku (odsetek), nie od wpłaconego kapitału!" type="none" />

      <Mistakes items={[
        ['Podatek liczony od całego kapitału (10 000 zł)','Podatek = p% × ODSETKI (zysk), nie od kapitału','Bank nie "kradnie" Twoich oszczędności — pobiera tylko od nowo zarobionych pieniędzy.'],
        ['Pełne oprocentowanie dla lokaty krótszej niż rok','Mnóż przez (liczba miesięcy / 12)','Oprocentowanie podawane jest ZAWSZE w skali roku — musisz przeliczyć na czas trwania.'],
      ]}/>
      <Remember items={[
        '"W skali roku" (p.a.) = musisz proporcjonalnie przeliczyć dla krótszych lokat',
        '"Netto" = po odjęciu podatku. "Brutto" = przed podatkiem',
        'Podatek od odsetek liczymy tylko od ZYSKU, nie od wpłaconego kapitału',
        'Jeśli zadanie nie wspomina o podatku — liczysz odsetki brutto jako końcowe',
      ]}/>
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
const QUIZ = [
  {q:'Bluzka kosztowała 80 zł. Po sezonie cenę obniżono o 25%. Ile wynosi nowa cena?',eq:'',opts:['20 zł','60 zł','55 zł','100 zł'],ans:1,dlaczego:'Obniżka o 25% → mnożnik 0,75. Płacimy 75% ceny: 80 · 0,75 = 60 zł. Lub: 25% z 80 = 20, 80 − 20 = 60 zł.'},
  {q:'Kurtka zimowa kosztuje 210 zł, co stanowi 70% jej pierwotnej ceny. Jaka była cena przed obniżką?',eq:'',opts:['300 zł','280 zł','350 zł','147 zł'],ans:0,dlaczego:'Równanie: 0,7 · x = 210. Dzielimy przez 0,7: x = 210 ÷ 0,7 = 300 zł. BŁĄD: nie dodawaj 30% z 210 — procenty nie są symetryczne!'},
  {q:'Cena akcji spadła o 20%, a w następnym miesiącu wzrosła o 20%. Obecna cena w porównaniu do wyjściowej jest:',eq:'',opts:['Taka sama','O 4% wyższa','O 4% niższa','O 2% niższa'],ans:2,dlaczego:'Mnożniki: 0,8 · 1,2 = 0,96. Cena to 96% wartości początkowej — spadek o 4%. Zmiany procentowe działają na nowej bazie!'},
  {q:'Koty (30%) i rybki (20%). Które zdanie jest BŁĘDNE?',eq:'',opts:['Stosunek psów do kotów = 5:3','Psy o 20 p.p. więcej niż koty','Rybki o 10% mniej niż koty','Rybki stanowią 1/5 klasy'],ans:2,dlaczego:'Opcja C: rybki (20%) są o 10 p.p. mniej niż koty (30%), ale "o ile PROCENT" to: 10÷30·100% ≈ 33%. Zdanie C myli p.p. z procentami.'},
  {q:'Ile gramów wody dolać do 200 g roztworu soku o stężeniu 15%, aby uzyskać stężenie 10%?',eq:'',opts:['50 g','100 g','150 g','300 g'],ans:1,dlaczego:'Masa soku: 15% z 200 = 30 g. Równanie: 30 = 0,10·(200+x) → 300 = 200+x → x = 100 g.'},
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
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:12,lineHeight:1.55}}>{q.q}</div>
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'11px 18px',marginBottom:14,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div></div>}
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

// ── FISZKI ────────────────────────────────────────────────────────────────────
const FISZKI = [
  {q:'Co oznacza symbol % w matematyce?',a:'Procent to inna forma zapisu ułamka o mianowniku 100. Pochodzi z łaciny (pro centum) = "na sto".',f:'15% = 15/100 = 0,15',note:'Procent nie istnieje sam w sobie — to zawsze "procent z czegoś".'},
  {q:'Co to jest "punkt procentowy" (p.p.)?',a:'Jednostka różnicy między dwiema wartościami procentowymi — wynik zwykłego odejmowania.',f:'8% → 6% = −2 p.p.',note:'Spadek z 8% do 6% to −2 p.p., ale −25% wartości wskaźnika!'},
  {q:'Jaki mnożnik dziesiętny odpowiada podwyżce o 35%?',a:'Podwyżka o 35% to 100% + 35% = 135% = 1,35.',f:'Nowa cena = 1,35 × stara cena',note:'Wzór ogólny: mnożnik podwyżki o p% = 1 + p/100'},
  {q:'Jak jednym działaniem odwrócić obniżkę o 20%?',a:'Podziel aktualną cenę przez mnożnik obniżki: 0,80.',f:'0,8 · x = 160  →  x = 160 ÷ 0,8 = 200 zł'},
  {q:'Jak zapisać wielokrotną zmianę: podwyżkę o 10% i obniżkę o 30%?',a:'Mnożniki dziesiętne mnoży się przez siebie.',f:'K × 1,10 × 0,70 = nowa kwota',note:'Kolejność mnożenia nie ma znaczenia (prawo przemienności).'},
  {q:'Jaki jest wzór na stężenie procentowe Cp?',a:'Masa czystej substancji podzielona przez masę całego roztworu × 100%.',f:'Cp = (ms ÷ mr) × 100%',note:'mr = ms + mw — nie dziel przez samą wodę!'},
  {q:'Pół bochenka chleba kosztuje o ile więcej niż ćwierć bochenka?',a:'O 100% więcej — wartość jest dwukrotnie wyższa, nie o 50%.',f:'(0,5 − 0,25) ÷ 0,25 × 100% = 100%',note:'"O 100% więcej" = podwojenie wartości'},
  {q:'Czy przy zadaniach z lokatami zawsze odliczamy podatek?',a:'Nie — tylko gdy zadanie podaje wprost informację o podatku od zysków kapitałowych.',note:'Jeśli liczysz podatek, pobierasz go TYLKO od odsetek (zysku), nie od kapitału!'},
  {q:'Co się dzieje z masą soli gdy odparowujemy wodę z roztworu?',a:'Masa soli NIE zmienia się — maleje tylko masa wody i masa roztworu.',f:'ms = const,  mr_nowe = mr − masa_wody'},
  {q:'Jak obliczyć "o ile procent liczba a jest większa od b"?',a:'Oblicz różnicę i podziel przez liczbę STOJĄCĄ PO SŁOWIE "od" (czyli przez b), pomnóż × 100%.',f:'((a − b) ÷ b) × 100%'},
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
      <div style={{fontSize:12,color:C.text3,textAlign:'center',marginBottom:12}}>Pozostało: {deck.length} kart · kliknij żeby obrócić</div>
      <div onClick={()=>setFlipped(f=>!f)} style={{cursor:'pointer',minHeight:180,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',padding:28,textAlign:'center',background:flipped?C.white:C.navy,border:`0.5px solid ${flipped?C.border:'rgba(255,255,255,.08)'}`,transition:'background .3s',marginBottom:14}}>
        {!flipped
          ?<div><div style={{fontSize:11,color:'rgba(255,255,255,.25)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Fiszka {mastered+1}/{FISZKI.length}</div><div style={{fontSize:16,fontWeight:500,color:'#fff',lineHeight:1.6}}>{c.q}</div><div style={{fontSize:11,color:'rgba(255,255,255,.25)',marginTop:12}}>kliknij żeby zobaczyć odpowiedź</div></div>
          :<div><div style={{fontSize:14,color:C.text,lineHeight:1.7,marginBottom:8}}>{c.a}</div>{c.f&&<div style={{fontFamily:'monospace',fontSize:14,color:C.accent,fontWeight:600,margin:'8px 0'}}>{c.f}</div>}{c.note&&<div style={{fontSize:12,color:C.text3,marginTop:4}}>{c.note}</div>}</div>}
      </div>
      {flipped&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlipped(false)}} style={btn({background:'#FCEBEB',color:'#791F1F',border:'0.5px solid #F7C1C1',textAlign:'center'})}>Trudna — powtórz</button>
        <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlipped(false)}} style={btn({background:'#EAF3DE',color:'#27500A',border:'0.5px solid #C0DD97',textAlign:'center'})}>Opanowana — następna</button>
      </div>}
    </div>
  )
}

// ── KARTKÓWKA ─────────────────────────────────────────────────────────────────
const KQ = [
  {q:'Liczba o 12% większa od 50 to:',eq:'',opts:['62','56','60','50,12'],ans:1,hint:'Pomnóż 50 przez odpowiedni mnożnik większy od 1.'},
  {q:'Rower po obniżce o 10% kosztuje 900 zł. Cena pierwotna to:',eq:'',opts:['990 zł','1000 zł','810 zł','1100 zł'],ans:1,hint:'900 zł to 90% pierwotnej ceny — znajdź 100%.'},
  {q:'Ile to 5% z 5% z liczby 400?',eq:'',opts:['10','2','1','5'],ans:2,hint:'Wykonaj działania po kolei lub pomnóż: 0,05 × 0,05 × 400.'},
  {q:'Komputer kosztował 3000 zł. Podrożał o 10%, a potem staniał o 10%. Cena obecna:',eq:'',opts:['3000 zł','3300 zł','2970 zł','2700 zł'],ans:2,hint:'Dwa osobne mnożniki: najpierw ×1,1, potem ×0,9.'},
  {q:'Pan Kowalski zarabiał 4000 zł, po awansie 4800 zł. O ile % wzrosła pensja?',eq:'',opts:['20%','15%','25%','80%'],ans:0,hint:'Oblicz różnicę, podziel przez pensję wyjściową.'},
  {q:'W klasie 25-osobowej jest 15 dziewcząt. Jaki % klasy stanowią chłopcy?',eq:'',opts:['60%','40%','10%','15%'],ans:1,hint:'Najpierw oblicz ilu jest chłopców.'},
  {q:'Rozwiązanie: 0,8x + 0,2 × 50 = x',eq:'',opts:['50','20','80','10'],ans:0,hint:'Pomnóż i przenieś x na jedną stronę.'},
  {q:'1/3 liczby a zwiększona o 50% to:',eq:'',opts:['a','1/2 a','5/6 a','2/3 a'],ans:1,hint:'Zwiększenie o 50% = mnożenie przez 1,5 = przez 3/2.'},
  {q:'Lokata 2000 zł, 3% p.a., podatek 19%. Podatek wynosi:',eq:'',opts:['11,40 zł','380 zł','60 zł','600 zł'],ans:0,hint:'Najpierw wylicz odsetki brutto, potem 19% TYLKO od odsetek.'},
  {q:'Ile soli jest w 2 kg 15-procentowego roztworu?',eq:'',opts:['300 g','150 g','30 g','200 g'],ans:0,hint:'2 kg = 2000 g. 15% z 2000 g = ?'},
  {q:'Wiadomo że a = 40% liczby b. Zatem b jest od a większe o:',eq:'',opts:['60%','150%','250%','40%'],ans:1,hint:'Jeśli a = 0,4b, to b = ? · a.'},
  {q:'200 osób ankietowanych: 60% to dorośli, z nich 15% ma samochód. Ile dorosłych NIE MA samochodu?',eq:'',opts:['18','102','120','85'],ans:1,hint:'Oblicz 60% całości, potem weź 85% (= 100%−15%) tej grupy.'},
  {q:'Bilet normalny = x zł, ulgowy o 40% tańszy. 2 normalne + 3 ulgowe = ?',eq:'',opts:['3,8x','5x','3,2x','2,6x'],ans:0,hint:'Ulgowy = 0,6x. Liczysz 2x + 3·(0,6x).'},
  {q:'Do 10 kg solanki 8% dosypano 2 kg soli. Nowe stężenie:',eq:'',opts:['20%','23,3%','10%','18%'],ans:1,hint:'Dosypana substancja zwiększa też mianownik!'},
  {q:'O ile % wydłużyć bok kwadratu, by pole wzrosło o 44%?',eq:'',opts:['44%','22%','20%','12%'],ans:2,hint:'Pole = bok². Jeśli pole = 1,44a², to bok = √1,44 · a.'},
]

function KartkowkaContent({onComplete}) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([]),[hint,setHint]=useState(false)
  if(!mode)return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.blue,display:'inline-block'}}/>
        Kartkówka — 15 pytań
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
      <button onClick={()=>mode&&setKi(0)} disabled={!mode} style={btn({width:'100%',textAlign:'center',background:mode?C.navy:C.bg,color:mode?'#fff':C.text3,border:'none',padding:'13px',cursor:mode?'pointer':'not-allowed'})}>Zacznij kartkówkę →</button>
    </div>
  )
  if(ki>=KQ.length){const ok=results.filter(r=>r).length;return(
    <div style={{...card,textAlign:'center'}}>
      <div style={{fontSize:52,marginBottom:8}}>{ok>=12?'🏆':ok>=9?'⭐':'📚'}</div>
      <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>{ok}/15 poprawnych</div>
      <div style={{fontSize:14,color:C.text2,marginBottom:20}}>Ocena: {ok>=13?'A — doskonały':ok>=10?'B — dobry':ok>=7?'C — zadowalający':'D — wróć do teorii'}</div>
      <div style={{display:'flex',justifyContent:'center',gap:8}}>
        <button onClick={()=>{setMode(null);setKi(0);setSel(null);setDone(false);setResults([])}} style={btn()}>Powtórz</button>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Raport Maxa →</button>
      </div>
    </div>
  )}
  const q=KQ[ki]
  return(
    <div style={card}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue}}>✏️ Kartkówka {ki+1}/{KQ.length}</div>
        <span style={{fontSize:11,background:C.bg,color:C.text3,padding:'3px 10px',borderRadius:20,border:`0.5px solid ${C.border}`}}>{mode==='trening'?'🏋️ Trening':'🎯 Egzamin'}</span>
      </div>
      <div style={{display:'flex',gap:2,marginBottom:14}}>{KQ.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i<ki?C.green:i===ki?C.accent:C.border}}/>)}</div>
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:10,lineHeight:1.5}}>{q.q}</div>
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'10px 18px',marginBottom:14,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div></div>}
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
  {rok:'styl 2023',nr:17,pkt:3,
   tresc:'Sklep zakupił partię koszulek i narzucił na każdą 30% marży. Z powodu końca sezonu cenę obniżono o 20%. Po obniżce koszulka kosztuje 52 zł. Jaka była cena zakupu w hurtowni? Zapisz obliczenia.',
   wsk:'Zapisz kolejne zmiany jednym równaniem z x i dwoma mnożnikami dziesiętnym.',
   rozw:['Cena zakupu = x. Marża 30% → mnożnik 1,3. Obniżka 20% → mnożnik 0,8','Równanie: x · 1,3 · 0,8 = 52','Mnożnik łączny: 1,3 · 0,8 = 1,04','1,04 · x = 52','x = 52 ÷ 1,04 = 5200 ÷ 104 = 50'],
   odp:'Cena zakupu w hurtowni wynosiła 50 zł.',
   schemat:'Za cena po marży = 1,3x: 1 pkt. Za pełne równanie z obniżką: 2 pkt. Za wynik x=50: 3 pkt.'},
  {rok:'styl 2022',nr:19,pkt:3,
   tresc:'Zmieszano 3 kg syropu o zawartości 20% cukru z 2 kg syropu o zawartości 40% cukru. Jaka jest procentowa zawartość cukru w mieszaninie? Zapisz obliczenia.',
   wsk:'Oblicz masę czystego cukru w każdym syropie oddzielnie, potem dodaj.',
   rozw:['Cukier w syropie 1: 20% z 3 kg = 0,2 · 3 = 0,6 kg','Cukier w syropie 2: 40% z 2 kg = 0,4 · 2 = 0,8 kg','Łączna masa cukru: 0,6 + 0,8 = 1,4 kg','Łączna masa roztworu: 3 + 2 = 5 kg','Stężenie: (1,4 ÷ 5) · 100% = 28%'],
   odp:'Zawartość cukru w mieszaninie wynosi 28%.',
   schemat:'Za poprawne obliczenie masy cukru w jednym syropie: 1 pkt. Za stosunek substancji do mieszaniny: 2 pkt. Za wynik 28%: 3 pkt.'},
  {rok:'styl 2021',nr:16,pkt:2,
   tresc:'W klasie 8A chłopcy stanowili 40% uczniów. Po I semestrze doszły 2 dziewczynki (chłopców nie przybyło). Teraz chłopcy stanowią 36% uczniów. Ilu uczniów liczyła klasa na początku? Zapisz obliczenia.',
   wsk:'Oznacz przez x pierwotną liczbę uczniów. Liczba chłopców nie zmienia się — zrób równanie.',
   rozw:['Niech x = pierwotna liczba uczniów. Chłopcy: 0,4x','Po dojściu 2 dziewczynek: nowa liczba = x + 2, chłopcy nadal = 0,4x','Równanie: 0,4x = 0,36 · (x + 2)','0,4x = 0,36x + 0,72','0,04x = 0,72 → x = 18'],
   odp:'Klasa liczyła na początku 18 uczniów.',
   schemat:'Za poprawne równanie z jedną niewiadomej: 1 pkt. Za wynik x=18 z uzasadnieniem: 2 pkt.'},
]

function CKEContent({onComplete}) {
  const [rev,setRev]=useState([]),[sol,setSol]=useState(Array(CKE_Z.length).fill(false))
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:4,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.blue,display:'inline-block'}}/>
        Zadania z arkuszy CKE
      </div>
      <p style={{fontSize:13,color:C.text2,marginBottom:16,lineHeight:1.65}}>Zadania wzorowane na egzaminach ósmoklasisty. Spróbuj samodzielnie, potem sprawdź rozwiązanie ze schematem oceniania CKE.</p>
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
        <div style={{fontSize:14,color:C.text2}}>Procenty na poziomie egzaminacyjnym opanowane</div>
      </div>
      <div style={{background:C.navy,borderRadius:12,padding:'20px',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#F5541E,#FF7A4D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>🤖</div>
          <div><div style={{fontSize:14,fontWeight:500,color:'#fff'}}>Max</div><div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>podsumowanie lekcji</div></div>
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.8)',lineHeight:1.8,marginBottom:14}}>Procenty to temat który pojawia się na CKE w wielu postaciach — ceny, statystyki, stężenia, finanse. Pięć zasad które muszą być dla Ciebie automatyczne:</div>
        {[
          ['Reguła mnożnika','Każdą zmianę procentową zastępuj mnożnikiem dziesiętnym. Wielokrotne zmiany = mnożenie mnożników.'],
          ['Niesymetryczność procentów','−20% a potem +20% to NIE jest powrót do bazy. Procent zawsze liczymy od nowej wartości.'],
          ['Słowo "od" = mianownik','W pytaniu "o ile % więcej od X" — X zawsze trafia do mianownika (= 100%).'],
          ['Zasada stężeń','Stężenie = masa substancji ÷ masa CAŁEGO roztworu × 100%. Nigdy nie dziel przez samą wodę!'],
          ['Podatek od zysku','Podatek płacimy tylko od zarobionych odsetek, nigdy od wpłaconego kapitału.'],
        ].map(([t,d],i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:8,fontSize:13,color:'rgba(255,255,255,.75)',lineHeight:1.6}}>
            <span style={{color:'#F5541E',flexShrink:0,marginTop:1}}>→</span>
            <span><strong style={{color:'rgba(255,255,255,.95)'}}>{t}:</strong> {d}</span>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Oznacz lekcję jako ukończoną</button>
        <Link href="/kurs" style={{...btn(),textDecoration:'none',display:'inline-block'}}>← Powrót do kursu</Link>
      </div>
    </div>
  )
}

// ── KONFIGURACJA ──────────────────────────────────────────────────────────────
const DZIAL = {
  n:4, title:'Procenty i statystyka', href:'/kurs',
  lekcje:[
    {n:1,title:'Zastosowania procentów',href:'/kurs/procenty',status:'active'},
    {n:2,title:'Diagramy i statystyka',href:'#',status:'locked'},
    {n:3,title:'Sprawdzian działu',href:'#',status:'locked',isTest:true},
  ],
}
const LEKCJA = {n:1,total:2,slug:'procenty',title:'Zastosowania procentów — wielokrotne zmiany, stężenia i lokaty',czas:'30 min',poziom:'Poziom: zaawansowany',cke:true}
const XP_MAP = {teoria:60,quiz:50,fiszki:60,kartkowka:100,cke:70,raport:40}
const MAX_FAQ = [
  {q:'jak policzyć procent z liczby szybko',a:'Zamień procent na ułamek dziesiętny i pomnóż: 12% z 50 = 0,12 × 50 = 6. Dla podwyżki o 12%: cena × 1,12. Dla obniżki o 12%: cena × 0,88.'},
  {q:'punkty procentowe co to jest pp',a:'Punkt procentowy to wynik zwykłego odejmowania dwóch wartości procentowych. Wzrost z 10% do 15% to +5 p.p. Ale matematycznie wartość wskaźnika wzrosła o 50%! Te dwie liczby ZAWSZE różnią się.'},
  {q:'podwyżka potem obniżka ten sam procent czy to samo',a:'Zdecydowanie nie! Buty za 100 zł, podwyżka o 10% = 110 zł. Obniżka o 10% z 110 = 99 zł. Procenty działają na nowej bazie — używaj mnożników: 1,10 × 0,90 = 0,99.'},
  {q:'jak liczyć stężenie procentowe sól woda roztwoór',a:'Wzór: Cp = masa substancji ÷ masa CAŁEGO roztworu × 100%. Najczęstszy błąd: dzielenie przez masę wody zamiast przez całość. Masa roztworu = masa substancji + masa wody!'},
  {q:'podatek od lokaty odsetki jak liczyć belki',a:'Podatek pobieramy TYLKO od zarobionych odsetek (zysku), nie od wpłaconego kapitału! Odsetki brutto = kapitał × oprocentowanie × czas w latach. Odsetki netto = brutto × (1 − podatek/100).'},
]

export default function ProcentyLesson() {
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
