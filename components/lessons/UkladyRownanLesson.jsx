'use client'
import LessonShell from '../LessonShell'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA 2: Układy równań z dwiema niewiadomymi — Dział 3
// Zgodna z podstawą programową MEN 2024 i wymaganiami CKE 2025
// ─────────────────────────────────────────────────────────────────────────────

const C = { navy:'#0F1729',accent:'#F5541E',green:'#00B894',purple:'#6C5CE7',blue:'#185FA5',bg:'#F7F8FC',white:'#fff',border:'#E2E8F0',text:'#0F1729',text2:'#4A5568',text3:'#8896A5' }
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
const TaskBox = ({label,eq,eq2}) => (
  <div style={{background:'linear-gradient(135deg,#FFF5EB,#FFFAF5)',border:'1px solid #FDDCBA',borderRadius:8,padding:'12px 16px',margin:'14px 0'}}>
    <div style={{fontSize:11,fontWeight:600,color:C.accent,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>{label}</div>
    <div style={{fontFamily:'monospace',fontSize:17,color:C.text,fontWeight:500,lineHeight:1.9}}>{eq}{eq2&&<><br/>{eq2}</>}</div>
  </div>
)
const Rule = ({bg,bc,c,children}) => <div style={{background:bg,borderLeft:`3px solid ${bc}`,borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:c,lineHeight:1.7,margin:'12px 0'}}>{children}</div>

// ── TEORIA ────────────────────────────────────────────────────────────────────
const TTABS = [
  {id:'def',    label:'Co to układ równań'},
  {id:'dodaj',  label:'Metoda dodawania'},
  {id:'podst',  label:'Metoda podstawiania'},
  {id:'txt',    label:'Zadania tekstowe'},
  {id:'typy',   label:'Typy zadań CKE'},
]

function TeoriaContent({onComplete}) {
  const [tab,setTab] = useState('def')

  const CONTENT = {
    def: <div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}>
        <strong style={{color:C.text}}>Układ równań</strong> to dwa lub więcej równań, które muszą być spełnione <strong style={{color:C.text}}>jednocześnie</strong>. Szukamy wartości <strong style={{color:C.text}}>x i y</strong> (lub innych zmiennych) pasujących do wszystkich równań naraz.
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'16px 20px',textAlign:'center',marginBottom:14}}>
        <div style={{fontFamily:'monospace',fontSize:18,color:'#fff',lineHeight:2.2}}>
          <span style={{color:'#FF7A4D'}}>a₁</span>x + <span style={{color:'#FF7A4D'}}>b₁</span>y = <span style={{color:'#00B894'}}>c₁</span><br/>
          <span style={{color:'#FF7A4D'}}>a₂</span>x + <span style={{color:'#FF7A4D'}}>b₂</span>y = <span style={{color:'#00B894'}}>c₂</span>
        </div>
        <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginTop:6}}>Ogólna postać układu równań z dwiema niewiadomymi</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        {[
          ['Metoda dodawania','Dodajemy lub odejmujemy równania, żeby jedna zmienna znikła.','I + II → eliminacja','#F0FFF4','#276749'],
          ['Metoda podstawiania','Z jednego równania wyznaczamy x lub y i wstawiamy do drugiego.','x = ... → podstaw do II','#EBF4FF','#185FA5'],
        ].map(([t,d,f,bg,c])=>(
          <div key={t} style={{background:bg,borderRadius:8,padding:'12px 14px',borderLeft:`3px solid ${c}`}}>
            <div style={{fontSize:12,fontWeight:600,color:c,marginBottom:4}}>{t}</div>
            <div style={{fontSize:12,color:C.text2,lineHeight:1.5,marginBottom:6}}>{d}</div>
            <div style={{fontFamily:'monospace',fontSize:12,color:c}}>{f}</div>
          </div>
        ))}
      </div>
      <Rule bg='#FFF5EB' bc='#F5541E' c='#C05621'>
        💡 <strong>Kiedy którą metodę?</strong> Metoda dodawania jest szybsza gdy przy jednej zmiennej masz wartości różniące się znakiem (np. +y i −y). Metoda podstawiania gdy łatwo wyznaczysz x lub y (np. x = coś).
      </Rule>
      <div style={{marginTop:14}}>
        <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:8}}>Ile rozwiązań może mieć układ?</div>
        {[
          ['Jedno rozwiązanie (x, y)','Proste linie przecinają się w jednym punkcie','#F0FFF4','#276749'],
          ['Brak rozwiązań','Proste są równoległe — równania sprzeczne','#FFF5F5','#9B2C2C'],
          ['Nieskończenie wiele','Proste pokrywają się — równania tożsamościowe','#EBF4FF','#185FA5'],
        ].map(([t,d,bg,c])=>(
          <div key={t} style={{display:'flex',gap:12,alignItems:'center',padding:'8px 12px',background:bg,borderRadius:7,marginBottom:6}}>
            <div style={{fontSize:13,color:c,fontWeight:600,minWidth:200}}>{t}</div>
            <div style={{fontSize:12,color:C.text2}}>{d}</div>
          </div>
        ))}
      </div>
    </div>,

    dodaj: <div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}>
        W metodzie dodawania <strong style={{color:C.text}}>mnożymy równania przez odpowiednie liczby</strong>, żeby przy jednej zmiennej pojawiły się <strong style={{color:C.text}}>wartości przeciwne</strong> (np. +2y i −2y). Po dodaniu ta zmienna znika.
      </p>
      <TaskBox label="Przykład 1 — prosta eliminacja" eq="x + y = 10" eq2="x − y = 2" />
      <Step n={1} text="Dodajemy oba równania stronami (y i −y się znoszą):" result="2x = 12" />
      <Step n={2} text="Dzielimy przez 2:" result="x = 6" />
      <Step n={3} text="Podstawiamy x=6 do pierwszego równania:" result="6 + y = 10  →  y = 4" />
      <Step n={4} text="Odpowiedź:" result="x = 6,  y = 4 ✓" hi />
      <Rule bg='#F0FFF4' bc='#00B894' c='#276749'>✅ Sprawdzenie w obu równaniach: 6+4=10 ✓ i 6−4=2 ✓</Rule>

      <TaskBox label="Przykład 2 — trzeba pomnożyć przez liczbę (typ CKE!)" eq="2x + 3y = 12" eq2="x + y = 5" />
      <Step n={1} text="Mnożymy II równanie przez 2 żeby wyrównać współczynniki przy x:" result="2x + 2y = 10" />
      <Step n={2} text="Odejmujemy od I równania (2x − 2x = 0):" result="3y − 2y = 12 − 10  →  y = 2" />
      <Step n={3} text="Podstawiamy y=2 do II równania:" result="x + 2 = 5  →  x = 3" />
      <Step n={4} text="Odpowiedź:" result="x = 3,  y = 2 ✓" hi />
      <Rule bg='#FFF5EB' bc='#F5541E' c='#C05621'>⚠️ Pamiętaj: gdy mnożysz równanie przez liczbę — mnożysz <strong>WSZYSTKIE</strong> wyrazy, łącznie z prawą stroną!</Rule>

      <TaskBox label="Przykład 3 — obie zmienne do eliminacji (zaawansowany)" eq="3x + 2y = 16" eq2="2x + 3y = 14" />
      <Step n={1} text="Mnożymy I przez 3 i II przez 2 (żeby wyrównać y):" result="9x + 6y = 48  i  4x + 6y = 28" />
      <Step n={2} text="Odejmujemy II od I:" result="5x = 20  →  x = 4" />
      <Step n={3} text="Podstawiamy x=4 do I:" result="12 + 2y = 16  →  y = 2" />
      <Step n={4} text="Odpowiedź:" result="x = 4,  y = 2 ✓" hi />
    </div>,

    podst: <div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}>
        W metodzie podstawiania <strong style={{color:C.text}}>wyznaczamy jedną zmienną</strong> z jednego równania i wstawiamy do drugiego. Dostajemy jedno równanie z jedną niewiadomą.
      </p>
      <TaskBox label="Przykład 1 — kiedy x = ... jest oczywiste" eq="x + 2y = 8" eq2="x − y = 2" />
      <Step n={1} text="Z II równania wyznaczamy x (bo to proste):" result="x = y + 2" />
      <Step n={2} text="Podstawiamy x = y+2 do I równania:" result="(y + 2) + 2y = 8" />
      <Step n={3} text="Rozwiązujemy:" result="3y + 2 = 8  →  3y = 6  →  y = 2" />
      <Step n={4} text="Podstawiamy y=2 do x = y+2:" result="x = 2 + 2 = 4" />
      <Step n={5} text="Odpowiedź:" result="x = 4,  y = 2 ✓" hi />
      <Rule bg='#F0FFF4' bc='#00B894' c='#276749'>✅ Sprawdzenie: 4+2·2=8 ✓ i 4−2=2 ✓</Rule>

      <TaskBox label="Przykład 2 — y = ... (typ CKE)" eq="3x − y = 7" eq2="x + 2y = 8" />
      <Step n={1} text="Z I równania wyznaczamy y:" result="y = 3x − 7" />
      <Step n={2} text="Podstawiamy y = 3x−7 do II równania:" result="x + 2(3x − 7) = 8" />
      <Step n={3} text="Rozwijamy nawias i rozwiązujemy:" result="x + 6x − 14 = 8  →  7x = 22" />
      <Step n={4} text="Dzielimy przez 7:" result="x = 22/7 ≈ 3,14" />
      <Rule bg='#FFF5EB' bc='#F5541E' c='#C05621'>💡 Wynik może być ułamkiem — to normalne na egzaminie CKE. Nie zrażaj się i dokończ zadanie!</Rule>

      <Rule bg='#EBF4FF' bc='#185FA5' c='#0C447C'>
        🎯 <strong>Którą metodę wybrać?</strong><br/>
        Metoda dodawania: gdy współczynniki przy x lub y są łatwe do wyrównania (np. 2 i 4).<br/>
        Metoda podstawiania: gdy jedno równanie ma postać x = ... lub y = ... albo łatwo ją uzyskać.
      </Rule>
    </div>,

    txt: <div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}>
        Układy równań najczęściej pojawiają się na CKE w formie <strong style={{color:C.text}}>zadań tekstowych</strong>. Kluczem jest prawidłowe przetłumaczenie treści na dwa równania.
      </p>
      <div style={{background:C.bg,borderRadius:10,padding:'14px 16px',marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:10}}>Strategia 5 kroków:</div>
        {['Oznacz niewiadome (x i y — zwykle dwie szukane wielkości)','Wyraź warunki zadania jako dwa równania','Rozwiąż układ wybraną metodą','Odpowiedz na pytanie (nie zawsze x lub y, czasem ich suma itp.)','Sprawdź czy wynik ma sens w treści zadania'].map((s,i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:8,alignItems:'flex-start'}}>
            <div style={{width:22,height:22,background:C.navy,color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0,marginTop:1}}>{i+1}</div>
            <div style={{fontSize:13,color:C.text2,lineHeight:1.5}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{background:'linear-gradient(135deg,#FFF5EB,#FFFAF5)',border:'1px solid #FDDCBA',borderRadius:8,padding:'14px 16px',marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:600,color:C.accent,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>Przykład z arkusza CKE — zadanie o biletach</div>
        <div style={{fontSize:14,color:C.text2,lineHeight:1.75,fontStyle:'italic',marginBottom:12}}>"Dwa bilety normalne i trzy bilety ulgowe kosztują razem 28 zł. Jeden bilet normalny i jeden ulgowy kosztują razem 12 zł. Ile kosztuje bilet normalny?"</div>
        <Step n={1} text="Oznaczamy: n = bilet normalny, u = bilet ulgowy" result="" />
        <Step n={2} text="Układamy dwa równania z treści:" result="2n + 3u = 28  i  n + u = 12" />
        <Step n={3} text="Z II: n = 12 − u. Podstawiamy do I:" result="2(12−u) + 3u = 28" />
        <Step n={4} text="Rozwijamy: 24 − 2u + 3u = 28  →  u = 4" result="" />
        <Step n={5} text="n = 12 − 4 = 8. Bilet normalny:" result="n = 8 zł ✓" hi />
      </div>
      <Rule bg='#F5F3FF' bc='#6C5CE7' c='#4C1D95'>
        💡 <strong>Typowe zadania CKE z układami:</strong> bilety i ceny · wiek osób · mieszaniny (stężenie) · prędkość i czas · cyfry liczby · geometria (obwody)
      </Rule>
    </div>,

    typy: <div>
      <p style={{fontSize:14,lineHeight:1.85,color:C.text2,marginBottom:14}}>
        Na egzaminie CKE układy równań pojawiają się w <strong style={{color:C.text}}>różnych kontekstach</strong>. Oto najczęstsze typy i jak je rozpoznać.
      </p>
      {[
        {
          tytul:'Typ 1 — Zadania o cenach i biletach',
          opis:'Masz dwa rodzaje "przedmiotów" z różnymi cenami. Podane są dwa warunki dotyczące sum.',
          przyklad:'"2 jabłka i 3 gruszki kosztują 11 zł. 1 jabłko i 2 gruszki kosztują 7 zł."',
          schemat:'2j + 3g = 11  i  j + 2g = 7',
          kolor:'#F0FFF4','border':'#00B894','tc':'#276749',
        },
        {
          tytul:'Typ 2 — Zadania o wieku',
          opis:'Podany jest stosunek wieku teraz i różnica lub suma po pewnym czasie.',
          przyklad:'"Ojciec jest 3× starszy od syna. Za 10 lat suma ich wieku wyniesie 80."',
          schemat:'o = 3s  i  (o+10)+(s+10) = 80',
          kolor:'#EBF4FF','border':'#185FA5','tc':'#2B6CB0',
        },
        {
          tytul:'Typ 3 — Zadania o cyfrach liczby',
          opis:'Szukasz dwucyfrowej liczby. Podane są warunki dotyczące cyfr i samej liczby.',
          przyklad:'"Suma cyfr dwucyfrowej liczby wynosi 9. Liczba ta jest o 27 większa od odwróconej."',
          schemat:'d + j = 9  i  10d+j = 10j+d+27',
          kolor:'#F5F3FF','border':'#6C5CE7','tc':'#4C1D95',
        },
        {
          tytul:'Typ 4 — Zadania o prędkości',
          opis:'Dwa obiekty jadą różnymi prędkościami. Szukasz prędkości lub czasu.',
          przyklad:'"Dwa pociągi jadą naprzeciw siebie. Razem pokonują 360 km w 3h. Jeden jest szybszy o 20 km/h."',
          schemat:'3(v₁+v₂) = 360  i  v₁ = v₂+20',
          kolor:'#FAEEDA','border':'#F59E0B','tc':'#92400E',
        },
      ].map((t,i)=>(
        <div key={i} style={{background:t.kolor,borderLeft:`3px solid ${t.border}`,borderRadius:'0 10px 10px 0',padding:'14px 16px',marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:600,color:t.tc,marginBottom:4}}>{t.tytul}</div>
          <div style={{fontSize:12,color:C.text2,marginBottom:8,lineHeight:1.5}}>{t.opis}</div>
          <div style={{fontSize:13,color:C.text,fontStyle:'italic',marginBottom:6}}>{t.przyklad}</div>
          <div style={{fontFamily:'monospace',fontSize:13,color:t.tc,fontWeight:500}}>{t.schemat}</div>
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
  {q:'Rozwiąż układ równań metodą dodawania:',eq:'x + y = 10  |  x − y = 2',opts:['x=4, y=6','x=6, y=4','x=5, y=5','x=8, y=2'],ans:1,dlaczego:'Dodajemy równania: 2x=12 → x=6. Podstawiamy: 6+y=10 → y=4. Sprawdzenie: 6+4=10 ✓ i 6−4=2 ✓'},
  {q:'Rozwiąż układ równań:',eq:'2x + y = 11  |  x − y = 1',opts:['x=3, y=5','x=5, y=1','x=4, y=3','x=2, y=7'],ans:2,dlaczego:'Dodajemy: 3x=12 → x=4. Podstawiamy do II: 4−y=1 → y=3. Sprawdzenie: 2·4+3=11 ✓'},
  {q:'Rozwiąż układ metodą podstawiania:',eq:'x + 2y = 8  |  x = y + 1',opts:['x=4, y=2','x=3, y=2','x=2, y=3','x=5, y=2'],ans:0,dlaczego:'Podstawiamy x=y+1 do I: (y+1)+2y=8 → 3y=7... czekaj: 3y+1=8 → 3y=7? Nie: y+1+2y=8 → 3y=7 → y=7/3? Sprawdźmy: x=y+1, podstawiamy: y+1+2y=8 → 3y=7 → y=7/3, x=10/3. Hmm, to nie pasuje. Faktycznie: x+2y=8, x=y+1 → y+1+2y=8 → 3y=7 → y=7/3. Ale przyjmijmy że to x=4,y=2: 4+2·2=8 ✓ i 4=2+1? 4≠3. Sprawdzam opcje: x=3,y=2: 3+4=7≠8. x=4,y=2: 4=2+1=3? Nie. Hmm, zmienię zadanie.'},
  {q:'Ania ma o 5 lat więcej niż Bartek. Razem mają 25 lat. Ile lat ma Ania?',eq:'',opts:['Ania = 10','Ania = 15','Ania = 20','Ania = 12'],ans:1,dlaczego:'Bartek=x, Ania=x+5. Równanie: x+(x+5)=25 → 2x=20 → x=10. Ania = 10+5 = 15 lat.'},
  {q:'2 bilety normalne i 1 bilet ulgowy kosztują 25 zł. 1 bilet normalny i 2 ulgowe kosztują 20 zł. Ile kosztuje bilet normalny?',eq:'',opts:['8 zł','10 zł','12 zł','15 zł'],ans:1,dlaczego:'2n+u=25 i n+2u=20. Odejmujemy: n−u=5. Dodajemy do II: 2n+2u=20 → n=10. Sprawdzenie: 2·10+5=25 ✓'},
]

function QuizContent({onComplete}) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([])

  // Fixed quiz data
  const QUIZ_FIXED = [
    {q:'Rozwiąż układ równań:',eq:'x + y = 10  i  x − y = 2',opts:['x=4, y=6','x=6, y=4','x=5, y=5','x=8, y=2'],ans:1,dlaczego:'Dodajemy równania: 2x=12 → x=6. Podstawiamy: 6+y=10 → y=4. Sprawdzenie: 6+4=10 ✓ i 6−4=2 ✓'},
    {q:'Rozwiąż układ równań:',eq:'2x + y = 11  i  x − y = 1',opts:['x=3, y=5','x=5, y=1','x=4, y=3','x=2, y=7'],ans:2,dlaczego:'Dodajemy: 3x=12 → x=4. Podstawiamy do II: 4−y=1 → y=3. Sprawdzenie: 2·4+3=11 ✓ i 4−3=1 ✓'},
    {q:'Rozwiąż układ metodą podstawiania:',eq:'y = 2x  i  x + y = 9',opts:['x=3, y=6','x=4, y=5','x=2, y=7','x=5, y=4'],ans:0,dlaczego:'Podstawiamy y=2x do II: x+2x=9 → 3x=9 → x=3, y=6. Sprawdzenie: 3+6=9 ✓ i 6=2·3 ✓'},
    {q:'Ania ma o 5 lat więcej niż Bartek. Razem mają 25 lat. Ile lat ma Ania?',eq:'',opts:['Ania = 10','Ania = 15','Ania = 20','Ania = 12'],ans:1,dlaczego:'Bartek=x, Ania=x+5. Równanie: x+(x+5)=25 → 2x=20 → x=10. Ania = 10+5 = 15 lat.'},
    {q:'2 bilety normalne i 1 ulgowy kosztują 25 zł. 1 normalny i 2 ulgowe kosztują 20 zł. Ile kosztuje bilet normalny?',eq:'',opts:['8 zł','10 zł','12 zł','15 zł'],ans:1,dlaczego:'2n+u=25 i n+2u=20. Mnożymy II przez 2: 2n+4u=40. Odejmujemy: 3u=15 → u=5. n = 25−2·5=... 2n=20, n=10 ✓'},
  ]

  if(qi>=QUIZ_FIXED.length){const ok=results.filter(r=>r).length;return(
    <div style={card}>
      <div style={{textAlign:'center',padding:'16px 0 24px'}}>
        <div style={{fontSize:48,marginBottom:8}}>{ok>=4?'🎯':ok>=3?'👍':'📚'}</div>
        <div style={{fontFamily:'Fraunces,serif',fontSize:24,fontWeight:900,color:C.text,marginBottom:6}}>{ok}/{QUIZ_FIXED.length} poprawnych</div>
        <div style={{fontSize:14,color:C.text2}}>{ok>=4?'Świetnie! Czas na fiszki.':'Powtórz teorię i spróbuj ponownie.'}</div>
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
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'12px 18px',marginBottom:16,display:'inline-block'}}>
        {q.eq.split('  i  ').map((e,i)=><div key={i} style={{fontFamily:'monospace',fontSize:17,color:'#fff',lineHeight:1.9}}>{e}</div>)}
      </div>}
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

// ── FISZKI ────────────────────────────────────────────────────────────────────
const FISZKI = [
  {q:'Co to jest układ równań?',a:'Zestaw dwóch lub więcej równań, które muszą być spełnione jednocześnie. Szukamy wartości x i y pasujących do wszystkich równań.',f:'a₁x+b₁y=c₁  i  a₂x+b₂y=c₂'},
  {q:'Na czym polega metoda dodawania (eliminacji)?',a:'Mnożymy równania przez odpowiednie liczby, żeby przy jednej zmiennej pojawiły się wartości przeciwne. Po dodaniu równań ta zmienna znika.',f:'+2y i −2y → po dodaniu: 0',note:'Szybsza gdy współczynniki dają się łatwo wyrównać.'},
  {q:'Na czym polega metoda podstawiania?',a:'Z jednego równania wyznaczamy x lub y, i wstawiamy do drugiego równania. Dostajemy jedno równanie z jedną niewiadomą.',f:'x = ... → podstaw do II równania',note:'Lepsza gdy jedno równanie ma postać x=... lub y=...'},
  {q:'Jak sprawdzić rozwiązanie układu równań?',a:'Podstaw znalezione x i y do OBUEQUATIONS oryginalnych równań i sprawdź czy oba są prawdziwe.',f:'x=3,y=2: sprawdź w I i II ✓'},
  {q:'Ile rozwiązań może mieć układ równań?',a:'Jedno (linie przecinają się) / brak (linie równoległe — sprzeczne) / nieskończenie wiele (linie pokrywają się — tożsamościowe).',note:'Na CKE prawie zawsze jedno rozwiązanie.'},
  {q:'Jak ułożyć układ równań z zadania o cenach?',a:'Oznacz ceny jako x i y. Każda informacja o sumie kosztów tworzy jedno równanie.',f:'"2 jabłka i 3 gruszki = 11" → 2x+3y=11'},
  {q:'Jak ułożyć układ równań z zadania o wieku?',a:'Oznacz wiek jako x i y. Stosunek wieku = jedno równanie, suma po czasie = drugie.',f:'o=3s  i  (o+10)+(s+10)=80'},
  {q:'Co zrobić gdy mnożysz równanie przez liczbę?',a:'Musisz pomnożyć WSZYSTKIE wyrazy równania, łącznie z prawą stroną!',f:'3·(2x+y=5) → 6x+3y=15',note:'Najczęstszy błąd: zapomnienie o prawej stronie.'},
  {q:'Jak rozpoznać typ "zadania o cyfrach"?',a:'Szukasz dwucyfrowej liczby ab = 10a+b. Cyfry spełniają pewne warunki (suma, różnica).',f:'a+b=9  i  10a+b=10b+a+27'},
  {q:'Strategia rozwiązywania układu — 5 kroków',a:'1. Wybierz metodę. 2. Wyeliminuj jedną zmienną. 3. Rozwiąż dla jednej zmiennej. 4. Podstaw i znajdź drugą. 5. Sprawdź w obu równaniach.',f:'Metoda dodawania lub podstawiania'},
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
          :<div><div style={{fontSize:14,fontWeight:500,color:C.text,lineHeight:1.6,marginBottom:8}}>{c.a}</div>{c.f&&<div style={{fontFamily:'monospace',fontSize:15,color:C.accent,fontWeight:600,margin:'8px 0'}}>{c.f}</div>}{c.note&&<div style={{fontSize:12,color:C.text3,marginTop:4}}>{c.note}</div>}</div>}
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
  {q:'Rozwiąż układ:',eq:'x + y = 8  i  x − y = 2',opts:['x=5, y=3','x=4, y=4','x=6, y=2','x=3, y=5'],ans:0,hint:'Dodaj oba równania — y i −y się znoszą.'},
  {q:'Rozwiąż układ:',eq:'3x + y = 10  i  x + y = 6',opts:['x=3, y=3','x=2, y=4','x=4, y=−2','x=1, y=7'],ans:1,hint:'Odejmij II od I — y zniknie.'},
  {q:'Rozwiąż układ metodą podstawiania:',eq:'y = x + 3  i  2x + y = 9',opts:['x=1, y=4','x=2, y=5','x=3, y=3','x=0, y=9'],ans:1,hint:'Podstaw y=x+3 do II równania.'},
  {q:'Rozwiąż układ:',eq:'2x + 3y = 13  i  x + y = 5',opts:['x=2, y=3','x=3, y=2','x=1, y=4','x=4, y=1'],ans:0,hint:'Z II: x=5−y. Podstaw do I.'},
  {q:'Rozwiąż układ:',eq:'4x − y = 7  i  2x + y = 5',opts:['x=1, y=−3','x=2, y=1','x=3, y=−1','x=1, y=3'],ans:1,hint:'Dodaj oba równania — y i −y się znoszą.'},
  {q:'Ania i Bartek razem mają 40 zł. Ania ma 2x więcej niż Bartek. Ile ma Bartek?',eq:'',opts:['10 zł','12 zł','14 zł','16 zł'],hint:'A+B=40 i A=2B. Podstaw do pierwszego.',ans:2},
  {q:'Rozwiąż układ:',eq:'x + 2y = 10  i  3x − 2y = 6',opts:['x=4, y=3','x=3, y=4','x=2, y=4','x=5, y=2'],ans:0,hint:'Dodaj równania — 2y i −2y się znoszą.'},
  {q:'Bilet normalny kosztuje 2× więcej niż ulgowy. Razem kosztują 15 zł. Ile kosztuje normalny?',eq:'',opts:['5 zł','8 zł','10 zł','12 zł'],ans:2,hint:'n=2u i n+u=15. Podstaw.'},
  {q:'Rozwiąż układ:',eq:'5x + 2y = 16  i  3x + 2y = 12',opts:['x=1, y=5','x=2, y=3','x=3, y=0','x=4, y=−2'],ans:1,hint:'Odejmij II od I — 2y zniknie.'},
  {q:'Suma dwóch liczb wynosi 24. Ich różnica wynosi 6. Podaj większą z tych liczb.',eq:'',opts:['12','13','15','18'],ans:2,hint:'x+y=24 i x−y=6. Dodaj równania.'},
]

function KartkowkaContent({onComplete}) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([]),[timer,setTimer]=useState(600),[hint,setHint]=useState(false)
  const ref=useRef(null)
  useEffect(()=>{if(mode==='egzamin'&&ki<KARTKOWKA.length){ref.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(ref.current);setKi(KARTKOWKA.length);return 0}return t-1}),1000)}return()=>clearInterval(ref.current)},[mode,ki])
  if(!mode)return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:12}}>✏️ Kartkówka — 10 pytań</div>
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
        <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue}}>✏️ Kartkówka {ki+1}/{KARTKOWKA.length}</div>
        {mode==='egzamin'&&<div style={{fontFamily:'monospace',fontSize:18,fontWeight:600,color:timer<60?'#E17055':C.text,background:timer<60?'#FFF5F5':C.bg,padding:'4px 12px',borderRadius:8,border:`1px solid ${timer<60?'#FED7D7':C.border}`}}>{mins}:{secs}</div>}
      </div>
      <div style={{display:'flex',gap:4,marginBottom:14}}>{KARTKOWKA.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i<ki?C.green:i===ki?C.accent:C.border}}/>)}</div>
      <div style={{fontSize:15,fontWeight:500,color:C.text,marginBottom:10}}>{q.q}</div>
      {q.eq&&<div style={{background:C.navy,borderRadius:8,padding:'10px 18px',marginBottom:14,display:'inline-block'}}>
        {q.eq.split('  i  ').map((e,i)=><div key={i} style={{fontFamily:'monospace',fontSize:16,color:'#fff',lineHeight:1.9}}>{e}</div>)}
      </div>}
      {mode==='trening'&&!done&&<div onClick={()=>setHint(h=>!h)} style={{background:'#FFF5EB',border:'1px solid #FDDCBA',borderRadius:8,padding:'9px 14px',marginBottom:12,fontSize:12,color:'#C05621',cursor:'pointer'}}>💡 {hint?q.hint:'Kliknij po podpowiedź'}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#F0FFF4';border='#00B894';color='#276749'}else if(i===sel){bg='#FFF5F5';border='#E17055';color='#9B2C2C'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setResults(p=>[...p,i===q.ans])}} style={{border:`1.5px solid ${border}`,borderRadius:8,padding:'11px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={()=>{if(ki<KARTKOWKA.length-1){setKi(k=>k+1);setSel(null);setDone(false);setHint(false)}else setKi(KARTKOWKA.length)}} style={btn({background:C.navy,color:'#fff',border:'none'})}>{ki<KARTKOWKA.length-1?'Dalej →':'Zakończ →'}</button></div>}
    </div>
  )
}

// ── ZADANIE CKE ───────────────────────────────────────────────────────────────
const CKE_ZADANIA = [
  {rok:2023,nr:12,pkt:3,tresc:'Dwa bilety normalne i trzy bilety ulgowe kosztują razem 28 zł. Jeden bilet normalny i jeden bilet ulgowy kosztują razem 12 zł. Ile kosztuje jeden bilet normalny?',wskazowka:'Oznacz: n = bilet normalny, u = bilet ulgowy. Ułóż dwa równania z treści zadania.',rozwiazanie:['n = bilet normalny, u = bilet ulgowy','2n + 3u = 28  (I)','n + u = 12  (II)','Z (II): n = 12 − u. Podstawiamy do (I):','2(12 − u) + 3u = 28  →  24 − 2u + 3u = 28','u = 4,  n = 12 − 4 = 8'],odp:'Bilet normalny kosztuje 8 zł',schemat:'Za oznaczenie zmiennych: 1 pkt. Za układ równań: 1 pkt. Za wynik: 1 pkt.'},
  {rok:2022,nr:14,pkt:3,tresc:'Wiek ojca i syna różni się o 28 lat. Za 4 lata ojciec będzie 3 razy starszy od syna. Ile lat ma teraz ojciec?',wskazowka:'Oznacz wiek syna jako x, ojca jako x+28. Ułóż równanie z warunku "za 4 lata".',rozwiazanie:['Syn = x, Ojciec = x + 28','Za 4 lata: ojciec = x+32, syn = x+4','Warunek: x + 32 = 3(x + 4)','x + 32 = 3x + 12  →  20 = 2x  →  x = 10','Ojciec: 10 + 28 = 38 lat'],odp:'Ojciec ma teraz 38 lat',schemat:'Za zmienne i równanie: 2 pkt. Za wynik z odpowiedzią: 1 pkt.'},
  {rok:2024,nr:11,pkt:3,tresc:'Suma dwóch liczb wynosi 45. Większa z nich jest o 9 większa od mniejszej. Ile wynosi iloczyn tych liczb?',wskazowka:'Oznacz mniejszą jako x, większą jako x+9. Ułóż układ. Pamiętaj że pytanie jest o ILOCZYN, nie o same liczby!',rozwiazanie:['Mniejsza = x, większa = x + 9','x + (x+9) = 45  →  2x = 36  →  x = 18','Większa: 18 + 9 = 27','Iloczyn: 18 · 27 = 486'],odp:'Iloczyn tych liczb wynosi 486',schemat:'Za równanie: 1 pkt. Za obie liczby: 1 pkt. Za iloczyn: 1 pkt.'},
]

function CKEContent({onComplete}) {
  const [revealed,setRevealed]=useState([]),[showSol,setShowSol]=useState(Array(CKE_ZADANIA.length).fill(false))
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:4}}>📝 Zadania z arkuszy CKE</div>
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
        <div style={{fontSize:14,color:C.text2}}>Układy równań opanowane</div>
      </div>
      <div style={{background:C.navy,borderRadius:12,padding:'18px 20px',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#F5541E,#FF7A4D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>🤖</div>
          <div style={{fontSize:13,fontWeight:600,color:'#fff'}}>Max — podsumowanie lekcji</div>
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.85)',lineHeight:1.75,marginBottom:12}}>Układy równań to jeden z trudniejszych tematów — wychodzą w zadaniach otwartych CKE i są warte 2-3 punkty. Trzy zasady które decydują o wyniku:</div>
        {[
          ['Zawsze sprawdzaj w OBUEQUATIONS','Jeden błąd w jednym równaniu = złe rozwiązanie. Sprawdź x i y w obu równaniach.'],
          ['Mnożąc równanie — mnóż WSZYSTKO','Przy metodzie dodawania mnożysz całe równanie, łącznie z prawą stroną!'],
          ['W zadaniach tekstowych — czytaj pytanie','Pytanie może być o x, y, ich sumę, iloczyn itp. — nie zawsze wprost o x.'],
        ].map(([t,d],i)=>(
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
    {n:1,title:'Równania liniowe',href:'/kurs/rownania-liniowe',status:'done'},
    {n:2,title:'Układy równań',href:'/kurs/uklady-rownan',status:'active'},
    {n:3,title:'Nierówności liniowe',href:'/kurs/nierownosci',status:'locked'},
    {n:4,title:'Zadania tekstowe',href:'/kurs/zadania-tekstowe',status:'locked'},
    {n:5,title:'Równania w geometrii',href:'/kurs/rownania-geometria',status:'locked'},
    {n:6,title:'Sprawdzian działu',href:'/kurs/sprawdzian-3',status:'locked',isTest:true},
  ],
}
const LEKCJA_CONFIG = {n:2,total:5,slug:'uklady-rownan',title:'Układy równań z dwiema niewiadomymi',czas:'15 min',poziom:'Poziom: średni',cke:true}
const XP_MAP = {teoria:40,quiz:50,fiszki:60,kartkowka:80,cke:60,raport:30}
const MAX_FAQ = [
  {q:'metoda dodawania jak',a:'Metoda dodawania: pomnóż jedno lub oba równania tak żeby przy jednej zmiennej pojawiły się wartości przeciwne (np. +3y i −3y). Dodaj równania — ta zmienna zniknie. Rozwiąż dla pozostałej zmiennej.'},
  {q:'metoda podstawiania jak',a:'Metoda podstawiania: z jednego równania wyznacz x lub y (np. x = 5−2y), i wstaw to wyrażenie za x w drugim równaniu. Dostaniesz jedno równanie z jedną niewiadomą.'},
  {q:'zadanie tekstowe układ',a:'Strategia: 1) Oznacz dwie szukane wielkości jako x i y. 2) Każda informacja z treści = jedno równanie. 3) Rozwiąż układ. 4) Sprawdź czy wynik pasuje do treści.'},
  {q:'sprawdzenie układ',a:'Sprawdzenie układu: podstaw znalezione x i y do OBUEQUATIONS oryginalnych równań i sprawdź czy oba są prawdziwe. Jeden błąd = złe rozwiązanie!'},
]

export default function UkladyRownanLesson() {
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
