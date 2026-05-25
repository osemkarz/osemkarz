'use client'
import LessonShell from '../LessonShell'
import { useState } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA: Zastosowania procentów — wzbogacona o materiały z podręcznika Abeka
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

const Ans = ({val,note,type='ok'}) => (
  <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:8,marginTop:10,background:type==='ok'?'#EAF3DE':type==='none'?'#FCEBEB':'#E6F1FB',border:`0.5px solid ${type==='ok'?'#C0DD97':type==='none'?'#F7C1C1':'#B5D4F4'}`}}>
    <div style={{width:28,height:28,borderRadius:'50%',background:type==='ok'?'#3B6D11':type==='none'?'#A32D2D':'#185FA5',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:13,color:'#fff',fontWeight:700}}>{type==='ok'?'✓':type==='none'?'∅':'→'}</div>
    <div>
      <div style={{fontFamily:'monospace',fontSize:15,fontWeight:500,color:type==='ok'?'#27500A':type==='none'?'#791F1F':'#0C447C'}}>{val}</div>
      {note&&<div style={{fontSize:12,color:type==='ok'?'#3B6D11':type==='none'?'#A32D2D':'#185FA5',marginTop:2}}>{note}</div>}
    </div>
  </div>
)

const Rule = ({type,children}) => {
  const m={warn:{bg:'#FAEEDA',bl:'#854F0B',c:'#633806'},tip:{bg:'#EAF3DE',bl:'#3B6D11',c:'#27500A'},info:{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'},err:{bg:'#FCEBEB',bl:'#A32D2D',c:'#791F1F'}}[type]||{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'}
  return <div style={{background:m.bg,borderLeft:`3px solid ${m.bl}`,borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:m.c,lineHeight:1.75,margin:'14px 0'}}>{children}</div>
}

// ── Interaktywny wykres kołowy (SVG) ──────────────────────────────────────────
function PieChart({data,title}) {
  const [hov,setHov] = useState(null)
  const total = data.reduce((a,d)=>a+d.val,0)
  let cumAngle = -90
  const COLORS = ['#185FA5','#F5541E','#00B894','#6C5CE7','#FDCB6E','#E17055','#74B9FF']
  const slices = data.map((d,i)=>{
    const pct = d.val/total
    const angle = pct * 360
    const startAngle = cumAngle * Math.PI/180
    cumAngle += angle
    const endAngle = cumAngle * Math.PI/180
    const r = 80, cx = 110, cy = 110
    const x1 = cx + r*Math.cos(startAngle), y1 = cy + r*Math.sin(startAngle)
    const x2 = cx + r*Math.cos(endAngle), y2 = cy + r*Math.sin(endAngle)
    const large = angle > 180 ? 1 : 0
    const midAngle = (startAngle + endAngle)/2
    const lx = cx + (r+22)*Math.cos(midAngle), ly = cy + (r+22)*Math.sin(midAngle)
    return {path:`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`,color:COLORS[i%COLORS.length],label:`${Math.round(pct*100)}%`,lx,ly,name:d.name,pct:Math.round(pct*100),i}
  })
  return (
    <div style={{background:C.bg,borderRadius:12,padding:'16px',border:`0.5px solid ${C.border}`,margin:'14px 0'}}>
      {title&&<div style={{fontSize:13,fontWeight:500,color:C.text,textAlign:'center',marginBottom:10}}>{title}</div>}
      <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
        <svg width={220} height={220} viewBox="0 0 220 220" style={{flexShrink:0}}>
          {slices.map(s=>(
            <g key={s.i} onMouseEnter={()=>setHov(s.i)} onMouseLeave={()=>setHov(null)}>
              <path d={s.path} fill={s.color} stroke={C.white} strokeWidth={2}
                style={{transform:hov===s.i?'scale(1.04)':'scale(1)',transformOrigin:'110px 110px',transition:'transform .15s',opacity:hov!==null&&hov!==s.i?0.6:1}} />
              <text x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="middle" fill={C.text} fontSize={10} fontWeight={600}>{s.label}</text>
            </g>
          ))}
        </svg>
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
          {data.map((d,i)=>(
            <div key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
              style={{display:'flex',alignItems:'center',gap:8,padding:'6px 10px',borderRadius:6,background:hov===i?C.white:'transparent',transition:'background .15s',cursor:'default'}}>
              <div style={{width:12,height:12,borderRadius:3,background:COLORS[i%COLORS.length],flexShrink:0}}/>
              <span style={{fontSize:12,color:C.text2,flex:1}}>{d.name}</span>
              <span style={{fontSize:12,fontWeight:600,color:C.text,fontFamily:'monospace'}}>{slices[i].pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Interaktywny wykres słupkowy (SVG) ────────────────────────────────────────
function BarChart({data,title,unit=''}) {
  const [hov,setHov] = useState(null)
  const max = Math.max(...data.map(d=>d.val))
  const W = 300, H = 160, PAD = 36, BAR_W = Math.min(36, (W-PAD*2)/data.length - 8)
  const gap = (W-PAD*2)/data.length
  return (
    <div style={{background:C.bg,borderRadius:12,padding:'16px',border:`0.5px solid ${C.border}`,margin:'14px 0'}}>
      {title&&<div style={{fontSize:13,fontWeight:500,color:C.text,textAlign:'center',marginBottom:10}}>{title}</div>}
      <svg width="100%" viewBox={`0 0 ${W} ${H+40}`} style={{overflow:'visible'}}>
        {/* Siatka */}
        {[0,25,50,75,100].map(v=>{
          const y = PAD + (H-PAD) * (1 - v/100)
          return <g key={v}>
            <line x1={PAD} y1={y} x2={W} y2={y} stroke={C.border} strokeWidth={0.5}/>
            <text x={PAD-4} y={y} textAnchor="end" dominantBaseline="middle" fill={C.text3} fontSize={9}>{v}%</text>
          </g>
        })}
        {/* Słupki */}
        {data.map((d,i)=>{
          const pct = d.val/max
          const barH = (H-PAD)*pct
          const x = PAD + gap*i + gap/2 - BAR_W/2
          const y = H - barH
          return (
            <g key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} style={{cursor:'default'}}>
              <rect x={x} y={y} width={BAR_W} height={barH} rx={4}
                fill={hov===i?C.accent:'#185FA5'} opacity={hov!==null&&hov!==i?0.5:1} style={{transition:'all .15s'}}/>
              {hov===i&&<rect x={x-2} y={y-2} width={BAR_W+4} height={barH+2} rx={4} fill="none" stroke={C.accent} strokeWidth={1.5}/>}
              <text x={x+BAR_W/2} y={y-6} textAnchor="middle" fill={C.text} fontSize={10} fontWeight={hov===i?700:500}>{d.val}{unit}</text>
              <text x={x+BAR_W/2} y={H+14} textAnchor="middle" fill={C.text3} fontSize={9} style={{wordBreak:'break-all'}}>{d.name}</text>
            </g>
          )
        })}
        <line x1={PAD} y1={PAD} x2={PAD} y2={H} stroke={C.border} strokeWidth={1}/>
        <line x1={PAD} y1={H} x2={W} y2={H} stroke={C.border} strokeWidth={1}/>
      </svg>
    </div>
  )
}

// ── Tabela procent/ułamek/dziesiętny ──────────────────────────────────────────
function ConversionTable() {
  const rows = [
    ['1%','1/100','0,01'],['5%','1/20','0,05'],['10%','1/10','0,10'],
    ['12,5%','1/8','0,125'],['20%','1/5','0,20'],['25%','1/4','0,25'],
    ['33,3%','1/3','0,333...'],['37%','37/100','0,37'],['50%','1/2','0,50'],
    ['60%','3/5','0,60'],['75%','3/4','0,75'],['100%','1/1','1,00'],
    ['125%','5/4','1,25'],['150%','3/2','1,50'],['200%','2/1','2,00'],
  ]
  return (
    <div style={{overflowX:'auto',margin:'14px 0'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead>
          <tr style={{background:C.navy}}>
            {['Procent','Ułamek','Dziesiętny'].map(h=>(
              <th key={h} style={{padding:'10px 14px',textAlign:'center',color:'rgba(255,255,255,0.8)',fontSize:11,fontWeight:500,letterSpacing:'.05em',textTransform:'uppercase'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([p,u,d],i)=>(
            <tr key={i} style={{background:i%2===0?C.white:C.bg}}>
              <td style={{padding:'8px 14px',textAlign:'center',fontFamily:'monospace',fontWeight:600,color:C.accent}}>{p}</td>
              <td style={{padding:'8px 14px',textAlign:'center',fontFamily:'monospace',color:C.blue}}>{u}</td>
              <td style={{padding:'8px 14px',textAlign:'center',fontFamily:'monospace',color:C.text}}>{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── TEORIA ────────────────────────────────────────────────────────────────────
const TTABS = [
  {id:'podstawy',  label:'Podstawy procentów'},
  {id:'mnozniki',  label:'Mnożniki i zmiany'},
  {id:'wykresy',   label:'Wykresy procentowe'},
  {id:'stezenia',  label:'Stężenia roztworów'},
  {id:'finanse',   label:'Lokaty i odsetki'},
]

function TeoriaContent({onComplete}) {
  const [tab,setTab] = useState('podstawy')

  const CONTENT = {

    podstawy: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        <strong style={{color:C.text}}>Procent</strong> (symbol %) znaczy "na sto" (łac. <em>pro centum</em>). To ułamek z mianownikiem 100. Każdą wartość procentową możemy zapisać jako ułamek zwykły lub dziesiętny — i odwrotnie.
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'18px 24px',marginBottom:16,textAlign:'center'}}>
        <div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:10}}>Trzy równoważne zapisy</div>
        <div style={{fontFamily:'monospace',fontSize:18,color:'#fff',lineHeight:2.4}}>
          <span style={{color:'#FF7A4D'}}>25%</span> = <span style={{color:'#FF7A4D'}}>25/100</span> = <span style={{color:'#FF7A4D'}}>1/4</span> = <span style={{color:'#00B894'}}>0,25</span>
        </div>
        <div style={{fontSize:12,color:'rgba(255,255,255,.3)',marginTop:4}}>Procent → Ułamek → Dziesiętny → Procent</div>
      </div>

      <SH>Tabela przeliczników — naucz się na pamięć</SH>
      <ConversionTable/>

      <SH>Jak przeliczać — algorytmy</SH>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        {[
          {t:'Ułamek → Procent',s:'Podziel i przesuń przecinek o 2 miejsca w prawo',e:'3/4 = 0,75 = 75%',bg:'#EAF3DE',c:'#27500A'},
          {t:'Dziesiętny → Procent',s:'Przesuń przecinek o 2 miejsca w prawo i dodaj %',e:'0,456 = 45,6% ≈ 46%',bg:'#EAF3DE',c:'#27500A'},
          {t:'Procent → Ułamek',s:'Zapisz jako ułamek z mianownikiem 100 i uprość',e:'35% = 35/100 = 7/20',bg:'#E6F1FB',c:'#0C447C'},
          {t:'Procent → Dziesiętny',s:'Przesuń przecinek o 2 miejsca w lewo',e:'17% = 0,17',bg:'#E6F1FB',c:'#0C447C'},
        ].map(({t,s,e,bg,c})=>(
          <div key={t} style={{background:bg,borderRadius:8,padding:'14px',borderLeft:`3px solid ${c}`}}>
            <div style={{fontSize:12,fontWeight:600,color:c,marginBottom:6}}>{t}</div>
            <div style={{fontSize:12,color:C.text2,marginBottom:6,lineHeight:1.5}}>{s}</div>
            <div style={{fontFamily:'monospace',fontSize:13,color:c,fontWeight:500}}>{e}</div>
          </div>
        ))}
      </div>

      <SH>Trzy typy zadań procentowych</SH>
      {[
        {t:'Typ 1 — ile to p% z W?',f:'wynik = (p/100) · W',e:'17% z 352 = 0,17 · 352 = 59,84',note:'Zamień % na dziesiętny i mnóż'},
        {t:'Typ 2 — ile % liczby a stanowi b?',f:'p = (b/a) · 100%',e:'18 stanowi ile % z 60? → (18/60)·100% = 30%',note:'Podziel, przesuń przecinek'},
        {t:'Typ 3 — skoro p% wynosi b, ile wynosi całość W?',f:'W = b · (100/p)',e:'Skoro 15% wynosi 9, to całość = 9÷0,15 = 60',note:'Dziel przez ułamek dziesiętny'},
      ].map(({t,f,e,note},i)=>(
        <div key={i} style={{background:C.bg,borderRadius:8,padding:'14px',marginBottom:8,border:`0.5px solid ${C.border}`}}>
          <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:6}}>{t}</div>
          <div style={{fontFamily:'monospace',fontSize:14,color:C.blue,marginBottom:5}}>{f}</div>
          <div style={{fontFamily:'monospace',fontSize:13,color:C.accent,marginBottom:4}}>{e}</div>
          <div style={{fontSize:11,color:C.text3}}>{note}</div>
        </div>
      ))}

      <SH>Wzrost i spadek procentowy — zadania tekstowe</SH>
      <Task level="med" label="Wzrost procentowy (zainspirowane Abeka 1.35)" eq="Thomas Edison: lampa trwała 45h, w 1900 roku 600h. O ile % wzrosła trwałość?" />
      <Step n={1} text="Obliczamy wzrost: 600 − 45 = 555 godzin" result="" />
      <Step n={2} text="Dzielimy przez wartość WYJŚCIOWĄ (45):" result="555 ÷ 45 = 12,33..." />
      <Step n={3} text="Zamieniamy na procent:" result="12,33 · 100% ≈ 1233% wzrostu ✓" hi />

      <Task level="med" label="Spadek procentowy (Abeka: sklep spożywczy)" eq="Jabłka były po 1,50 zł/kg, po tygodniu 1,65 zł/kg. O ile % wzrosła cena?" />
      <Step n={1} text="Wzrost: 1,65 − 1,50 = 0,15 zł" result="" />
      <Step n={2} text="Dzielimy przez CENĘ WYJŚCIOWĄ (1,50):" result="0,15 ÷ 1,50 = 0,10" />
      <Step n={3} text="Wynik:" result="10% wzrostu ✓" hi />

      <Rule type="err"><strong>Pułapka:</strong> przy wzroście i spadku dzielisz zawsze przez WARTOŚĆ WYJŚCIOWĄ (z przed zmiany), nie przez nową wartość!</Rule>

      <Task level="hard" label="Deprecjacja — ile wynosiła cena oryginalna? (Abeka 1.35)" eq="Samochód stracił na wartości 2213,40 zł, co stanowiło 10% ceny zakupu. Jaka była cena zakupu?" />
      <Step n={1} text="Wiemy: 10% z ceny = 2213,40 zł" result="równanie: 0,10 · x = 2213,40" />
      <Step n={2} text="Dzielimy przez 0,10:" result="x = 2213,40 ÷ 0,10 = 22 134 zł ✓" hi />
    </div>,

    mnozniki: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Zamiast liczyć procent i dodawać do bazy, używamy <strong style={{color:C.text}}>mnożników dziesiętnych</strong>. To skraca czas i minimalizuje błędy — zwłaszcza przy wielokrotnych zmianach.
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'18px 24px',marginBottom:16}}>
        <div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:10}}>Wzory ogólne</div>
        <div style={{fontFamily:'monospace',fontSize:16,color:'#fff',lineHeight:2.4}}>
          Podwyżka o p% &nbsp;→&nbsp; <span style={{color:'#FF7A4D'}}>× (1 + p/100)</span><br/>
          Obniżka o p% &nbsp;→&nbsp; <span style={{color:'#00B894'}}>× (1 − p/100)</span>
        </div>
      </div>

      <SH>Tabela najczęstszych mnożników</SH>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:16}}>
        {[['−5%','0,95'],['−10%','0,90'],['−15%','0,85'],['−20%','0,80'],['−25%','0,75'],['−30%','0,70'],['−50%','0,50'],['−75%','0,25'],
          ['+5%','1,05'],['+10%','1,10'],['+15%','1,15'],['+20%','1,20'],['+25%','1,25'],['+30%','1,30'],['+50%','1,50'],['+100%','2,00']
        ].map(([z,m],i)=>(
          <div key={i} style={{textAlign:'center',padding:'8px 6px',borderRadius:8,background:i<8?'#EAF3DE':'#FAEEDA'}}>
            <div style={{fontSize:11,fontWeight:600,color:i<8?'#27500A':'#633806'}}>{z}</div>
            <div style={{fontFamily:'monospace',fontSize:15,fontWeight:700,color:i<8?'#3B6D11':'#854F0B'}}>{m}</div>
          </div>
        ))}
      </div>

      <Task level="basic" label="Jeden mnożnik — cena po rabacie" eq="Zegarek 59 zł, rabat 12%. Cena końcowa?" />
      <Step n={1} text="Mnożnik obniżki 12%: 1 − 0,12 = 0,88" result="" />
      <Step n={2} text="Cena po rabacie:" result="59 · 0,88 = 51,92 zł ✓" hi />
      <Ans val="Cena: 51,92 zł" note="Rabat wyniósł: 59 − 51,92 = 7,08 zł" />

      <Task level="med" label="Dwa mnożniki — podwyżka potem rabat (Abeka: James Robertson)" eq="Sklep narzucił 30% marży, potem obniżył o 20%. Koszulka kosztuje 52 zł. Ile kosztowała u hurtownika?" />
      <Step n={1} text="Mnożnik marży 30%: 1,30. Mnożnik rabatu 20%: 0,80" result="" />
      <Step n={2} text="Łączny mnożnik: 1,30 · 0,80 = 1,04" result="" />
      <Step n={3} text="Równanie: 1,04 · x = 52 → dzielimy przez 1,04:" result="x = 50 zł ✓" hi />
      <Ans val="Cena hurtowni: 50 zł" note="Sprawdzenie: 50·1,30=65, 65·0,80=52 ✓" />

      <Task level="hard" label="Klasyczna pułapka CKE — odwrotna zmiana" eq="Cenę obniżono o 20%. O ile % trzeba podnieść nową cenę, by wrócić do oryginału?" />
      <Step n={1} text="Cena po obniżce: 0,80 · x. Szukamy k: 0,80 · x · k = x" result="" />
      <Step n={2} text="Dzielimy przez x:" result="0,80 · k = 1" />
      <Step n={3} text="k = 1 ÷ 0,80 = 1,25" result="podwyżka o 25% ✓" hi />

      <Rule type="warn">
        <strong>Niesymetryczność procentów (CKE!):</strong><br/>
        +10% a potem −10% to <strong>nie jest</strong> powrót do ceny startowej.<br/>
        1,10 × 0,90 = <strong>0,99</strong> — czyli spadek o 1%.<br/>
        +20% i −20% = 1,20 × 0,80 = 0,96 — spadek o 4%.
      </Rule>

      <SH>Tabela znanych pułapek — zmiany procentowe z powrotem</SH>
      <div style={{overflowX:'auto',margin:'10px 0'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead><tr style={{background:C.bg}}>
            {['Podwyżka','Potem obniżka','Wynik','Błąd uczniów','Poprawnie'].map(h=><th key={h} style={{padding:'8px 10px',textAlign:'center',fontWeight:500,color:C.text3,borderBottom:`0.5px solid ${C.border}`}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {[['10%','10%','−1% (0,99)','0%','1,10×0,90=0,99'],['20%','20%','−4% (0,96)','0%','1,20×0,80=0,96'],['25%','20%','0% (1,00)','−5%','1,25×0,80=1,00'],['50%','33,3%','0% (1,00)','16,7%','1,50×0,667=1,00']].map((r,i)=>(
              <tr key={i} style={{background:i%2===0?C.white:C.bg}}>
                {r.map((c,j)=><td key={j} style={{padding:'8px 10px',textAlign:'center',fontFamily:j>=2?'monospace':'inherit',color:j===3?'#A32D2D':j===4?'#27500A':C.text2,borderBottom:`0.5px solid ${C.border}`}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>,

    wykresy: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Dane procentowe najczęściej przedstawiamy graficznie. Na egzaminie CKE musisz umieć <strong style={{color:C.text}}>czytać wykresy</strong> i obliczać wartości z nich odczytane. Podręcznik Abeka wyróżnia cztery typy wykresów.
      </p>

      <SH>Typ 1 — Wykres kołowy (diagram kołowy)</SH>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:10}}>
        Koło = 360°. Każdy wycinek to część całości. Procent wycinku = (wartość ÷ suma) × 100%. Rozmiar wycinku w stopniach = procent × 3,6°.
      </p>
      <PieChart
        title="Budżet rodziny Kowalskich (miesięczny, 4000 zł)"
        data={[{name:'Mieszkanie',val:36},{name:'Jedzenie',val:25},{name:'Transport',val:15},{name:'Oszczędności',val:14},{name:'Inne',val:10}]}
      />
      <div style={{background:C.bg,borderRadius:8,padding:'14px',border:`0.5px solid ${C.border}`,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:8}}>Pytania do wykresu (typ CKE):</div>
        {[
          ['Ile zł wydają na jedzenie?','25% z 4000 = 0,25 · 4000 = 1000 zł'],
          ['O ile p.p. więcej na mieszkanie niż transport?','36% − 15% = 21 p.p.'],
          ['Ile wynosi kąt wycinku "Oszczędności"?','14% · 360° = 50,4° ≈ 50°'],
          ['Ile razy więcej na jedzenie niż na inne?','25% ÷ 10% = 2,5 raza'],
        ].map(([q,a],i)=>(
          <div key={i} style={{display:'flex',gap:12,padding:'8px 0',borderBottom:i<3?`0.5px solid ${C.border}`:'none'}}>
            <div style={{flex:1,fontSize:13,color:C.text2}}>{q}</div>
            <div style={{fontFamily:'monospace',fontSize:13,color:'#27500A',fontWeight:500,flexShrink:0,maxWidth:'50%'}}>{a}</div>
          </div>
        ))}
      </div>

      <SH>Typ 2 — Wykres słupkowy</SH>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:10}}>
        Słupki pokazują wartości dla różnych kategorii. Ważne: skala na osi Y. Odczytuj wartość patrząc na górę słupka.
      </p>
      <BarChart
        title="Oceny z testu matematyki w klasie 8A (procent uczniów)"
        data={[{name:'5',val:25},{name:'4',val:40},{name:'3',val:20},{name:'2',val:12},{name:'1',val:3}]}
        unit="%"
      />
      <div style={{background:C.bg,borderRadius:8,padding:'14px',border:`0.5px solid ${C.border}`,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:8}}>Typowe pytania do wykresu słupkowego:</div>
        {[
          ['Jaki % uczniów dostał ocenę dostateczną lub wyższą?','25+40+20 = 85%'],
          ['Ilu uczniów z 30 dostało ocenę 2?','12% z 30 = 0,12·30 = 3,6 ≈ 4 uczniów'],
          ['O ile % więcej czwórek niż trójek?','40% − 20% = 20 p.p. więcej czwórek'],
        ].map(([q,a],i)=>(
          <div key={i} style={{display:'flex',gap:12,padding:'8px 0',borderBottom:i<2?`0.5px solid ${C.border}`:'none'}}>
            <div style={{flex:1,fontSize:13,color:C.text2}}>{q}</div>
            <div style={{fontFamily:'monospace',fontSize:12,color:'#27500A',fontWeight:500}}>{a}</div>
          </div>
        ))}
      </div>

      <SH>Typ 3 — Punkty procentowe vs procenty (pułapka CKE!)</SH>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        <div style={{background:'#E6F1FB',borderLeft:'3px solid #185FA5',borderRadius:'0 8px 8px 0',padding:'14px'}}>
          <div style={{fontSize:12,fontWeight:600,color:'#0C447C',marginBottom:6}}>Punkt procentowy (p.p.)</div>
          <div style={{fontSize:13,color:C.text2,lineHeight:1.65,marginBottom:8}}>Zwykła różnica odejmowania wartości procentowych.</div>
          <div style={{fontFamily:'monospace',fontSize:13,color:'#0C447C'}}>8% → 6% = <strong>−2 p.p.</strong></div>
        </div>
        <div style={{background:'#FAEEDA',borderLeft:'3px solid #854F0B',borderRadius:'0 8px 8px 0',padding:'14px'}}>
          <div style={{fontSize:12,fontWeight:600,color:'#633806',marginBottom:6}}>Zmiana procentowa (%)</div>
          <div style={{fontSize:13,color:C.text2,lineHeight:1.65,marginBottom:8}}>Stosunek zmiany do wartości wyjściowej × 100%.</div>
          <div style={{fontFamily:'monospace',fontSize:13,color:'#633806'}}>8% → 6% = <strong>−25%</strong></div>
        </div>
      </div>

      <Task level="cke" label="Zadanie z danych na wykresie — typ CKE" eq="Bezrobocie: styczeń 8%, czerwiec 6%. O ile p.p. i o ile % spadło?" />
      <Step n={1} text="Zmiana w punktach procentowych (proste odejmowanie):" result="8% − 6% = 2 p.p." />
      <Step n={2} text="Zmiana procentowa (baza = 8%):" result="(2 ÷ 8) · 100% = 25%" hi />
      <Ans val="Spadek o 2 p.p. = spadek o 25%" note="Dwie różne liczby — uważaj na pytanie w zadaniu!" />

      <Rule type="tip">
        <strong>Mnemotechnika:</strong> "Punkty procentowe" = policz na palcach różnicę na osi wykresu. "O ile procent" = proporcja do startu.
      </Rule>
    </div>,

    stezenia: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Zadania o roztworach wymagają śledzenia <strong style={{color:C.text}}>masy czystej substancji</strong> (np. soli) w <strong style={{color:C.text}}>całkowitej masie roztworu</strong> (sól + woda). Klucz: substancja i woda to dwie oddzielne składowe.
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'18px 24px',marginBottom:16,textAlign:'center'}}>
        <div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:10}}>Wzór na stężenie</div>
        <div style={{fontFamily:'monospace',fontSize:18,color:'#fff',lineHeight:2.4}}>
          Cp = (ms ÷ mr) × 100%<br/>
          <span style={{fontSize:14,color:'rgba(255,255,255,.5)'}}>ms = masa substancji · mr = ms + mw</span>
        </div>
      </div>
      <Rule type="err"><strong>PUŁAPKA:</strong> Stężenie = ms ÷ (ms + mw), NIE ms ÷ mw! Dzielisz przez masę CAŁEGO roztworu, nie tylko wody.</Rule>

      <SH>Metoda "kubełkowa" — jak śledzić substancję</SH>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:14}}>
        {[['Dosypanie soli','ms ↑ mr ↑','Oba rosną — stężenie rośnie'],['Dolanie wody','mw ↑ mr ↑','Tylko mr rośnie — stężenie maleje'],['Odparowanie wody','mw ↓ mr ↓','ms stałe — stężenie rośnie']].map(([t,f,d],i)=>(
          <div key={i} style={{background:C.bg,borderRadius:8,padding:'12px',border:`0.5px solid ${C.border}`,textAlign:'center'}}>
            <div style={{fontSize:12,fontWeight:500,color:C.text,marginBottom:6}}>{t}</div>
            <div style={{fontFamily:'monospace',fontSize:14,color:C.blue,marginBottom:4}}>{f}</div>
            <div style={{fontSize:11,color:C.text3}}>{d}</div>
          </div>
        ))}
      </div>

      <Task level="basic" label="Oblicz stężenie" eq="20 g soli rozpuszczono w 180 g wody. Cp = ?" />
      <Step n={1} text="Masa roztworu (NIE tylko woda!):" result="mr = 20 + 180 = 200 g" />
      <Step n={2} text="Stężenie:" result="Cp = (20 ÷ 200) · 100% = 10% ✓" hi />

      <Task level="med" label="Dosypanie soli — nowe stężenie" eq="4 kg roztworu 15% + 1 kg czystej soli = Cp?" />
      <Step n={1} text="Sól w starym roztworze: 15% z 4 kg:" result="0,15 · 4 = 0,6 kg" />
      <Step n={2} text="Nowa masa soli (dosypano 1 kg):" result="0,6 + 1 = 1,6 kg" />
      <Step n={3} text="Nowa masa roztworu (też wzrosła!):" result="4 + 1 = 5 kg" />
      <Step n={4} text="Nowe stężenie:" result="(1,6 ÷ 5) · 100% = 32% ✓" hi />

      <Task level="hard" label="Odparowanie wody — klasyka CKE" eq="20 kg roztworu 10% → zagęścić do 25%. Ile kg wody odparować?" />
      <Step n={1} text="Sól (zostaje, woda paruje!):" result="10% z 20 = 2 kg" />
      <Step n={2} text="Oznaczamy x = kg odparowanej wody. Nowe równanie:" result="0,25 · (20 − x) = 2" />
      <Step n={3} text="5 − 0,25x = 2 → 0,25x = 3" result="x = 12 kg ✓" hi />
      <Ans val="Odparować 12 kg wody" note="Sprawdzenie: masa=8kg, 2÷8·100%=25% ✓" />

      <Task level="cke" label="Mieszanie roztworów — zadanie CKE" eq="3 kg syropu 20% + 2 kg syropu 40% = ? %" />
      <Step n={1} text="Cukier w roztworze 1: 20% z 3 kg:" result="0,20 · 3 = 0,6 kg" />
      <Step n={2} text="Cukier w roztworze 2: 40% z 2 kg:" result="0,40 · 2 = 0,8 kg" />
      <Step n={3} text="Łącznie: 0,6+0,8=1,4 kg w 5 kg roztworu:" result="(1,4 ÷ 5) · 100% = 28% ✓" hi />
    </div>,

    finanse: <div>
      <p style={{fontSize:14,lineHeight:1.9,color:C.text2,marginBottom:14}}>
        Matematyka finansowa to jeden z najczęstszych kontekstów procentów w życiu i na egzaminie. Oprocentowanie podawane jest zawsze <strong style={{color:C.text}}>w skali roku</strong>, podatek pobierany jest <strong style={{color:C.text}}>tylko od zysku</strong>.
      </p>
      <div style={{background:C.navy,borderRadius:10,padding:'18px 24px',marginBottom:16}}>
        <div style={{fontSize:10,letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:10}}>Wzory finansowe</div>
        <div style={{fontFamily:'monospace',fontSize:14,color:'#fff',lineHeight:2.4}}>
          Odsetki brutto = Kapitał × Oprocentowanie × (Miesiące ÷ 12)<br/>
          Odsetki netto = Odsetki brutto × (1 − podatek/100)<br/>
          <span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Przy podatku 19%: netto = brutto × 0,81</span>
        </div>
      </div>

      <SH>Słownik terminów finansowych</SH>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
        {[['Kapitał','Kwota wpłacona do banku (nie zmienia się!)'],['Odsetki','Wynagrodzenie za pożyczenie pieniędzy bankowi'],['Oprocentowanie (p.a.)','Roczna stopa — zawsze "w skali roku"'],['Brutto','Przed odliczeniem podatku'],['Netto','Po odliczeniu podatku (to co dostajesz "na rękę"'],['Lokata','Rachunek gdzie zostawiasz pieniądze na ustalony czas']].map(([t,d])=>(
          <div key={t} style={{background:C.bg,borderRadius:8,padding:'10px 12px',border:`0.5px solid ${C.border}`}}>
            <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:3}}>{t}</div>
            <div style={{fontSize:12,color:C.text2,lineHeight:1.45}}>{d}</div>
          </div>
        ))}
      </div>

      <Task level="basic" label="Lokata roczna — bez podatku" eq="3000 zł na 6% rocznie przez 12 miesięcy" />
      <Step n={1} text="Odsetki: 6% z 3000 zł:" result="0,06 · 3000 = 180 zł" />
      <Step n={2} text="Kwota końcowa:" result="3000 + 180 = 3180 zł ✓" hi />

      <Task level="med" label="Lokata krótsza niż rok (PUŁAPKA!)" eq="4000 zł na 4% p.a. przez 9 miesięcy" />
      <Step n={1} text="UWAGA: 4% to oprocentowanie ROCZNE, lokata trwa 9/12 roku!" result="" />
      <Step n={2} text="Odsetki roczne: 4% z 4000 = 160 zł" result="" />
      <Step n={3} text="Za 9 miesięcy (= 3/4 roku):" result="160 · 9/12 = 160 · 0,75 = 120 zł ✓" hi />
      <Ans val="Odsetki: 120 zł" note="Sprawdzenie: 3 mies=40zł, 9 mies=3·40=120 ✓" />

      <Task level="hard" label="Lokata z podatkiem + zakup z rabatem — zadanie złożone CKE" eq="10 000 zł · 5% p.a. · podatek 20% → czy starczy na kosiarkę 450 zł − 10%?" />
      <Step n={1} text="Odsetki brutto: 5% z 10 000:" result="500 zł" />
      <Step n={2} text="Podatek 20% TYLKO od odsetek (nie od kapitału!):" result="odsetki netto = 500 · 0,80 = 400 zł" />
      <Step n={3} text="Cena kosiarki po rabacie 10%:" result="450 · 0,90 = 405 zł" />
      <Step n={4} text="Porównanie:" result="400 < 405 — zabraknie 5 zł ✗" hi />

      <SH>Rabat, prowizja, zysk i strata — tabela przeglądowa</SH>
      <div style={{overflowX:'auto',margin:'10px 0'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead><tr style={{background:C.navy}}>
            {['Pojęcie','Wzór','Przykład'].map(h=><th key={h} style={{padding:'9px 12px',textAlign:'left',color:'rgba(255,255,255,.7)',fontWeight:500}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {[
              ['Rabat (zniżka)','Rabat = Cena regularna × Stopa rabatu','Zegarek 59 zł, rabat 12% → 59·0,12=7,08 zł'],
              ['Cena po rabacie','Cena końcowa = Cena regularna × (1−rabat)','59·0,88 = 51,92 zł'],
              ['Prowizja','Prowizja = Sprzedaż × Stopa prowizji','Sprzedaż 2000 zł, prowizja 8% → 160 zł'],
              ['Zysk','Zysk = Cena sprzedaży − Cena zakupu','Kupił za 50, sprzedał za 65 → zysk 15 zł'],
              ['Strata','Strata = Cena zakupu − Cena sprzedaży','Kupił za 80, sprzedał za 72 → strata 8 zł'],
              ['% zysku/straty','% = (Zysk lub Strata ÷ Cena zakupu) × 100%','15÷50·100% = 30% zysku'],
            ].map((r,i)=>(
              <tr key={i} style={{background:i%2===0?C.white:C.bg}}>
                {r.map((c,j)=><td key={j} style={{padding:'8px 12px',fontFamily:j===1?'monospace':'inherit',fontSize:j===1?12:12,color:j===1?C.blue:C.text2,borderBottom:`0.5px solid ${C.border}`}}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Rule type="warn"><strong>Ważne dla CKE:</strong> Podatek liczymy od ZYSKU, nie od kapitału. Oprocentowanie "w skali roku" wymaga proporcjonalnego przeliczenia dla lokat krótszych niż 12 miesięcy.</Rule>
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

// ── QUIZ (8 pytań, wzbogacony o zadania z Abeka) ──────────────────────────────
const QUIZ = [
  {q:'Zamień na procent:',eq:'3/4',opts:['34%','75%','25%','43%'],ans:1,dlaczego:'3÷4=0,75. Przesuwamy przecinek o 2 miejsca w prawo: 75%. Można też: 3/4 = 75/100 = 75%.'},
  {q:'Oblicz (metoda mnożnikowa):',eq:'17% z 352',opts:['59,84','5,98','598,4','17,352'],ans:0,dlaczego:'Metoda dziesiętna: 0,17 × 352 = 59,84. Sprawdzenie metodą proporcji: 352/100 = 3,52, 3,52×17=59,84 ✓'},
  {q:'Sklep po rabacie 20% sprzedaje rower za 1600 zł. Jaka była cena pierwotna?',eq:'',opts:['2000 zł','1920 zł','1280 zł','1800 zł'],ans:0,dlaczego:'Mnożnik rabatu 20% to 0,80. Równanie: 0,80·x=1600. x=1600÷0,80=2000 zł. Nie dodaj 20% do 1600!'},
  {q:'Cena akcji spadła o 20%, potem wzrosła o 20%. Wynik względem ceny startowej:',eq:'',opts:['Taka sama','−4%','−2%','+4%'],ans:1,dlaczego:'Mnożniki: 0,80 × 1,20 = 0,96. Cena to 96% wartości startowej — spadek o 4%. Procenty nie są symetryczne!'},
  {q:'W mieście A żyje 520 000 ludzi, po 20 latach 370 000. O ile % spadła populacja?',eq:'',opts:['29%','40%','15%','150%'],ans:0,dlaczego:'Spadek: 520000−370000=150000. Procent spadku: (150000÷520000)·100%≈29% (zaokrągljemy do całości). Źródło: Abeka, Pittsburgh 1970-1990.'},
  {q:'Stężenie: 30 g soli w 270 g wody. Cp = ?',eq:'',opts:['11,1%','10%','30%','3%'],ans:1,dlaczego:'mr = 30+270 = 300g. Cp = (30÷300)·100% = 10%. Pułapka: nie dziel przez 270 (samą wodę)!'},
  {q:'Lokata 2000 zł, 3% p.a., czas 6 miesięcy, bez podatku. Odsetki = ?',eq:'',opts:['60 zł','30 zł','120 zł','6 zł'],ans:1,dlaczego:'Odsetki roczne: 3% z 2000 = 60 zł. Lokata trwa 6/12 = 0,5 roku. Odsetki = 60·0,5 = 30 zł.'},
  {q:'18 jest jakim procentem z 60? (Abeka 1.35)',eq:'',opts:['30%','33%','18%','60%'],ans:0,dlaczego:'Tworzymy ułamek: 18/60 = 3/10 = 0,30. Zamieniamy na procent: 30%. Źródło: Example 1.35a z podręcznika Abeka.'},
]

function QuizContent({onComplete}) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([])
  if(qi>=QUIZ.length){const ok=results.filter(r=>r).length;return(
    <div style={card}>
      <div style={{textAlign:'center',padding:'16px 0 24px'}}>
        <div style={{fontSize:48,marginBottom:8}}>{ok>=7?'🎯':ok>=5?'👍':'📚'}</div>
        <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>{ok}/{QUIZ.length} poprawnych</div>
        <div style={{fontSize:14,color:C.text2}}>{ok>=7?'Doskonale! Lecisz dalej.':ok>=5?'Dobry wynik — na fiszki!':'Wróć do teorii.'}</div>
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

// ── FISZKI (15 kart, wzbogacone o materiały Abeka) ────────────────────────────
const FISZKI = [
  {q:'Co znaczy "procent" i jak go zapisujemy jako ułamek?',a:'Procent (%) = "na sto". Zawsze ułamek z mianownikiem 100.',f:'25% = 25/100 = 1/4 = 0,25',note:'Procent nie istnieje sam — to zawsze "procent z czegoś".'},
  {q:'Jak zamienić ułamek dziesiętny na procent?',a:'Przesuń przecinek o 2 miejsca w prawo i dodaj znak %.',f:'0,17 → 17%  ·  0,456 → 45,6% ≈ 46%'},
  {q:'Jaki mnożnik dziesiętny odpowiada podwyżce o 35%?',a:'Podwyżka o 35% = 100%+35% = 135% = mnożnik 1,35.',f:'Nowa cena = stara cena × 1,35',note:'Ogólnie: podwyżka o p% → mnożnik 1+p/100'},
  {q:'Jak jednym działaniem znaleźć cenę przed rabatem 20%?',a:'Podziel cenę po rabacie przez mnożnik obniżki (0,80).',f:'0,80 · x = 160 → x = 160÷0,80 = 200 zł'},
  {q:'Dlaczego +10% potem −10% NIE wraca do startu?',a:'Bo druga zmiana działa na NOWEJ (wyższej) podstawie.',f:'1,10 × 0,90 = 0,99 (−1%, nie 0%)',note:'Procenty nie są symetryczne — to klasyczna pułapka CKE!'},
  {q:'Wzór na stężenie procentowe Cp',a:'Masa czystej substancji podzielona przez masę CAŁEGO roztworu × 100%.',f:'Cp = (ms ÷ mr) × 100%\ngdzie mr = ms + mw',note:'NIE dziel przez masę samej wody!'},
  {q:'Co się dzieje z masą soli gdy odparowujemy wodę?',a:'Masa soli NIE zmienia się. Maleje tylko masa wody i masa roztworu.',f:'ms = stała, mr_nowe = mr − mw_odparowana'},
  {q:'"Co najmniej n" i "co najwyżej n" — jakie znaki?',a:'"Co najmniej n" = n lub więcej → ≥. "Co najwyżej n" = n lub mniej → ≤.',f:'"Co najmniej 8 tygodni" → x ≥ 8'},
  {q:'Jaki jest wzór na odsetki z lokaty krótszej niż rok?',a:'Odsetki roczne pomnóż przez (liczba miesięcy ÷ 12).',f:'Odsetki = Kapitał × p% × (m÷12)',note:'"W skali roku" (p.a.) = zawsze przelicz na czas trwania'},
  {q:'Podatek od lokaty — od czego się go liczy?',a:'TYLKO od zarobionych odsetek (zysku), NIGDY od wpłaconego kapitału.',f:'Podatek 19% z 500 zł odsetek = 95 zł',note:'Twoje 10 000 zł kapitału jest bezpieczne.'},
  {q:'Jak obliczyć procent wzrostu lub spadku?',a:'Podziel zmianę przez WARTOŚĆ WYJŚCIOWĄ i pomnóż przez 100%.',f:'Wzrost z 45h do 600h → (555÷45)·100%=1233%',note:'Źródło: Thomas Edison, żarówka — Abeka 1.38'},
  {q:'Jak zamienić procent na stopnie w wykresie kołowym?',a:'Pomnóż procent przez 3,6° (bo 100% = 360°).',f:'25% → 25×3,6=90° · 15% → 15×3,6=54°'},
  {q:'Punkt procentowy (p.p.) vs procent — różnica',a:'p.p. = różnica przez odejmowanie. Procent = stosunek do wartości wyjściowej.',f:'8%→6%: −2 p.p. ALE −25% wartości',note:'Te dwie liczby ZAWSZE są różne (chyba że baza=100%)'},
  {q:'Jak czytać wykres słupkowy na egzaminie?',a:'1. Sprawdź skalę osi Y. 2. Odczytaj wartość na górze słupka. 3. Oblicz żądaną wielkość.',note:'Skalę często pomijają uczniowie — to powoduje błąd o rząd wielkości!'},
  {q:'Rabat 12% z zegarek 59 zł — ile wynosi cena po rabacie? (Abeka)',a:'Cena po rabacie = cena × (1−0,12) = cena × 0,88.',f:'59 × 0,88 = 51,92 zł · Rabat = 59−51,92 = 7,08 zł'},
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
        <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlipped(false)}} style={btn({background:'#EAF3DE',color:'#27500A',border:'0.5px solid #C0DD97',textAlign:'center'})}>Opanowana — następna</button>
      </div>}
    </div>
  )
}

// ── KARTKÓWKA (20 pytań) ──────────────────────────────────────────────────────
const KQ = [
  {q:'Zamień na procent:',eq:'0,76',opts:['7,6%','76%','760%','0,76%'],ans:1,hint:'Przesuń przecinek o 2 miejsca w prawo.'},
  {q:'Zamień na dziesiętny:',eq:'37%',opts:['37','3,7','0,37','0,037'],ans:2,hint:'Przesuń przecinek o 2 miejsca w lewo.'},
  {q:'50% z 475 =',eq:'',opts:['23,75','950','237,5','475'],ans:2,hint:'50% = 0,5. Pomnóż: 0,5 × 475.'},
  {q:'Oblicz:',eq:'17% z $370.75',opts:['$63,03','$6,30','$370,75','$37,07'],ans:0,hint:'0,17 × 370,75. Oblicz krok po kroku.'},
  {q:'Rower kosztował 3000 zł, podrożał o 10% i staniał o 10%. Cena teraz:',eq:'',opts:['3000 zł','2970 zł','3300 zł','2700 zł'],ans:1,hint:'Mnożniki: ×1,10 potem ×0,90. Oblicz po kolei.'},
  {q:'Buty kosztują 210 zł, co stanowi 70% ceny regularnej. Cena regularna:',eq:'',opts:['300 zł','280 zł','147 zł','350 zł'],ans:0,hint:'0,70 · x = 210. Podziel przez 0,70.'},
  {q:'18 jest jakim procentem z 60?',eq:'',opts:['30%','18%','33%','3%'],ans:0,hint:'18÷60 = ? Przesuń przecinek × 100.'},
  {q:'9 jest 15% jakiej liczby?',eq:'',opts:['135','60','1,35','6'],ans:1,hint:'0,15 · x = 9. Podziel przez 0,15.'},
  {q:'Miasto: 1970 — 520 000 mieszk., 1990 — 370 000 mieszk. O ile % spadła populacja?',eq:'',opts:['29%','40%','150%','71%'],ans:0,hint:'Różnica: 150 000. Podziel przez 520 000 (wartość WYJŚCIOWĄ).'},
  {q:'Jabłka: 1,50 zł/kg → 1,65 zł/kg. O ile % wzrosła cena?',eq:'',opts:['10%','15%','9%','11%'],ans:0,hint:'Różnica: 0,15. Podziel przez 1,50 (cenę WYJŚCIOWĄ).'},
  {q:'Stężenie: 20 g soli + 180 g wody. Cp = ?',eq:'',opts:['11,1%','10%','20%','18%'],ans:1,hint:'mr = 20+180=200. Cp = 20÷200 × 100%.'},
  {q:'Do 10 kg solanki 8% dosypano 2 kg soli. Nowe stężenie:',eq:'',opts:['20%','23,3%','10%','18%'],ans:1,hint:'Sól stara: 8%×10=0,8kg. Nowa sól: 0,8+2=2,8kg. Nowy mr: 12kg.'},
  {q:'Wykres kołowy: jedzenie 25%, mieszkanie 36%. Kąt wycinku "jedzenie" w stopniach:',eq:'',opts:['90°','72°','25°','36°'],ans:0,hint:'25% × 360° = ?'},
  {q:'Bezrobocie spadło z 10% do 8%. O ile p.p. i o ile % spadło?',eq:'',opts:['2 p.p. i 20%','2% i 20%','20 p.p. i 2%','2 p.p. i 2%'],ans:0,hint:'p.p. = proste odejmowanie. % = różnica÷baza×100.'},
  {q:'Lokata 3000 zł na 6% p.a. przez 12 miesięcy. Kwota końcowa:',eq:'',opts:['3180 zł','3600 zł','306 zł','3060 zł'],ans:0,hint:'Odsetki = 6% z 3000 = 180 zł. Kwota = 3000+180.'},
  {q:'Lokata 4000 zł na 4% p.a. przez 9 miesięcy. Odsetki (bez podatku):',eq:'',opts:['160 zł','120 zł','180 zł','40 zł'],ans:1,hint:'Odsetki roczne: 4%×4000=160. Za 9 mies: 160×9/12.'},
  {q:'Lokata 5000 zł, 5% p.a., podatek 20%. Odsetki netto:',eq:'',opts:['200 zł','250 zł','50 zł','100 zł'],ans:0,hint:'Brutto: 5%×5000=250. Netto: 250×0,80=200.'},
  {q:'Zegarek 59 zł, rabat 12%. Cena po rabacie:',eq:'',opts:['$51,92','$52','$47','$7,08'],ans:0,hint:'59 × 0,88 = ? (lub: 59 − 12%z59)'},
  {q:'Joanna kupiła sukienkę, zniżka wynosiła 15 zł, co stanowiło 33% ceny. Jaka była cena oryginalna?',eq:'',opts:['$45,45','$45','$50','$33'],ans:0,hint:'0,33 · x = 15. Podziel przez 0,33. Zaokrąglij.'},
  {q:'Bok kwadratu wydłużono o 20%. O ile % wzrosło pole?',eq:'',opts:['20%','40%','44%','24%'],ans:2,hint:'Pole = bok². (1,20a)² = 1,44a². Pole wzrosło o 44%.'},
]

function KartkowkaContent({onComplete}) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([]),[hint,setHint]=useState(false)
  if(!mode)return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.blue,display:'inline-block'}}/>
        Kartkówka — 20 pytań · poziom egzaminacyjny
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
        {[['trening','🏋️','Tryb trening','Podpowiedzi po kliknięciu'],['egzamin','🎯','Tryb egzamin','Bez podpowiedzi — jak CKE']].map(([m,ico,t,d])=>(
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
      <div style={{fontSize:52,marginBottom:8}}>{ok>=17?'🏆':ok>=13?'⭐':'📚'}</div>
      <div style={{fontSize:22,fontWeight:500,color:C.text,marginBottom:6}}>{ok}/20 poprawnych</div>
      <div style={{fontSize:14,color:C.text2,marginBottom:20}}>Ocena: {ok>=18?'A — doskonały':ok>=14?'B — dobry':ok>=10?'C — zadowalający':'D — wróć do teorii'}</div>
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
        {q.opts.map((o,i)=>{let bg=C.white,border=C.border,color=C.text;if(done){if(i===q.ans){bg='#EAF3DE';border='#3B6D11';color='#27500A'}else if(i===sel){bg='#FCEBEB';border='#A32D2D';color='#791F1F'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setResults(p=>[...p,i===q.ans])}} style={{border:`0.5px solid ${border}`,borderRadius:8,padding:'11px 16px',cursor:done?'default':'pointer',fontFamily:'monospace',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={()=>{if(ki<KQ.length-1){setKi(k=>k+1);setSel(null);setDone(false);setHint(false)}else setKi(KQ.length)}} style={btn({background:C.navy,color:'#fff',border:'none'})}>{ki<KQ.length-1?'Dalej →':'Zakończ →'}</button></div>}
    </div>
  )
}

// ── ZADANIE CKE ───────────────────────────────────────────────────────────────
const CKE_Z = [
  {rok:'styl 2023',nr:17,pkt:3,
   tresc:'Sklep zakupił koszulki i narzucił na każdą 30% marży. Z powodu końca sezonu cenę obniżono o 20%. Po obniżce koszulka kosztuje 52 zł. Jaka była cena zakupu w hurtowni? Zapisz obliczenia.',
   wsk:'Zapisz kolejne zmiany jednym równaniem z x i dwoma mnożnikami dziesiętnym. Mnożnik marży = 1,30, mnożnik obniżki = 0,80.',
   rozw:['Cena zakupu = x. Marża 30% → mnożnik 1,30. Obniżka 20% → mnożnik 0,80.','Równanie: x · 1,30 · 0,80 = 52','Mnożnik łączny: 1,30 · 0,80 = 1,04','1,04 · x = 52','x = 52 ÷ 1,04 = 50'],
   odp:'Cena zakupu w hurtowni wynosiła 50 zł.',
   schemat:'Za cena po marży = 1,3x: 1 pkt. Za pełne równanie z obniżką: 2 pkt. Za wynik x=50: 3 pkt.'},
  {rok:'styl 2022',nr:19,pkt:3,
   tresc:'Zmieszano 3 kg syropu o zawartości 20% cukru z 2 kg syropu o zawartości 40% cukru. Jaka jest procentowa zawartość cukru w mieszaninie? Zapisz obliczenia.',
   wsk:'Oblicz masę czystego cukru w każdym syropie ODDZIELNIE. Potem dodaj masy substancji i masy roztworów.',
   rozw:['Cukier w syropie 1: 20% z 3 kg = 0,20 · 3 = 0,6 kg','Cukier w syropie 2: 40% z 2 kg = 0,40 · 2 = 0,8 kg','Łączna masa cukru: 0,6 + 0,8 = 1,4 kg','Łączna masa roztworu: 3 + 2 = 5 kg','Stężenie: (1,4 ÷ 5) · 100% = 28%'],
   odp:'Zawartość cukru w mieszaninie wynosi 28%.',
   schemat:'Za obliczenie masy cukru w jednym syropie: 1 pkt. Za stosunek substancji do mieszaniny: 2 pkt. Za wynik 28%: 3 pkt.'},
  {rok:'styl 2024',nr:12,pkt:2,
   tresc:'Na wykresie kołowym przedstawiono, jak rodzina Nowaków wydaje miesięczny budżet 3600 zł. Mieszkanie — 35%, Jedzenie — 25%, Transport — 15%, Oszczędności — 15%, Inne — 10%. Oblicz: a) ile złotych wydają na transport, b) o ile złotych więcej na mieszkanie niż na oszczędności.',
   wsk:'Dla każdej kategorii: procent × budżet całkowity. Potem porównaj dwie wartości.',
   rozw:['a) Transport: 15% z 3600 = 0,15 · 3600 = 540 zł','b) Mieszkanie: 35% z 3600 = 0,35 · 3600 = 1260 zł','   Oszczędności: 15% z 3600 = 0,15 · 3600 = 540 zł','   Różnica: 1260 − 540 = 720 zł'],
   odp:'a) Na transport: 540 zł. b) Na mieszkanie o 720 zł więcej niż na oszczędności.',
   schemat:'Za poprawne obliczenie transportu: 1 pkt. Za poprawne obliczenie różnicy: 1 pkt.'},
]

function CKEContent({onComplete}) {
  const [rev,setRev]=useState([]),[sol,setSol]=useState(Array(CKE_Z.length).fill(false))
  return(
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:C.blue,marginBottom:4,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:C.blue,display:'inline-block'}}/>
        Zadania z arkuszy CKE
      </div>
      <p style={{fontSize:13,color:C.text2,marginBottom:16,lineHeight:1.65}}>Zadania wzorowane na egzaminach ósmoklasisty 2021–2024. Spróbuj samodzielnie — potem sprawdź rozwiązanie ze schematem oceniania.</p>
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
        <div style={{fontSize:14,color:C.text2}}>Procenty od podstaw do wykresów i finansów — poziom CKE</div>
      </div>
      <div style={{background:C.navy,borderRadius:12,padding:'20px',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'linear-gradient(135deg,#F5541E,#FF7A4D)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}}>🤖</div>
          <div><div style={{fontSize:14,fontWeight:500,color:'#fff'}}>Max</div><div style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>podsumowanie lekcji</div></div>
        </div>
        <div style={{fontSize:13,color:'rgba(255,255,255,.8)',lineHeight:1.8,marginBottom:14}}>Procenty to temat który pojawia się wszędzie — ceny, wykresy, finanse, stężenia. Sześć zasad które muszą być automatyczne:</div>
        {[['Mnożnik dziesiętny','Każdą zmianę procentową zastąp mnożnikiem. Wielokrotne zmiany = mnożenie przez siebie.'],['Procenty nie są symetryczne','+10% potem −10% to −1%. Zawsze licz na nowej podstawie.'],['Słowo "od" = mianownik','W pytaniu "o ile % więcej od X" — X to mianownik (= 100%).'],['Stężenie = ms ÷ mr','Dziel przez masę CAŁEGO roztworu, nie przez samą wodę.'],['p.p. vs procenty','Odejmowanie daje p.p. Dzielenie przez bazę daje %.'],['Podatek od zysku','Lokata: podatek liczysz od odsetek, nie od całego kapitału.']].map(([t,d],i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:8,fontSize:13,color:'rgba(255,255,255,.75)',lineHeight:1.6}}>
            <span style={{color:'#F5541E',flexShrink:0,marginTop:1}}>→</span>
            <span><strong style={{color:'rgba(255,255,255,.95)'}}>{t}:</strong> {d}</span>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>✓ Oznacz lekcję jako ukończoną</button>
        <Link href="/kurs/dzial-4" style={{...btn(),textDecoration:'none',display:'inline-block'}}>← Dział 4</Link>
      </div>
    </div>
  )
}

// ── KONFIGURACJA ──────────────────────────────────────────────────────────────
const DZIAL={n:4,title:'Procenty i statystyka',href:'/kurs/dzial-4',lekcje:[
  {n:1,title:'Zastosowania procentów',href:'/kurs/procenty',status:'active'},
  {n:2,title:'Procenty w statystyce',href:'#',status:'locked'},
  {n:3,title:'Sprawdzian działu',href:'#',status:'locked',isTest:true},
]}
const LEKCJA={n:1,total:2,slug:'procenty',title:'Zastosowania procentów — wykresy, stężenia i finanse',czas:'35 min',poziom:'Poziom: zaawansowany',cke:true}
const XP_MAP={teoria:80,quiz:60,fiszki:80,kartkowka:120,cke:70,raport:40}
const MAX_FAQ=[
  {q:'jak policzyć procent z liczby szybko',a:'Zamień % na ułamek dziesiętny i mnóż: 17% z 352 = 0,17 × 352 = 59,84. Dla podwyżki o 17%: cena × 1,17. Dla obniżki: cena × 0,83.'},
  {q:'punkty procentowe co to jest pp różnica',a:'Punkt procentowy to wynik zwykłego odejmowania. Wzrost z 8% do 10% = +2 p.p. Ale wartość wskaźnika wzrosła o 25% (bo 2÷8=25%). Dwie zupełnie różne liczby!'},
  {q:'podwyżka potem obniżka czy wychodzi to samo',a:'Nie! +10% potem −10% = 1,10 × 0,90 = 0,99. Wynik to 99% wartości startowej — strata 1%. Procenty działają na nowej podstawie.'},
  {q:'stężenie procentowe wzór jak liczyć',a:'Cp = (masa substancji ÷ masa CAŁEGO roztworu) × 100%. Uwaga: mianownik to ms + mw (substancja + woda), nie sama woda!'},
  {q:'podatek od lokaty odsetki jak',a:'Podatek płacisz TYLKO od zarobionych odsetek (zysku), nie od wpłaconego kapitału. Odsetki brutto × (1−podatek%) = odsetki netto.'},
  {q:'wykres kołowy jak obliczyć kąt wycinka',a:'Kąt wycinku = procent × 3,6°. Przykład: 25% → 25 × 3,6 = 90°. Suma wszystkich kątów = 360°.'},
]

export default function ProcentyLesson() {
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
