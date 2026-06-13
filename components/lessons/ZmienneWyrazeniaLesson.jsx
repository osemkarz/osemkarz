'use client'
import { useState, useRef, useEffect } from 'react'
import LessonShell from '../LessonShell'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA: Zmienne i wyrażenia algebraiczne
// Dział 2 | Abeka Pre-Algebra 3.1–3.3 | CKE
// Redesign: ciemny, ostry, zero banalności
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  navy:'#0A0F1E', dark:'#111827', card:'#1A2236',
  accent:'#FF4D1C', green:'#00C896', blue:'#3B82F6',
  purple:'#8B5CF6', yellow:'#FBBF24',
  white:'#F9FAFB', dim:'#6B7280', border:'rgba(255,255,255,0.08)',
  bg:'#0D1321',
}

const s = {
  card: {
    background: C.card,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    padding: 28,
    color: C.white,
  },
  mono: { fontFamily: '"SF Mono", "Fira Code", monospace' },
}

const btn = (x={}) => ({
  padding: '10px 22px', fontSize: 13, fontWeight: 600,
  borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
  border: `1px solid ${C.border}`, background: 'transparent',
  color: C.white, transition: 'all .15s', ...x,
})

// ── Komponenty UI ─────────────────────────────────────────────────────────────

const Tag = ({children, color=C.accent}) => (
  <span style={{
    fontSize: 10, fontWeight: 700, letterSpacing: '.08em',
    textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6,
    background: color + '22', color, border: `1px solid ${color}44`,
  }}>{children}</span>
)

const Eq = ({children, big}) => (
  <div style={{
    ...s.mono, fontSize: big ? 22 : 16, color: C.yellow,
    background: '#0A0F1E', borderRadius: 10, padding: big ? '14px 20px' : '8px 14px',
    display: 'inline-block', letterSpacing: '0.02em',
    border: `1px solid rgba(251,191,36,0.2)`,
  }}>{children}</div>
)

const Krok = ({n, text, eq, hi}) => (
  <div style={{ display:'flex', gap:12, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>
    <div style={{
      width:26, height:26, borderRadius:'50%', flexShrink:0, marginTop:2,
      background: hi ? C.green : C.accent,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:11, fontWeight:800, color:'#000',
    }}>{n}</div>
    <div style={{ flex:1 }}>
      <div style={{ fontSize:13, color:'#CBD5E1', lineHeight:1.6, marginBottom: eq?8:0 }}>{text}</div>
      {eq && (
        <div style={{
          ...s.mono, fontSize:15, color: hi ? C.green : C.yellow,
          background: '#0A0F1E', borderRadius:8, padding:'8px 14px',
          display:'inline-block', border:`1px solid ${hi ? C.green + '44' : 'rgba(251,191,36,0.2)'}`,
        }}>{eq}</div>
      )}
    </div>
  </div>
)

const Rule = ({type='info', children}) => {
  const t = {
    warn: { bg:'rgba(251,191,36,0.08)', b:C.yellow, icon:'⚡' },
    err:  { bg:'rgba(255,77,28,0.08)',  b:C.accent, icon:'✗' },
    tip:  { bg:'rgba(0,200,150,0.08)',  b:C.green,  icon:'✓' },
    info: { bg:'rgba(59,130,246,0.08)', b:C.blue,   icon:'→' },
  }[type] || { bg:'rgba(59,130,246,0.08)', b:C.blue, icon:'→' }
  return (
    <div style={{
      background:t.bg, borderLeft:`3px solid ${t.b}`,
      borderRadius:'0 10px 10px 0', padding:'12px 16px',
      fontSize:13, color:'#CBD5E1', lineHeight:1.75, margin:'16px 0',
      display:'flex', gap:10,
    }}>
      <span style={{color:t.b, flexShrink:0, fontWeight:700}}>{t.icon}</span>
      <span>{children}</span>
    </div>
  )
}

const Wynik = ({val, note}) => (
  <div style={{
    display:'flex', alignItems:'center', gap:12,
    padding:'12px 16px', borderRadius:10, marginTop:12,
    background:'rgba(0,200,150,0.1)', border:`1px solid ${C.green}44`,
  }}>
    <div style={{
      width:30, height:30, borderRadius:'50%', background:C.green,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:14, color:'#000', fontWeight:900, flexShrink:0,
    }}>✓</div>
    <div>
      <div style={{...s.mono, fontSize:16, fontWeight:600, color:C.green}}>{val}</div>
      {note && <div style={{fontSize:12, color:'#6B7280', marginTop:2}}>{note}</div>}
    </div>
  </div>
)

// ── TEORIA ────────────────────────────────────────────────────────────────────

const TABS = [
  {id:'jezyk',    label:'Algebra jako język'},
  {id:'anatomia', label:'Anatomia wyrażenia'},
  {id:'potegi',   label:'Potęgi'},
  {id:'wartosci', label:'Obliczanie wartości'},
  {id:'porzadek', label:'Porządkowanie'},
]

function InteraktywnyDissector() {
  const [active, setActive] = useState(null)
  const parts = [
    { id:'coeff', text:'4', color:'#FF4D1C', x:0,
      name:'Współczynnik liczbowy', desc:'Liczba stojąca przed zmiennymi. Tu: 4. Gdy nie ma liczby — współczynnik wynosi 1 (np. xy = 1·xy).' },
    { id:'x',    text:'x', color:'#3B82F6', x:1,
      name:'Zmienna x', desc:'Litera reprezentująca nieznaną liczbę. Może przyjmować różne wartości w różnych zadaniach.' },
    { id:'exp2', text:'²', color:'#8B5CF6', x:2,
      name:'Wykładnik potęgi', desc:'Mówi ile razy podstawa jest czynnikiem mnożenia. x² = x·x. Czytamy: "x do kwadratu".' },
    { id:'y',    text:'y', color:'#FBBF24', x:3,
      name:'Kolejna zmienna', desc:'Wyraz może mieć wiele zmiennych. 4x²y to jeden wyraz — iloczyn 4, x² i y.' },
    { id:'op',   text:' + ', color:'#6B7280', x:4,
      name:'Operator', desc:'Plus lub minus oddziela wyrazy. 4x²y + (...) to wielomian z co najmniej 2 wyrazami.' },
    { id:'t2',   text:'−7x', color:'#00C896', x:5,
      name:'Drugi wyraz', desc:'Wyraz −7x: współczynnik liczbowy = −7, współczynnik literowy = x.' },
    { id:'t3',   text:' + 3', color:'#94A3B8', x:6,
      name:'Wyraz wolny', desc:'Sam numer — bez zmiennej. Wyraz wolny 3 nie zmienia się niezależnie od x i y.' },
  ]
  const active_p = parts.find(p => p.id === active)
  return (
    <div>
      <div style={{
        background:'#0A0F1E', borderRadius:12, padding:'20px 24px',
        border:`1px solid ${C.border}`, marginBottom:12,
        display:'flex', flexWrap:'wrap', alignItems:'baseline', gap:2,
      }}>
        {parts.map(p => (
          <span key={p.id} onClick={() => setActive(active === p.id ? null : p.id)}
            style={{
              ...s.mono, fontSize: p.id === 'exp2' ? 14 : 24, fontWeight:700,
              verticalAlign: p.id === 'exp2' ? 'super' : 'baseline',
              color: active === p.id ? p.color : active ? '#374151' : '#94A3B8',
              cursor:'pointer', padding:'4px 6px', borderRadius:6,
              background: active === p.id ? p.color + '20' : 'transparent',
              border: `1px solid ${active === p.id ? p.color + '60' : 'transparent'}`,
              transition:'all .15s',
            }}
          >{p.text}</span>
        ))}
      </div>
      {active_p ? (
        <div style={{
          background: active_p.color + '10',
          borderLeft:`3px solid ${active_p.color}`,
          borderRadius:'0 10px 10px 0', padding:'14px 18px',
          animation:'slideIn .15s ease',
        }}>
          <div style={{fontSize:12,fontWeight:700,color:active_p.color,marginBottom:4,textTransform:'uppercase',letterSpacing:'.06em'}}>{active_p.name}</div>
          <div style={{fontSize:13,color:'#CBD5E1',lineHeight:1.65}}>{active_p.desc}</div>
        </div>
      ) : (
        <div style={{fontSize:12,color:'#4B5563',textAlign:'center',padding:'8px'}}>
          ↑ kliknij dowolny element wyrażenia
        </div>
      )}
    </div>
  )
}

function TranslatorGame() {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const zadania = [
    { id:'a', pl:'x podzielone przez 3',       alg:'x/3' },
    { id:'b', pl:'4 mniej niż 3 razy x',       alg:'3x − 4' },
    { id:'c', pl:'x do piątej potęgi',         alg:'x⁵' },
    { id:'d', pl:'suma x i y zwiększona o 11', alg:'x + y + 11' },
    { id:'e', pl:'połowa y powiększona o 3',   alg:'y/2 + 3' },
  ]
  return (
    <div>
      <div style={{fontSize:11,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>
        Przetłumacz opis na zapis algebraiczny
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {zadania.map(z => {
          const correct = checked && answers[z.id]?.trim().replace(/\s/g,'') === z.alg.replace(/\s/g,'')
          const wrong = checked && answers[z.id] && !correct
          return (
            <div key={z.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:'#0A0F1E',borderRadius:10,border:`1px solid ${correct?C.green+'44':wrong?C.accent+'44':C.border}`}}>
              <div style={{fontSize:13,color:'#CBD5E1',flex:1}}>{z.pl}</div>
              <span style={{color:C.dim}}>→</span>
              <input
                value={answers[z.id]||''} onChange={e=>setAnswers({...answers,[z.id]:e.target.value})}
                disabled={checked}
                placeholder="wpisz..."
                style={{
                  ...s.mono, fontSize:14, width:140, background:'transparent',
                  border:`1px solid ${correct?C.green:wrong?C.accent:C.border}`,
                  borderRadius:7, padding:'6px 10px', color:correct?C.green:wrong?C.accent:C.white,
                  outline:'none', fontFamily:'inherit',
                }}
              />
              {checked && <span style={{fontSize:14,color:correct?C.green:C.accent}}>{correct?'✓':'✗'}</span>}
              {wrong && <div style={{...s.mono,fontSize:12,color:C.green}}>{z.alg}</div>}
            </div>
          )
        })}
      </div>
      <div style={{display:'flex',gap:8,marginTop:12}}>
        {!checked
          ? <button onClick={()=>setChecked(true)} style={btn({background:C.accent,border:'none',color:'#fff'})}>Sprawdź odpowiedzi</button>
          : <button onClick={()=>{setChecked(false);setAnswers({})}} style={btn()}>Resetuj</button>}
      </div>
    </div>
  )
}

function KalkulatorWartosci() {
  const [x, setX] = useState(3)
  const [y, setY] = useState(2)
  const exprs = [
    { label:'2x + 3y − 5', fn:(x,y)=>2*x+3*y-5, steps:(x,y)=>`2·${x} + 3·${y} − 5 = ${2*x} + ${3*y} − 5` },
    { label:'x² − 2xy + y²', fn:(x,y)=>x*x-2*x*y+y*y, steps:(x,y)=>`${x}² − 2·${x}·${y} + ${y}² = ${x*x} − ${2*x*y} + ${y*y}` },
    { label:'3x³ − x', fn:(x,y)=>3*x*x*x-x, steps:(x,y)=>`3·${x}³ − ${x} = 3·${x*x*x} − ${x}` },
  ]
  return (
    <div style={{background:'#0A0F1E',borderRadius:12,padding:'20px',border:`1px solid ${C.border}`}}>
      <div style={{display:'flex',gap:24,marginBottom:20,flexWrap:'wrap'}}>
        {[['x',x,setX],['y',y,setY]].map(([n,v,set])=>(
          <div key={n} style={{flex:1,minWidth:120}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <span style={{...s.mono,fontSize:15,fontWeight:700,color:C.accent}}>{n} =</span>
              <span style={{...s.mono,fontSize:18,fontWeight:900,color:C.white}}>{v}</span>
            </div>
            <input type="range" min={-5} max={5} value={v} onChange={e=>set(+e.target.value)}
              style={{width:'100%',accentColor:C.accent}}/>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:C.dim,marginTop:4}}>
              <span>−5</span><span>0</span><span>5</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {exprs.map(e=>(
          <div key={e.label} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:C.card,borderRadius:10,border:`1px solid ${C.border}`,flexWrap:'wrap',gap:8}}>
            <span style={{...s.mono,fontSize:13,color:C.yellow,minWidth:160}}>{e.label}</span>
            <span style={{fontSize:11,color:C.dim,flex:1}}>{e.steps(x,y)}</span>
            <span style={{...s.mono,fontSize:20,fontWeight:900,color:C.green}}>{e.fn(x,y)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TeoriaContent({onComplete}) {
  const [tab, setTab] = useState('jezyk')
  const idx = TABS.findIndex(t=>t.id===tab)

  const content = {
    jezyk: (
      <div>
        <p style={{fontSize:14,color:'#94A3B8',lineHeight:1.9,marginBottom:20}}>
          Arytmetyka operuje na konkretnych liczbach. Algebra robi coś sprytniejszego — używa <strong style={{color:C.white}}>liter zamiast liczb</strong>, żeby zapisać ogólne prawdy raz na zawsze.
        </p>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:24}}>
          {[
            { t:'Arytmetyka', ex:'6 groszy + 3 niklów + 8 pensów', res:'= 17 centów (tylko gdy znasz wartości!)', c:'#374151' },
            { t:'Algebra', ex:'6d + 3n + 8p', res:'= 6d + 3n + 8p (prawda dla dowolnych monet!)', c:C.accent },
          ].map(x=>(
            <div key={x.t} style={{background:x.c+'22',borderRadius:12,padding:'16px 18px',border:`1px solid ${x.c}44`}}>
              <div style={{fontSize:10,fontWeight:700,color:x.c,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>{x.t}</div>
              <div style={{...s.mono,fontSize:14,color:C.white,marginBottom:6}}>{x.ex}</div>
              <div style={{fontSize:11,color:C.dim}}>{x.res}</div>
            </div>
          ))}
        </div>

        <div style={{borderBottom:`1px solid ${C.border}`,paddingBottom:20,marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>Jak algebra zapisuje mnożenie (Abeka 3.1)</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {[['4·a·b','klasyczny zapis'],['4ab','obok siebie'],['4(ab)','z nawiasem'],['(4a)(b)','dwa nawiasy']].map(([z,o])=>(
              <div key={z} style={{background:'#0A0F1E',borderRadius:8,padding:'10px 14px',border:`1px solid ${C.border}`,textAlign:'center'}}>
                <div style={{...s.mono,fontSize:16,fontWeight:700,color:C.yellow}}>{z}</div>
                <div style={{fontSize:10,color:C.dim,marginTop:4}}>{o}</div>
              </div>
            ))}
          </div>
          <Rule type="warn">Znak × jest ZAKAZANY w algebrze — można go pomylić z literą x. Zawsze piszemy 4x, nie 4×x.</Rule>
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>Słownik algebra ↔ polski (Abeka 3.1b)</div>
          <div style={{background:'#0A0F1E',borderRadius:12,overflow:'hidden',border:`1px solid ${C.border}`}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
              <thead>
                <tr style={{borderBottom:`1px solid ${C.border}`}}>
                  {['Zapis','Po polsku','Uwaga'].map(h=>(
                    <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:10,color:C.dim,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['x + y', 'x plus y, lub y dodane do x', '—'],
                  ['x − 6', 'x minus 6, lub 6 mniej niż x', '—'],
                  ['9y', '9 razy y, iloczyn 9 i y', '—'],
                  ['x/3', 'x podzielone przez 3, lub ⅓ raza x', '—'],
                  ['6y − 4', '4 mniej niż iloczyn 6 i y', 'kolejność ważna!'],
                  ['x/2 + 6', '6 więcej niż połowa x', '—'],
                ].map(([z,p,u],i)=>(
                  <tr key={z} style={{borderBottom:`1px solid ${C.border}`,background:i%2?'transparent':'rgba(255,255,255,0.02)'}}>
                    <td style={{...s.mono,padding:'9px 14px',color:C.yellow,fontWeight:600}}>{z}</td>
                    <td style={{padding:'9px 14px',color:'#CBD5E1'}}>{p}</td>
                    <td style={{padding:'9px 14px',color:C.dim,fontSize:11}}>{u}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>Przetłumacz na algebrę</div>
          <TranslatorGame/>
        </div>
      </div>
    ),

    anatomia: (
      <div>
        <p style={{fontSize:14,color:'#94A3B8',lineHeight:1.9,marginBottom:20}}>
          Każde wyrażenie ma strukturę. Egzamin CKE pyta wprost o poszczególne elementy — trzeba je identyfikować pewnie i szybko.
        </p>

        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Kliknij element i sprawdź co to jest</div>
          <InteraktywnyDissector/>
        </div>

        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Słownik terminów — miej je w małym palcu</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {[
              {t:'Zmienna',            d:'Litera zastępująca nieznaną liczbę (x, y, a, n, …)',                                         ex:'x, y, ab, n²'},
              {t:'Wsp. liczbowy',      d:'Liczba przed zmiennymi. Gdy brak — wynosi ZAWSZE 1!',                                        ex:'6 w 6xy; 1 w xy'},
              {t:'Wsp. literowy',      d:'Literowa część wyrazu. W 6xy: x jest wsp. lit. 6y.',                                        ex:'xy w 6xy; x w 6x'},
              {t:'Wyraz / składnik',   d:'Jedna część wyrażenia oddzielona przez + lub −.',                                            ex:'6x i 4y w 6x+4y'},
              {t:'Wyraz wolny',        d:'Wyraz bez żadnej zmiennej — sama liczba.',                                                   ex:'−5 w 3x²+2x−5'},
              {t:'Czynnik',            d:'Jedna z mnożonych części. Liczby i litery razem.',                                           ex:'3, x, y w 3xy'},
              {t:'Jednomian',          d:'Jeden wyraz: liczba, zmienna lub ich iloczyn.',                                              ex:'4x²y, −7ab, 12'},
              {t:'Dwumian',            d:'Dokładnie dwa wyrazy połączone + lub −.',                                                    ex:'x+y, 11y−6h'},
              {t:'Trójmian',           d:'Dokładnie trzy wyrazy.',                                                                     ex:'2x+y+5, x²−2x+1'},
              {t:'Wielomian',          d:'Dwa lub więcej wyrazów. Dwumian i trójmian też są wielomianami.',                            ex:'wszystkie powyższe'},
            ].map(({t,d,ex},i)=>(
              <div key={t} style={{
                display:'flex', gap:14, alignItems:'flex-start',
                padding:'10px 14px', borderRadius:10,
                background: i%2 ? 'transparent' : 'rgba(255,255,255,0.02)',
                border:`1px solid ${C.border}`,
              }}>
                <div style={{minWidth:130,fontSize:12,fontWeight:700,color:C.accent}}>{t}</div>
                <div style={{flex:1,fontSize:13,color:'#94A3B8',lineHeight:1.5}}>{d}</div>
                <div style={{...s.mono,fontSize:11,color:C.yellow,flexShrink:0,textAlign:'right'}}>{ex}</div>
              </div>
            ))}
          </div>
        </div>

        <Rule type="warn">
          <strong>Pułapka #1 CKE:</strong> Współczynnik liczbowy wyrazu <em>xy</em> wynosi 1, nie 0 i nie "brak". Zawsze jest jakaś liczba — domyślnie 1. Pytanie "podaj wsp. liczbowy −mn²" odpowiedź to −1, nie m czy n.
        </Rule>

        <div style={{background:'#0A0F1E',borderRadius:12,padding:'18px',border:`1px solid ${C.border}`,marginTop:16}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Szybkie ćwiczenia — Abeka 3.1 Practice Problems</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
            {[
              ['3xy','jednomian'],['9d + 4t + 8p','trójmian'],
              ['2x + y + 5','trójmian'],['11y − 6h','dwumian'],
              ['14xy','jednomian'],['9x − y','dwumian'],
              ['x² + xy + xy + y²','trójmian po upros.'],['5m + 4m + 2r + 3m','dwumian po upros.'],
            ].map(([e,t])=>(
              <div key={e} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>
                <span style={{...s.mono,fontSize:13,color:C.white}}>{e}</span>
                <Tag color={t.includes('mono')?C.blue:t.includes('dwu')?C.purple:C.accent}>{t}</Tag>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    potegi: (
      <div>
        <p style={{fontSize:14,color:'#94A3B8',lineHeight:1.9,marginBottom:20}}>
          Potęga to skrótowy zapis wielokrotnego mnożenia tej samej liczby lub zmiennej przez siebie. Abeka 3.2 — fundamenty których nie można pominąć.
        </p>

        <div style={{background:'#0A0F1E',borderRadius:12,padding:'20px 24px',marginBottom:20,textAlign:'center',border:`1px solid ${C.border}`}}>
          <div style={{...s.mono,fontSize:36,marginBottom:12,letterSpacing:'-0.02em'}}>
            <span style={{color:C.yellow}}>3</span>
            <span style={{color:C.purple,fontSize:22,verticalAlign:'super'}}>2</span>
            <span style={{color:C.dim}}> = 3 × 3 = </span>
            <span style={{color:C.green}}>9</span>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:40,fontSize:11,color:C.dim}}>
            <span><span style={{color:C.yellow}}>■</span> podstawa</span>
            <span><span style={{color:C.purple}}>■</span> wykładnik</span>
            <span><span style={{color:C.green}}>■</span> wynik</span>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:20}}>
          {[
            ['y⁴','y·y·y·y','y jest czynnikiem 4 razy'],
            ['2x³','2·x·x·x','2 razy (x do 3.)'],
            ['x²y³','x·x·y·y·y','oddzielne potęgi'],
            ['x¹','= x','potęga 1. = sama podstawa'],
            ['x⁰','= 1','potęga 0. = jeden (x≠0)'],
            ['8²xy²','= 64xy²','8²=64, xy² zostaje'],
          ].map(([p,r,d])=>(
            <div key={p} style={{background:'#0A0F1E',borderRadius:10,padding:'14px',border:`1px solid ${C.border}`,textAlign:'center'}}>
              <div style={{...s.mono,fontSize:18,fontWeight:700,color:C.yellow,marginBottom:4}}>{p}</div>
              <div style={{...s.mono,fontSize:12,color:C.green,marginBottom:6}}>{r}</div>
              <div style={{fontSize:11,color:C.dim}}>{d}</div>
            </div>
          ))}
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Zapis rozwinięty ↔ potęgowy (Abeka 3.2)</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {[
              ['y·y·y·y', 'y⁴'],
              ['2·x·x·x', '2x³'],
              ['8·8·x·y·y·y', '8²xy³ = 64xy³'],
              ['3·3·3·t·t·t', '3³t³ = 27t³'],
              ['x·x·y·y·y·z', 'x²y³z'],
              ['4·4·a·b·b', '4²ab² = 16ab²'],
            ].map(([r,p])=>(
              <div key={r} style={{display:'flex',gap:12,padding:'9px 14px',background:'#0A0F1E',borderRadius:8,border:`1px solid ${C.border}`,alignItems:'center'}}>
                <span style={{...s.mono,fontSize:13,color:'#94A3B8',flex:1}}>{r}</span>
                <span style={{color:C.dim,fontSize:18}}>→</span>
                <span style={{...s.mono,fontSize:15,fontWeight:700,color:C.yellow,minWidth:120,textAlign:'right'}}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <Rule type="err">
          <strong>KRYTYCZNA pułapka:</strong> (−2)² = 4, ale −2² = −4. Nawiasy decydują wszystko. Gdy podstawiasz ujemną liczbę — ZAWSZE w nawiasach: (−2)² = (−2)·(−2) = +4.
        </Rule>

        <div style={{background:'#0A0F1E',borderRadius:12,padding:'18px',border:`1px solid ${C.border}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:14}}>Sprawdź się — oblicz każdą potęgę</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
            {[['3²','9'],['(−3)²','9'],['−3²','−9'],['2³','8'],['(−1)⁴','1'],['(−2)³','−8'],['5⁰','1'],['7¹','7']].map(([p,w])=>(
              <div key={p} style={{textAlign:'center',padding:'12px 8px',background:C.card,borderRadius:8,border:`1px solid ${C.border}`}}>
                <div style={{...s.mono,fontSize:16,fontWeight:700,color:C.yellow,marginBottom:4}}>{p}</div>
                <div style={{...s.mono,fontSize:14,color:C.green}}>{w}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    wartosci: (
      <div>
        <p style={{fontSize:14,color:'#94A3B8',lineHeight:1.9,marginBottom:20}}>
          Obliczanie wartości wyrażenia to podstawowy typ zadań zamkniętych na CKE — szybkie, ale pełne pułapek. Trzy kroki które robisz ZAWSZE w tej kolejności.
        </p>

        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:24}}>
          {[
            {n:1,t:'Podstaw', d:'Wstaw liczby zamiast zmiennych. Ujemne i wielocyfrowe ZAWSZE w nawiasach.', ex:'x=−2 → piszesz (−2), nie −2'},
            {n:2,t:'Potęgi', d:'Oblicz wszystkie potęgi. Żadnych skrótów — każda pomyłka tutaj psuje resztę.', ex:'(−2)² = 4 (nie −4!)'},
            {n:3,t:'Kolejność', d:'Mnożenie i dzielenie przed dodawaniem i odejmowaniem. Od lewej do prawej.', ex:'3+4·2 = 3+8 = 11'},
          ].map(s=>(
            <div key={s.n} style={{display:'flex',gap:14,padding:'14px 16px',background:'#0A0F1E',borderRadius:10,border:`1px solid ${C.border}`}}>
              <div style={{
                width:32,height:32,borderRadius:'50%',flexShrink:0,
                background:C.accent,display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:14,fontWeight:900,color:'#000',
              }}>{s.n}</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:C.white,marginBottom:3}}>{s.t}</div>
                <div style={{fontSize:12,color:'#94A3B8',marginBottom:4}}>{s.d}</div>
                <div style={{...{fontFamily:'"SF Mono","Fira Code",monospace'},fontSize:12,color:C.yellow}}>{s.ex}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Interaktywny kalkulator — przesuń suwaki</div>
          <KalkulatorWartosci/>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Przykład z CKE — pełny tok (oblicz dla a=4, b=−1)</div>
          <div style={{background:'#0A0F1E',borderRadius:12,padding:'16px',border:`1px solid ${C.border}`}}>
            <div style={{marginBottom:12}}><Eq big>a² + 2ab − b²</Eq></div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <Krok n={1} text="Podstawiamy a=(4), b=(−1) — nawiasy obowiązkowe przy ujemnych:" eq="(4)² + 2·(4)·(−1) − (−1)²"/>
              <Krok n={2} text="Obliczamy potęgi: (4)²=16, (−1)²=1:" eq="16 + 2·(4)·(−1) − 1"/>
              <Krok n={3} text="Mnożenie: 2·4·(−1) = −8:" eq="16 + (−8) − 1"/>
              <Krok n={4} text="Dodawanie i odejmowanie od lewej:" eq="16 − 8 − 1 = 7" hi/>
            </div>
            <Wynik val="7" note="Sprawdzenie: (a−b)² = (4−(−1))² = 5² = 25? NIE — bo a²+2ab−b² ≠ (a−b)². To (a+b)²−2b² — bądź ostrożny!"/>
          </div>
        </div>

        <Rule type="info">
          Na egzaminie CKE zawsze <strong>zapisuj każdy krok</strong>. Nawet przy błędzie rachunkowym w końcu — za poprawny tok dostajesz punkty cząstkowe.
        </Rule>
      </div>
    ),

    porzadek: (
      <div>
        <p style={{fontSize:14,color:'#94A3B8',lineHeight:1.9,marginBottom:20}}>
          Wielomian można zapisać w różnej kolejności wyrazów — wynik jest ten sam, ale musi być w postaci uproszczonej. Abeka 3.3 — porządkowanie i upraszczanie wielomianów.
        </p>

        <div style={{marginBottom:24}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Wyrazy podobne — klucz do upraszczania (Abeka 3.3)</div>
          <Rule type="info">
            <strong>Wyrazy podobne</strong> mają IDENTYCZNĄ część literową — te same zmienne podniesione do tych samych potęg. Różnią się tylko współczynnikiem liczbowym.
          </Rule>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
            {[
              {a:'6xy',b:'4xy',similar:true,why:'Obie mają xy'},
              {a:'2xy',b:'2az',similar:false,why:'xy ≠ az'},
              {a:'5x²y',b:'−3x²y',similar:true,why:'Obie mają x²y'},
              {a:'3x²',b:'3x³',similar:false,why:'x² ≠ x³ (różne potęgi)'},
            ].map(r=>(
              <div key={r.a+r.b} style={{
                padding:'12px 14px',borderRadius:10,
                background:r.similar ? 'rgba(0,200,150,0.08)' : 'rgba(255,77,28,0.08)',
                border:`1px solid ${r.similar?C.green:C.accent}44`,
              }}>
                <div style={{...{fontFamily:'"SF Mono","Fira Code",monospace'},fontSize:15,fontWeight:600,color:C.white,marginBottom:4}}>
                  {r.a} i {r.b}
                </div>
                <div style={{fontSize:11,color:r.similar?C.green:C.accent,fontWeight:600,marginBottom:2}}>
                  {r.similar ? '✓ PODOBNE' : '✗ NIEPODOBNE'}
                </div>
                <div style={{fontSize:11,color:C.dim}}>{r.why}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Upraszczanie — przykłady z Abeka 3.3</div>
          {[
            {
              input:'3x + 5x + 2x + 3x',
              steps:[
                {n:1,text:'Wszystkie wyrazy mają tę samą część literową x — są podobne.',eq:'3x + 5x + 2x + 3x'},
                {n:2,text:'Dodajemy współczynniki: 3+5+2+3=13',eq:'13x',hi:true},
              ],
              ans:'13x',
            },
            {
              input:'6x² + 2x + 3x + 5',
              steps:[
                {n:1,text:'Identyfikujemy grupy podobnych wyrazów:',eq:'6x² | 2x i 3x | 5'},
                {n:2,text:'2x i 3x są podobne, 6x² i 5 stoją same.',eq:'6x² + (2x+3x) + 5'},
                {n:3,text:'Sumujemy podobne:',eq:'6x² + 5x + 5',hi:true},
              ],
              ans:'6x² + 5x + 5',
              note:'6x² i 5x to NIE są wyrazy podobne — x² ≠ x!',
            },
            {
              input:'5m + 4m + 2r + 3m',
              steps:[
                {n:1,text:'m-y grupujemy razem, r zostaje samo:',eq:'(5m+4m+3m) + 2r'},
                {n:2,text:'12m + 2r',eq:'12m + 2r',hi:true},
              ],
              ans:'12m + 2r',
            },
          ].map((ex,i)=>(
            <div key={i} style={{background:'#0A0F1E',borderRadius:12,padding:'16px',border:`1px solid ${C.border}`,marginBottom:10}}>
              <div style={{marginBottom:12}}><Eq>{ex.input}</Eq></div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {ex.steps.map(s=><Krok key={s.n} {...s}/>)}
              </div>
              <Wynik val={ex.ans} note={ex.note}/>
            </div>
          ))}
        </div>

        <div style={{background:'#0A0F1E',borderRadius:12,padding:'18px',border:`1px solid ${C.border}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em',marginBottom:12}}>Upraszczaj samodzielnie — Abeka 3.3 Practice</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {[
              ['5m + 4m + 2r + 3m','12m + 2r'],
              ['x² + xy + xy + y²','x² + 2xy + y²'],
              ['14 + 3x + 2 + x² + 3y + 2x','x² + 5x + 3y + 16'],
              ['7mn + 6m + 3mn + 15m','10mn + 21m'],
              ['8x² + 3x² + xy + y²','11x² + xy + y²'],
            ].map(([q,a])=>(
              <div key={q} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:C.card,borderRadius:8,border:`1px solid ${C.border}`,flexWrap:'wrap'}}>
                <span style={{...{fontFamily:'"SF Mono","Fira Code",monospace'},fontSize:13,color:C.yellow,flex:1}}>{q}</span>
                <span style={{color:C.dim}}>→</span>
                <span style={{...{fontFamily:'"SF Mono","Fira Code",monospace'},fontSize:14,fontWeight:700,color:C.green}}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  }

  return (
    <div style={s.card}>
      <div style={{marginBottom:20}}>
        <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:4}}>
          {TABS.map((t,i)=>{
            const done = i < idx, active = t.id === tab
            return (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                padding:'6px 14px', fontSize:11, fontWeight:700, borderRadius:8,
                cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
                border:`1px solid ${active?C.accent:done?C.green+'44':C.border}`,
                background:active?C.accent:done?C.green+'11':'transparent',
                color:active?'#000':done?C.green:C.dim,
                letterSpacing:'.02em',
              }}>{done&&!active?'✓ ':''}{t.label}</button>
            )
          })}
        </div>
      </div>
      <div style={{minHeight:400}}>{content[tab]}</div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:24,paddingTop:20,borderTop:`1px solid ${C.border}`,gap:8}}>
        {idx>0
          ?<button onClick={()=>setTab(TABS[idx-1].id)} style={btn()}>← {TABS[idx-1].label}</button>
          :<div/>}
        {idx<TABS.length-1
          ?<button onClick={()=>setTab(TABS[idx+1].id)} style={btn({background:C.accent,border:'none',color:'#000',fontWeight:800})}>{TABS[idx+1].label} →</button>
          :<button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Ukończyłem teorię →</button>}
      </div>
    </div>
  )
}

// ── QUIZ (10 pytań) ───────────────────────────────────────────────────────────
const QUIZ = [
  {q:'Jaki jest współczynnik liczbowy wyrażenia:',eq:'−mn²',opts:['m','n²','1','−1'],ans:3,
    why:'−mn² = (−1)·mn². Minus to −1. Ukryty współczynnik −1.'},
  {q:'Które wyrazy są PODOBNE do 4ab?',eq:'',opts:['4a²b','2ab i −7ab','ab² i 4b','3a i 2b'],ans:1,
    why:'Podobne = identyczna część literowa. 2ab i −7ab mają obydwa ab → podobne.'},
  {q:'Ile wynosi (−3)²?',eq:'',opts:['−9','9','6','−6'],ans:1,
    why:'(−3)² = (−3)·(−3) = +9. Nawias obejmuje cały wyraz z minusem. Bez nawiasu −3² = −9.'},
  {q:'Oblicz wartość gdy x=2:',eq:'3x³ − x',opts:['22','18','14','46'],ans:0,
    why:'3·(2)³ − 2 = 3·8 − 2 = 24 − 2 = 22. Najpierw potęga, potem mnożenie.'},
  {q:'Uprość wielomian:',eq:'5m + 4m + 2r + 3m',opts:['14mr','12m + 2r','9m + 2r','12m + 2mr'],ans:1,
    why:'m-y: 5+4+3=12. r zostaje samo. Wynik: 12m + 2r. m i r to różne zmienne!'},
  {q:'Jakiego typu wyrażenie to:',eq:'11y − 6h',opts:['jednomian','dwumian','trójmian','wielomian 4-wyrazowy'],ans:1,
    why:'Dwa wyrazy (11y i −6h) połączone minusem = dwumian.'},
  {q:'Oblicz wartość gdy a=−2, b=3:',eq:'a² + 2ab + b²',opts:['1','25','13','−1'],ans:0,
    why:'(−2)² + 2·(−2)·3 + 3² = 4 − 12 + 9 = 1. Zauważ: to (a+b)² = (−2+3)² = 1² = 1 ✓'},
  {q:'Zapisz jako wyrażenie algebraiczne:\n"4 mniej niż iloczyn 5 i x"',eq:'',opts:['4−5x','5x−4','5x+4','5(x−4)'],ans:1,
    why:'"Iloczyn 5 i x" = 5x. "4 mniej niż 5x" = 5x − 4. Kolejność "mniej niż" jest odwrócona!'},
  {q:'Ile wynosi x⁰ dla x = 2026?',eq:'',opts:['2026','0','nieokreślone','1'],ans:3,
    why:'Każda niezerowa liczba lub zmienna do potęgi 0 równa się 1. Zawsze, bez wyjątku.'},
  {q:'Uprość: (Abeka 3.3)',eq:'x² + xy + xy + y²',opts:['x²+y²','x²+2xy+y²','2x²y²','(x+y)²'],ans:1,
    why:'xy+xy = 2xy (podobne). x² i y² nie mają podobnych. Wynik: x²+2xy+y². To wzór (x+y)²!'},
]

function QuizContent({onComplete}) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[res,setRes]=useState([])
  if(qi>=QUIZ.length){
    const ok=res.filter(r=>r).length
    return(
      <div style={s.card}>
        <div style={{textAlign:'center',padding:'24px 0'}}>
          <div style={{fontSize:56,marginBottom:12}}>{ok>=9?'🎯':ok>=7?'💪':'📖'}</div>
          <div style={{fontSize:28,fontWeight:900,color:ok>=9?C.green:ok>=7?C.yellow:C.accent,marginBottom:8}}>{ok}/{QUIZ.length}</div>
          <div style={{fontSize:14,color:C.dim}}>{ok>=9?'Absolutnie doskonale.':ok>=7?'Dobry wynik, lecisz dalej.':'Wróć do teorii, nie poddawaj się.'}</div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:16}}>
          <button onClick={()=>{setQi(0);setSel(null);setDone(false);setRes([])}} style={btn()}>Powtórz</button>
          <button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Fiszki →</button>
        </div>
      </div>
    )
  }
  const q=QUIZ[qi]
  return(
    <div style={s.card}>
      <div style={{display:'flex',gap:3,marginBottom:20}}>
        {QUIZ.map((_,i)=>(
          <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<qi?C.green:i===qi?C.accent:C.border,transition:'background .3s'}}/>
        ))}
      </div>
      <div style={{fontSize:12,color:C.dim,marginBottom:8}}>Pytanie {qi+1} z {QUIZ.length}</div>
      <div style={{fontSize:16,fontWeight:500,color:C.white,marginBottom:16,lineHeight:1.55,whiteSpace:'pre-line'}}>{q.q}</div>
      {q.eq&&<div style={{marginBottom:16}}><Eq big>{q.eq}</Eq></div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
        {q.opts.map((o,i)=>{
          let bg='transparent',border=C.border,color=C.white
          if(done){
            if(i===q.ans){bg=C.green+'22';border=C.green;color=C.green}
            else if(i===sel){bg=C.accent+'22';border=C.accent;color=C.accent}
          }
          return(
            <div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setRes(p=>[...p,i===q.ans])}}
              style={{border:`1px solid ${border}`,borderRadius:10,padding:'12px 16px',cursor:done?'default':'pointer',
                fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s',
                ...({fontFamily:done&&i===q.ans||i===sel?'"SF Mono","Fira Code",monospace':'inherit'})}}>
              {o}
            </div>
          )
        })}
      </div>
      {done&&(
        <>
          <div style={{padding:'14px 16px',borderRadius:10,background:sel===q.ans?C.green+'11':C.accent+'11',border:`1px solid ${sel===q.ans?C.green:C.accent}44`,marginBottom:12}}>
            <div style={{fontSize:13,color:C.white,lineHeight:1.7}}>
              <strong style={{color:sel===q.ans?C.green:C.accent}}>{sel===q.ans?'Poprawnie ✓':'Błąd ✗'}</strong>
              <div style={{background:'rgba(139,92,246,0.1)',borderRadius:8,padding:'8px 12px',marginTop:8,fontSize:12,color:'#C4B5FD',lineHeight:1.7,border:'1px solid rgba(139,92,246,0.2)'}}>{q.why}</div>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'flex-end'}}>
            <button onClick={()=>{if(qi<QUIZ.length-1){setQi(i=>i+1);setSel(null);setDone(false)}else setQi(QUIZ.length)}}
              style={btn({background:C.accent,border:'none',color:'#fff',fontWeight:700})}>
              {qi<QUIZ.length-1?'Następne →':'Wynik →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── FISZKI (12 kart) ──────────────────────────────────────────────────────────
const FISZKI = [
  {q:'Dlaczego w algebrze zakazany jest znak ×?',a:'Można go pomylić z literą x. Zamiast tego: 4x lub 4·x lub 4(x).',f:'4 × x → BŁĄD\n4x lub 4·x → POPRAWNIE'},
  {q:'Jaki współczynnik liczbowy ma wyraz xy?',a:'1. Zawsze, gdy przed zmiennymi nie stoi żadna liczba. xy = 1·xy.',note:'Pułapka CKE #1 — nie myl braku z zerem!'},
  {q:'Jaka jest różnica: wyrazy PODOBNE vs NIEPODOBNE?',a:'Podobne mają identyczną część literową (te same zmienne, te same potęgi). Różnią się tylko współczynnikami.',f:'6xy i 4xy → PODOBNE\n6xy i 6x²y → NIEPODOBNE'},
  {q:'(−3)² = ?',a:'+9. Nawias obejmuje cały wyraz −3. Minus razy minus = plus.',f:'(−3)² = (−3)·(−3) = +9\n−3² = −(3²) = −9',note:'Różnica wynika z nawiasów!'},
  {q:'Jak obliczać wartość wyrażenia — 3 kroki?',a:'1. Podstaw liczby (ujemne w nawiasach). 2. Oblicz potęgi. 3. Reszta w kolejności działań.',f:'x=−2: x² = (−2)² = 4, nie −4'},
  {q:'Jak upraszczamy wyrazy podobne?',a:'Dodajemy lub odejmujemy TYLKO współczynniki liczbowe. Część literowa zostaje bez zmian.',f:'3x + 5x + 2x = (3+5+2)x = 10x'},
  {q:'"4 mniej niż iloczyn 5 i x" po algebraicznie = ?',a:'5x − 4 (NIE 4 − 5x). "Mniej niż" odwraca kolejność!',f:'"4 mniej niż A" = A − 4\n"A zmniejszone o 4" = A − 4'},
  {q:'x⁰ = ? (dla x ≠ 0)',a:'1. Każda niezerowa liczba lub zmienna do potęgi 0 = 1.',f:'5⁰ = 1 · y⁰ = 1 · 2026⁰ = 1'},
  {q:'Co to jest wyraz wolny?',a:'Wyraz bez żadnej zmiennej — sama liczba. Stoi osobno, nie upraszcza się z wyrazami z literami.',f:'W 3x²+2x−5: wyraz wolny = −5'},
  {q:'Policz wyrazy w wyrażeniu: 3x³ − 2x²y + xy − 5',a:'4 wyrazy. Policz znaki + i − (3 znaki) i dodaj 1.',f:'3x³ | −2x²y | +xy | −5 = 4 wyrazy'},
  {q:'Uprość: x² + xy + xy + y²',a:'x² + 2xy + y². Dwie pary xy są podobne (xy+xy=2xy). x² i y² stoją osobno.',f:'x² + 2xy + y² = (x+y)²'},
  {q:'Jaki jest współczynnik liczbowy wyrazu −mn²?',a:'−1. Minus to skrót od (−1). −mn² = (−1)·m·n².',note:'Pułapka CKE #2 — odpowiedź to −1, nie m, n² ani "brak"'},
]

function FiszkiContent({onComplete}) {
  const [deck,setDeck]=useState(FISZKI.map((f,i)=>({...f,id:i}))),[flip,setFlip]=useState(false),[mastered,setMastered]=useState(0)
  if(!deck.length)return(
    <div style={{...s.card,textAlign:'center'}}>
      <div style={{fontSize:52,marginBottom:12}}>🎴</div>
      <div style={{fontSize:22,fontWeight:900,color:C.green,marginBottom:8}}>Wszystkie {FISZKI.length} opanowane</div>
      <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:20}}>
        <button onClick={()=>{setDeck(FISZKI.map((f,i)=>({...f,id:i})));setFlip(false);setMastered(0)}} style={btn()}>Powtórz</button>
        <button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Kartkówka →</button>
      </div>
    </div>
  )
  const c=deck[0], pct=Math.round(mastered/FISZKI.length*100)
  return(
    <div style={s.card}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.06em'}}>{mastered}/{FISZKI.length} opanowanych</div>
        <div style={{fontSize:11,color:C.dim}}>{deck.length} pozostało</div>
      </div>
      <div style={{height:3,background:C.border,borderRadius:2,marginBottom:20,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:C.green,borderRadius:2,transition:'width .4s'}}/>
      </div>
      <div onClick={()=>setFlip(f=>!f)} style={{
        cursor:'pointer', minHeight:200, borderRadius:12, display:'flex',
        alignItems:'center', justifyContent:'center', padding:28, textAlign:'center',
        background: flip?C.card:'#0A0F1E',
        border:`1px solid ${flip?C.accent+44:C.border}`,
        transition:'background .25s', marginBottom:14,
      }}>
        {!flip
          ? <div>
              <div style={{fontSize:10,color:C.dim,textTransform:'uppercase',letterSpacing:'.1em',marginBottom:14}}>Fiszka {mastered+1}/{FISZKI.length}</div>
              <div style={{fontSize:17,fontWeight:500,color:C.white,lineHeight:1.65}}>{c.q}</div>
              <div style={{fontSize:11,color:C.dim,marginTop:16}}>kliknij żeby zobaczyć odpowiedź</div>
            </div>
          : <div>
              <div style={{fontSize:14,color:'#CBD5E1',lineHeight:1.7,marginBottom:10}}>{c.a}</div>
              {c.f&&<div style={{...s.mono,fontSize:13,color:C.yellow,fontWeight:600,margin:'10px 0',whiteSpace:'pre-line'}}>{c.f}</div>}
              {c.note&&<div style={{fontSize:12,color:C.dim,marginTop:8,fontStyle:'italic'}}>{c.note}</div>}
            </div>
        }
      </div>
      {flip&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlip(false)}}
            style={btn({background:C.accent+'22',borderColor:C.accent+'44',color:C.accent,textAlign:'center'})}>Trudna — powtórz</button>
          <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlip(false)}}
            style={btn({background:C.green+'22',borderColor:C.green+'44',color:C.green,textAlign:'center'})}>Opanowana ✓</button>
        </div>
      )}
    </div>
  )
}

// ── KARTKÓWKA (12 pytań) ──────────────────────────────────────────────────────
const KQ = [
  {q:'Wskaż wyraz o współczynniku liczbowym −1:',eq:'',opts:['−3x²','−xy','3mn','−4ab'],ans:1,hint:'−1 pojawia się gdy przed zmiennymi stoi SAM minus, bez liczby.'},
  {q:'Ile wyrazów ma wielomian?',eq:'4 + 6x² + 3x³ − 2x',opts:['3','4','5','2'],ans:1,hint:'Policz znaki + i − i dodaj 1.'},
  {q:'Które wyrazy są podobne do −7x²y?',eq:'',opts:['7xy²','3x²y','−7xy','x²y²'],ans:1,hint:'Identyczna część literowa: x²y. Współczynnik może być różny.'},
  {q:'Oblicz:',eq:'(−2)³',opts:['6','8','−8','−6'],ans:2,hint:'(−2)³ = (−2)·(−2)·(−2) = 4·(−2) = −8. Liczba nieparzystych mnożeń decyduje o znaku.'},
  {q:'Uprość:',eq:'7mn + 6m + 3mn + 15m',opts:['31mn','10mn + 21m','31m + n','10m + 21mn'],ans:1,hint:'mn-y razem: 7+3=10. m-y razem: 6+15=21.'},
  {q:'Oblicz wartość gdy x=−3:',eq:'x² − 2x + 1',opts:['16','4','22','10'],ans:0,hint:'(−3)² − 2·(−3) + 1 = 9+6+1 = 16.'},
  {q:'Przetłumacz na algebrę:\n"połowa y powiększona o trzy razy x"',eq:'',opts:['y/2 − 3x','3x + y/2','3xy/2','y + 3/2x'],ans:1,hint:'"połowa y" = y/2. "powiększona o 3x" = +3x. Kolejność: y/2 + 3x.'},
  {q:'Oblicz wartość gdy a=2, b=−1:',eq:'a³ + 3a²b + 3ab² + b³',opts:['1','7','−1','3'],ans:0,hint:'To (a+b)³ = (2+(−1))³ = 1³ = 1. Skorzystaj ze wzoru albo licz krok po kroku.'},
  {q:'Uprość:',eq:'8x² + 3x² + xy + y²',opts:['11x² + xy + y²','12x²y²','11x²y + y²','8x²'],ans:0,hint:'x²-y: 8+3=11. xy i y² stoją same.'},
  {q:'Który zapis POPRAWNIE zapisuje x·x·x·y·y?',eq:'',opts:['x³y²','3xy²','x³+y²','3x+2y'],ans:0,hint:'x pojawia się 3 razy = x³. y pojawia się 2 razy = y².'},
  {q:'Oblicz wartość gdy x=0:',eq:'5x³ − 3x + 7',opts:['7','0','−3','5'],ans:0,hint:'x=0: 5·0³ − 3·0 + 7 = 0 − 0 + 7 = 7. Wyraz wolny zawsze zostaje.'},
  {q:'Jaki typ wyrażenia to x² − 2xy + y²?',eq:'',opts:['jednomian','dwumian','trójmian','wielomian 4-wyrazowy'],ans:2,hint:'Trzy wyrazy: x², −2xy, y². Trójmian. To wzór (x−y)².'},
]

function KartkowkaContent({onComplete}) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[res,setRes]=useState([]),[hint,setHint]=useState(false)
  if(!mode)return(
    <div style={s.card}>
      <div style={{fontSize:18,fontWeight:900,color:C.white,marginBottom:6}}>Kartkówka</div>
      <div style={{fontSize:13,color:C.dim,marginBottom:20}}>12 pytań · materiał Abeka 3.1–3.3 · zadania CKE</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:24}}>
        {[['trening','🏋️','Tryb trening','Podpowiedzi dostępne po kliknięciu'],['egzamin','🎯','Tryb egzamin','Żadnych podpowiedzi — czyste CKE']].map(([m,ico,t,d])=>(
          <div key={m} onClick={()=>setMode(m)} style={{border:`1px solid ${mode===m?C.accent:C.border}`,borderRadius:12,padding:18,cursor:'pointer',background:mode===m?C.accent+'15':'transparent',textAlign:'center',transition:'all .15s'}}>
            <div style={{fontSize:28,marginBottom:8}}>{ico}</div>
            <div style={{fontSize:14,fontWeight:700,color:mode===m?C.accent:C.white,marginBottom:4}}>{t}</div>
            <div style={{fontSize:11,color:C.dim}}>{d}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>mode&&setKi(0)} disabled={!mode}
        style={btn({width:'100%',textAlign:'center',background:mode?C.accent:'transparent',color:mode?'#000':C.dim,border:mode?'none':`1px solid ${C.border}`,fontWeight:mode?800:400,padding:'14px',cursor:mode?'pointer':'not-allowed'})}>
        Zacznij →
      </button>
    </div>
  )
  if(ki>=KQ.length){const ok=res.filter(r=>r).length;return(
    <div style={{...s.card,textAlign:'center'}}>
      <div style={{fontSize:56,marginBottom:12}}>{ok>=11?'🏆':ok>=9?'⭐':'📚'}</div>
      <div style={{fontSize:28,fontWeight:900,marginBottom:6,color:ok>=11?C.green:ok>=9?C.yellow:C.accent}}>{ok}/12</div>
      <div style={{fontSize:14,color:C.dim,marginBottom:24}}>{ok>=11?'Perfekcja':ok>=9?'Dobry wynik':ok>=7?'Zadowalający':'Wróć do teorii'}</div>
      <div style={{display:'flex',justifyContent:'center',gap:8}}>
        <button onClick={()=>{setMode(null);setKi(0);setSel(null);setDone(false);setRes([])}} style={btn()}>Powtórz</button>
        <button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Zadania CKE →</button>
      </div>
    </div>
  )}
  const q=KQ[ki]
  return(
    <div style={s.card}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
        <div style={{fontSize:11,color:C.dim,fontWeight:600,textTransform:'uppercase',letterSpacing:'.06em'}}>{ki+1}/{KQ.length}</div>
        <Tag color={mode==='trening'?C.yellow:C.accent}>{mode==='trening'?'🏋️ Trening':'🎯 Egzamin'}</Tag>
      </div>
      <div style={{display:'flex',gap:2,marginBottom:20}}>
        {KQ.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<ki?C.green:i===ki?C.accent:C.border,transition:'background .2s'}}/>)}
      </div>
      <div style={{fontSize:15,fontWeight:500,color:C.white,marginBottom:14,lineHeight:1.55,whiteSpace:'pre-line'}}>{q.q}</div>
      {q.eq&&<div style={{marginBottom:16}}><Eq big>{q.eq}</Eq></div>}
      {mode==='trening'&&!done&&(
        <div onClick={()=>setHint(h=>!h)} style={{background:C.yellow+'11',border:`1px solid ${C.yellow}33`,borderRadius:8,padding:'9px 14px',marginBottom:12,fontSize:12,color:C.yellow,cursor:'pointer'}}>
          💡 {hint?q.hint:'Kliknij po wskazówkę'}
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
        {q.opts.map((o,i)=>{
          let bg='transparent',border=C.border,color=C.white
          if(done){if(i===q.ans){bg=C.green+'22';border=C.green;color=C.green}else if(i===sel){bg=C.accent+'22';border=C.accent;color=C.accent}}
          return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setRes(p=>[...p,i===q.ans])}}
            style={{border:`1px solid ${border}`,borderRadius:10,padding:'12px 14px',cursor:done?'default':'pointer',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>
        })}
      </div>
      {done&&<div style={{display:'flex',justifyContent:'flex-end'}}>
        <button onClick={()=>{if(ki<KQ.length-1){setKi(i=>i+1);setSel(null);setDone(false);setHint(false)}else setKi(KQ.length)}}
          style={btn({background:C.accent,border:'none',color:'#fff',fontWeight:700})}>{ki<KQ.length-1?'Dalej →':'Wynik →'}</button>
      </div>}
    </div>
  )
}

// ── CKE ───────────────────────────────────────────────────────────────────────
const CKE_Z = [
  {rok:'styl CKE',nr:6,pkt:1,
   tresc:'Podaj współczynnik liczbowy wyrażenia: −mn².',
   wsk:'Minus to skrót od −1. Gdy sama litera stoi za minusem bez żadnej liczby, współczynnik = −1.',
   rozw:['−mn² = (−1)·m·n²','Współczynnik liczbowy = −1'],
   odp:'−1',
   schemat:'Za podanie −1: 1 pkt.'},
  {rok:'styl CKE',nr:11,pkt:2,
   tresc:'Oblicz wartość wyrażenia a² − 2ab + b² dla a = 3 i b = −2. Zapisz obliczenia.',
   wsk:'Podstawiaj a=(3), b=(−2) — nawiasy obowiązkowe. Pamiętaj o kolejności: najpierw potęgi.',
   rozw:['(3)² − 2·(3)·(−2) + (−2)²','9 − 2·(3)·(−2) + 4','9 − (−12) + 4','9 + 12 + 4 = 25',
     'Alternatywnie: (a−b)² = (3−(−2))² = (3+2)² = 5² = 25 ✓'],
   odp:'25',
   schemat:'Za poprawne podstawienie i potęgi: 1 pkt. Za wynik 25 z obliczeniami: 1 pkt.'},
  {rok:'styl CKE',nr:15,pkt:2,
   tresc:'Uprość wyrażenie: 5m + 4m + 2r + 3m. Następnie oblicz jego wartość dla m = −2 i r = 5.',
   wsk:'Krok 1: uprość (zbierz wyrazy podobne). Krok 2: dopiero wtedy podstaw wartości.',
   rozw:['Krok 1 — upraszczanie: m-y: 5+4+3=12','Wynik uproszczenia: 12m + 2r',
     'Krok 2 — wartość dla m=−2, r=5:','12·(−2) + 2·5 = −24 + 10 = −14'],
   odp:'12m + 2r; wartość = −14',
   schemat:'Za uproszczenie 12m+2r: 1 pkt. Za obliczenie −14: 1 pkt.'},
]

function CKEContent({onComplete}) {
  const [rev,setRev]=useState([]),[sol,setSol]=useState(Array(CKE_Z.length).fill(false))
  return(
    <div style={s.card}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:18,fontWeight:900,color:C.white,marginBottom:4}}>Zadania z egzaminu CKE</div>
        <div style={{fontSize:13,color:C.dim}}>Spróbuj samodzielnie. Każdy krok = punkt.</div>
      </div>
      {CKE_Z.map((z,i)=>(
        <div key={i} style={{background:'#0A0F1E',borderRadius:12,border:`1px solid ${C.border}`,padding:'20px',marginBottom:12}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,flexWrap:'wrap'}}>
            <Tag color={C.blue}>{z.rok}</Tag>
            <span style={{fontSize:11,color:C.dim}}>Zadanie {z.nr}</span>
            <Tag color={C.yellow} style={{marginLeft:'auto'}}>{z.pkt} {z.pkt===1?'punkt':'punkty'}</Tag>
          </div>
          <div style={{fontSize:15,fontWeight:500,color:C.white,lineHeight:1.65,marginBottom:16}}>{z.tresc}</div>
          <div onClick={()=>setRev(r=>r.includes(i)?r.filter(x=>x!==i):[...r,i])}
            style={{background:C.yellow+'11',border:`1px solid ${C.yellow}33`,borderRadius:8,padding:'9px 14px',marginBottom:10,fontSize:12,color:C.yellow,cursor:'pointer'}}>
            💡 {rev.includes(i)?z.wsk:'Kliknij po wskazówkę'}
          </div>
          <button onClick={()=>setSol(p=>p.map((v,j)=>j===i?!v:v))}
            style={btn({fontSize:12,padding:'8px 16px'})}>
            {sol[i]?'▲ Ukryj rozwiązanie':'▼ Wzorcowe rozwiązanie'}
          </button>
          {sol[i]&&(
            <div style={{marginTop:14,background:C.card,borderRadius:10,border:`1px solid ${C.border}`,padding:'16px'}}>
              {z.rozw.map((step,j)=>(
                <div key={j} style={{display:'flex',gap:10,padding:'7px 0',borderBottom:j<z.rozw.length-1?`1px solid ${C.border}`:'none',alignItems:'flex-start'}}>
                  <div style={{width:22,height:22,borderRadius:'50%',background:C.accent,color:'#000',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:900,flexShrink:0}}>{j+1}</div>
                  <div style={{...s.mono,fontSize:13,color:'#CBD5E1',lineHeight:1.55}}>{step}</div>
                </div>
              ))}
              <div style={{background:C.green+'15',borderRadius:8,padding:'10px 14px',marginTop:12,fontSize:14,color:C.green,fontWeight:700,...s.mono}}>
                Odpowiedź: {z.odp}
              </div>
              <div style={{background:'rgba(139,92,246,0.1)',borderRadius:8,padding:'10px 14px',marginTop:8,fontSize:12,color:'#C4B5FD',lineHeight:1.6,border:'1px solid rgba(139,92,246,0.2)'}}>
                <strong>Schemat oceniania:</strong> {z.schemat}
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{display:'flex',justifyContent:'flex-end',marginTop:8}}>
        <button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Raport →</button>
      </div>
    </div>
  )
}

// ── RAPORT ────────────────────────────────────────────────────────────────────
function RaportContent({onComplete}) {
  const punkty = [
    ['Algebra ≠ Arytmetyka','Algebra operuje na literach. Ta sama litera może mieć różne wartości. Znak × zakazany.'],
    ['Współczynnik = 1','Gdy brak liczby przed zmiennymi, współczynnik = 1. −xy to (−1)·xy.'],
    ['Wyrazy podobne','Identyczna część literowa — te same zmienne, te same potęgi. Tylko wtedy można łączyć.'],
    ['Potęgi: nawiasy decydują','(−2)² = +4, ale −2² = −4. Zawsze stawiaj nawiasy przy ujemnych.'],
    ['Wartość: krok po kroku','Podstaw → potęgi → kolejność działań. Nie skracaj skrótów.'],
  ]
  return(
    <div style={s.card}>
      <div style={{textAlign:'center',marginBottom:28}}>
        <div style={{fontSize:48,marginBottom:12}}>🏆</div>
        <div style={{fontSize:24,fontWeight:900,color:C.white,marginBottom:4}}>Lekcja ukończona</div>
        <div style={{fontSize:13,color:C.dim}}>Zmienne i wyrażenia algebraiczne</div>
      </div>
      <div style={{background:'#0A0F1E',borderRadius:12,padding:'20px',marginBottom:20,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,fontWeight:700,color:C.dim,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:14}}>Pięć zasad które masz w głowie</div>
        {punkty.map(([t,d],i)=>(
          <div key={i} style={{display:'flex',gap:12,marginBottom:10,fontSize:13,color:'#94A3B8',lineHeight:1.65,paddingBottom:10,borderBottom:i<punkty.length-1?`1px solid ${C.border}`:'none'}}>
            <span style={{color:C.accent,flexShrink:0,fontWeight:800,minWidth:16}}>{i+1}.</span>
            <span><strong style={{color:C.white}}>{t} — </strong>{d}</span>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',gap:8,flexWrap:'wrap'}}>
        <button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Oznacz jako ukończoną</button>
        <Link href="/kurs/dzial-2" style={{...btn(),textDecoration:'none',display:'inline-flex',alignItems:'center'}}>← Dział 2</Link>
      </div>
    </div>
  )
}

// ── KONFIGURACJA ──────────────────────────────────────────────────────────────
const DZIAL = {
  n:2, title:'Wyrażenia algebraiczne', href:'/kurs/dzial-2',
  lekcje:[
    {n:1,title:'Zmienne i wyrażenia',     href:'/kurs/zmienne-wyrazenia',     status:'active'},
    {n:2,title:'Upraszczanie wyrażeń',    href:'/kurs/wyrazenia-algebraiczne', status:'done'},
    {n:3,title:'Wzory skróconego mnożenia',href:'#',status:'locked'},
    {n:4,title:'Wyłączanie przed nawias', href:'#',status:'locked'},
    {n:5,title:'Wielomiany',              href:'#',status:'locked'},
    {n:6,title:'Sprawdzian',              href:'#',status:'locked',isTest:true},
  ],
}
const LEKCJA = {
  n:1, total:5, slug:'zmienne-wyrazenia',
  title:'Zmienne i wyrażenia algebraiczne',
  czas:'25 min', poziom:'Poziom: podstawowy–średni', cke:true,
}
const XP_MAP = {teoria:90,quiz:70,fiszki:80,kartkowka:100,cke:70,raport:40}
const MAX_FAQ = [
  {q:'co to jest zmienna algebra',a:'Litera zamiast liczby. x=3 tu, x=7 tam — ta sama litera, różne wartości. Algebra zapisuje ogólne prawdy, arytmetyka — konkretne liczby.'},
  {q:'wspolczynnik liczbowy jak znalezc',a:'Liczba przed zmiennymi. Gdy jej brak — wynosi 1. Sam minus to −1. W −mn²: współczynnik = −1. W xyz: współczynnik = 1.'},
  {q:'wyrazy podobne jak rozpoznac',a:'Identyczna część literowa — te same litery podniesione do tych samych potęg. 6xy i 4xy → podobne. 6xy i 6x²y → NIEPODOBNE (x ≠ x²).'},
  {q:'minus przed potega ujemna liczba',a:'(−2)² = +4. Nawias obejmuje minus. −2² = −4. Minus jest poza nawiasem. Zasada: gdy podstawiasz ujemną liczbę za zmienną, ZAWSZE wstaw ją w nawiasach.'},
  {q:'jak uproszczac wyrazenie podobne',a:'Zbierz wyrazy podobne, dodaj/odejmij ich współczynniki liczbowe, część literowa zostaje. 3x+5x+2x = (3+5+2)x = 10x.'},
]

export default function ZmienneWyrazeniaLesson() {
  const segments = [
    {id:'teoria',    icon:'📖', label:'Teoria',      content:({onComplete})=><TeoriaContent onComplete={onComplete}/>},
    {id:'quiz',      icon:'🧠', label:'Quiz',        content:({onComplete})=><QuizContent onComplete={onComplete}/>},
    {id:'fiszki',    icon:'🃏', label:'Fiszki',      content:({onComplete})=><FiszkiContent onComplete={onComplete}/>},
    {id:'kartkowka', icon:'✏️', label:'Kartkówka',   content:({onComplete})=><KartkowkaContent onComplete={onComplete}/>},
    {id:'cke',       icon:'📝', label:'Zadanie CKE', content:({onComplete})=><CKEContent onComplete={onComplete}/>},
    {id:'raport',    icon:'📊', label:'Raport',       content:({onComplete})=><RaportContent onComplete={onComplete}/>},
  ]
  return (
    <>
      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        input[type=range]{-webkit-appearance:none;height:4px;background:rgba(255,255,255,0.1);border-radius:2px}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#FF4D1C;cursor:pointer}
      `}</style>
      <LessonShell dzial={DZIAL} lekcja={LEKCJA} segments={segments} xpMap={XP_MAP} maxFaq={MAX_FAQ}/>
    </>
  )
}
