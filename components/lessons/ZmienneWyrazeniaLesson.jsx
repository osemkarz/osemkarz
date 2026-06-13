'use client'
import LessonShell from '../LessonShell'
import { useState } from 'react'
import Link from 'next/link'

const C = { navy:'#0F1729',accent:'#F5541E',green:'#00B894',purple:'#6C5CE7',blue:'#185FA5',bg:'#F7F8FC',white:'#fff',border:'#E2E8F0',text:'#0F1729',text2:'#4A5568',text3:'#8896A5' }
const card = { background:C.white, borderRadius:14, border:'0.5px solid #E2E8F0', padding:24 }
const btn = (x={}) => ({ padding:'10px 22px', fontSize:13, fontWeight:500, borderRadius:8, cursor:'pointer', fontFamily:'inherit', border:'0.5px solid #E2E8F0', background:'#fff', color:'#0F1729', transition:'all .15s', ...x })

const SH = ({children}) => (
  <div style={{fontSize:14,fontWeight:500,color:'#0F1729',margin:'22px 0 10px',paddingBottom:8,borderBottom:'0.5px solid #E2E8F0',display:'flex',alignItems:'center',gap:8}}>
    <span style={{width:3,height:16,background:'#6C5CE7',borderRadius:2,display:'inline-block',flexShrink:0}}/>{children}
  </div>
)

const Step = ({n,text,result,hi}) => (
  <div style={{display:'flex',gap:10}}>
    <div style={{width:22,height:22,background:'#0F1729',color:'#fff',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:600,flexShrink:0,marginTop:10}}>{n}</div>
    <div style={{flex:1,padding:'8px 0',borderBottom:'0.5px solid #E2E8F0'}}>
      <div style={{fontSize:13,color:'#4A5568',marginBottom:result?5:0,lineHeight:1.55}}>{text}</div>
      {result&&<div style={hi?{background:'#EAF3DE',borderLeft:'3px solid #3B6D11',padding:'7px 12px',borderRadius:'0 7px 7px 0',fontFamily:'monospace',fontSize:14,color:'#27500A',fontWeight:600,display:'inline-block'}:{background:'#F7F8FC',padding:'6px 10px',borderRadius:6,fontFamily:'monospace',fontSize:13,color:'#0F1729',display:'inline-block'}}>{result}</div>}
    </div>
  </div>
)

const Task = ({level,label,eq}) => {
  const b={basic:{bg:'#EAF3DE',c:'#27500A',txt:'Podstawowy'},med:{bg:'#FAEEDA',c:'#633806',txt:'Sredni'},hard:{bg:'#FCEBEB',c:'#791F1F',txt:'Trudny'},cke:{bg:'#EEEDFE',c:'#3C3489',txt:'Typ CKE'}}[level]||{bg:'#EAF3DE',c:'#27500A',txt:'Podstawowy'}
  return (
    <div style={{margin:'18px 0'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
        <span style={{fontSize:10,fontWeight:500,padding:'3px 9px',borderRadius:20,background:b.bg,color:b.c}}>{b.txt}</span>
        {label&&<span style={{fontSize:13,color:'#4A5568'}}>{label}</span>}
      </div>
      <div style={{background:'#F7F8FC',borderRadius:8,padding:'14px 18px',border:'0.5px solid #E2E8F0'}}>
        <div style={{fontFamily:'monospace',fontSize:18,color:'#0F1729',fontWeight:500,lineHeight:1.6}}>{eq}</div>
      </div>
    </div>
  )
}

const Ans = ({val,note}) => (
  <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:8,marginTop:10,background:'#EAF3DE',border:'0.5px solid #C0DD97'}}>
    <div style={{width:28,height:28,borderRadius:'50%',background:'#3B6D11',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:13,color:'#fff',fontWeight:700}}>&#10003;</div>
    <div><div style={{fontFamily:'monospace',fontSize:15,fontWeight:500,color:'#27500A'}}>{val}</div>{note&&<div style={{fontSize:12,color:'#3B6D11',marginTop:2}}>{note}</div>}</div>
  </div>
)

const Rule = ({type,children}) => {
  const m={warn:{bg:'#FAEEDA',bl:'#854F0B',c:'#633806'},tip:{bg:'#EAF3DE',bl:'#3B6D11',c:'#27500A'},info:{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'},err:{bg:'#FCEBEB',bl:'#A32D2D',c:'#791F1F'}}[type]||{bg:'#E6F1FB',bl:'#185FA5',c:'#0C447C'}
  return <div style={{background:m.bg,borderLeft:'3px solid '+m.bl,borderRadius:'0 8px 8px 0',padding:'12px 16px',fontSize:13,color:m.c,lineHeight:1.75,margin:'14px 0'}}>{children}</div>
}

function ExprValueCalc() {
  const [x, setX] = useState(2)
  const [y, setY] = useState(3)
  const expr1 = 4*x*x*y
  const expr2 = 2*x + 3*y - 5
  const expr3 = x*x - 2*x*y + y*y
  return (
    <div style={{background:'#F7F8FC',borderRadius:12,padding:'16px',border:'0.5px solid #E2E8F0',margin:'14px 0'}}>
      <div style={{fontSize:11,color:'#8896A5',marginBottom:12,textTransform:'uppercase',letterSpacing:'.06em'}}>Oblicz wartosc wyrazenia - przestaw suwaki</div>
      <div style={{display:'flex',gap:24,marginBottom:16,flexWrap:'wrap'}}>
        {[['x',x,setX],['y',y,setY]].map(([name,val,set])=>(
          <div key={name} style={{flex:1,minWidth:120}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontFamily:'monospace',fontSize:14,fontWeight:600,color:'#185FA5'}}>{name} =</span>
              <span style={{fontFamily:'monospace',fontSize:16,fontWeight:700,color:'#0F1729'}}>{val}</span>
            </div>
            <input type="range" min={-5} max={5} value={val} onChange={e=>set(Number(e.target.value))} style={{width:'100%',cursor:'pointer'}}/>
          </div>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {[
          ['4x²y', '4·'+x+'²·'+y+' = 4·'+(x*x)+'·'+y, expr1],
          ['2x + 3y - 5', '2·'+x+' + 3·'+y+' - 5 = '+2*x+' + '+3*y+' - 5', expr2],
          ['x² - 2xy + y²', x+'² - 2·'+x+'·'+y+' + '+y+'² = '+(x*x)+' - '+(2*x*y)+' + '+(y*y), expr3],
        ].map(([expr,rozw,wynik])=>(
          <div key={expr} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:'#fff',borderRadius:8,border:'0.5px solid #E2E8F0'}}>
            <div style={{fontFamily:'monospace',fontSize:14,fontWeight:600,color:'#0F1729',minWidth:130}}>{expr}</div>
            <div style={{fontSize:12,color:'#8896A5',flex:1}}>{rozw}</div>
            <div style={{fontFamily:'monospace',fontSize:18,fontWeight:700,color:'#F5541E',minWidth:50,textAlign:'right'}}>{wynik}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const TTABS = [
  {id:'intro',   label:'Algebra vs arytmetyka'},
  {id:'budowa',  label:'Budowa wyrazenia'},
  {id:'typy',    label:'Typy wyraze'},
  {id:'potegi',  label:'Potegi i wykladniki'},
  {id:'wartosc', label:'Wartosc wyrazenia'},
]

function TeoriaContent({onComplete}) {
  const [tab, setTab] = useState('intro')
  const idx = TTABS.findIndex(t=>t.id===tab)

  const tabs_content = {
    intro: (
      <div>
        <p style={{fontSize:14,lineHeight:1.9,color:'#4A5568',marginBottom:14}}>
          Algebra to rozszerzenie arytmetyki. Zamiast tylko konkretnych liczb, uzywamy <strong style={{color:'#0F1729'}}>liter (zmiennych)</strong> reprezentujacych liczby. Ta sama litera moze oznaczac rozne liczby w roznych zadaniach.
        </p>
        <div style={{background:'#0F1729',borderRadius:10,padding:'18px 24px',marginBottom:14}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,.4)',marginBottom:10,textTransform:'uppercase',letterSpacing:'.08em'}}>Abeka 3.1 - Algebra vs Arytmetyka</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            {[['Arytmetyka','Tylko konkretne liczby','6 groszy + 3 nikle + 8 groszy','= 17'],['Algebra','Litery zamiast liczb','6d + 3n + 8p','(nie da sie uproscic dalej)']].map(([t,d,p,w])=>(
              <div key={t}>
                <div style={{fontSize:12,fontWeight:600,color:'rgba(255,255,255,.5)',marginBottom:6}}>{t}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginBottom:6}}>{d}</div>
                <div style={{fontFamily:'monospace',fontSize:16,color:'#fff',marginBottom:2}}>{p}</div>
                <div style={{fontFamily:'monospace',fontSize:14,color:'#FDCB6E'}}>{w}</div>
              </div>
            ))}
          </div>
        </div>
        <SH>Co to jest zmienna?</SH>
        <p style={{fontSize:14,lineHeight:1.9,color:'#4A5568',marginBottom:10}}>
          Zmienna (litera) moze miec rozne wartosci. x = 3 w rownaniu x = 2+1, ale x = 9 w rownaniu x = 12-3.
        </p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:14}}>
          {[['x = 3','gdy x + 1 = 4'],['x = 7','gdy 2x = 14'],['x = 0','gdy x + 5 = 5']].map(([v,k])=>(
            <div key={v} style={{background:'#F7F8FC',borderRadius:8,padding:'12px',textAlign:'center',border:'0.5px solid #E2E8F0'}}>
              <div style={{fontFamily:'monospace',fontSize:18,fontWeight:700,color:'#185FA5',marginBottom:4}}>{v}</div>
              <div style={{fontSize:11,color:'#8896A5'}}>{k}</div>
            </div>
          ))}
        </div>
        <Rule type="warn">W algebrze NIE uzywamy znaku x dla mnozenia - myli sie z litera x. Zamiast tego: 4*x lub 4x lub 4(x).</Rule>
      </div>
    ),
    budowa: (
      <div>
        <p style={{fontSize:14,lineHeight:1.9,color:'#4A5568',marginBottom:14}}>
          Kazde wyrazenie algebraiczne zbudowane jest z konkretnych elementow. Znajomosc terminologii jest kluczowa na CKE.
        </p>
        <SH>Slownik terminow (Abeka 3.1)</SH>
        <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:14}}>
          {[
            ['Zmienna','Litera zastepujaca nieznan lub zmienn liczbe.','x, y, a, n'],
            ['Wspolczynnik liczbowy','Liczba stojaca przed zmienn. Gdy brak - wynosi 1.','W 6xy: 6 | W xy: 1 | W -3a: -3'],
            ['Wyraz (skladnik)','Jedna czesc wyrazenia oddzielona + lub -.','W 6x+4y: wyrazy to 6x i 4y'],
            ['Wyraz wolny','Wyraz bez zmiennej - sama liczba.','W 3x2+2x-5: wyraz wolny = -5'],
            ['Czynnik','Kazda z mnozonych czesci.','Czynniki 6xy: 6, x, y'],
          ].map(([t,d,p])=>(
            <div key={t} style={{background:'#F7F8FC',borderRadius:8,padding:'11px 14px',border:'0.5px solid #E2E8F0',display:'flex',gap:12}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:'#0F1729',marginBottom:2}}>{t}</div>
                <div style={{fontSize:12,color:'#4A5568'}}>{d}</div>
              </div>
              <div style={{fontFamily:'monospace',fontSize:11,color:'#185FA5',textAlign:'right',maxWidth:200,lineHeight:1.7}}>{p}</div>
            </div>
          ))}
        </div>
        <SH>Ile wyrazow ma wyrazenie?</SH>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {[['6x + 4y','2 wyrazy','6x i 4y'],['3x² - 2x + 5','3 wyrazy','3x², -2x, 5'],['4ab','1 wyraz','jednomian'],['9d + 4t + 8p','3 wyrazy','9d, 4t, 8p']].map(([e,n,d])=>(
            <div key={e} style={{display:'flex',gap:12,padding:'9px 14px',background:'#F7F8FC',borderRadius:8,border:'0.5px solid #E2E8F0',alignItems:'center'}}>
              <div style={{fontFamily:'monospace',fontSize:15,fontWeight:600,color:'#0F1729',minWidth:160}}>{e}</div>
              <div style={{fontSize:13,fontWeight:500,color:'#F5541E',minWidth:80}}>{n}</div>
              <div style={{fontSize:12,color:'#8896A5'}}>{d}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    typy: (
      <div>
        <p style={{fontSize:14,lineHeight:1.9,color:'#4A5568',marginBottom:14}}>
          Wyrazenia algebraiczne klasyfikujemy wedlug liczby wyrazow.
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
          {[
            {n:'Jednomian',eng:'monomial',def:'Wyrazenie z 1 wyrazem.',przyk:['4x²y','-7ab','12','x³'],kolor:'#185FA5'},
            {n:'Dwumian',eng:'binomial',def:'Wyrazenie z dokladnie 2 wyrazami.',przyk:['x + y','3x - 5','9d - 6h'],kolor:'#6C5CE7'},
            {n:'Trojmian',eng:'trinomial',def:'Wyrazenie z dokladnie 3 wyrazami.',przyk:['2x + y + 5','x² - 2x + 1'],kolor:'#F5541E'},
            {n:'Wielomian',eng:'polynomial',def:'Ogolna nazwa - 2 lub wiecej wyrazow.',przyk:['wszystkie dwumiany','trojmiany i wieksze'],kolor:'#00B894'},
          ].map(t=>(
            <div key={t.n} style={{borderRadius:10,border:'1px solid '+t.kolor+'22',overflow:'hidden'}}>
              <div style={{background:t.kolor,padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div>
                  <span style={{fontWeight:700,color:'#fff',fontSize:14}}>{t.n}</span>
                  <span style={{fontSize:11,color:'rgba(255,255,255,.5)',marginLeft:8}}>{t.eng}</span>
                </div>
              </div>
              <div style={{padding:'12px 16px',background:'#fff'}}>
                <div style={{fontSize:13,color:'#4A5568',marginBottom:8}}>{t.def}</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {t.przyk.map(p=><span key={p} style={{fontFamily:'monospace',fontSize:12,background:t.kolor+'11',color:t.kolor,padding:'3px 8px',borderRadius:6}}>{p}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    potegi: (
      <div>
        <p style={{fontSize:14,lineHeight:1.9,color:'#4A5568',marginBottom:14}}>
          Wykladnik to mala liczba po prawej stronie u gory - mowi ile razy podstawa jest mnozenia.
        </p>
        <div style={{background:'#0F1729',borderRadius:10,padding:'18px 24px',marginBottom:14,textAlign:'center'}}>
          <div style={{fontFamily:'monospace',fontSize:28,color:'#fff',marginBottom:8}}>
            3<span style={{fontSize:18,verticalAlign:'super',color:'#FDCB6E'}}>2</span> = 3 · 3 = 9
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:32,fontSize:12,color:'rgba(255,255,255,.4)'}}>
            <span>↑ podstawa</span><span>↑ wykladnik</span>
          </div>
        </div>
        <SH>Jak czytamy potegi</SH>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:14}}>
          {[['x²','x do kwadratu','x · x'],['x³','x do szescianu','x · x · x'],['x⁴','x do czwartej','x · x · x · x'],['x¹','x do pierwszej = x','= x'],['x⁰','x do zerowej = 1','= 1 (dla x≠0)'],['x⁵','x do piatej','x · x · x · x · x']].map(([p,c,r])=>(
            <div key={p} style={{background:'#F7F8FC',borderRadius:8,padding:'10px 12px',border:'0.5px solid #E2E8F0'}}>
              <div style={{fontFamily:'monospace',fontSize:18,fontWeight:700,color:'#185FA5',marginBottom:3}}>{p}</div>
              <div style={{fontSize:11,color:'#4A5568',marginBottom:2}}>{c}</div>
              <div style={{fontFamily:'monospace',fontSize:12,color:'#8896A5'}}>{r}</div>
            </div>
          ))}
        </div>
        <Rule type="info">Dwie wazne zasady: x¹ = x | x⁰ = 1 (dla x≠0)</Rule>
        <Task level="med" label="Rozwin i oblicz" eq="8 · 8 · x · y · y · y" />
        <Step n={1} text="Grupujemy: (8·8) · x · (y·y·y)" result="8² · x · y³" />
        <Step n={2} text="Obliczamy 8² = 64:" result="64xy³" hi />
        <Ans val="64xy³" />
      </div>
    ),
    wartosc: (
      <div>
        <p style={{fontSize:14,lineHeight:1.9,color:'#4A5568',marginBottom:14}}>
          <strong style={{color:'#0F1729'}}>Wartosc wyrazenia</strong> obliczamy podstawiajac konkretne liczby w miejsce zmiennych i wykonujac dzialania.
        </p>
        <SH>Interaktywny kalkulator - zmien x i y</SH>
        <ExprValueCalc/>
        <SH>Algorytm - 3 kroki</SH>
        <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:14}}>
          {[
            ['Podstaw','Zastap kazda zmienna podana liczba. Uzywaj nawiasow przy ujemnych!','x=-2 wstawiasz (-2), nie -2'],
            ['Oblicz potegi','Jako pierwsze oblicz wszystkie potegi.','(-2)² = 4, nie -4'],
            ['Kolejnosc dzialan','Mnozenie przed dodawaniem. Skroc do jednej liczby.','2·3 + 4 = 6 + 4 = 10'],
          ].map(([t,d,p],i)=>(
            <div key={i} style={{display:'flex',gap:12,padding:'10px 14px',background:'#F7F8FC',borderRadius:8,border:'0.5px solid #E2E8F0'}}>
              <div style={{width:24,height:24,borderRadius:'50%',background:'#0F1729',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
              <div>
                <div style={{fontSize:13,fontWeight:500,color:'#0F1729',marginBottom:2}}>{t}</div>
                <div style={{fontSize:12,color:'#4A5568',marginBottom:3}}>{d}</div>
                <div style={{fontFamily:'monospace',fontSize:12,color:'#185FA5'}}>{p}</div>
              </div>
            </div>
          ))}
        </div>
        <Task level="basic" label="Oblicz wartosc gdy x=3, y=2" eq="2x + 3y - 5" />
        <Step n={1} text="Podstawiamy x=3, y=2:" result="2·3 + 3·2 - 5" />
        <Step n={2} text="Mnozenie:" result="6 + 6 - 5" />
        <Step n={3} text="Dodawanie/odejmowanie:" result="7" hi />
        <Ans val="7" note="Sprawdzenie: 2(3)+3(2)-5 = 6+6-5 = 7" />
        <Task level="med" label="Liczby ujemne - pulapka CKE!" eq="x² - 2xy + y²  gdy  x=-2, y=3" />
        <Step n={1} text="Podstawiamy (nawiasy przy ujemnych!):" result="(-2)² - 2·(-2)·3 + 3²" />
        <Step n={2} text="Potegi: (-2)²=4 i 3²=9:" result="4 - 2·(-2)·3 + 9" />
        <Step n={3} text="Mnozenie: 2·(-2)·3 = -12:" result="4 - (-12) + 9" />
        <Step n={4} text="Odejmowanie ujemnej = dodawanie:" result="4 + 12 + 9 = 25" hi />
        <Ans val="25" />
        <Rule type="err">PULAPKA CKE: (-2)² = 4, ale -2² = -4. Zawsze nawiasy przy ujemnych!</Rule>
      </div>
    ),
  }

  return (
    <div style={card}>
      <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'#6C5CE7',marginBottom:12,display:'flex',alignItems:'center',gap:6}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:'#6C5CE7',display:'inline-block'}}/>
        Teoria - {TTABS.find(t=>t.id===tab)?.label}
        <span style={{marginLeft:'auto',fontWeight:400,color:'#8896A5'}}>Sekcja {idx+1} z {TTABS.length}</span>
      </div>
      <div style={{display:'flex',gap:5,marginBottom:18,flexWrap:'wrap',paddingBottom:14,borderBottom:'0.5px solid #E2E8F0'}}>
        {TTABS.map((t,i)=>{const isDone=i<idx,isActive=t.id===tab;return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'5px 12px',fontSize:11,fontWeight:500,borderRadius:20,cursor:'pointer',fontFamily:'inherit',transition:'all .15s',border:'0.5px solid '+(isActive?'#0F1729':isDone?'#C0DD97':'#E2E8F0'),background:isActive?'#0F1729':isDone?'#EAF3DE':'#fff',color:isActive?'#fff':isDone?'#27500A':'#4A5568'}}>{t.label}</button>
        )})}
      </div>
      {tabs_content[tab]}
      <div style={{display:'flex',justifyContent:'space-between',marginTop:22,gap:8,paddingTop:14,borderTop:'0.5px solid #E2E8F0'}}>
        {idx>0?<button onClick={()=>setTab(TTABS[idx-1].id)} style={btn()}>&#8592; {TTABS[idx-1].label}</button>:<div/>}
        {idx<TTABS.length-1
          ?<button onClick={()=>setTab(TTABS[idx+1].id)} style={btn({background:'#0F1729',color:'#fff',border:'none'})}>{TTABS[idx+1].label} &#8594;</button>
          :<button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>&#10003; Ukonczylem teorie &#8594;</button>}
      </div>
    </div>
  )
}

const QUIZ = [
  {q:'Ktore z tych wyraze to jednomian?',eq:'',opts:['3x + 2y','4x²y','a - b','x + y - 1'],ans:1,dlaczego:'Jednomian = jedno wyrazenie bez + i -. 4x²y to iloczyn liczby 4, x² i y.'},
  {q:'Jaki jest wspolczynnik liczbowy w wyrazeniu:',eq:'xy',opts:['0','x','1','brak'],ans:2,dlaczego:'Gdy przed zmienna nie stoi zadna liczba, wspolczynnik liczbowy wynosi 1. xy = 1*xy.'},
  {q:'Ile wyrazow ma wyrazenie?',eq:'6x + 4y',opts:['1','2','3','6'],ans:1,dlaczego:'Policz + i - i dodaj 1: mamy jeden znak +, wiec 1+1=2 wyrazy. To: 6x i 4y.'},
  {q:'Co to jest:',eq:'9d + 4t + 8p',opts:['Jednomian','Dwumian','Trojmian','Wielomian 4-wyrazowy'],ans:2,dlaczego:'Trzy wyrazy (9d, 4t, 8p) = trojmian. Przyklad z Abeka 3.1.'},
  {q:'Ile wynosi (-3)²?',eq:'',opts:['-9','9','-6','6'],ans:1,dlaczego:'(-3)² = (-3)*(-3) = 9. Dwa minusy daja plus! Uwaga: -3² = -9.'},
  {q:'Oblicz wartosc wyrazenia gdy x=2:',eq:'3x² - 5',opts:['7','19','1','10'],ans:0,dlaczego:'3*(2)² - 5 = 3*4 - 5 = 12 - 5 = 7.'},
  {q:'Zapisz bez wykladnika:',eq:'2x³',opts:['2*x*x*x','2x*2x*2x','2³*x','x*x*x'],ans:0,dlaczego:'Wykladnik 3 przy x oznacza x*x*x. Liczba 2 to staly wspolczynnik.'},
  {q:'Oblicz wartosc gdy a=4, b=-1:',eq:'a² + 2ab - b²',opts:['7','23','9','25'],ans:0,dlaczego:'4² + 2*4*(-1) - (-1)² = 16 + (-8) - 1 = 7.'},
]

function QuizContent({onComplete}) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([])
  if(qi>=QUIZ.length){const ok=results.filter(r=>r).length;return(
    <div style={card}>
      <div style={{textAlign:'center',padding:'16px 0 24px'}}>
        <div style={{fontSize:48,marginBottom:8}}>{ok>=7?'&#127919;':ok>=5?'&#128077;':'&#128218;'}</div>
        <div style={{fontSize:22,fontWeight:500,color:'#0F1729',marginBottom:6}}>{ok}/{QUIZ.length} poprawnych</div>
      </div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
        <button onClick={()=>{setQi(0);setSel(null);setDone(false);setResults([])}} style={btn()}>Powtorz</button>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>&#10003; Fiszki &#8594;</button>
      </div>
    </div>
  )}
  const q=QUIZ[qi]
  return(
    <div style={card}>
      <div style={{display:'flex',gap:4,marginBottom:16}}>{QUIZ.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i<qi?'#00B894':i===qi?'#F5541E':'#E2E8F0',transition:'background .3s'}}/>)}</div>
      <div style={{fontSize:15,fontWeight:500,color:'#0F1729',marginBottom:12,lineHeight:1.55}}>{q.q}</div>
      {q.eq&&<div style={{background:'#0F1729',borderRadius:8,padding:'11px 18px',marginBottom:14,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:20,color:'#fff'}}>{q.eq}</div></div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
        {q.opts.map((o,i)=>{let bg='#fff',border='#E2E8F0',color='#0F1729';if(done){if(i===q.ans){bg='#EAF3DE';border='#3B6D11';color='#27500A'}else if(i===sel){bg='#FCEBEB';border='#A32D2D';color='#791F1F'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setResults(p=>[...p,i===q.ans])}} style={{border:'0.5px solid '+border,borderRadius:8,padding:'12px 14px',cursor:done?'default':'pointer',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<>
        <div style={{padding:'12px 16px',borderRadius:8,marginBottom:10,background:sel===q.ans?'#EAF3DE':'#FCEBEB',border:'0.5px solid '+(sel===q.ans?'#C0DD97':'#F7C1C1'),color:sel===q.ans?'#27500A':'#791F1F'}}>
          <div style={{fontSize:13,lineHeight:1.7}}><strong>{sel===q.ans?'Poprawnie!':'Bledna odpowiedz.'}</strong>
            <div style={{background:'#EEEDFE',borderRadius:6,padding:'8px 12px',marginTop:8,fontSize:12,color:'#3C3489',lineHeight:1.7}}>{q.dlaczego}</div>
          </div>
        </div>
        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <button onClick={()=>{if(qi<QUIZ.length-1){setQi(q=>q+1);setSel(null);setDone(false)}else setQi(QUIZ.length)}} style={btn({background:'#0F1729',color:'#fff',border:'none'})}>{qi<QUIZ.length-1?'Nastepne &#8594;':'Zobacz wynik &#8594;'}</button>
        </div>
      </>}
    </div>
  )
}

const FISZKI = [
  {q:'Czym rozni sie algebra od arytmetyki?',a:'Algebra uzywa liter (zmiennych) zamiast tylko liczb. Ta sama litera moze oznaczac rozne wartosci.',f:'6d + 3n + 8p (algebra)'},
  {q:'Co to jest zmienna?',a:'Litera zastepujaca nieznan lub zmienn liczbe.',f:'x = 3 w x+1=4\nx = 7 w 2x=14'},
  {q:'Ile wynosi wspolczynnik liczbowy w wyrazeniu xy?',a:'1. Gdy przed zmienna nie stoi zadna liczba, wspolczynnik = 1.',note:'Czesta pulapka w zadaniach CKE!'},
  {q:'Jak liczyc wyrazy w wyrazeniu?',a:'Policz znaki + i - i dodaj 1.',f:'3x² + 2x - 5 = 3 wyrazy'},
  {q:'Jednomian, dwumian, trojmian - czym sa?',a:'1 wyraz = jednomian, 2 = dwumian, 3 = trojmian.',f:'4x²y | x+y | x²-2x+1'},
  {q:'Co oznacza wykladnik w x³?',a:'x jest czynnikiem 3 razy: x³ = x*x*x',f:'y⁴ = y*y*y*y'},
  {q:'Ile wynosi x⁰ i x¹?',a:'x⁰ = 1 (dla x≠0). x¹ = x.',f:'5⁰ = 1 | y¹ = y'},
  {q:'Jak obliczac wartosc wyrazenia?',a:'1. Podstaw liczby (ujemne W NAWIASACH). 2. Oblicz potegi. 3. Kolejnosc dzialan.',f:'x=-2: x² = (-2)² = 4'},
  {q:'Jaka jest roznica miedzy (-2)² a -2²?',a:'(-2)² = 4 (caly nawias do potegi). -2² = -4 (tylko 2 jest potegowane).',note:'Zawsze nawiasy gdy podstawiasz ujemna liczbe!'},
  {q:'Co to jest wyraz wolny?',a:'Wyraz bez zadnej zmiennej - sama liczba.',f:'W 3x²+2x-5: wyraz wolny = -5'},
]

function FiszkiContent({onComplete}) {
  const [deck,setDeck]=useState(FISZKI.map((f,i)=>({...f,id:i}))),[flipped,setFlipped]=useState(false),[mastered,setMastered]=useState(0)
  if(deck.length===0)return(
    <div style={{...card,textAlign:'center'}}>
      <div style={{fontSize:48,marginBottom:8}}>&#127924;</div>
      <div style={{fontSize:22,fontWeight:500,marginBottom:6}}>Wszystkie {FISZKI.length} kart opanowane!</div>
      <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:16}}>
        <button onClick={()=>{setDeck(FISZKI.map((f,i)=>({...f,id:i})));setFlipped(false);setMastered(0)}} style={btn()}>Powtorz</button>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>&#10003; Kartkowka &#8594;</button>
      </div>
    </div>
  )
  const c=deck[0],pct=Math.round((mastered/FISZKI.length)*100)
  return(
    <div style={card}>
      <div style={{height:4,background:'#E2E8F0',borderRadius:2,marginBottom:12,overflow:'hidden'}}><div style={{height:'100%',background:'#00B894',width:pct+'%',transition:'width .3s',borderRadius:2}}/></div>
      <div style={{fontSize:12,color:'#8896A5',textAlign:'center',marginBottom:12}}>{mastered}/{FISZKI.length} opanowanych | Pozostalo: {deck.length} | kliknij zeby obrocic</div>
      <div onClick={()=>setFlipped(f=>!f)} style={{cursor:'pointer',minHeight:180,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',padding:28,textAlign:'center',background:flipped?'#fff':'#0F1729',border:'0.5px solid '+(flipped?'#E2E8F0':'rgba(255,255,255,.08)'),transition:'background .3s',marginBottom:14}}>
        {!flipped
          ?<div><div style={{fontSize:11,color:'rgba(255,255,255,.25)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>Fiszka {mastered+1}/{FISZKI.length}</div><div style={{fontSize:16,fontWeight:500,color:'#fff',lineHeight:1.6}}>{c.q}</div></div>
          :<div><div style={{fontSize:14,color:'#0F1729',lineHeight:1.7,marginBottom:8}}>{c.a}</div>{c.f&&<div style={{fontFamily:'monospace',fontSize:13,color:'#F5541E',fontWeight:600,margin:'8px 0',whiteSpace:'pre-line'}}>{c.f}</div>}{c.note&&<div style={{fontSize:12,color:'#8896A5',marginTop:4}}>{c.note}</div>}</div>}
      </div>
      {flipped&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlipped(false)}} style={btn({background:'#FCEBEB',color:'#791F1F',border:'0.5px solid #F7C1C1',textAlign:'center'})}>Trudna - powtorz</button>
        <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlipped(false)}} style={btn({background:'#EAF3DE',color:'#27500A',border:'0.5px solid #C0DD97',textAlign:'center'})}>Opanowana &#8594;</button>
      </div>}
    </div>
  )
}

const KQ = [
  {q:'Ktory zapis NIE jest poprawny dla 4*x*x*y?',eq:'',opts:['4x²y','4·x²·y','4(xx)y','4×x²y'],ans:3,hint:'W algebrze nie uzywamy znaku x dla mnozenia.'},
  {q:'Wskaż trojmian:',eq:'',opts:['3xy','9x - y','2x + y + 5','x'],ans:2,hint:'Policz wyrazy: 2x, y, 5 - trzy wyrazy.'},
  {q:'Wspolczynnik liczbowy wyrazu xyz = ?',eq:'',opts:['0','z','xyz','1'],ans:3,hint:'Brak liczby przed zmiennymi = wspolczynnik 1.'},
  {q:'Zapisz jako potege:',eq:'y·y·y·y',opts:['4y','y⁴','4y⁴','y+y+y+y'],ans:1,hint:'y jako czynnik 4 razy = y⁴.'},
  {q:'Oblicz:',eq:'3³',opts:['9','27','6','33'],ans:1,hint:'3³ = 3·3·3 = 9·3 = 27.'},
  {q:'Ile wynosi x⁰ dla x=5?',eq:'',opts:['0','5','1','nieokreslone'],ans:2,hint:'Kazda niezerowa liczba do potegi 0 = 1.'},
  {q:'Oblicz wartosc gdy x=3:',eq:'2x² - 4',opts:['14','50','2','32'],ans:0,hint:'Najpierw potega: 3²=9. Potem: 2·9-4=18-4=14.'},
  {q:'Oblicz wartosc gdy a=-2, b=3:',eq:'a + b²',opts:['7','1','25','-7'],ans:0,hint:'(-2) + (3)² = -2 + 9 = 7.'},
  {q:'Oblicz wartosc gdy x=2, y=-1:',eq:'x² + 2xy + y²',opts:['1','9','5','3'],ans:0,hint:'(x+y)² = (2+(-1))² = (1)² = 1.'},
  {q:'Ktore wyrazenie to: "x podzielone przez 3"?',eq:'',opts:['3x','x-3','x/3','3/x'],ans:2,hint:'x divided by 3 = x/3.'},
  {q:'Ile wyrazow ma wielomian?',eq:'3x³ - 2x²y + xy - 5',opts:['3','4','5','2'],ans:1,hint:'Znaki -, +, - = 3 znaki + 1 = 4 wyrazy.'},
  {q:'Jaki typ wyrazenia to 11y - 6h?',eq:'',opts:['Jednomian','Dwumian','Trojmian','Wielomian'],ans:1,hint:'Dwa wyrazy = dwumian.'},
]

function KartkowkaContent({onComplete}) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[results,setResults]=useState([]),[hint,setHint]=useState(false)
  if(!mode)return(
    <div style={card}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20}}>
        {[['trening','&#127947;','Tryb trening','Podpowiedzi dostepne'],['egzamin','&#127919;','Tryb egzamin','Bez podpowiedzi']].map(([m,ico,t,d])=>(
          <div key={m} onClick={()=>setMode(m)} style={{border:'0.5px solid '+(mode===m?'#0F1729':'#E2E8F0'),borderRadius:12,padding:16,cursor:'pointer',background:mode===m?'#0F1729':'#fff',textAlign:'center',transition:'all .15s'}}>
            <div style={{fontSize:24,marginBottom:8}} dangerouslySetInnerHTML={{__html:ico}}/>
            <div style={{fontSize:14,fontWeight:500,color:mode===m?'#fff':'#0F1729',marginBottom:4}}>{t}</div>
            <div style={{fontSize:12,color:mode===m?'rgba(255,255,255,.5)':'#8896A5'}}>{d}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>mode&&setKi(0)} disabled={!mode} style={btn({width:'100%',textAlign:'center',background:mode?'#0F1729':'#F7F8FC',color:mode?'#fff':'#8896A5',border:'none',padding:'13px',cursor:mode?'pointer':'not-allowed'})}>Zacznij kartkowke &#8594;</button>
    </div>
  )
  if(ki>=KQ.length){const ok=results.filter(r=>r).length;return(
    <div style={{...card,textAlign:'center'}}>
      <div style={{fontSize:52,marginBottom:8}}>{ok>=11?'&#127942;':ok>=9?'&#11088;':'&#128218;'}</div>
      <div style={{fontSize:22,fontWeight:500,marginBottom:6}}>{ok}/12 poprawnych</div>
      <div style={{display:'flex',justifyContent:'center',gap:8,marginTop:16}}>
        <button onClick={()=>{setMode(null);setKi(0);setSel(null);setDone(false);setResults([])}} style={btn()}>Powtorz</button>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>&#10003; Zadania CKE &#8594;</button>
      </div>
    </div>
  )}
  const q=KQ[ki]
  return(
    <div style={card}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'#185FA5'}}>Kartkowka {ki+1}/{KQ.length}</div>
      </div>
      <div style={{display:'flex',gap:2,marginBottom:14}}>{KQ.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i<ki?'#00B894':i===ki?'#F5541E':'#E2E8F0'}}/>)}</div>
      <div style={{fontSize:15,fontWeight:500,color:'#0F1729',marginBottom:10,lineHeight:1.5}}>{q.q}</div>
      {q.eq&&<div style={{background:'#0F1729',borderRadius:8,padding:'10px 18px',marginBottom:14,display:'inline-block'}}><div style={{fontFamily:'monospace',fontSize:18,color:'#fff'}}>{q.eq}</div></div>}
      {mode==='trening'&&!done&&<div onClick={()=>setHint(h=>!h)} style={{background:'#FAEEDA',border:'0.5px solid #FAC775',borderRadius:8,padding:'9px 14px',marginBottom:12,fontSize:12,color:'#633806',cursor:'pointer'}}>&#128161; {hint?q.hint:'Kliknij po wskazowke'}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
        {q.opts.map((o,i)=>{let bg='#fff',border='#E2E8F0',color='#0F1729';if(done){if(i===q.ans){bg='#EAF3DE';border='#3B6D11';color='#27500A'}else if(i===sel){bg='#FCEBEB';border='#A32D2D';color='#791F1F'}}return<div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setResults(p=>[...p,i===q.ans])}} style={{border:'0.5px solid '+border,borderRadius:8,padding:'11px 14px',cursor:done?'default':'pointer',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s'}}>{o}</div>})}
      </div>
      {done&&<div style={{display:'flex',justifyContent:'flex-end'}}><button onClick={()=>{if(ki<KQ.length-1){setKi(k=>k+1);setSel(null);setDone(false);setHint(false)}else setKi(KQ.length)}} style={btn({background:'#0F1729',color:'#fff',border:'none'})}>{ki<KQ.length-1?'Dalej &#8594;':'Zakoncz &#8594;'}</button></div>}
    </div>
  )
}

const CKE_Z = [
  {rok:'styl CKE',nr:5,pkt:1,tresc:'Podaj wspolczynnik liczbowy wyrazenia: -mn².',wsk:'Gdy nie ma liczby przed zmiennymi, sprawdz czy jest ukryty minus.',
   rozw:['Wyrazenie: -mn²','-1*mn²','Wspolczynnik liczbowy = -1'],odp:'Wspolczynnik liczbowy wynosi -1.',schemat:'1 pkt za podanie -1.'},
  {rok:'styl CKE',nr:9,pkt:2,tresc:'Oblicz wartosc wyrazenia 3a² - 2ab + b² dla a = 2 i b = -3.',wsk:'Podstawiaj w nawiasach: a=(2), b=(-3). Najpierw potegi.',
   rozw:['3*(2)² - 2*(2)*(-3) + (-3)²','3*4 - 2*(2)*(-3) + 9','12 - (-12) + 9','12 + 12 + 9 = 33'],odp:'Wartosc wyrazenia wynosi 33.',schemat:'Za podstawienie i potegi: 1 pkt. Za wynik 33: 1 pkt.'},
  {rok:'styl CKE',nr:12,pkt:2,tresc:'Zapisz jako wyrazenie algebraiczne, potem oblicz dla x=4:\n"Trzy razy x do kwadratu, zmniejszone o dwa razy x, zwiekszone o 5."',wsk:'Krok 1: przetlumacz slowa. Krok 2: podstaw x=4.',
   rozw:['Wyrazenie: 3x² - 2x + 5','Dla x=4: 3*(4)² - 2*4 + 5','3*16 - 8 + 5 = 48 - 8 + 5 = 45'],odp:'3x² - 2x + 5. Wartosc dla x=4: 45.',schemat:'Za poprawne wyrazenie: 1 pkt. Za wynik 45: 1 pkt.'},
]

function CKEContent({onComplete}) {
  const [rev,setRev]=useState([]),[sol,setSol]=useState(Array(CKE_Z.length).fill(false))
  return(
    <div style={card}>
      <p style={{fontSize:13,color:'#4A5568',marginBottom:16,lineHeight:1.65}}>Zadania otwarte wzorowane na egzaminie. Sprobuj samodzielnie!</p>
      {CKE_Z.map((z,i)=>(
        <div key={i} style={{background:'#F7F8FC',borderRadius:12,border:'0.5px solid #E2E8F0',padding:'18px 20px',marginBottom:14}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <span style={{fontSize:12,fontWeight:500,background:'#E6F1FB',color:'#0C447C',padding:'3px 10px',borderRadius:20}}>{z.rok}</span>
            <span style={{fontSize:12,color:'#8896A5'}}>Zadanie {z.nr}</span>
            <span style={{fontSize:12,fontWeight:500,color:'#633806',background:'#FAEEDA',padding:'3px 9px',borderRadius:20,marginLeft:'auto'}}>{z.pkt} {z.pkt===1?'punkt':'punkty'}</span>
          </div>
          <div style={{fontSize:15,fontWeight:500,color:'#0F1729',lineHeight:1.65,marginBottom:14,whiteSpace:'pre-line'}}>{z.tresc}</div>
          <div onClick={()=>setRev(r=>r.includes(i)?r:[...r,i])} style={{background:'#FAEEDA',border:'0.5px solid #FAC775',borderRadius:8,padding:'9px 14px',marginBottom:10,fontSize:12,color:'#633806',cursor:'pointer',lineHeight:1.6}}>
            &#128161; {rev.includes(i)?z.wsk:'Kliknij po wskazowke'}
          </div>
          <button onClick={()=>setSol(p=>p.map((v,j)=>j===i?!v:v))} style={btn({fontSize:12,padding:'8px 16px'})}>{sol[i]?'&#9650; Ukryj':'&#9660; Wzorcowe rozwiazanie'}</button>
          {sol[i]&&(
            <div style={{marginTop:14,background:'#fff',borderRadius:8,border:'0.5px solid #E2E8F0',padding:'16px'}}>
              {z.rozw.map((s,j)=>(
                <div key={j} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:j<z.rozw.length-1?'0.5px solid #E2E8F0':'none',alignItems:'center'}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:'#0F1729',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:500,flexShrink:0}}>{j+1}</div>
                  <div style={{fontFamily:'monospace',fontSize:13,color:'#0F1729',lineHeight:1.5}}>{s}</div>
                </div>
              ))}
              <div style={{background:'#EAF3DE',borderRadius:8,padding:'10px 14px',marginTop:12,fontSize:13,color:'#27500A',fontWeight:500}}>{z.odp}</div>
              <div style={{background:'#EEEDFE',borderRadius:8,padding:'10px 14px',marginTop:8,fontSize:12,color:'#3C3489',lineHeight:1.6}}><strong>Schemat:</strong> {z.schemat}</div>
            </div>
          )}
        </div>
      ))}
      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>&#10003; Ukonczylem zadania CKE &#8594;</button>
      </div>
    </div>
  )
}

function RaportContent({onComplete}) {
  return(
    <div style={card}>
      <div style={{textAlign:'center',padding:'10px 0 20px'}}>
        <div style={{fontSize:52,marginBottom:8}}>&#127942;</div>
        <div style={{fontSize:22,fontWeight:500,marginBottom:4}}>Lekcja ukonczona</div>
        <div style={{fontSize:14,color:'#4A5568'}}>Zmienne i wyrazenia algebraiczne</div>
      </div>
      <div style={{background:'#0F1729',borderRadius:12,padding:'20px',marginBottom:16}}>
        {[['Zmienna','Litera zastepujaca liczbe. Ta sama litera moze miec rozne wartosci.'],['Wspolczynnik = 1','Gdy brak liczby przed zmienna, wspolczynnik = 1. xy = 1*xy.'],['Typy wyraze','1 wyraz = jednomian, 2 = dwumian, 3 = trojmian.'],['Potegi','x³ = x*x*x. Wykladnik 0 daje 1. Wykladnik 1 daje podstawe.'],['Wartosc wyrazenia','Podstawiaj ujemne W NAWIASACH: (-2)² = 4, ale -2² = -4!']].map(([t,d],i)=>(
          <div key={i} style={{display:'flex',gap:10,marginBottom:8,fontSize:13,color:'rgba(255,255,255,.75)',lineHeight:1.6}}>
            <span style={{color:'#F5541E',flexShrink:0}}>&#8594;</span>
            <span><strong style={{color:'rgba(255,255,255,.95)'}}>{t}:</strong> {d}</span>
          </div>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
        <button onClick={onComplete} style={btn({background:'#3B6D11',color:'#fff',border:'none'})}>&#10003; Oznacz jako ukonczona</button>
        <Link href="/kurs/dzial-2" style={{...btn(),textDecoration:'none',display:'inline-block'}}>&#8592; Dzial 2</Link>
      </div>
    </div>
  )
}

const DZIAL = {n:2,title:'Wyrazenia algebraiczne',href:'/kurs/dzial-2',lekcje:[
  {n:1,title:'Zmienne i wyrazenia',href:'/kurs/zmienne-wyrazenia',status:'active'},
  {n:2,title:'Upraszczanie wyraze',href:'/kurs/wyrazenia-algebraiczne',status:'done'},
  {n:3,title:'Wzory skroconego mnozenia',href:'#',status:'locked'},
  {n:4,title:'Wylaczanie przed nawias',href:'#',status:'locked'},
  {n:5,title:'Wielomiany',href:'#',status:'locked'},
  {n:6,title:'Sprawdzian dzialu',href:'#',status:'locked',isTest:true},
]}
const LEKCJA = {n:1,total:5,slug:'zmienne-wyrazenia',title:'Zmienne i wyrazenia algebraiczne',czas:'20 min',poziom:'Poziom: podstawowy',cke:true}
const XP_MAP = {teoria:80,quiz:60,fiszki:70,kartkowka:90,cke:60,raport:40}
const MAX_FAQ = [
  {q:'co to jest zmienna w algebrze',a:'Litera zastepujaca nieznan lub zmienn liczbe. x=3 w jednym zadaniu, x=7 w innym.'},
  {q:'jednomian dwumian trojmian roznica',a:'Liczba wyrazow: jednomian = 1, dwumian = 2, trojmian = 3.'},
  {q:'jak obliczyc wartosc wyrazenia',a:'1. Podstaw liczby (ujemne W NAWIASACH). 2. Potegi. 3. Kolejnosc dzialan.'},
  {q:'ujemna liczba do kwadratu',a:'(-2)² = 4 (z nawiasem). -2² = -4 (bez nawiasu). Zawsze nawiasy przy podstawianiu!'},
  {q:'wspolczynnik liczbowy',a:'Liczba przed zmiennymi. Brak liczby = 1. W -3a: -3. W xy: 1.'},
]

export default function ZmienneWyrazeniaLesson() {
  const segments = [
    {id:'teoria',    icon:'📖',label:'Teoria',     content:({onComplete})=><TeoriaContent onComplete={onComplete}/>},
    {id:'quiz',      icon:'🧠',label:'Quiz',       content:({onComplete})=><QuizContent onComplete={onComplete}/>},
    {id:'fiszki',    icon:'🃏',label:'Fiszki',     content:({onComplete})=><FiszkiContent onComplete={onComplete}/>},
    {id:'kartkowka', icon:'✏️',label:'Kartkowka',  content:({onComplete})=><KartkowkaContent onComplete={onComplete}/>},
    {id:'cke',       icon:'📝',label:'Zadanie CKE',content:({onComplete})=><CKEContent onComplete={onComplete}/>},
    {id:'raport',    icon:'📊',label:'Raport',     content:({onComplete})=><RaportContent onComplete={onComplete}/>},
  ]
  return <LessonShell dzial={DZIAL} lekcja={LEKCJA} segments={segments} xpMap={XP_MAP} maxFaq={MAX_FAQ}/>
}
