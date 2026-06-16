'use client'
import { useState } from 'react'
import LessonShell from '../LessonShell'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA 3: Wzory skróconego mnożenia
// Dział 2 | Podstawa: Abeka 3.7–3.9 + polska podstawa programowa CKE
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  navy:'#0A0F1E', dark:'#111827', card:'#1A2236',
  accent:'#FF4D1C', green:'#00C896', blue:'#3B82F6',
  purple:'#8B5CF6', yellow:'#FBBF24', teal:'#14B8A6',
  white:'#F9FAFB', dim:'#6B7280', border:'rgba(255,255,255,0.08)',
  bg:'#0D1321',
}
const mono = { fontFamily:'"SF Mono","Fira Code",monospace' }
const card = { background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:28, color:C.white }
const btn = (x={}) => ({ padding:'10px 22px', fontSize:13, fontWeight:600, borderRadius:10, cursor:'pointer', fontFamily:'inherit', border:`1px solid ${C.border}`, background:'transparent', color:C.white, transition:'all .15s', ...x })

const Tag = ({c=C.accent, children}) => (
  <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', padding:'3px 8px', borderRadius:6, background:c+'22', color:c, border:`1px solid ${c}44` }}>{children}</span>
)

const Wzor = ({lewa, prawa, color=C.yellow}) => (
  <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px 24px', margin:'16px 0', border:`1px solid ${color}33`, textAlign:'center' }}>
    <div style={{ ...mono, fontSize:22, fontWeight:700, letterSpacing:'0.02em', lineHeight:1.6 }}>
      <span style={{ color }}>{lewa}</span>
      <span style={{ color:C.dim }}> = </span>
      <span style={{ color:C.white }}>{prawa}</span>
    </div>
  </div>
)

const Krok = ({n, text, eq, hi, note}) => (
  <div style={{ display:'flex', gap:12, padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
    <div style={{ width:26, height:26, borderRadius:'50%', flexShrink:0, marginTop:1, background:hi?C.green:C.accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#000' }}>{n}</div>
    <div style={{ flex:1 }}>
      <div style={{ fontSize:13, color:'#CBD5E1', lineHeight:1.6, marginBottom:eq?6:0 }}>{text}</div>
      {eq && <div style={{ ...mono, fontSize:15, color:hi?C.green:C.yellow, background:'#0A0F1E', borderRadius:8, padding:'8px 14px', display:'inline-block', border:`1px solid ${hi?C.green+'33':'rgba(251,191,36,0.2)'}` }}>{eq}</div>}
      {note && <div style={{ fontSize:11, color:C.dim, marginTop:4, fontStyle:'italic' }}>{note}</div>}
    </div>
  </div>
)

const Wynik = ({val, note}) => (
  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:10, marginTop:12, background:'rgba(0,200,150,0.1)', border:`1px solid ${C.green}44` }}>
    <div style={{ width:30, height:30, borderRadius:'50%', background:C.green, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:'#000', fontWeight:900, flexShrink:0 }}>✓</div>
    <div>
      <div style={{ ...mono, fontSize:16, fontWeight:600, color:C.green }}>{val}</div>
      {note && <div style={{ fontSize:12, color:C.dim, marginTop:2 }}>{note}</div>}
    </div>
  </div>
)

const Alert = ({type='warn', children}) => {
  const t = { warn:{bg:'rgba(251,191,36,0.08)',b:C.yellow,i:'⚡'}, err:{bg:'rgba(255,77,28,0.08)',b:C.accent,i:'✗'}, tip:{bg:'rgba(0,200,150,0.08)',b:C.green,i:'✓'}, info:{bg:'rgba(59,130,246,0.08)',b:C.blue,i:'→'} }[type]
  return (
    <div style={{ background:t.bg, borderLeft:`3px solid ${t.b}`, borderRadius:'0 10px 10px 0', padding:'12px 16px', fontSize:13, color:'#CBD5E1', lineHeight:1.75, margin:'16px 0', display:'flex', gap:10 }}>
      <span style={{ color:t.b, flexShrink:0, fontWeight:700 }}>{t.i}</span>
      <span>{children}</span>
    </div>
  )
}

// ── TEORIA — 5 sekcji ─────────────────────────────────────────────────────────
const TTABS = [
  { id:'potegi',    label:'Prawa potęg (fundament)' },
  { id:'wypr',      label:'Wyprowadzenie wzorów' },
  { id:'kwadraty',  label:'(a±b)² — kwadrat sumy/różnicy' },
  { id:'roznica',   label:'(a+b)(a−b) — różnica kwadratów' },
  { id:'zastosow',  label:'Zastosowania i trudniejsze typy' },
]

function TeoriaContent({ onComplete }) {
  const [tab, setTab] = useState('potegi')
  const idx = TTABS.findIndex(t => t.id === tab)

  const content = {

    potegi: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Wzory skróconego mnożenia wynikają z mnożenia wielomianów, które z kolei opiera się na mnożeniu i potęgowaniu jednomianów. Abeka (lekcje 3.7–3.9) pokazuje te zasady dokładnie — bez nich wzorów nie ma sensu zapamiętywać, bo za każdym razem można je wyprowadzić od zera.
        </p>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>
            Reguła 1 — Mnożenie potęg o tej samej podstawie (Abeka 3.7)
          </div>
          <Wzor lewa="xᵃ · xᵇ" prawa="xᵃ⁺ᵇ" />
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Dlaczego? Rozpisz: x⁵ · x² = (x·x·x·x·x) · (x·x) = x⁷. Siódemka to 5+2. Wykładniki dodajemy, bo mnożenie jest przemienne i łączne.
          </p>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:11, color:C.dim, marginBottom:10, textTransform:'uppercase', letterSpacing:'.06em' }}>Przykłady z Abeka 3.7</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[
                ['3² · 3⁴','3⁶ = 729'],['x³ · x² · x⁵','x¹⁰'],
                ['y²(y)(z²)','y³z²'],['ax²y² · xy²','ax³y⁴'],
                ['(2xy²)(3x²y)','6x³y³'],['(3a²b)(2ac²)','6a³bc²'],
              ].map(([p,w]) => (
                <div key={p} style={{ background:C.card, borderRadius:8, padding:'10px 12px', border:`1px solid ${C.border}` }}>
                  <div style={{ ...mono, fontSize:13, color:C.yellow, marginBottom:3 }}>{p}</div>
                  <div style={{ ...mono, fontSize:14, fontWeight:700, color:C.green }}>= {w}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>
            Reguła 2 — Dzielenie potęg o tej samej podstawie (Abeka 3.8)
          </div>
          <Wzor lewa="xᵃ ÷ xᵇ" prawa="xᵃ⁻ᵇ  (gdy a > b)" />
          <Wzor lewa="xᵃ ÷ xᵇ" prawa="1/xᵇ⁻ᵃ  (gdy b > a)" color={C.purple} />
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:11, color:C.dim, marginBottom:10, textTransform:'uppercase', letterSpacing:'.06em' }}>Przykłady z Abeka 3.8 i 3.10</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[
                ['y⁵ ÷ y²','y³'],['a⁵ ÷ a⁹','1/a⁴'],
                ['16x³ ÷ 4x','4x²'],['18a²bc² ÷ 3ab²c','6ac/b'],
                ['20m²n² ÷ 4mn','5mn'],['12a²b ÷ 3ab','4a'],
              ].map(([p,w]) => (
                <div key={p} style={{ background:C.card, borderRadius:8, padding:'10px 12px', border:`1px solid ${C.border}` }}>
                  <div style={{ ...mono, fontSize:13, color:C.yellow, marginBottom:3 }}>{p}</div>
                  <div style={{ ...mono, fontSize:14, fontWeight:700, color:C.green }}>= {w}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>
            Reguła 3 — Mnożenie jednomianów (Abeka 3.9)
          </div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            By pomnożyć dwa jednomiany: mnożymy osobno współczynniki liczbowe, mnożymy osobno współczynniki literowe (sumując wykładniki tej samej zmiennej).
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { p:'(4xy)(2x²y)', tok:'4·2 = 8; x·x² = x³; y·y = y²', w:'8x³y²' },
              { p:'(3a²b)(2ac²)', tok:'3·2 = 6; a²·a = a³; b; c²', w:'6a³bc²' },
              { p:'(2xy²)(3x²y²)(5xy)', tok:'2·3·5=30; x·x²·x=x⁴; y²·y²·y=y⁵', w:'30x⁴y⁵' },
            ].map(ex => (
              <div key={ex.p} style={{ background:'#0A0F1E', borderRadius:10, padding:'12px 16px', border:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                <span style={{ ...mono, fontSize:15, color:C.yellow, minWidth:200 }}>{ex.p}</span>
                <span style={{ fontSize:12, color:C.dim, flex:1 }}>→ {ex.tok}</span>
                <span style={{ ...mono, fontSize:16, fontWeight:700, color:C.green }}>= {ex.w}</span>
              </div>
            ))}
          </div>
        </div>

        <Alert type="info">
          Te trzy reguły wystarczą do wyprowadzenia WSZYSTKICH wzorów skróconego mnożenia od zera. Nie musisz ich zapamiętywać na siłę — wystarczy rozumieć skąd się biorą.
        </Alert>
      </div>
    ),

    wypr: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Wzory skróconego mnożenia to skróty dla wielokrotnie powtarzanych mnożeń. Każdy z nich można wyprowadzić ręcznie przez rozpisanie iloczynu — i właśnie to zrobimy, żebyś rozumiał, a nie tylko pamiętał.
        </p>

        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:12 }}>Wyprowadzenie 1: kwadrat sumy (a+b)²</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            (a+b)² to skrót od (a+b)·(a+b). Każdy wyraz pierwszego nawiasu mnożymy przez każdy wyraz drugiego nawiasu (metoda FOIL):
          </p>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px', border:`1px solid ${C.border}`, marginBottom:12 }}>
            <div style={{ ...mono, fontSize:14, color:'#94A3B8', lineHeight:2.4 }}>
              <span style={{ color:C.yellow }}>(a + b)</span> · <span style={{ color:C.yellow }}>(a + b)</span><br/>
              = <span style={{ color:C.green }}>a·a</span> + <span style={{ color:C.teal }}>a·b</span> + <span style={{ color:C.teal }}>b·a</span> + <span style={{ color:C.purple }}>b·b</span><br/>
              = <span style={{ color:C.green }}>a²</span> + <span style={{ color:C.teal }}>ab</span> + <span style={{ color:C.teal }}>ab</span> + <span style={{ color:C.purple }}>b²</span><br/>
              = <span style={{ color:C.white, fontWeight:700 }}>a² + 2ab + b²</span>
            </div>
          </div>
          <Wzor lewa="(a + b)²" prawa="a² + 2ab + b²" />
        </div>

        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:12 }}>Wyprowadzenie 2: kwadrat różnicy (a−b)²</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Jedyna różnica to znak: zamiast (a+b) mamy (a−b). Rozpisujemy identycznie:
          </p>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px', border:`1px solid ${C.border}`, marginBottom:12 }}>
            <div style={{ ...mono, fontSize:14, color:'#94A3B8', lineHeight:2.4 }}>
              <span style={{ color:C.yellow }}>(a − b)</span> · <span style={{ color:C.yellow }}>(a − b)</span><br/>
              = <span style={{ color:C.green }}>a·a</span> + <span style={{ color:C.teal }}>a·(−b)</span> + <span style={{ color:C.teal }}>(−b)·a</span> + <span style={{ color:C.purple }}>(−b)·(−b)</span><br/>
              = <span style={{ color:C.green }}>a²</span> <span style={{ color:C.teal }}>− ab</span> <span style={{ color:C.teal }}>− ab</span> + <span style={{ color:C.purple }}>b²</span><br/>
              = <span style={{ color:C.white, fontWeight:700 }}>a² − 2ab + b²</span>
            </div>
          </div>
          <Wzor lewa="(a − b)²" prawa="a² − 2ab + b²" color={C.purple} />
        </div>

        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:12 }}>Wyprowadzenie 3: różnica kwadratów (a+b)(a−b)</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Tym razem mnożymy dwa różne nawiasy — sumę przez różnicę. Środkowe wyrazy się znoszą:
          </p>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px', border:`1px solid ${C.border}`, marginBottom:12 }}>
            <div style={{ ...mono, fontSize:14, color:'#94A3B8', lineHeight:2.4 }}>
              <span style={{ color:C.yellow }}>(a + b)</span> · <span style={{ color:C.yellow }}>(a − b)</span><br/>
              = <span style={{ color:C.green }}>a·a</span> + <span style={{ color:C.teal }}>a·(−b)</span> + <span style={{ color:C.teal }}>b·a</span> + <span style={{ color:C.purple }}>b·(−b)</span><br/>
              = <span style={{ color:C.green }}>a²</span> <span style={{ color:C.teal }}>− ab</span> <span style={{ color:C.teal }}>+ ab</span> <span style={{ color:C.purple }}>− b²</span><br/>
              = <span style={{ color:C.white, fontWeight:700 }}>a² − b²</span> &nbsp;<span style={{ color:C.dim, fontSize:12 }}>(środkowe wyrazy = 0)</span>
            </div>
          </div>
          <Wzor lewa="(a + b)(a − b)" prawa="a² − b²" color={C.teal} />
        </div>

        <Alert type="tip">
          <strong>Jak zapamiętać?</strong> Kwadrat sumy: pierwszy², dwa razy iloczyn, drugi². Kwadrat różnicy: identycznie ale środkowy wyraz minus. Różnica kwadratów: środkowe wyrazy zawsze się znoszą — wynik to tylko a² − b².
        </Alert>
      </div>
    ),

    kwadraty: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Kwadrat sumy i kwadrat różnicy to wzory, które na CKE pojawiają się zarówno w kierunku „rozwiń nawias", jak i „rozpoznaj i cofnij". Obydwa kierunki wymagają treningu.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
          <div style={{ background:'rgba(251,191,36,0.08)', borderRadius:12, padding:'16px', border:`1px solid ${C.yellow}33` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.yellow, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>Kwadrat sumy</div>
            <div style={{ ...mono, fontSize:18, fontWeight:700, color:C.white, marginBottom:4 }}>(a + b)² =</div>
            <div style={{ ...mono, fontSize:16, color:C.yellow }}>a² + 2ab + b²</div>
            <div style={{ fontSize:11, color:C.dim, marginTop:8, lineHeight:1.6 }}>pierwszy² + 2·pierwszy·drugi + drugi²</div>
          </div>
          <div style={{ background:'rgba(139,92,246,0.08)', borderRadius:12, padding:'16px', border:`1px solid ${C.purple}33` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.purple, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>Kwadrat różnicy</div>
            <div style={{ ...mono, fontSize:18, fontWeight:700, color:C.white, marginBottom:4 }}>(a − b)² =</div>
            <div style={{ ...mono, fontSize:16, color:C.purple }}>a² − 2ab + b²</div>
            <div style={{ fontSize:11, color:C.dim, marginTop:8, lineHeight:1.6 }}>pierwszy² − 2·pierwszy·drugi + drugi²</div>
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Przykłady — rozwinięcie nawiasów</div>
          {[
            { input:'(x + 3)²', a:'x', b:'3', tok:['a = x, b = 3','a² = x², 2ab = 2·x·3 = 6x, b² = 9'], wynik:'x² + 6x + 9' },
            { input:'(2x − 5)²', a:'2x', b:'5', tok:['a = 2x, b = 5','a² = 4x², 2ab = 2·2x·5 = 20x, b² = 25'], wynik:'4x² − 20x + 25', minus:true },
            { input:'(3a + 2b)²', a:'3a', b:'2b', tok:['a = 3a, b = 2b','a² = 9a², 2ab = 2·3a·2b = 12ab, b² = 4b²'], wynik:'9a² + 12ab + 4b²' },
            { input:'(x/2 − 3)²', a:'x/2', b:'3', tok:['a = x/2, b = 3','a² = x²/4, 2ab = 2·(x/2)·3 = 3x, b² = 9'], wynik:'x²/4 − 3x + 9', minus:true },
          ].map(ex => (
            <div key={ex.input} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:10 }}>
              <div style={{ ...mono, fontSize:18, color:C.yellow, marginBottom:12, fontWeight:700 }}>{ex.input}</div>
              {ex.tok.map((t,i) => (
                <div key={i} style={{ fontSize:13, color:'#94A3B8', marginBottom:4, paddingLeft:8, borderLeft:`2px solid ${C.border}` }}>{t}</div>
              ))}
              <Wynik val={ex.wynik} />
            </div>
          ))}
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Zastosowanie numeryczne — szybkie obliczenia</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Wzory pozwalają obliczać kwadraty liczb bez mnożenia pisemnego. To typ zadania, który pojawia się na CKE i sprawdza czy rozumiesz wzór, a nie tylko go stosujesz mechanicznie.
          </p>
          {[
            { zad:'Oblicz 47² korzystając ze wzoru na kwadrat różnicy.', tok:['47 = 50 − 3, więc a = 50, b = 3','47² = (50 − 3)² = 50² − 2·50·3 + 3²','= 2500 − 300 + 9'], wynik:'47² = 2209' },
            { zad:'Oblicz 103² korzystając ze wzoru na kwadrat sumy.', tok:['103 = 100 + 3, więc a = 100, b = 3','103² = (100 + 3)² = 100² + 2·100·3 + 3²','= 10000 + 600 + 9'], wynik:'103² = 10609' },
          ].map(ex => (
            <div key={ex.zad} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:10 }}>
              <div style={{ fontSize:14, fontWeight:500, color:C.white, marginBottom:12 }}>{ex.zad}</div>
              {ex.tok.map((t,i) => (
                <div key={i} style={{ ...mono, fontSize:13, color:'#94A3B8', marginBottom:4 }}>{t}</div>
              ))}
              <Wynik val={ex.wynik} />
            </div>
          ))}
        </div>

        <Alert type="warn">
          <strong>Najczęstszy błąd na CKE:</strong> (a + b)² ≠ a² + b². Brakujące 2ab to cena za pominięcie środkowego wyrazu. (x+3)² = x²+6x+9, NIE x²+9. Sprawdzaj zawsze podstawiając konkretną liczbę.
        </Alert>

        <div>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Kierunek odwrotny — rozpoznaj i sfaktoryzuj</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Jeśli wielomian ma postać a² ± 2ab + b², jest kwadratem sumy lub różnicy. Rozpoznaj wzorzec i zapisz w postaci nawiasów.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              ['x² + 10x + 25','x² + 2·x·5 + 5²','(x + 5)²'],
              ['4x² − 12x + 9','(2x)² − 2·2x·3 + 3²','(2x − 3)²'],
              ['a² + 6ab + 9b²','a² + 2·a·3b + (3b)²','(a + 3b)²'],
              ['9x² − 24xy + 16y²','(3x)² − 2·3x·4y + (4y)²','(3x − 4y)²'],
            ].map(([wej,rozw,wyj]) => (
              <div key={wej} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#0A0F1E', borderRadius:10, border:`1px solid ${C.border}`, flexWrap:'wrap' }}>
                <span style={{ ...mono, fontSize:14, color:C.yellow, minWidth:160 }}>{wej}</span>
                <span style={{ fontSize:12, color:C.dim, flex:1 }}>= {rozw}</span>
                <span style={{ ...mono, fontSize:16, fontWeight:700, color:C.green }}>= {wyj}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    roznica: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Wzór na różnicę kwadratów jest prostszy niż kwadraty sumy/różnicy — wynik ma tylko dwa wyrazy. Jego siła tkwi w zastosowaniach: zarówno do rozwijania nawiasów, jak i faktoryzacji.
        </p>

        <Wzor lewa="(a + b)(a − b)" prawa="a² − b²" color={C.teal} />

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Przykłady — rozwinięcie</div>
          {[
            { input:'(x + 5)(x − 5)', tok:['a = x, b = 5','a² = x², b² = 25'], wynik:'x² − 25' },
            { input:'(3x + 2)(3x − 2)', tok:['a = 3x, b = 2','a² = 9x², b² = 4'], wynik:'9x² − 4' },
            { input:'(2a + 3b)(2a − 3b)', tok:['a = 2a, b = 3b','a² = 4a², b² = 9b²'], wynik:'4a² − 9b²' },
            { input:'(x² + y)(x² − y)', tok:['a = x², b = y','a² = x⁴, b² = y²'], wynik:'x⁴ − y²' },
          ].map(ex => (
            <div key={ex.input} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:10 }}>
              <div style={{ ...mono, fontSize:18, color:C.yellow, marginBottom:10, fontWeight:700 }}>{ex.input}</div>
              {ex.tok.map((t,i) => <div key={i} style={{ fontSize:13, color:'#94A3B8', marginBottom:3 }}>{t}</div>)}
              <Wynik val={ex.wynik} />
            </div>
          ))}
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Zastosowanie numeryczne — sprytne obliczenia</div>
          {[
            { zad:'Oblicz 53 · 47 bez kalkulatora.', tok:['53 · 47 = (50 + 3)(50 − 3)','= 50² − 3² = 2500 − 9'], wynik:'= 2491' },
            { zad:'Oblicz 99 · 101.', tok:['99 · 101 = (100 − 1)(100 + 1)','= 100² − 1² = 10000 − 1'], wynik:'= 9999' },
          ].map(ex => (
            <div key={ex.zad} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:10 }}>
              <div style={{ fontSize:14, fontWeight:500, color:C.white, marginBottom:10 }}>{ex.zad}</div>
              {ex.tok.map((t,i) => <div key={i} style={{ ...mono, fontSize:13, color:'#94A3B8', marginBottom:3 }}>{t}</div>)}
              <Wynik val={ex.wynik} />
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Kierunek odwrotny — faktoryzacja różnicy kwadratów</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Jeśli wielomian ma postać a² − b² (dwie potęgi kwadratowe z minusem między nimi), zawsze możesz go rozłożyć. Uwaga: a² + b² się NIE rozkłada na rzeczywistych liczbach.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
            {[
              ['x² − 16','x² − 4²','(x + 4)(x − 4)'],
              ['9x² − 25','(3x)² − 5²','(3x + 5)(3x − 5)'],
              ['4a² − 49b²','(2a)² − (7b)²','(2a + 7b)(2a − 7b)'],
              ['x⁴ − 1','(x²)² − 1²','(x² + 1)(x² − 1) = (x²+1)(x+1)(x−1)'],
            ].map(([wej,rozw,wyj]) => (
              <div key={wej} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#0A0F1E', borderRadius:10, border:`1px solid ${C.border}`, flexWrap:'wrap' }}>
                <span style={{ ...mono, fontSize:14, color:C.yellow, minWidth:130 }}>{wej}</span>
                <span style={{ fontSize:12, color:C.dim, flex:1 }}>= {rozw}</span>
                <span style={{ ...mono, fontSize:14, fontWeight:700, color:C.green }}>= {wyj}</span>
              </div>
            ))}
          </div>
          <Alert type="warn">
            x⁴ − 1 rozkłada się dwukrotnie: najpierw jako (x²+1)(x²−1), a potem x²−1 jako (x+1)(x−1). Zawsze sprawdzaj, czy każdy z czynników da się jeszcze rozłożyć.
          </Alert>
        </div>
      </div>
    ),

    zastosow: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Na egzaminie CKE wzory skróconego mnożenia rzadko pojawiają się w czystej postaci. Zazwyczaj wymagają kombinacji kilku wzorów, upraszczania, lub zastosowania geometrycznego. Poniżej typy zadań, które odróżniają piątkę od czwórki.
        </p>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:14 }}>Typ 1 — Kombinacja wzorów: dowiedź tożsamości</div>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:500, color:C.white, marginBottom:14 }}>
              Udowodnij, że: (a + b)² − (a − b)² = 4ab
            </div>
            <Krok n={1} text="Rozwijamy lewą stronę — każdy kwadrat osobno:" eq="(a² + 2ab + b²) − (a² − 2ab + b²)" />
            <Krok n={2} text="Otwieramy nawias z minusem (ZMIANA ZNAKÓW!):" eq="a² + 2ab + b² − a² + 2ab − b²" />
            <Krok n={3} text="Redukujemy wyrazy podobne (a² i b² znikają):" eq="4ab ✓" hi />
          </div>

          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:14, fontWeight:500, color:C.white, marginBottom:14 }}>
              Udowodnij, że: (a + b)² + (a − b)² = 2(a² + b²)
            </div>
            <Krok n={1} text="Rozwijamy oba kwadraty:" eq="(a² + 2ab + b²) + (a² − 2ab + b²)" />
            <Krok n={2} text="Redukujemy — wyrazy z ab znikają:" eq="2a² + 2b²" />
            <Krok n={3} text="Wyłączamy 2 przed nawias:" eq="2(a² + b²) ✓" hi />
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:14 }}>Typ 2 — Zastosowanie geometryczne (CKE 2023)</div>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:14, fontWeight:500, color:C.white, marginBottom:14 }}>
              Bok kwadratu wynosi (x + 4) cm. Pole kwadratu wyraź wzorem. Następnie oblicz pole dla x = 3.
            </div>
            <Krok n={1} text="Pole kwadratu = bok²:" eq="P = (x + 4)²" />
            <Krok n={2} text="Stosujemy wzór na kwadrat sumy:" eq="P = x² + 8x + 16" />
            <Krok n={3} text="Podstawiamy x = 3:" eq="P = 9 + 24 + 16 = 49 cm²" hi />
            <Wynik val="P = x² + 8x + 16; dla x=3: P = 49 cm²" note="Sprawdzenie: (3+4)² = 7² = 49 ✓" />
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:14 }}>Typ 3 — Skomplikowane nawiasy</div>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:14, fontWeight:500, color:C.white, marginBottom:14 }}>
              Rozwiń i uprość: (x + y + 1)(x + y − 1)
            </div>
            <Krok n={1} text="Podstawiamy A = x + y, aby zobaczyć wzorzec:" eq="(A + 1)(A − 1)" />
            <Krok n={2} text="Rozpoznajemy różnicę kwadratów:" eq="A² − 1²" />
            <Krok n={3} text="Wracamy do oryginału: A = x + y" eq="(x + y)² − 1" />
            <Krok n={4} text="Rozwijamy (x + y)²:" eq="x² + 2xy + y² − 1" hi />
            <Wynik val="x² + 2xy + y² − 1" />
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:14 }}>Typ 4 — Wyrażenia z ułamkami i pierwiastkami</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { zad:'(√x + √y)(√x − √y)', tok:'(√x)² − (√y)²', wynik:'= x − y' },
              { zad:'(a + 1/a)²', tok:'a² + 2·a·(1/a) + 1/a² = a² + 2 + 1/a²', wynik:'= a² + 2 + 1/a²' },
              { zad:'(√3 + √2)²', tok:'3 + 2√6 + 2', wynik:'= 5 + 2√6' },
              { zad:'(√5 + √3)(√5 − √3)', tok:'(√5)² − (√3)² = 5 − 3', wynik:'= 2' },
            ].map(ex => (
              <div key={ex.zad} style={{ background:'#0A0F1E', borderRadius:10, padding:'12px 16px', border:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                <span style={{ ...mono, fontSize:14, color:C.yellow, minWidth:200 }}>{ex.zad}</span>
                <span style={{ fontSize:12, color:C.dim, flex:1 }}>= {ex.tok}</span>
                <span style={{ ...mono, fontSize:14, fontWeight:700, color:C.green }}>{ex.wynik}</span>
              </div>
            ))}
          </div>
        </div>

        <Alert type="tip">
          <strong>Strategia CKE:</strong> Gdy widzisz wyrażenie z czterema członami lub zagnieżdżonymi nawiasami — spróbuj podstawić A = (jakiś dwumian). To często odkrywa ukryty wzór na różnicę kwadratów lub kwadrat sumy.
        </Alert>
      </div>
    ),
  }

  return (
    <div style={card}>
      <div style={{ marginBottom:20 }}>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {TTABS.map((t,i) => {
            const done = i < idx, active = t.id === tab
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
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
      <div style={{ minHeight:400 }}>{content[tab]}</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:24, paddingTop:20, borderTop:`1px solid ${C.border}`, gap:8 }}>
        {idx>0
          ? <button onClick={() => setTab(TTABS[idx-1].id)} style={btn()}>← {TTABS[idx-1].label}</button>
          : <div/>}
        {idx<TTABS.length-1
          ? <button onClick={() => setTab(TTABS[idx+1].id)} style={btn({background:C.accent,border:'none',color:'#000',fontWeight:800})}>{TTABS[idx+1].label} →</button>
          : <button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Ukończyłem teorię →</button>}
      </div>
    </div>
  )
}

// ── QUIZ (10 pytań) ───────────────────────────────────────────────────────────
const QUIZ = [
  { q:'Rozwiń:', eq:'(x + 7)²',
    opts:['x² + 7','x² + 49','x² + 14x + 49','x² + 7x + 49'], ans:2,
    why:'Kwadrat sumy: a²+2ab+b². Tutaj a=x, b=7. x² + 2·x·7 + 7² = x²+14x+49.' },
  { q:'Rozwiń:', eq:'(3x − 2)²',
    opts:['9x² − 4','9x²+12x+4','9x²−12x+4','3x²−12x+4'], ans:2,
    why:'Kwadrat różnicy: a²−2ab+b². a=3x, b=2. (3x)²−2·3x·2+2² = 9x²−12x+4.' },
  { q:'Rozwiń:', eq:'(4a + 3b)(4a − 3b)',
    opts:['16a²+9b²','16a²−9b²','8a²−6b²','16a²−24ab+9b²'], ans:1,
    why:'Różnica kwadratów: (a+b)(a−b) = a²−b². Wynik: (4a)²−(3b)² = 16a²−9b².' },
  { q:'Sfaktoryzuj:',eq:'x² − 25',
    opts:['(x−5)²','(x+5)²','(x+5)(x−5)','nie da się'], ans:2,
    why:'x²−25 = x²−5². To różnica kwadratów: (x+5)(x−5).' },
  { q:'Oblicz korzystając ze wzoru:', eq:'98²',
    opts:['9604','9604 ≠ 9801','9801','9001'], ans:0,
    why:'98=(100−2)². (100−2)²=10000−400+4=9604.' },
  { q:'Które wyrażenie NIE jest kwadratem sumy ani różnicy?',
    opts:['x²+4x+4','x²−6x+9','x²+5x+6','4x²+12x+9'], ans:2,
    why:'x²+5x+6 = (x+2)(x+3) — to iloczyn dwumianów, ale nie kwadrat. Sprawdź: 2ab = 2·x·? — środkowy wyraz powinien być 2·x·(√6), co nie jest liczbą wymierną.' },
  { q:'Uprość:', eq:'(a+b)² − (a−b)²',
    opts:['2a²+2b²','4ab','0','2(a²+b²)'], ans:1,
    why:'(a²+2ab+b²)−(a²−2ab+b²) = 4ab. Pamiętaj o zmianie znaków przy otwieraniu drugiego nawiasu.' },
  { q:'Sfaktoryzuj:', eq:'9x² − 16y²',
    opts:['(3x−4y)²','(9x+16y)(9x−16y)','(3x+4y)(3x−4y)','(3x−4y)(3x+4y)=to samo co C'], ans:2,
    why:'9x²=(3x)², 16y²=(4y)². Różnica kwadratów: (3x+4y)(3x−4y). C i D to to samo zapisu — poprawna jest C.' },
  { q:'Rozwiń:', eq:'(x + y + 2)(x + y − 2)',
    opts:['x²+y²−4','x²+2xy+y²−4','x²+y²+4xy−4','(x+y)²−4'], ans:1,
    why:'Podstaw A=x+y: (A+2)(A−2)=A²−4=(x+y)²−4=x²+2xy+y²−4.' },
  { q:'Jeśli bok kwadratu wynosi (2x−3), to jego pole to:',
    opts:['4x²−9','4x²−6x+9','4x²−12x+9','2x²−12x+9'], ans:2,
    why:'Pole = (2x−3)² = (2x)²−2·2x·3+3² = 4x²−12x+9.' },
]

function QuizContent({ onComplete }) {
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[res,setRes]=useState([])
  if(qi>=QUIZ.length){
    const ok=res.filter(r=>r).length
    return (
      <div style={card}>
        <div style={{ textAlign:'center', padding:'24px 0' }}>
          <div style={{ fontSize:52, marginBottom:12 }}>{ok>=9?'🎯':ok>=7?'💪':'📖'}</div>
          <div style={{ fontSize:28, fontWeight:900, color:ok>=9?C.green:ok>=7?C.yellow:C.accent, marginBottom:8 }}>{ok}/{QUIZ.length}</div>
          <div style={{ fontSize:14, color:C.dim }}>{ok>=9?'Doskonale.':ok>=7?'Dobry wynik.':'Wróć do teorii.'}</div>
        </div>
        <div style={{ display:'flex', justifyContent:'flex-end', gap:8, marginTop:16 }}>
          <button onClick={()=>{setQi(0);setSel(null);setDone(false);setRes([])}} style={btn()}>Powtórz</button>
          <button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Fiszki →</button>
        </div>
      </div>
    )
  }
  const q=QUIZ[qi]
  return (
    <div style={card}>
      <div style={{ display:'flex', gap:3, marginBottom:20 }}>
        {QUIZ.map((_,i) => <div key={i} style={{ flex:1,height:3,borderRadius:2,background:i<qi?C.green:i===qi?C.accent:C.border,transition:'background .3s' }}/>)}
      </div>
      <div style={{ fontSize:12,color:C.dim,marginBottom:8 }}>Pytanie {qi+1} z {QUIZ.length}</div>
      <div style={{ fontSize:15,fontWeight:500,color:C.white,marginBottom:16,lineHeight:1.55 }}>{q.q}</div>
      {q.eq && <div style={{ ...mono, fontSize:22, color:C.yellow, background:'#0A0F1E', borderRadius:10, padding:'14px 20px', display:'inline-block', marginBottom:20, border:`1px solid rgba(251,191,36,0.2)` }}>{q.eq}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
        {q.opts.map((o,i) => {
          let bg='transparent',border=C.border,color=C.white
          if(done){
            if(i===q.ans){bg=C.green+'22';border=C.green;color=C.green}
            else if(i===sel){bg=C.accent+'22';border=C.accent;color=C.accent}
          }
          return (
            <div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setRes(p=>[...p,i===q.ans])}}
              style={{ border:`1px solid ${border}`,borderRadius:10,padding:'12px 16px',cursor:done?'default':'pointer',
                fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s' }}>
              {o}
            </div>
          )
        })}
      </div>
      {done && (
        <>
          <div style={{ padding:'14px 16px',borderRadius:10,background:sel===q.ans?C.green+'11':C.accent+'11',border:`1px solid ${sel===q.ans?C.green:C.accent}44`,marginBottom:12 }}>
            <strong style={{ color:sel===q.ans?C.green:C.accent }}>{sel===q.ans?'Poprawnie ✓':'Błąd ✗'}</strong>
            <div style={{ background:'rgba(139,92,246,0.1)',borderRadius:8,padding:'8px 12px',marginTop:8,fontSize:12,color:'#C4B5FD',lineHeight:1.7,border:'1px solid rgba(139,92,246,0.2)' }}>{q.why}</div>
          </div>
          <div style={{ display:'flex',justifyContent:'flex-end' }}>
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
  { q:'Podaj wzór na kwadrat sumy (a+b)²', a:'a² + 2ab + b²', f:'(a+b)² = a² + 2ab + b²', note:'Składniki: pierwszy², dwa razy iloczyn, drugi²' },
  { q:'Podaj wzór na kwadrat różnicy (a−b)²', a:'a² − 2ab + b²', f:'(a−b)² = a² − 2ab + b²', note:'Jak kwadrat sumy, ale środkowy wyraz MINUS' },
  { q:'Podaj wzór na różnicę kwadratów (a+b)(a−b)', a:'a² − b²', f:'(a+b)(a−b) = a² − b²', note:'Środkowe wyrazy (ab − ab) znoszą się wzajemnie' },
  { q:'Jaki błąd robi uczeń pisząc (a+b)² = a²+b²?', a:'Pominął wyraz środkowy 2ab. Kwadrat sumy ma TRZY wyrazy, nie dwa.', f:'(x+3)² = x²+6x+9, NIE x²+9' },
  { q:'Rozwiń: (2x+5)²', a:'4x² + 20x + 25', f:'a=2x, b=5\n(2x)²+2·2x·5+5²\n= 4x²+20x+25' },
  { q:'Rozwiń: (3a−4b)²', a:'9a² − 24ab + 16b²', f:'a=3a, b=4b\n(3a)²−2·3a·4b+(4b)²\n= 9a²−24ab+16b²' },
  { q:'Sfaktoryzuj: x²−36', a:'(x+6)(x−6)', f:'x²−6² = (x+6)(x−6)', note:'Różnica kwadratów: a²−b² = (a+b)(a−b)' },
  { q:'Oblicz 47² korzystając ze wzoru', a:'2209', f:'47=(50−3)\n(50−3)²=2500−300+9=2209' },
  { q:'Oblicz 53·47 korzystając ze wzoru', a:'2491', f:'53·47=(50+3)(50−3)\n=50²−3²=2500−9=2491' },
  { q:'Uprość: (a+b)² + (a−b)²', a:'2a² + 2b² = 2(a²+b²)', f:'(a²+2ab+b²)+(a²−2ab+b²)\n=2a²+2b²=2(a²+b²)' },
  { q:'Uprość: (a+b)² − (a−b)²', a:'4ab', f:'(a²+2ab+b²)−(a²−2ab+b²)\n= 4ab' },
  { q:'Rozwiń: (x+y+1)(x+y−1)', a:'x² + 2xy + y² − 1', f:'Podstaw A=x+y\n(A+1)(A−1)=A²−1\n=(x+y)²−1=x²+2xy+y²−1' },
]

function FiszkiContent({ onComplete }) {
  const [deck,setDeck]=useState(FISZKI.map((f,i)=>({...f,id:i}))),[flip,setFlip]=useState(false),[mastered,setMastered]=useState(0)
  if(!deck.length) return (
    <div style={{...card,textAlign:'center'}}>
      <div style={{ fontSize:52, marginBottom:12 }}>🎴</div>
      <div style={{ fontSize:22, fontWeight:900, color:C.green, marginBottom:8 }}>Wszystkie {FISZKI.length} opanowane</div>
      <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20 }}>
        <button onClick={()=>{setDeck(FISZKI.map((f,i)=>({...f,id:i})));setFlip(false);setMastered(0)}} style={btn()}>Powtórz</button>
        <button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Kartkówka →</button>
      </div>
    </div>
  )
  const c=deck[0], pct=Math.round(mastered/FISZKI.length*100)
  return (
    <div style={card}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em' }}>{mastered}/{FISZKI.length} opanowanych</div>
        <div style={{ fontSize:11, color:C.dim }}>{deck.length} pozostało</div>
      </div>
      <div style={{ height:3, background:C.border, borderRadius:2, marginBottom:20, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:C.green, borderRadius:2, transition:'width .4s' }}/>
      </div>
      <div onClick={()=>setFlip(f=>!f)} style={{
        cursor:'pointer', minHeight:200, borderRadius:12, display:'flex',
        alignItems:'center', justifyContent:'center', padding:28, textAlign:'center',
        background:flip?C.card:'#0A0F1E',
        border:`1px solid ${flip?C.accent+'44':C.border}`,
        transition:'background .25s', marginBottom:14,
      }}>
        {!flip
          ? <div>
              <div style={{ fontSize:10, color:C.dim, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:14 }}>Fiszka {mastered+1}/{FISZKI.length}</div>
              <div style={{ fontSize:17, fontWeight:500, color:C.white, lineHeight:1.65 }}>{c.q}</div>
              <div style={{ fontSize:11, color:C.dim, marginTop:16 }}>kliknij żeby zobaczyć odpowiedź</div>
            </div>
          : <div>
              <div style={{ fontSize:14, color:'#CBD5E1', lineHeight:1.7, marginBottom:10 }}>{c.a}</div>
              {c.f && <div style={{ ...mono, fontSize:13, color:C.yellow, fontWeight:600, margin:'10px 0', whiteSpace:'pre-line' }}>{c.f}</div>}
              {c.note && <div style={{ fontSize:12, color:C.dim, marginTop:8, fontStyle:'italic' }}>{c.note}</div>}
            </div>}
      </div>
      {flip && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlip(false)}}
            style={btn({background:C.accent+'22',borderColor:C.accent+'44',color:C.accent,textAlign:'center'})}>Trudna — powtórz</button>
          <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlip(false)}}
            style={btn({background:C.green+'22',borderColor:C.green+'44',color:C.green,textAlign:'center'})}>Opanowana ✓</button>
        </div>
      )}
    </div>
  )
}

// ── KARTKÓWKA (12 pytań, poziom CKE) ─────────────────────────────────────────
const KQ = [
  { q:'Rozwiń:', eq:'(x + 4)²', opts:['x²+8x+16','x²+16','x²+4x+16','x²+8x+8'], ans:0, hint:'a=x, b=4. Wzór: a²+2ab+b².' },
  { q:'Rozwiń:', eq:'(5x − 3)²', opts:['25x²−9','25x²+30x+9','25x²−30x+9','5x²−30x+9'], ans:2, hint:'a=5x, b=3. Wzór: a²−2ab+b².' },
  { q:'Rozwiń:', eq:'(2a + 7b)(2a − 7b)', opts:['4a²−49b²','4a²+49b²','4a²−28ab+49b²','2a²−7b²'], ans:0, hint:'Różnica kwadratów: (2a)²−(7b)².' },
  { q:'Sfaktoryzuj:', eq:'4x² − 25', opts:['(2x−5)²','(4x+5)(4x−5)','(2x+5)(2x−5)','nie da się'], ans:2, hint:'4x²=(2x)², 25=5². Różnica kwadratów.' },
  { q:'Oblicz bez kalkulatora:', eq:'99² ', opts:['9801','9999','9601','9799'], ans:0, hint:'99=(100−1). (100−1)²=10000−200+1=9801.' },
  { q:'Sfaktoryzuj:', eq:'x⁴ − 16', opts:['(x²+4)(x+2)(x−2)','(x²−4)²','(x²+4)(x²−4)=rozł. dalej','nie da się'], ans:0, hint:'x⁴−16=(x²)²−4². Najpierw (x²+4)(x²−4), potem x²−4=(x+2)(x−2).' },
  { q:'Uprość:', eq:'(2x+3)² − (2x−3)²', opts:['8x²+18','24x','48','0'], ans:1, hint:'Wzór: (a+b)²−(a−b)²=4ab. Tu a=2x, b=3: 4·2x·3=24x.' },
  { q:'Bok kwadratu wynosi (x+5) cm. Jego pole to:', eq:'', opts:['x²+25','x²+5x+25','x²+10x+25','x²+10x+5'], ans:2, hint:'Pole = (x+5)² = x²+10x+25.' },
  { q:'Rozwiń:', eq:'(√a + √b)(√a − √b)', opts:['a−b','a+b','a²−b²','(√a)²−(√b)²=a−b'], ans:0, hint:'Różnica kwadratów: (√a)²−(√b)² = a−b.' },
  { q:'Rozwiń:', eq:'(x + y − 3)²', opts:['x²+y²+9','x²+y²−6x−6y+2xy+9','x²+y²+9−6x−6y','x²+y²+2xy−6x−6y+9'], ans:3, hint:'(A−3)² gdzie A=x+y. A²−6A+9=(x+y)²−6(x+y)+9=x²+2xy+y²−6x−6y+9.' },
  { q:'Jeśli a+b=7 i ab=10, to a²+b² równa się:', eq:'', opts:['49','29','30','100'], ans:1, hint:'a²+b²=(a+b)²−2ab=49−20=29.' },
  { q:'Udowodnij że prawdziwa jest równość. Który krok jest błędny?', eq:'(a−b)² = a²+2ab+b²', opts:['Nie ma błędu — to prawda','Błąd: brak minusa przy 2ab','Błąd: a² powinno być 2a²','Całe wyrażenie jest błędne'], ans:1, hint:'Kwadrat RÓŻNICY: a²−2ab+b², nie a²+2ab+b².' },
]

function KartkowkaContent({ onComplete }) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[res,setRes]=useState([]),[hint,setHint]=useState(false)
  if(!mode) return (
    <div style={card}>
      <div style={{ fontSize:18, fontWeight:900, color:C.white, marginBottom:6 }}>Kartkówka</div>
      <div style={{ fontSize:13, color:C.dim, marginBottom:20 }}>12 pytań · poziom egzaminacyjny CKE</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
        {[['trening','🏋️','Tryb trening','Podpowiedzi na żądanie'],['egzamin','🎯','Tryb egzamin','Żadnych podpowiedzi']].map(([m,ico,t,d]) => (
          <div key={m} onClick={()=>setMode(m)} style={{ border:`1px solid ${mode===m?C.accent:C.border}`,borderRadius:12,padding:18,cursor:'pointer',background:mode===m?C.accent+'15':'transparent',textAlign:'center',transition:'all .15s' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{ico}</div>
            <div style={{ fontSize:14, fontWeight:700, color:mode===m?C.accent:C.white, marginBottom:4 }}>{t}</div>
            <div style={{ fontSize:11, color:C.dim }}>{d}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>mode&&setKi(0)} disabled={!mode}
        style={btn({width:'100%',textAlign:'center',background:mode?C.accent:'transparent',color:mode?'#000':C.dim,border:mode?'none':`1px solid ${C.border}`,fontWeight:mode?800:400,padding:'14px',cursor:mode?'pointer':'not-allowed'})}>
        Zacznij →
      </button>
    </div>
  )
  if(ki>=KQ.length){
    const ok=res.filter(r=>r).length
    return (
      <div style={{...card,textAlign:'center'}}>
        <div style={{ fontSize:56, marginBottom:12 }}>{ok>=11?'🏆':ok>=9?'⭐':'📚'}</div>
        <div style={{ fontSize:28, fontWeight:900, marginBottom:6, color:ok>=11?C.green:ok>=9?C.yellow:C.accent }}>{ok}/12</div>
        <div style={{ fontSize:14, color:C.dim, marginBottom:24 }}>{ok>=11?'Perfekcja':ok>=9?'Dobry wynik':ok>=7?'Zadowalający':'Wróć do teorii'}</div>
        <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
          <button onClick={()=>{setMode(null);setKi(0);setSel(null);setDone(false);setRes([])}} style={btn()}>Powtórz</button>
          <button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Zadania CKE →</button>
        </div>
      </div>
    )
  }
  const q=KQ[ki]
  return (
    <div style={card}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ fontSize:11, color:C.dim, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em' }}>{ki+1}/{KQ.length}</div>
        <Tag c={mode==='trening'?C.yellow:C.accent}>{mode==='trening'?'🏋️ Trening':'🎯 Egzamin'}</Tag>
      </div>
      <div style={{ display:'flex', gap:2, marginBottom:20 }}>
        {KQ.map((_,i) => <div key={i} style={{ flex:1,height:3,borderRadius:2,background:i<ki?C.green:i===ki?C.accent:C.border,transition:'background .2s' }}/>)}
      </div>
      <div style={{ fontSize:15, fontWeight:500, color:C.white, marginBottom:14, lineHeight:1.55 }}>{q.q}</div>
      {q.eq && <div style={{ ...mono, fontSize:22, color:C.yellow, background:'#0A0F1E', borderRadius:10, padding:'14px 20px', display:'inline-block', marginBottom:20, border:`1px solid rgba(251,191,36,0.2)` }}>{q.eq}</div>}
      {mode==='trening' && !done && (
        <div onClick={()=>setHint(h=>!h)} style={{ background:C.yellow+'11',border:`1px solid ${C.yellow}33`,borderRadius:8,padding:'9px 14px',marginBottom:12,fontSize:12,color:C.yellow,cursor:'pointer' }}>
          💡 {hint?q.hint:'Kliknij po wskazówkę'}
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
        {q.opts.map((o,i) => {
          let bg='transparent',border=C.border,color=C.white
          if(done){if(i===q.ans){bg=C.green+'22';border=C.green;color=C.green}else if(i===sel){bg=C.accent+'22';border=C.accent;color=C.accent}}
          return <div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setRes(p=>[...p,i===q.ans])}}
            style={{ border:`1px solid ${border}`,borderRadius:10,padding:'12px 14px',cursor:done?'default':'pointer',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s' }}>{o}</div>
        })}
      </div>
      {done && <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <button onClick={()=>{if(ki<KQ.length-1){setKi(i=>i+1);setSel(null);setDone(false);setHint(false)}else setKi(KQ.length)}}
          style={btn({background:C.accent,border:'none',color:'#fff',fontWeight:700})}>{ki<KQ.length-1?'Dalej →':'Wynik →'}</button>
      </div>}
    </div>
  )
}

// ── ZADANIA CKE ───────────────────────────────────────────────────────────────
const CKE_Z = [
  { rok:'CKE 2023', nr:14, pkt:2,
    tresc:'Wykaż, że wyrażenie (2n+1)² − (2n−1)² jest podzielne przez 8 dla każdej liczby naturalnej n.',
    wsk:'Rozwiń oba kwadraty osobno, następnie odejmij. Wynik powinna dać się przedstawić jako 8·(coś).',
    rozw:[
      '(2n+1)² = 4n² + 4n + 1',
      '(2n−1)² = 4n² − 4n + 1',
      'Różnica: (4n²+4n+1) − (4n²−4n+1)',
      '= 4n² + 4n + 1 − 4n² + 4n − 1',
      '= 8n',
      '8n jest podzielne przez 8 dla każdej liczby naturalnej n. ✓',
    ],
    odp:'(2n+1)²−(2n−1)² = 8n, co jest podzielne przez 8.',
    schemat:'Za rozwinięcie obu kwadratów: 1 pkt. Za wykazanie równości 8n i wniosek: 1 pkt.' },
  { rok:'CKE 2022', nr:11, pkt:2,
    tresc:'Pole kwadratu A wynosi (x+3)² cm². Pole kwadratu B wynosi x² cm². Wyrób w najprostszej postaci algebraicznej o ile cm² pole kwadratu A jest większe od pola kwadratu B.',
    wsk:'Oblicz (x+3)² − x², uprość. Wynik to wyrażenie liniowe.',
    rozw:[
      'Pole A = (x+3)² = x² + 6x + 9',
      'Pole B = x²',
      'Różnica = (x²+6x+9) − x²',
      '= 6x + 9',
    ],
    odp:'Pole kwadratu A jest większe o (6x + 9) cm².',
    schemat:'Za rozwinięcie (x+3)²: 1 pkt. Za uproszczoną różnicę 6x+9: 1 pkt.' },
  { rok:'CKE 2024', nr:16, pkt:3,
    tresc:'Wiadomo, że a + b = 5 i ab = 4. Oblicz wartość wyrażeń:\na) a² + b²\nb) (a − b)²\nc) a³ + b³  (wskazówka: skorzystaj z a³+b³=(a+b)(a²−ab+b²))',
    wsk:'Z (a+b)²=a²+2ab+b² wyznacz a²+b². Następnie skorzystaj z (a−b)²=(a+b)²−4ab.',
    rozw:[
      'a) (a+b)² = a²+2ab+b² → a²+b² = (a+b)²−2ab = 25−8 = 17',
      'b) (a−b)² = (a+b)²−4ab = 25−16 = 9',
      'c) a²+b² = 17 (z podpunktu a), ab = 4',
      '   a²−ab+b² = 17−4 = 13',
      '   a³+b³ = (a+b)(a²−ab+b²) = 5·13 = 65',
    ],
    odp:'a) 17, b) 9, c) 65',
    schemat:'Za a): 1 pkt. Za b): 1 pkt. Za c) z tokiem: 1 pkt.' },
]

function CKEContent({ onComplete }) {
  const [rev,setRev]=useState([]),[sol,setSol]=useState(Array(CKE_Z.length).fill(false))
  return (
    <div style={card}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:18, fontWeight:900, color:C.white, marginBottom:4 }}>Zadania z egzaminu CKE</div>
        <div style={{ fontSize:13, color:C.dim }}>Spróbuj samodzielnie. Każdy krok = punkt.</div>
      </div>
      {CKE_Z.map((z,i) => (
        <div key={i} style={{ background:'#0A0F1E', borderRadius:12, border:`1px solid ${C.border}`, padding:'20px', marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, flexWrap:'wrap' }}>
            <Tag c={C.blue}>{z.rok}</Tag>
            <span style={{ fontSize:11, color:C.dim }}>Zadanie {z.nr}</span>
            <Tag c={C.yellow}>{z.pkt} {z.pkt===1?'punkt':'punkty'}</Tag>
          </div>
          <div style={{ fontSize:15, fontWeight:500, color:C.white, lineHeight:1.75, marginBottom:16, whiteSpace:'pre-line' }}>{z.tresc}</div>
          <div onClick={()=>setRev(r=>r.includes(i)?r.filter(x=>x!==i):[...r,i])}
            style={{ background:C.yellow+'11', border:`1px solid ${C.yellow}33`, borderRadius:8, padding:'9px 14px', marginBottom:10, fontSize:12, color:C.yellow, cursor:'pointer' }}>
            💡 {rev.includes(i)?z.wsk:'Kliknij po wskazówkę'}
          </div>
          <button onClick={()=>setSol(p=>p.map((v,j)=>j===i?!v:v))} style={btn({fontSize:12,padding:'8px 16px'})}>
            {sol[i]?'▲ Ukryj':'▼ Wzorcowe rozwiązanie'}
          </button>
          {sol[i] && (
            <div style={{ marginTop:14, background:C.card, borderRadius:10, border:`1px solid ${C.border}`, padding:'16px' }}>
              {z.rozw.map((step,j) => (
                <div key={j} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:j<z.rozw.length-1?`1px solid ${C.border}`:'none', alignItems:'flex-start' }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:C.accent, color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, flexShrink:0 }}>{j+1}</div>
                  <div style={{ ...mono, fontSize:13, color:'#CBD5E1', lineHeight:1.6 }}>{step}</div>
                </div>
              ))}
              <div style={{ background:C.green+'15', borderRadius:8, padding:'10px 14px', marginTop:12, fontSize:14, color:C.green, fontWeight:700, ...mono }}>
                Odpowiedź: {z.odp}
              </div>
              <div style={{ background:'rgba(139,92,246,0.1)', borderRadius:8, padding:'10px 14px', marginTop:8, fontSize:12, color:'#C4B5FD', lineHeight:1.6, border:'1px solid rgba(139,92,246,0.2)' }}>
                <strong>Schemat oceniania:</strong> {z.schemat}
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
        <button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Raport →</button>
      </div>
    </div>
  )
}

// ── RAPORT ────────────────────────────────────────────────────────────────────
function RaportContent({ onComplete }) {
  return (
    <div style={card}>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>🏆</div>
        <div style={{ fontSize:24, fontWeight:900, color:C.white, marginBottom:4 }}>Lekcja ukończona</div>
        <div style={{ fontSize:13, color:C.dim }}>Wzory skróconego mnożenia</div>
      </div>
      <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px', marginBottom:20, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:16 }}>Trzy wzory — trzy kierunki zastosowań</div>
        {[
          { w:'(a+b)² = a²+2ab+b²', z:'Rozwijanie nawiasów, obliczanie kwadratów liczb bliskich okrągłych, geometria' },
          { w:'(a−b)² = a²−2ab+b²', z:'Jak wyżej. Uwaga: środkowy wyraz MINUS — tam najczęściej błąd' },
          { w:'(a+b)(a−b) = a²−b²', z:'Faktoryzacja, sprytne mnożenia (53×47), upraszczanie wyrażeń' },
        ].map((p,i) => (
          <div key={i} style={{ marginBottom:i<2?14:0, paddingBottom:i<2?14:0, borderBottom:i<2?`1px solid ${C.border}`:'none' }}>
            <div style={{ ...mono, fontSize:16, fontWeight:700, color:C.yellow, marginBottom:6 }}>{p.w}</div>
            <div style={{ fontSize:13, color:'#94A3B8' }}>{p.z}</div>
          </div>
        ))}
      </div>
      <Alert type="warn">
        Na CKE 2022–2024 wzory skróconego mnożenia pojawiały się w zadaniach dotyczących: dowodów podzielności, pól figur, tożsamości algebraicznych, i układów z a+b, ab. Samo mechaniczne rozwijanie to za mało.
      </Alert>
      <div style={{ display:'flex', justifyContent:'space-between', gap:8, flexWrap:'wrap', marginTop:20 }}>
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
    {n:1,title:'Zmienne i wyrażenia',          href:'/kurs/zmienne-wyrazenia',      status:'done'},
    {n:2,title:'Upraszczanie wyrażeń',          href:'/kurs/wyrazenia-algebraiczne', status:'done'},
    {n:3,title:'Wzory skróconego mnożenia',     href:'/kurs/wzory-skroconego',       status:'active'},
    {n:4,title:'Wyłączanie przed nawias',       href:'#',                            status:'locked'},
    {n:5,title:'Wielomiany',                    href:'#',                            status:'locked'},
    {n:6,title:'Sprawdzian działu',             href:'#',                            status:'locked', isTest:true},
  ],
}
const LEKCJA = { n:3, total:5, slug:'wzory-skroconego', title:'Wzory skróconego mnożenia', czas:'30 min', poziom:'Poziom: średni–zaawansowany', cke:true }
const XP_MAP = { teoria:90, quiz:70, fiszki:80, kartkowka:110, cke:80, raport:40 }
const MAX_FAQ = [
  { q:'kwadrat sumy wzor jak zapamiętać', a:'Pierwszy do kwadratu, plus dwa razy iloczyn, plus drugi do kwadratu. (a+b)²=a²+2ab+b². Środkowy wyraz 2ab to najczęściej opuszczany element.' },
  { q:'różnica kwadratów jak rozpoznać sfaktoryzować', a:'Dwa wyrazy, oba kwadraty, między nimi minus: a²−b²=(a+b)(a−b). Uwaga: a²+b² NIE rozkłada się na liczbami rzeczywistymi.' },
  { q:'(a+b)² to a²+b² czy nie', a:'NIE. (a+b)²=a²+2ab+b². Brakujący wyraz 2ab to błąd numer 1. Sprawdź: (1+2)²=9, ale 1²+2²=5. Różnica to 2·1·2=4.' },
  { q:'jak liczyć 47 do kwadratu wzor', a:'47=(50−3). (50−3)²=2500−300+9=2209. Wzór kwadrat różnicy pozwala liczyć bez mnożenia pisemnego.' },
  { q:'jak udowodnić że wyrazenie jest podzielne', a:'Rozwiń wzorami, uprość do postaci k·n (k=stała, n=liczba naturalna). Jeśli k to szukany dzielnik — dowód gotowy. Np. 8n jest podzielne przez 8.' },
]

export default function WzorySkroconegMnozenia() {
  const segments = [
    { id:'teoria',    icon:'📖', label:'Teoria',      content:({onComplete})=><TeoriaContent onComplete={onComplete}/> },
    { id:'quiz',      icon:'🧠', label:'Quiz',        content:({onComplete})=><QuizContent onComplete={onComplete}/> },
    { id:'fiszki',    icon:'🃏', label:'Fiszki',      content:({onComplete})=><FiszkiContent onComplete={onComplete}/> },
    { id:'kartkowka', icon:'✏️', label:'Kartkówka',   content:({onComplete})=><KartkowkaContent onComplete={onComplete}/> },
    { id:'cke',       icon:'📝', label:'Zadanie CKE', content:({onComplete})=><CKEContent onComplete={onComplete}/> },
    { id:'raport',    icon:'📊', label:'Raport',       content:({onComplete})=><RaportContent onComplete={onComplete}/> },
  ]
  return (
    <>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <LessonShell dzial={DZIAL} lekcja={LEKCJA} segments={segments} xpMap={XP_MAP} maxFaq={MAX_FAQ}/>
    </>
  )
}
