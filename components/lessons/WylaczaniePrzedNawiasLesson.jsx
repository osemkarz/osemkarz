'use client'
import { useState } from 'react'
import LessonShell from '../LessonShell'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA 4: Wyłączanie przed nawias
// Dział 2 | Abeka 3.9–3.10 + polska podstawa programowa CKE
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  navy:'#0A0F1E', card:'#1A2236', accent:'#FF4D1C', green:'#00C896',
  blue:'#3B82F6', purple:'#8B5CF6', yellow:'#FBBF24', teal:'#14B8A6',
  white:'#F9FAFB', dim:'#6B7280', border:'rgba(255,255,255,0.08)',
}
const mono = { fontFamily:'"SF Mono","Fira Code",monospace' }
const card = { background:C.card, borderRadius:16, border:`1px solid ${C.border}`, padding:28, color:C.white }
const btn = (x={}) => ({ padding:'10px 22px', fontSize:13, fontWeight:600, borderRadius:10, cursor:'pointer', fontFamily:'inherit', border:`1px solid ${C.border}`, background:'transparent', color:C.white, transition:'all .15s', ...x })

const Tag = ({c=C.accent, children}) => (
  <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', padding:'3px 8px', borderRadius:6, background:c+'22', color:c, border:`1px solid ${c}44` }}>{children}</span>
)
const Eq = ({children, big, color=C.yellow}) => (
  <div style={{ ...mono, fontSize:big?22:16, color, background:'#0A0F1E', borderRadius:10, padding:big?'14px 20px':'8px 14px', display:'inline-block', letterSpacing:'0.02em', border:`1px solid ${color}22` }}>{children}</div>
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
const Alert = ({type='info', children}) => {
  const t = { warn:{bg:'rgba(251,191,36,0.08)',b:C.yellow,i:'⚡'}, err:{bg:'rgba(255,77,28,0.08)',b:C.accent,i:'✗'}, tip:{bg:'rgba(0,200,150,0.08)',b:C.green,i:'✓'}, info:{bg:'rgba(59,130,246,0.08)',b:C.blue,i:'→'} }[type]
  return (
    <div style={{ background:t.bg, borderLeft:`3px solid ${t.b}`, borderRadius:'0 10px 10px 0', padding:'12px 16px', fontSize:13, color:'#CBD5E1', lineHeight:1.75, margin:'16px 0', display:'flex', gap:10 }}>
      <span style={{ color:t.b, flexShrink:0, fontWeight:700 }}>{t.i}</span><span>{children}</span>
    </div>
  )
}

// ── TEORIA — 5 sekcji ─────────────────────────────────────────────────────────
const TTABS = [
  { id:'co',       label:'Idea i odwrotność mnożenia' },
  { id:'nwd',      label:'NWD jednomianów — jak szukać' },
  { id:'proste',   label:'Wyłączanie jednomianu' },
  { id:'grupow',   label:'Grupowanie wyrazów' },
  { id:'zastosow', label:'Zastosowania — ułamki i równania' },
]

function TeoriaContent({ onComplete }) {
  const [tab, setTab] = useState('co')
  const idx = TTABS.findIndex(t => t.id === tab)

  const CONTENT = {

    co: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Wyłączanie przed nawias to operacja odwrotna do mnożenia przez nawias. Zamiast rozkładać iloczyn na sumę — zbieramy sumę z powrotem do iloczynu. Matematycy mówią o tym <strong style={{color:C.white}}>rozkładzie na czynniki</strong> lub <strong style={{color:C.white}}>faktoryzacji</strong>.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
          <div style={{ background:'rgba(255,77,28,0.08)', borderRadius:12, padding:'18px', border:`1px solid ${C.accent}33` }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.accent, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>Prawo rozdzielności →</div>
            <div style={{ ...mono, fontSize:14, color:C.white, lineHeight:2 }}>
              a(b + c)<br/>
              <span style={{ color:C.dim }}>↓ rozwijamy</span><br/>
              ab + ac
            </div>
          </div>
          <div style={{ background:'rgba(0,200,150,0.08)', borderRadius:12, padding:'18px', border:`1px solid ${C.green}33` }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.green, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>Wyłączanie przed nawias ←</div>
            <div style={{ ...mono, fontSize:14, color:C.white, lineHeight:2 }}>
              ab + ac<br/>
              <span style={{ color:C.dim }}>↓ faktoryzujemy</span><br/>
              a(b + c)
            </div>
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>Dlaczego to ma sens — połączenie z dzieleniem jednomianów (Abeka 3.10)</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Gdy wyłączamy a z wyrażenia ab + ac, każdy wyraz dzielimy przez a:
          </p>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px', border:`1px solid ${C.border}` }}>
            <div style={{ ...mono, fontSize:14, color:'#94A3B8', lineHeight:2.4 }}>
              <span style={{ color:C.yellow }}>6x³ + 4x²</span><br/>
              <span style={{ color:C.dim }}>wyłączamy 2x² (wspólny czynnik)</span><br/>
              <span style={{ color:C.green }}>6x³ ÷ 2x²</span> = <span style={{ color:C.white }}>3x</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<span style={{ color:C.green }}>4x² ÷ 2x²</span> = <span style={{ color:C.white }}>2</span><br/>
              wynik: <span style={{ color:C.yellow, fontWeight:700 }}>2x²(3x + 2)</span>
            </div>
          </div>
          <Alert type="tip">
            Każdy wyraz po wyłączeniu to wynik <strong>dzielenia</strong> danego wyrazu przez wyłączony czynnik. Korzystamy dokładnie z zasad dzielenia jednomianów z Abeki 3.10.
          </Alert>
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>Sprawdzenie — zawsze wróć do punktu wyjścia</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Po wyłączeniu zawsze sprawdzamy rozwijając nawias. Wynik musi być identyczny z wejściem.
          </p>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}` }}>
            <div style={{ ...mono, fontSize:14, color:'#94A3B8', lineHeight:2 }}>
              <span style={{ color:C.dim }}>Wejście:</span>  <span style={{ color:C.yellow }}>6x³ + 4x²</span><br/>
              <span style={{ color:C.dim }}>Wyłączamy:</span> <span style={{ color:C.green }}>2x²(3x + 2)</span><br/>
              <span style={{ color:C.dim }}>Sprawdzamy:</span> 2x² · 3x + 2x² · 2 = <span style={{ color:C.white }}>6x³ + 4x² ✓</span>
            </div>
          </div>
        </div>

        <Alert type="warn">
          Wyłączanie przed nawias NIE zmienia wartości wyrażenia — tylko jego postać. To jak zapisanie 12 jako 4·3 zamiast 12. Liczba ta sama, zapis inny.
        </Alert>
      </div>
    ),

    nwd: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Przed wyłączeniem musisz znaleźć <strong style={{color:C.white}}>największy wspólny czynnik</strong> (NWC, ang. GCF — Greatest Common Factor) wszystkich wyrazów wielomianu. To ten największy jednomian, który dzieli każdy wyraz bez reszty.
        </p>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Algorytm szukania NWC — dwa kroki</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { n:1, t:'NWD współczynników liczbowych', d:'Znajdź NWD (największy wspólny dzielnik) liczb stojących przed zmiennymi.', ex:'12, 8, 20 → NWD = 4' },
              { n:2, t:'Najniższe potęgi wspólnych zmiennych', d:'Weź każdą zmienną która WYSTĘPUJE W KAŻDYM wyrazie, z NAJNIŻSZĄ potęgą spośród wyrazów.', ex:'x³, x², x⁴ → bierzemy x² (najniższe)' },
            ].map(p => (
              <div key={p.n} style={{ display:'flex', gap:12, padding:'14px 16px', background:'#0A0F1E', borderRadius:10, border:`1px solid ${C.border}` }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:C.accent, color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, flexShrink:0 }}>{p.n}</div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:3 }}>{p.t}</div>
                  <div style={{ fontSize:12, color:'#94A3B8', marginBottom:4 }}>{p.d}</div>
                  <div style={{ ...mono, fontSize:12, color:C.yellow }}>{p.ex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Przykłady — szukanie NWC</div>
          {[
            {
              wyrazy: ['6x²', '9x', '12x³'],
              krok1: 'NWD(6, 9, 12) = 3',
              krok2: 'Zmienna x w każdym wyrazie, najniższa potęga: x¹',
              wynik: 'NWC = 3x',
            },
            {
              wyrazy: ['12a²b', '8ab²', '20a³b³'],
              krok1: 'NWD(12, 8, 20) = 4',
              krok2: 'a: jest w każdym, potęgi 2,1,3 → bierzemy a¹\nb: jest w każdym, potęgi 1,2,3 → bierzemy b¹',
              wynik: 'NWC = 4ab',
            },
            {
              wyrazy: ['15x³y²', '10x²y⁴', '5x⁴y'],
              krok1: 'NWD(15, 10, 5) = 5',
              krok2: 'x: potęgi 3,2,4 → bierzemy x²\ny: potęgi 2,4,1 → bierzemy y¹',
              wynik: 'NWC = 5x²y',
            },
          ].map((ex, i) => (
            <div key={i} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:10 }}>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
                {ex.wyrazy.map(w => <Eq key={w}>{w}</Eq>)}
              </div>
              <div style={{ fontSize:12, color:'#94A3B8', marginBottom:4 }}>① {ex.krok1}</div>
              <div style={{ fontSize:12, color:'#94A3B8', marginBottom:8, whiteSpace:'pre-line' }}>② {ex.krok2}</div>
              <Wynik val={`NWC = ${ex.wynik.replace('NWC = ','')}`} />
            </div>
          ))}
        </div>

        <Alert type="err">
          <strong>Typowy błąd:</strong> Wzięcie zmiennej, która NIE występuje w każdym wyrazie. Np. w wyrażeniu 6x² + 4y zmienna x nie występuje w drugim wyrazie — NWC wynosi tylko 2, nie 2x.
        </Alert>

        <div>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>Szczególne przypadki</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              ['NWC = 1', '3x² + 5y', 'Brak wspólnego czynnika > 1. Nie można wyłączyć nic więcej niż 1.'],
              ['NWC = liczba', '6x + 9', 'NWC = 3. Wyłączamy samą liczbę: 3(2x + 3).'],
              ['Ujemny wiodący wyraz', '−4x² + 8x', 'Można wyłączyć −4x: −4x(x − 2). Sprawdź znaki w nawiasie!'],
              ['NWC = cały wyraz', 'x(a+b) + y(a+b)', 'Wspólny czynnik to (a+b). Wynik: (a+b)(x+y).'],
            ].map(([t, ex, d]) => (
              <div key={t} style={{ padding:'11px 14px', background:'#0A0F1E', borderRadius:10, border:`1px solid ${C.border}`, display:'flex', gap:12, alignItems:'flex-start' }}>
                <Tag c={C.purple}>{t}</Tag>
                <div>
                  <div style={{ ...mono, fontSize:13, color:C.yellow, marginBottom:3 }}>{ex}</div>
                  <div style={{ fontSize:12, color:'#94A3B8' }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    proste: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Mając NWC, sam proces wyłączania jest prosty: dzielimy każdy wyraz przez NWC i zapisujemy w nawiasie. Ważna jest precyzja — jeden błąd znaku psuje cały wynik.
        </p>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Przykłady rosnące trudnością</div>

          {[
            {
              poziom: 'basic', label: 'Wyłączanie liczby',
              wej: '6x + 9',
              kroki: [
                { n:1, text:'NWD(6, 9) = 3. Brak wspólnych zmiennych. NWC = 3.' },
                { n:2, text:'Dzielimy: 6x ÷ 3 = 2x, 9 ÷ 3 = 3', eq:'3(2x + 3)' },
                { n:3, text:'Sprawdzamy: 3·2x + 3·3 = 6x + 9 ✓', hi:true, eq:'3(2x + 3)' },
              ],
            },
            {
              poziom: 'basic', label: 'Wyłączanie zmiennej',
              wej: 'x² + 5x',
              kroki: [
                { n:1, text:'Liczby: 1 i 5. NWD = 1. Zmienna x: potęgi 2 i 1. Najniższa: x¹. NWC = x.' },
                { n:2, text:'Dzielimy: x² ÷ x = x, 5x ÷ x = 5', eq:'x(x + 5)' },
                { n:3, text:'Sprawdzamy: x·x + x·5 = x² + 5x ✓', hi:true, eq:'x(x + 5)' },
              ],
            },
            {
              poziom: 'med', label: 'Wyłączanie jednomianu (Abeka 3.10)',
              wej: '6x³ + 4x²',
              kroki: [
                { n:1, text:'NWD(6, 4) = 2. Zmienna x: potęgi 3 i 2 → najniższa x². NWC = 2x².' },
                { n:2, text:'6x³ ÷ 2x² = 3x  (Abeka 3.10: 6÷2=3, x³÷x²=x)', eq:'3x' },
                { n:3, text:'4x² ÷ 2x² = 2', eq:'2x²(3x + 2)' },
                { n:4, text:'Sprawdzamy: 2x²·3x + 2x²·2 = 6x³ + 4x² ✓', hi:true, eq:'2x²(3x + 2)' },
              ],
            },
            {
              poziom: 'med', label: 'Trzy wyrazy — Abeka 3.10b',
              wej: '18a²bc² − 12ab²c + 6a³b³',
              kroki: [
                { n:1, text:'NWD(18, 12, 6) = 6. Zmienna a: 2,1,3 → a¹. Zmienna b: 1,2,3 → b¹. Zmienna c: 2,1,0 → c nie jest wspólna! NWC = 6ab.' },
                { n:2, text:'18a²bc² ÷ 6ab = 3ac²', eq:'3ac²' },
                { n:3, text:'12ab²c ÷ 6ab = 2bc', eq:'(pamiętaj o znaku minus!)' },
                { n:4, text:'6a³b³ ÷ 6ab = a²b²', eq:'6ab(3ac² − 2bc + a²b²)' },
                { n:5, text:'Sprawdzamy rozwijając...', hi:true, eq:'6ab(3ac² − 2bc + a²b²)' },
              ],
            },
            {
              poziom: 'hard', label: 'Ujemny czynnik wyłączający',
              wej: '−3x³ + 9x² − 6x',
              kroki: [
                { n:1, text:'NWC = 3x (lub −3x, gdy chcemy dodatni pierwszy wyraz w nawiasie). Wyłączamy −3x.' },
                { n:2, text:'−3x³ ÷ (−3x) = x², 9x² ÷ (−3x) = −3x, −6x ÷ (−3x) = 2' },
                { n:3, text:'Przy wyłączaniu liczby ujemnej wszystkie znaki w nawiasie się odwracają!', eq:'−3x(x² − 3x + 2)', hi:true },
                { n:4, text:'Sprawdzamy: −3x·x² + (−3x)·(−3x) + (−3x)·2 = −3x³ + 9x² − 6x ✓' },
              ],
            },
          ].map((ex, i) => (
            <div key={i} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <Tag c={ex.poziom==='basic'?C.green:ex.poziom==='med'?C.yellow:C.accent}>{ex.poziom==='basic'?'Podstawowy':ex.poziom==='med'?'Średni':'Trudny'}</Tag>
                <span style={{ fontSize:13, color:C.dim }}>{ex.label}</span>
              </div>
              <div style={{ marginBottom:12 }}><Eq big>{ex.wej}</Eq></div>
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {ex.kroki.map(k => <Krok key={k.n} {...k} />)}
              </div>
            </div>
          ))}
        </div>

        <Alert type="warn">
          <strong>Znak minus przed nawiasem zmienia wszystkie znaki wewnątrz.</strong> −3x(x² − 3x + 2): sprawdź czy −3x·(−3x) = +9x². Jeden błąd znaku w nawiasie to błąd całego zadania.
        </Alert>
      </div>
    ),

    grupow: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Gdy wielomian ma cztery lub więcej wyrazów bez jednego wspólnego czynnika dla wszystkich — możemy zastosować <strong style={{color:C.white}}>metodę grupowania</strong>: dzielimy wyrazy na pary, z każdej pary wyłączamy osobny czynnik, a potem szukamy wspólnego dwumianu.
        </p>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Schemat metody grupowania</div>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px', border:`1px solid ${C.border}`, marginBottom:14 }}>
            <div style={{ ...mono, fontSize:14, color:'#94A3B8', lineHeight:2.4 }}>
              ax + ay + bx + by<br/>
              <span style={{ color:C.dim }}>← grupujemy w pary →</span><br/>
              <span style={{ color:C.yellow }}>(ax + ay)</span> + <span style={{ color:C.blue }}>(bx + by)</span><br/>
              <span style={{ color:C.dim }}>← wyłączamy z każdej pary →</span><br/>
              <span style={{ color:C.yellow }}>a(x + y)</span> + <span style={{ color:C.blue }}>b(x + y)</span><br/>
              <span style={{ color:C.dim }}>← wspólny nawias (x+y) →</span><br/>
              <span style={{ color:C.green, fontWeight:700 }}>(x + y)(a + b)</span>
            </div>
          </div>
          <Alert type="info">
            Warunek sukcesu: po wyłączeniu z każdej pary musi pojawić się <strong>ten sam nawias</strong>. Jeśli nie — spróbuj innego grupowania lub zmień kolejność wyrazów.
          </Alert>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Przykłady grupowania</div>

          {[
            {
              wej: 'xy + 3x + 2y + 6',
              kroki: [
                { n:1, text:'Grupujemy: (xy + 3x) + (2y + 6)' },
                { n:2, text:'Z pierwszej pary wyłączamy x:', eq:'x(y + 3)' },
                { n:3, text:'Z drugiej pary wyłączamy 2:', eq:'2(y + 3)' },
                { n:4, text:'Mamy dwa razy (y+3) — wyłączamy jako wspólny czynnik:', eq:'(y + 3)(x + 2)', hi:true },
              ],
              spr: '(y+3)(x+2) = xy+2y+3x+6 ✓',
            },
            {
              wej: 'ax − bx − ay + by',
              kroki: [
                { n:1, text:'Grupujemy: (ax − bx) + (−ay + by)' },
                { n:2, text:'Z pierwszej pary wyłączamy x:', eq:'x(a − b)' },
                { n:3, text:'Z drugiej pary wyłączamy y (uwaga na znaki!):', eq:'y(−a + b) = y(b − a) = −y(a − b)' },
                { n:4, text:'Wspólny czynnik (a−b):', eq:'(a − b)(x − y)', hi:true },
              ],
              spr: '(a−b)(x−y) = ax−ay−bx+by ✓',
            },
            {
              wej: 'x³ + x² + x + 1',
              kroki: [
                { n:1, text:'Grupujemy: (x³ + x²) + (x + 1)' },
                { n:2, text:'Z pierwszej pary wyłączamy x²:', eq:'x²(x + 1)' },
                { n:3, text:'Druga para: (x + 1) — już jest prosta', eq:'1·(x + 1)' },
                { n:4, text:'Wspólny czynnik (x+1):', eq:'(x + 1)(x² + 1)', hi:true },
              ],
              spr: '(x+1)(x²+1) = x³+x+x²+1 = x³+x²+x+1 ✓',
            },
            {
              wej: '2ax + 6bx − 3ay − 9by',
              kroki: [
                { n:1, text:'Grupujemy: (2ax + 6bx) + (−3ay − 9by)' },
                { n:2, text:'Z pierwszej pary wyłączamy 2x:', eq:'2x(a + 3b)' },
                { n:3, text:'Z drugiej pary wyłączamy −3y:', eq:'−3y(a + 3b)' },
                { n:4, text:'Wspólny czynnik (a+3b):', eq:'(a + 3b)(2x − 3y)', hi:true },
              ],
              spr: '(a+3b)(2x−3y) = 2ax−3ay+6bx−9by ✓',
            },
          ].map((ex, i) => (
            <div key={i} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:10 }}>
              <div style={{ marginBottom:12 }}><Eq big>{ex.wej}</Eq></div>
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {ex.kroki.map(k => <Krok key={k.n} {...k} />)}
              </div>
              <div style={{ fontSize:11, color:C.dim, marginTop:8, ...mono }}>Sprawdzenie: {ex.spr}</div>
            </div>
          ))}
        </div>

        <Alert type="warn">
          <strong>Gdy grupowanie nie wychodzi za pierwszym razem</strong> — zmień kolejność wyrazów i spróbuj ponownie. Np. ax + by + ay + bx → (ax + ay) + (bx + by) = a(x+y) + b(x+y) = (x+y)(a+b).
        </Alert>
      </div>
    ),

    zastosow: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Faktoryzacja to nie cel sam w sobie — służy do upraszczania ułamków algebraicznych, rozwiązywania równań i dowodzenia twierdzeń. Na CKE te zastosowania pojawiają się w zadaniach otwartych wycenianych na 2–3 punkty.
        </p>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:14 }}>Zastosowanie 1 — upraszczanie ułamków algebraicznych</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Ułamek algebraiczny upraszczamy przez wyłączenie przed nawias licznika i mianownika, a następnie skracamy wspólne czynniki. Podobnie jak w ułamkach liczbowych: 12/8 = (4·3)/(4·2) = 3/2.
          </p>
          {[
            {
              wej: '(6x³ + 4x²) / (2x²)',
              tok: ['Licznik: 6x³+4x² = 2x²(3x+2) (wyłączamy 2x²)', 'Mianownik: 2x²', 'Skracamy 2x²:'],
              wynik: '3x + 2',
              war: 'x ≠ 0',
            },
            {
              wej: '(x² + 5x) / (x² + 3x)',
              tok: ['Licznik: x²+5x = x(x+5)', 'Mianownik: x²+3x = x(x+3)', 'Skracamy x:'],
              wynik: '(x + 5) / (x + 3)',
              war: 'x ≠ 0',
            },
            {
              wej: '(2a²b − 4ab²) / (6ab)',
              tok: ['Licznik: 2a²b−4ab² = 2ab(a−2b)', 'Mianownik: 6ab = 6ab', 'Skracamy 2ab:'],
              wynik: '(a − 2b) / 3',
              war: 'a ≠ 0, b ≠ 0',
            },
          ].map((ex, i) => (
            <div key={i} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:10 }}>
              <div style={{ marginBottom:12 }}><Eq big>{ex.wej}</Eq></div>
              {ex.tok.map((t,j) => <div key={j} style={{ fontSize:13, color:'#94A3B8', marginBottom:4, paddingLeft:8, borderLeft:`2px solid ${C.border}` }}>{t}</div>)}
              <Wynik val={ex.wynik} note={`Warunek dziedziny: ${ex.war}`} />
            </div>
          ))}
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:14 }}>Zastosowanie 2 — rozwiązywanie równań metodą faktoryzacji</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Gdy iloczyn równa się zero, jeden z czynników musi być zerem. To <strong style={{color:C.white}}>właściwość zera</strong>: a·b = 0 ⟺ a = 0 lub b = 0.
          </p>
          {[
            {
              rownanie: 'x² + 5x = 0',
              kroki: [
                { n:1, text:'Wyłączamy x (nie przenosimy na prawą stronę!):', eq:'x(x + 5) = 0' },
                { n:2, text:'Właściwość zera: jeden z czynników = 0', eq:'x = 0  lub  x + 5 = 0' },
                { n:3, text:'Rozwiązujemy oba przypadki:', eq:'x = 0  lub  x = −5', hi:true },
              ],
              spr: 'Dla x=0: 0+0=0 ✓  Dla x=−5: 25−25=0 ✓',
            },
            {
              rownanie: '3x² = 9x',
              kroki: [
                { n:1, text:'Przenosimy wszystko na lewą stronę:', eq:'3x² − 9x = 0' },
                { n:2, text:'Wyłączamy 3x:', eq:'3x(x − 3) = 0' },
                { n:3, text:'Właściwość zera:', eq:'3x = 0  lub  x − 3 = 0' },
                { n:4, text:'Wyniki:', eq:'x = 0  lub  x = 3', hi:true },
              ],
              spr: 'Dla x=0: 0=0 ✓  Dla x=3: 27=27 ✓',
            },
          ].map((ex, i) => (
            <div key={i} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:10 }}>
              <div style={{ marginBottom:12 }}><Eq big>{ex.rownanie}</Eq></div>
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {ex.kroki.map(k => <Krok key={k.n} {...k} />)}
              </div>
              <div style={{ fontSize:11, color:C.dim, marginTop:8, ...mono }}>Sprawdzenie: {ex.spr}</div>
            </div>
          ))}
          <Alert type="err">
            <strong>Klasyczny błąd:</strong> Przy x² + 5x = 0 dzielenie obu stron przez x. Tracimy rozwiązanie x = 0! Zawsze wyłączaj x przed nawias zamiast dzielić.
          </Alert>
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:14 }}>Zastosowanie 3 — wyłączanie przed nawias razem z wzorami skróconego mnożenia</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              {
                wej: 'x³ − x',
                tok: 'Wyłączamy x: x(x²−1) = x(x+1)(x−1)',
                wynik: 'x(x+1)(x−1)',
                note: 'x²−1 to różnica kwadratów!',
              },
              {
                wej: '2x³ − 8x',
                tok: 'Wyłączamy 2x: 2x(x²−4) = 2x(x+2)(x−2)',
                wynik: '2x(x+2)(x−2)',
                note: 'x²−4 to różnica kwadratów',
              },
              {
                wej: '3a²b − 12b',
                tok: 'Wyłączamy 3b: 3b(a²−4) = 3b(a+2)(a−2)',
                wynik: '3b(a+2)(a−2)',
                note: 'a²−4 to różnica kwadratów',
              },
            ].map((ex) => (
              <div key={ex.wej} style={{ background:'#0A0F1E', borderRadius:10, padding:'14px 16px', border:`1px solid ${C.border}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:6 }}>
                  <span style={{ ...mono, fontSize:15, color:C.yellow }}>{ex.wej}</span>
                  <span style={{ color:C.dim }}>→</span>
                  <span style={{ fontSize:12, color:'#94A3B8', flex:1 }}>{ex.tok}</span>
                </div>
                <Wynik val={ex.wynik} note={ex.note} />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  }

  return (
    <div style={card}>
      <div style={{ marginBottom:20 }}>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {TTABS.map((t, i) => {
            const done = i < idx, active = t.id === tab
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:'6px 14px', fontSize:11, fontWeight:700, borderRadius:8,
                cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
                border:`1px solid ${active?C.accent:done?C.green+'44':C.border}`,
                background:active?C.accent:done?C.green+'11':'transparent',
                color:active?'#000':done?C.green:C.dim, letterSpacing:'.02em',
              }}>{done&&!active?'✓ ':''}{t.label}</button>
            )
          })}
        </div>
      </div>
      <div style={{ minHeight:400 }}>{CONTENT[tab]}</div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:24, paddingTop:20, borderTop:`1px solid ${C.border}`, gap:8 }}>
        {idx > 0 ? <button onClick={() => setTab(TTABS[idx-1].id)} style={btn()}>← {TTABS[idx-1].label}</button> : <div/>}
        {idx < TTABS.length-1
          ? <button onClick={() => setTab(TTABS[idx+1].id)} style={btn({background:C.accent,border:'none',color:'#000',fontWeight:800})}>{TTABS[idx+1].label} →</button>
          : <button onClick={onComplete} style={btn({background:C.green,border:'none',color:'#000',fontWeight:800})}>✓ Ukończyłem teorię →</button>}
      </div>
    </div>
  )
}

// ── QUIZ (10 pytań) ───────────────────────────────────────────────────────────
const QUIZ = [
  { q:'Wyłącz przed nawias:', eq:'8x + 12',
    opts:['4(2x+3)','8(x+4)','2(4x+6)','4(2x+12)'], ans:0,
    why:'NWD(8,12)=4. 8x÷4=2x, 12÷4=3. Wynik: 4(2x+3). C jest błędne: 2(4x+6) też jest poprawne algebraicznie, ale nie jest PEŁNYM wyłączeniem — 4 jest większym czynnikiem.' },
  { q:'Wyłącz przed nawias:', eq:'x² + 3x',
    opts:['x(x²+3)','x(x+3)','3x(x+1)','x²(1+3)'], ans:1,
    why:'NWC = x (najniższa potęga). x²÷x=x, 3x÷x=3. Wynik: x(x+3).' },
  { q:'Wyłącz przed nawias (Abeka 3.10):', eq:'6x³ + 4x²',
    opts:['2x(3x²+2x)','2x²(3x+2)','x²(6x+4)','6x³(1+4x²/6x³)'], ans:1,
    why:'NWD(6,4)=2, najniższa potęga x: x². NWC=2x². 6x³÷2x²=3x, 4x²÷2x²=2. Wynik: 2x²(3x+2).' },
  { q:'Wyłącz przed nawias:', eq:'−3x³ + 9x² − 6x',
    opts:['−3x(x²−3x+2)','3x(−x²+3x−2)','−3x(x²+3x+2)','−3(x³−3x²+2x)'], ans:0,
    why:'NWC = −3x (wyłączamy ujemny czynnik by pierwszy wyraz w nawiasie był dodatni). −3x³÷(−3x)=x², 9x²÷(−3x)=−3x, −6x÷(−3x)=2. Wynik: −3x(x²−3x+2). B też jest algebr. poprawne, ale A to konwencja.' },
  { q:'Rozkład na czynniki metodą grupowania:', eq:'ax + bx + ay + by',
    opts:['(a+b)x+y','(a+b)(x+y)','a(x+y)+b','xy(a+b)'], ans:1,
    why:'(ax+bx)+(ay+by) = x(a+b)+y(a+b) = (a+b)(x+y).' },
  { q:'Rozwiąż równanie metodą faktoryzacji:', eq:'x² − 4x = 0',
    opts:['x=4','x=0 lub x=4','x=0 lub x=−4','x=−4'], ans:1,
    why:'Wyłączamy x: x(x−4)=0. Właściwość zera: x=0 lub x−4=0, więc x=0 lub x=4.' },
  { q:'Uprość ułamek:', eq:'(x² + 5x) / x',
    opts:['x+5x','x+5','x²+5','5'], ans:1,
    why:'Licznik: x²+5x=x(x+5). Skracamy x (dla x≠0): (x+5)/1 = x+5.' },
  { q:'Wyłącz NWC (Abeka 3.10b):', eq:'12a²b − 8ab² + 4a³b',
    opts:['4ab(3a−2b+a²)','4a(3ab−2b²+a²b)','4ab(3a+2b+a²)','2ab(6a−4b+2a²)'], ans:0,
    why:'NWD(12,8,4)=4. a: 2,1,3→a¹. b: 1,2,1→b¹. NWC=4ab. 12a²b÷4ab=3a, 8ab²÷4ab=2b, 4a³b÷4ab=a². Wynik: 4ab(3a−2b+a²).' },
  { q:'Które wyrażenie jest poprawnie rozłożone?', eq:'x³ − x',
    opts:['x(x²)−x','x(x²−1)','x(x+1)(x−1)','Zarówno B jak i C'], ans:3,
    why:'x³−x = x(x²−1) — to B. Ale x²−1 to różnica kwadratów: x²−1=(x+1)(x−1). Więc pełny rozkład to x(x+1)(x−1) — to C. Oba zapisy są poprawne.' },
  { q:'Wyłącz z grupowania:', eq:'x³ + x² + x + 1',
    opts:['(x+1)(x²+1)','(x²+1)(x+1)','x²(x+1)+1','x(x²+x)+1'], ans:0,
    why:'Grupujemy: (x³+x²)+(x+1) = x²(x+1)+1·(x+1) = (x+1)(x²+1). A i B to to samo — oba poprawne.' },
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
      <div style={{ fontSize:12, color:C.dim, marginBottom:8 }}>Pytanie {qi+1} z {QUIZ.length}</div>
      <div style={{ fontSize:15,fontWeight:500,color:C.white,marginBottom:16,lineHeight:1.55 }}>{q.q}</div>
      {q.eq && <div style={{ ...mono, fontSize:20, color:C.yellow, background:'#0A0F1E', borderRadius:10, padding:'14px 20px', display:'inline-block', marginBottom:20, border:`1px solid rgba(251,191,36,0.2)` }}>{q.eq}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
        {q.opts.map((o,i)=>{
          let bg='transparent',border=C.border,color=C.white
          if(done){if(i===q.ans){bg=C.green+'22';border=C.green;color=C.green}else if(i===sel){bg=C.accent+'22';border=C.accent;color=C.accent}}
          return <div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setRes(p=>[...p,i===q.ans])}}
            style={{ border:`1px solid ${border}`,borderRadius:10,padding:'12px 16px',cursor:done?'default':'pointer',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s' }}>{o}</div>
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
              style={btn({background:C.accent,border:'none',color:'#fff',fontWeight:700})}>{qi<QUIZ.length-1?'Następne →':'Wynik →'}</button>
          </div>
        </>
      )}
    </div>
  )
}

// ── FISZKI (12 kart) ──────────────────────────────────────────────────────────
const FISZKI = [
  { q:'Co to jest wyłączanie przed nawias?', a:'Operacja odwrotna do mnożenia przez nawias: zbieramy sumę wyrazów do iloczynu. ab+ac = a(b+c). To faktoryzacja — rozkład na czynniki.' },
  { q:'Jak znaleźć NWC (największy wspólny czynnik) wielomianu?', a:'Krok 1: NWD współczynników liczbowych. Krok 2: każda zmienna wspólna dla WSZYSTKICH wyrazów z NAJNIŻSZĄ potęgą.', f:'6x³, 4x², 2x → NWD(6,4,2)=2, x¹ → NWC=2x' },
  { q:'Co to jest właściwość zera przy faktoryzacji?', a:'Jeśli iloczyn a·b = 0, to a = 0 lub b = 0 (albo oba). Służy do rozwiązywania równań kwadratowych po faktoryzacji.', f:'x(x−3)=0 → x=0 lub x=3', note:'Nie wolno dzielić obu stron przez x!' },
  { q:'Jak uprosić ułamek algebraiczny faktoryzacją?', a:'Wyłącz przed nawias licznik i mianownik osobno, następnie skróć wspólne czynniki. Pamiętaj o warunku dziedziny (dzielnik ≠ 0).', f:'(x²+5x)/x = x(x+5)/x = x+5' },
  { q:'Jak wyłączyć ujemny czynnik?', a:'Wszystkie znaki wyrazów wewnątrz nawiasu odwracają się. Sprawdź zawsze przez rozwinięcie.', f:'−3x³+9x²−6x = −3x(x²−3x+2)', note:'Przy ujemnym NWC: + staje się −, i odwrotnie' },
  { q:'Na czym polega metoda grupowania?', a:'Dzielimy wyrazy wielomianu na pary, z każdej wyłączamy wspólny czynnik, po czym wyłączamy powstały wspólny nawias.', f:'ax+bx+ay+by = x(a+b)+y(a+b) = (a+b)(x+y)' },
  { q:'Dlaczego nie wolno dzielić obu stron równania przez x przy x²−4x=0?', a:'Tracimy rozwiązanie x=0. Zawsze przenosimy wszystko na jedną stronę i wyłączamy: x(x−4)=0 → x=0 lub x=4.', note:'Dzielenie przez zmienną jest dozwolone tylko gdy wiemy że ≠ 0' },
  { q:'Wyłącz: 18a²bc² − 12ab²c (Abeka 3.10b)', a:'NWD(18,12)=6. a: 2,1→a¹. b: 1,2→b¹. c: 2,1→c¹. NWC=6abc. Wynik: 6abc(3ac − 2b).', f:'6abc(3ac − 2b)' },
  { q:'Jak połączyć wyłączanie z różnicą kwadratów?', a:'Wyłącz NWC, a następnie sprawdź czy wyraz w nawiasie to różnica kwadratów i rozłóż dalej.', f:'2x³−8x = 2x(x²−4) = 2x(x+2)(x−2)' },
  { q:'Co sprawdzić po wyłączeniu przed nawias?', a:'Rozwiń nawias przez wyłączony czynnik. Wynik musi być identyczny z wyjściem.', note:'To jedyny pewny sposób — sprawdzanie jest obowiązkowe na CKE!' },
  { q:'Uprość: (6x³+4x²) ÷ (2x²)', a:'Licznik: 2x²(3x+2). Skróć 2x². Wynik: 3x+2 (dla x≠0).', f:'6x³+4x² = 2x²(3x+2) → ÷2x² → 3x+2' },
  { q:'Rozwiąż: 3x² = 9x metodą faktoryzacji', a:'Przenosimy: 3x²−9x=0. Wyłączamy: 3x(x−3)=0. Właściwość zera: x=0 lub x=3.', f:'3x²−9x=0 → 3x(x−3)=0 → x=0 lub x=3' },
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
        <span style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em' }}>{mastered}/{FISZKI.length} opanowanych</span>
        <span style={{ fontSize:11, color:C.dim }}>{deck.length} pozostało</span>
      </div>
      <div style={{ height:3, background:C.border, borderRadius:2, marginBottom:20, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:C.green, borderRadius:2, transition:'width .4s' }}/>
      </div>
      <div onClick={()=>setFlip(f=>!f)} style={{ cursor:'pointer', minHeight:200, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', padding:28, textAlign:'center', background:flip?C.card:'#0A0F1E', border:`1px solid ${flip?C.accent+'44':C.border}`, transition:'background .25s', marginBottom:14 }}>
        {!flip
          ? <div><div style={{ fontSize:10, color:C.dim, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:14 }}>Fiszka {mastered+1}/{FISZKI.length}</div><div style={{ fontSize:17, fontWeight:500, color:C.white, lineHeight:1.65 }}>{c.q}</div><div style={{ fontSize:11, color:C.dim, marginTop:16 }}>kliknij żeby zobaczyć odpowiedź</div></div>
          : <div><div style={{ fontSize:14, color:'#CBD5E1', lineHeight:1.7, marginBottom:10 }}>{c.a}</div>{c.f&&<div style={{ ...mono, fontSize:13, color:C.yellow, fontWeight:600, margin:'10px 0', whiteSpace:'pre-line' }}>{c.f}</div>}{c.note&&<div style={{ fontSize:12, color:C.dim, marginTop:8, fontStyle:'italic' }}>{c.note}</div>}</div>}
      </div>
      {flip && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          <button onClick={()=>{const[,...r]=deck;setDeck([...r,deck[0]]);setFlip(false)}} style={btn({background:C.accent+'22',borderColor:C.accent+'44',color:C.accent,textAlign:'center'})}>Trudna — powtórz</button>
          <button onClick={()=>{const[,...r]=deck;setDeck(r);setMastered(m=>m+1);setFlip(false)}} style={btn({background:C.green+'22',borderColor:C.green+'44',color:C.green,textAlign:'center'})}>Opanowana ✓</button>
        </div>
      )}
    </div>
  )
}

// ── KARTKÓWKA (12 pytań) ──────────────────────────────────────────────────────
const KQ = [
  { q:'Wyłącz NWC:', eq:'15x⁴ − 10x³ + 5x²', opts:['5x²(3x²−2x+1)','5x(3x³−2x²+1)','5x³(3x−2)+5x²','x²(15x²−10x+5)'], ans:0, hint:'NWD(15,10,5)=5. Najniższa potęga x: x². NWC=5x².' },
  { q:'Wyłącz NWC:', eq:'12a²b³ − 8a³b² + 4a²b', opts:['4a²b(3b²−2ab+1)','4ab(3ab²−2a²b+a)','4a²b(3b²−2ab+1) tak','2a²b(6b²−4ab+2)'], ans:0, hint:'NWD(12,8,4)=4. a:2,3,2→a². b:3,2,1→b¹. NWC=4a²b.' },
  { q:'Rozwiąż metodą faktoryzacji:', eq:'2x² − 6x = 0', opts:['x=3','x=0 lub x=3','x=0 lub x=−3','x=6'], ans:1, hint:'Wyłącz 2x: 2x(x−3)=0. Właściwość zera.' },
  { q:'Uprość ułamek (podaj dziedzinę):', eq:'(x² − 4x) / (2x)', opts:['(x−4)/2 dla x≠0','x−4 dla x≠0','(x−4)/2','x(x−4)/2x'], ans:0, hint:'Licznik: x(x−4). Skróć x. Wynik: (x−4)/2, warunek: x≠0.' },
  { q:'Rozkład metodą grupowania:', eq:'ab + 2b + 3a + 6', opts:['(a+2)(b+3)','(a+3)(b+2)','b(a+2)+3(a+2)','Zarówno A jak i B'], ans:1, hint:'(ab+2b)+(3a+6) = b(a+2)+3(a+2) = (a+2)(b+3).' },
  { q:'Wyłącz i rozłóż różnicę kwadratów:', eq:'3x³ − 12x', opts:['3x(x²−4)','3x(x−2)(x+2)','3(x³−4x)','3x(x+2)²'], ans:1, hint:'Wyłącz 3x: 3x(x²−4). Potem x²−4=(x+2)(x−2).' },
  { q:'Wyłącz ujemny czynnik:', eq:'−6a²b + 4ab² − 2ab', opts:['−2ab(3a−2b+1)','2ab(−3a+2b−1)','−2ab(3a+2b+1)','−2a(3ab−2b²+b)'], ans:0, hint:'NWC=−2ab. −6a²b÷(−2ab)=3a, 4ab²÷(−2ab)=−2b, −2ab÷(−2ab)=1.' },
  { q:'Rozwiąż:', eq:'x³ = 4x', opts:['x=2','x=0,x=2,x=−2','x=4','x=2,x=−2'], ans:1, hint:'Przenieś: x³−4x=0. Wyłącz x: x(x²−4)=0 → x(x+2)(x−2)=0. Trzy rozwiązania!' },
  { q:'Rozkład metodą grupowania:', eq:'x³ − 3x² + x − 3', opts:['x²(x−3)+(x−3)','(x−3)(x²+1)','(x+3)(x²−1)','x(x²+1)−3(x²−1)'], ans:1, hint:'Grupujemy: (x³−3x²)+(x−3) = x²(x−3)+1·(x−3) = (x−3)(x²+1).' },
  { q:'Uprość ułamek:', eq:'(3x³ − 6x²) / (x² − 2x)', opts:['3x','3','3x²−6x','3(x−2)'], ans:0, hint:'Licznik: 3x²(x−2). Mianownik: x(x−2). Skróć x(x−2). Wynik: 3x²/x=3x.' },
  { q:'Wyłącz NWC z wielomianu o czterech wyrazach:', eq:'4ax − 6bx + 6ay − 9by', opts:['(4a−6b)(x+y)','(2x+3y)(2a−3b)','(2a−3b)(2x+3y)','2(2ax−3bx)+3(2ay−3by)'], ans:1, hint:'Grupuj: (4ax−6bx)+(6ay−9by) = 2x(2a−3b)+3y(2a−3b) = (2a−3b)(2x+3y).' },
  { q:'Który rozkład jest BŁĘDNY?', eq:'12x²y − 8xy²', opts:['4xy(3x−2y)','2xy(6x−4y)','4x(3xy−2y²)','4xy(3x−2y) i 2xy(6x−4y) to oba poprawne, różnią się stopniem wyłączenia'], ans:2, hint:'C: 4x(3xy−2y²) → sprawdź: 4x·3xy=12x²y ✓, 4x·2y²=8xy² ✓. Ale C brakuje czynnika y przy wyłączeniu — y nie zostało wyłączone. Poprawne wyłączenie NWC to A.' },
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
      <button onClick={()=>mode&&setKi(0)} disabled={!mode} style={btn({width:'100%',textAlign:'center',background:mode?C.accent:'transparent',color:mode?'#000':C.dim,border:mode?'none':`1px solid ${C.border}`,fontWeight:mode?800:400,padding:'14px',cursor:mode?'pointer':'not-allowed'})}>Zacznij →</button>
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
      {q.eq && <div style={{ ...mono, fontSize:20, color:C.yellow, background:'#0A0F1E', borderRadius:10, padding:'14px 20px', display:'inline-block', marginBottom:20, border:`1px solid rgba(251,191,36,0.2)` }}>{q.eq}</div>}
      {mode==='trening' && !done && <div onClick={()=>setHint(h=>!h)} style={{ background:C.yellow+'11',border:`1px solid ${C.yellow}33`,borderRadius:8,padding:'9px 14px',marginBottom:12,fontSize:12,color:C.yellow,cursor:'pointer' }}>💡 {hint?q.hint:'Kliknij po wskazówkę'}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
        {q.opts.map((o,i) => {
          let bg='transparent',border=C.border,color=C.white
          if(done){if(i===q.ans){bg=C.green+'22';border=C.green;color=C.green}else if(i===sel){bg=C.accent+'22';border=C.accent;color=C.accent}}
          return <div key={i} onClick={()=>{if(done)return;setSel(i);setDone(true);setHint(false);setRes(p=>[...p,i===q.ans])}}
            style={{ border:`1px solid ${border}`,borderRadius:10,padding:'12px 14px',cursor:done?'default':'pointer',fontSize:13,fontWeight:500,textAlign:'center',background:bg,color,transition:'all .15s' }}>{o}</div>
        })}
      </div>
      {done && <div style={{ display:'flex',justifyContent:'flex-end' }}><button onClick={()=>{if(ki<KQ.length-1){setKi(i=>i+1);setSel(null);setDone(false);setHint(false)}else setKi(KQ.length)}} style={btn({background:C.accent,border:'none',color:'#fff',fontWeight:700})}>{ki<KQ.length-1?'Dalej →':'Wynik →'}</button></div>}
    </div>
  )
}

// ── ZADANIA CKE ───────────────────────────────────────────────────────────────
const CKE_Z = [
  {
    rok:'CKE 2023', nr:13, pkt:2,
    tresc:'Uprość wyrażenie algebraiczne, podając warunki dla których jest ono określone:\n(3x³ − 6x²) / (x² − 2x)',
    wsk:'Wyłącz przed nawias licznik i mianownik osobno. Skróć wspólne czynniki. Warunek: mianownik ≠ 0.',
    rozw:[
      'Licznik: 3x³ − 6x² = 3x²(x − 2)',
      'Mianownik: x² − 2x = x(x − 2)',
      'Ułamek: [3x²(x−2)] / [x(x−2)]',
      'Skracamy x(x−2): 3x²/x = 3x',
      'Warunek: x ≠ 0 i x ≠ 2 (mianownik ≠ 0)',
    ],
    odp:'3x, dla x ∈ ℝ \\ {0, 2}',
    schemat:'Za poprawne wyłączenie w liczniku i mianowniku: 1 pkt. Za wynik 3x z warunkiem: 1 pkt.',
  },
  {
    rok:'CKE 2022', nr:15, pkt:3,
    tresc:'Rozwiąż równanie: x³ = 4x. Podaj wszystkie rozwiązania rzeczywiste.',
    wsk:'Przenieś 4x na lewą stronę. Wyłącz x, następnie rozłóż wyrazy w nawiasie jako różnicę kwadratów.',
    rozw:[
      'Przenosimy: x³ − 4x = 0',
      'Wyłączamy x: x(x² − 4) = 0',
      'Różnica kwadratów: x(x+2)(x−2) = 0',
      'Właściwość zera: x = 0, lub x+2=0, lub x−2=0',
      'x = 0   lub   x = −2   lub   x = 2',
    ],
    odp:'x = −2, x = 0, x = 2',
    schemat:'Za przeniesienie i wyłączenie x: 1 pkt. Za rozłożenie różnicy kwadratów: 1 pkt. Za wszystkie trzy rozwiązania: 1 pkt.',
  },
  {
    rok:'CKE 2024', nr:17, pkt:2,
    tresc:'Udowodnij, że wyrażenie n² − n jest podzielne przez 2 dla każdej liczby naturalnej n.',
    wsk:'Wyłącz n przed nawias. Zastanów się co to oznacza: n i (n−1) to dwie kolejne liczby naturalne.',
    rozw:[
      'Wyłączamy n: n² − n = n(n − 1)',
      'n i (n−1) to dwie kolejne liczby całkowite',
      'W każdej parze kolejnych liczb całkowitych jedna jest parzysta',
      'Iloczyn dwóch kolejnych liczb zawsze jest parzysty (podzielny przez 2)',
      'Zatem n(n−1) jest podzielne przez 2 dla każdego n ∈ ℕ. ✓',
    ],
    odp:'n² − n = n(n−1), iloczyn dwóch kolejnych liczb — zawsze parzysty.',
    schemat:'Za poprawne wyłączenie n: 1 pkt. Za uzasadnienie parzystości iloczynu kolejnych liczb: 1 pkt.',
  },
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
              <div style={{ background:C.green+'15', borderRadius:8, padding:'10px 14px', marginTop:12, fontSize:14, color:C.green, fontWeight:700, ...mono }}>Odpowiedź: {z.odp}</div>
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
        <div style={{ fontSize:13, color:C.dim }}>Wyłączanie przed nawias</div>
      </div>
      <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px', marginBottom:20, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:16 }}>Pięć zasad które musisz mieć automatycznie</div>
        {[
          ['NWC = NWD liczb + najniższe potęgi wspólnych zmiennych', 'Zmienna musi być w KAŻDYM wyrazie. Bierzemy NAJNIŻSZĄ potęgę.'],
          ['Sprawdzenie przez rozwinięcie', 'Po wyłączeniu zawsze rozwijaj nawias i porównaj z wejściem. Obowiązkowe na CKE.'],
          ['Ujemny czynnik odwraca znaki', 'Przy −a(b−c+d): wewnątrz nawiasu wszystkie znaki są przeciwne do tych w wejściu.'],
          ['Nie dziel przez zmienną', 'x²−4x=0 → x(x−4)=0, nie "dzielimy przez x". Tracisz rozwiązanie x=0.'],
          ['Grupowanie gdy brak wspólnego NWC', 'Podziel wyrazy na pary, wyłącz z każdej, szukaj wspólnego nawiasu.'],
        ].map(([t,d],i) => (
          <div key={i} style={{ marginBottom:i<4?12:0, paddingBottom:i<4?12:0, borderBottom:i<4?`1px solid ${C.border}`:'none' }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:3 }}>{i+1}. {t}</div>
            <div style={{ fontSize:12, color:'#94A3B8' }}>{d}</div>
          </div>
        ))}
      </div>
      <Alert type="info">
        Na CKE wyłączanie przed nawias łączy się ze wzorami skróconego mnożenia (różnica kwadratów), upraszczaniem ułamków i rozwiązywaniem równań. Zawsze myśl o dalszym rozkładzie po wyłączeniu NWC.
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
    {n:1,title:'Zmienne i wyrażenia',         href:'/kurs/zmienne-wyrazenia',      status:'done'},
    {n:2,title:'Upraszczanie wyrażeń',         href:'/kurs/wyrazenia-algebraiczne', status:'done'},
    {n:3,title:'Wzory skróconego mnożenia',    href:'/kurs/wzory-skroconego',       status:'done'},
    {n:4,title:'Wyłączanie przed nawias',      href:'/kurs/wylaczanie-przed-nawias',status:'active'},
    {n:5,title:'Wielomiany',                   href:'#',                            status:'locked'},
    {n:6,title:'Sprawdzian działu',            href:'#',                            status:'locked',isTest:true},
  ],
}
const LEKCJA = { n:4, total:5, slug:'wylaczanie-przed-nawias', title:'Wyłączanie czynnika przed nawias', czas:'30 min', poziom:'Poziom: średni–zaawansowany', cke:true }
const XP_MAP = { teoria:90, quiz:70, fiszki:80, kartkowka:110, cke:80, raport:40 }
const MAX_FAQ = [
  { q:'jak znaleźć nwc największy wspólny czynnik wielomianu', a:'Krok 1: NWD współczynników liczbowych wszystkich wyrazów. Krok 2: każda zmienna która występuje w KAŻDYM wyrazie, z NAJNIŻSZĄ swoją potęgą. Wymnóż jedno i drugie.' },
  { q:'jak wyłączyć przed nawias ujemna liczba', a:'Dzielimy każdy wyraz przez wyłączany czynnik (z minusem). Znaki wewnątrz nawiasu odwracają się. Sprawdź przez rozwinięcie.' },
  { q:'jak rozwiązać równanie kwadratowe faktoryzacją', a:'Przenieś wszystko na lewą stronę (= 0). Wyłącz x lub NWC. Zastosuj właściwość zera: iloczyn = 0 → jeden z czynników = 0. Nigdy nie dziel przez zmienną!' },
  { q:'kiedy zastosować metodę grupowania', a:'Gdy wielomian ma cztery (lub więcej) wyrazy i nie ma jednego NWC dla wszystkich. Podziel na pary, wyłącz z każdej, szukaj wspólnego nawiasu.' },
  { q:'jak uprościć ułamek algebraiczny', a:'Wyłącz przed nawias licznik i mianownik osobno, następnie skróć wspólne czynniki. Zawsze podawaj warunki dziedziny (co ≠ 0 w mianowniku).' },
]

export default function WylaczaniePrzedNawiasLesson() {
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
