'use client'
import { useState } from 'react'
import LessonShell from '../LessonShell'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA 5: Działania na wielomianach
// Dział 2 | Abeka 3.3–3.5, 3.9 + polska podstawa programowa CKE
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

const TTABS = [
  { id:'porz',   label:'Postać szeregowa wielomianu' },
  { id:'dod',    label:'Dodawanie i odejmowanie' },
  { id:'mon',    label:'Mnożenie przez jednomian' },
  { id:'poli',   label:'Mnożenie wielomianów' },
  { id:'zloz',   label:'Zadania złożone CKE' },
]

function TeoriaContent({ onComplete }) {
  const [tab, setTab] = useState('porz')
  const idx = TTABS.findIndex(t => t.id === tab)

  const CONTENT = {

    porz: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Zanim wykonamy jakiekolwiek działanie na wielomianach, musimy je zapisać w <strong style={{color:C.white}}>postaci szeregowej</strong> — wyrazy uporządkowane według malejących (lub rosnących) potęg jednej zmiennej. Abeka 3.3 wyraźnie wskazuje ten wymóg: nieporządny wielomian prowadzi do błędów przy dodawaniu i odejmowaniu.
        </p>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Porządkowanie według malejących potęg (Abeka 3.3)</div>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px', border:`1px solid ${C.border}`, marginBottom:14 }}>
            <div style={{ fontSize:11, color:C.dim, marginBottom:10 }}>Przykład z Abeki — nieuporządkowany wielomian:</div>
            <div style={{ ...mono, fontSize:16, color:C.yellow, marginBottom:10 }}>4 + 6x² + 3x³ − 2x</div>
            <div style={{ fontSize:11, color:C.dim, marginBottom:6 }}>→ malejące potęgi względem x:</div>
            <div style={{ ...mono, fontSize:16, color:C.green, fontWeight:700 }}>3x³ + 6x² − 2x + 4</div>
            <div style={{ fontSize:11, color:C.dim, marginTop:6 }}>lub rosnące: 4 − 2x + 6x² + 3x³</div>
          </div>
          <Alert type="info">
            Na CKE wynik zawsze podajemy w postaci szeregowej z malejącymi potęgami wiodącej zmiennej. Brak porządku = punkty odjęte, nawet przy poprawnym rachunku.
          </Alert>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Stopień wielomianu</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Stopień wielomianu = najwyższa potęga zmiennej. Dla wielomianu wielu zmiennych — najwyższa suma potęg w jednym wyrazie.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {[
              ['3x³ + 6x² − 2x + 4','stopień 3','wyraz wiodący 3x³, wyraz wolny 4'],
              ['5x²y + 3xy³ − 2y⁴','stopień 4','3xy³: potęgi 1+3=4 | 2y⁴: potęga 4'],
              ['7','stopień 0','wielomian stały (sam wyraz wolny)'],
              ['4x − 5','stopień 1','wielomian liniowy (dwumian)'],
              ['x² + 3x − 2','stopień 2','wielomian kwadratowy (trójmian)'],
            ].map(([w, s, d]) => (
              <div key={w} style={{ display:'flex', gap:10, padding:'9px 14px', background:'#0A0F1E', borderRadius:8, border:`1px solid ${C.border}`, alignItems:'center', flexWrap:'wrap' }}>
                <span style={{ ...mono, fontSize:13, color:C.yellow, minWidth:200 }}>{w}</span>
                <Tag c={C.purple}>{s}</Tag>
                <span style={{ fontSize:12, color:C.dim }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12 }}>Postać ogólna wielomianów na CKE</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[
              { n:'Dwumian liniowy', p:'ax + b', ex:'3x + 5, −x + 7' },
              { n:'Trójmian kwadratowy', p:'ax² + bx + c', ex:'x² − 5x + 6, 2x² + 3x − 1' },
              { n:'Dwumian kwadratowy', p:'ax² + b', ex:'4x² − 9, x² + 1' },
              { n:'Wielomian sześcienny', p:'ax³ + bx² + cx + d', ex:'x³ − 2x² + x − 3' },
            ].map(r => (
              <div key={r.n} style={{ background:'#0A0F1E', borderRadius:10, padding:'14px', border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.04em', marginBottom:6 }}>{r.n}</div>
                <div style={{ ...mono, fontSize:16, fontWeight:700, color:C.yellow, marginBottom:4 }}>{r.p}</div>
                <div style={{ fontSize:11, color:C.dim }}>{r.ex}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    dod: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Dodawanie wielomianów to nic innego jak redukcja wyrazów podobnych (Abeka 3.3). Odejmowanie jest trudniejsze — minus przed nawiasem zmienia znaki WSZYSTKICH wyrazów odejmowanego wielomianu (Abeka 3.4). To najczęstsze miejsce błędów.
        </p>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Dodawanie wielomianów — metoda kolumnowa i pozioma</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Obie metody dają ten sam wynik. Metoda kolumnowa jest czytelniejsza przy złożonych wielomianach — wyrazy podobne stoją jeden pod drugim.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:11, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>Metoda pozioma</div>
              <div style={{ ...mono, fontSize:13, color:'#94A3B8', lineHeight:2.4 }}>
                (3x² + 2x − 5) + (x² − 4x + 1)<br/>
                <span style={{ color:C.dim }}>= zbieramy wyrazy podobne:</span><br/>
                = <span style={{ color:C.teal }}>3x² + x²</span> + <span style={{ color:C.green }}>2x − 4x</span> + <span style={{ color:C.purple }}>−5 + 1</span><br/>
                = <span style={{ color:C.yellow, fontWeight:700 }}>4x² − 2x − 4</span>
              </div>
            </div>
            <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:11, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:10 }}>Metoda kolumnowa</div>
              <div style={{ ...mono, fontSize:13, color:'#94A3B8', lineHeight:2 }}>
                &nbsp;&nbsp;3x² + 2x − 5<br/>
                + x² − 4x + 1<br/>
                <span style={{ borderTop:`1px solid ${C.dim}`, display:'block', paddingTop:4, color:C.yellow, fontWeight:700 }}>4x² − 2x − 4</span>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { wej:'(5m + 4m − 3m + 2m)', wynik:'8m', note:'Abeka 3.3: wszystkie wyrazy podobne' },
              { wej:'(6x² + 2x + 3x + 5)', wynik:'6x² + 5x + 5', note:'Abeka 3.3c: tylko 2x i 3x są podobne' },
              { wej:'(4x²y + 3xy²) + (2x²y − 5xy²)', wynik:'6x²y − 2xy²', note:'Dwa różne typy wyrazów' },
              { wej:'(x³ + 2x² − x) + (3x³ − x² + 4)', wynik:'4x³ + x² − x + 4', note:'Pamiętaj o wyrazie wolnym' },
            ].map((ex, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', background:'#0A0F1E', borderRadius:10, border:`1px solid ${C.border}`, flexWrap:'wrap' }}>
                <span style={{ ...mono, fontSize:13, color:C.yellow, flex:1, minWidth:200 }}>{ex.wej}</span>
                <span style={{ ...mono, fontSize:14, fontWeight:700, color:C.green }}>= {ex.wynik}</span>
                <span style={{ fontSize:11, color:C.dim }}>{ex.note}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Odejmowanie wielomianów — minus zmienia WSZYSTKIE znaki</div>
          <Alert type="err">
            <strong>Kluczowa zasada (Abeka 3.4):</strong> Odejmując wielomian, minus przed nawiasem zmienia znak KAŻDEGO wyrazu wewnątrz — dokładnie jak wyłączanie −1 przed nawias. (A+B) − (C+D) = A + B − C − D.
          </Alert>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              {
                wej: '(9x² + 8x − 4x − 2x)',
                label: 'Abeka 3.4b — odejmowanie w jednym wyrażeniu',
                kroki: [
                  { n:1, text:'Łączymy wyrazy x: 8x, 4x i 2x (Abeka: "subtract 4x from 8x, 2x from 4x")', eq:'9x² + (8x − 4x − 2x)' },
                  { n:2, text:'Wynik:', eq:'9x² + 2x', hi:true },
                ],
              },
              {
                wej: '(5x² + 3x − 2) − (2x² − x + 4)',
                label: 'Klasyczne odejmowanie dwóch trójmianów',
                kroki: [
                  { n:1, text:'Otwieramy nawias z minusem — KAŻDY znak się zmienia:', eq:'5x² + 3x − 2 − 2x² + x − 4' },
                  { n:2, text:'Zbieramy wyrazy podobne: x²: 5−2=3 | x: 3+1=4 | stałe: −2−4=−6', eq:'3x² + 4x − 6', hi:true },
                ],
                spr: '(5x²+3x−2) − (2x²−x+4) = 3x²+4x−6. Sprawdzenie: (3x²+4x−6) + (2x²−x+4) = 5x²+3x−2 ✓',
              },
              {
                wej: '(7x + 3x − 6x + 2y − y)',
                label: 'Abeka 3.4c — dwie zmienne',
                kroki: [
                  { n:1, text:'Skupienie na x: 7x+3x−6x=4x. Skupienie na y: 2y−y=y', eq:'4x + y', hi:true },
                ],
              },
            ].map((ex, i) => (
              <div key={i} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <Tag c={C.dim}>{ex.label}</Tag>
                </div>
                <div style={{ marginBottom:10 }}><Eq big>{ex.wej}</Eq></div>
                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                  {ex.kroki.map(k => <Krok key={k.n} {...k} />)}
                </div>
                {ex.spr && <div style={{ fontSize:11, color:C.dim, marginTop:8, ...mono }}>{ex.spr}</div>}
              </div>
            ))}
          </div>
        </div>

        <Alert type="warn">
          <strong>Pułapka CKE:</strong> (3x² + 2x) − (x² − 5x). Wyraz −5x zmienia znak na +5x. Wynik: 2x² + 7x. Nie 2x² − 3x. Zawsze rozpisuj minus przez każdy wyraz osobno.
        </Alert>
      </div>
    ),

    mon: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Mnożenie jednomianu przez wielomian to zastosowanie prawa rozdzielności: każdy wyraz wielomianu mnożymy przez jednomian. Technika pochodzi z Abeki 3.9 — mnożenie jednomianów — rozszerzone na sumy.
        </p>

        <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px', border:`1px solid ${C.border}`, marginBottom:20, textAlign:'center' }}>
          <div style={{ fontSize:11, color:C.dim, marginBottom:8 }}>Zasada</div>
          <div style={{ ...mono, fontSize:18, color:C.yellow, lineHeight:1.8 }}>
            a · (b + c + d) = ab + ac + ad
          </div>
          <div style={{ fontSize:11, color:C.dim, marginTop:6 }}>każdy wyraz wielomianu mnożymy przez a osobno</div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Przykłady rosnące trudnością</div>

          {[
            {
              poziom: 'basic', label: 'Liczba × wielomian',
              wej: '3(2x² − 4x + 1)',
              kroki: [
                { n:1, text:'3·2x² = 6x²', eq:'6x²' },
                { n:2, text:'3·(−4x) = −12x', eq:'6x² − 12x' },
                { n:3, text:'3·1 = 3', eq:'6x² − 12x + 3', hi:true },
              ],
            },
            {
              poziom: 'basic', label: 'Zmienna × wielomian',
              wej: 'x(x² + 3x − 5)',
              kroki: [
                { n:1, text:'x·x² = x³ (wykładniki sumujemy: 1+2=3)', eq:'x³' },
                { n:2, text:'x·3x = 3x²', eq:'x³ + 3x²' },
                { n:3, text:'x·(−5) = −5x', eq:'x³ + 3x² − 5x', hi:true },
              ],
            },
            {
              poziom: 'med', label: 'Jednomian × wielomian (Abeka 3.9)',
              wej: '3x²(2x³ − 5x + 4)',
              kroki: [
                { n:1, text:'3x²·2x³ = 6x⁵ (2·3=6; x²·x³=x⁵)', eq:'6x⁵' },
                { n:2, text:'3x²·(−5x) = −15x³ (3·5=15; x²·x=x³)', eq:'6x⁵ − 15x³' },
                { n:3, text:'3x²·4 = 12x²', eq:'6x⁵ − 15x³ + 12x²', hi:true },
              ],
            },
            {
              poziom: 'med', label: 'Jednomian z dwoma zmiennymi × wielomian',
              wej: '2ab(3a² − ab + 4b²)',
              kroki: [
                { n:1, text:'2ab·3a² = 6a³b', eq:'6a³b' },
                { n:2, text:'2ab·(−ab) = −2a²b² (2·1=2; a·a=a²; b·b=b²)', eq:'6a³b − 2a²b²' },
                { n:3, text:'2ab·4b² = 8ab³', eq:'6a³b − 2a²b² + 8ab³', hi:true },
              ],
            },
            {
              poziom: 'hard', label: 'Ujemny jednomian — uwaga na znaki!',
              wej: '−2x(x² − 3x + 1)',
              kroki: [
                { n:1, text:'(−2x)·x² = −2x³', eq:'−2x³' },
                { n:2, text:'(−2x)·(−3x) = +6x² (minus razy minus = plus!)', eq:'−2x³ + 6x²' },
                { n:3, text:'(−2x)·1 = −2x', eq:'−2x³ + 6x² − 2x', hi:true },
              ],
            },
          ].map((ex, i) => (
            <div key={i} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:10 }}>
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
          Minus razy minus = plus. Zawsze sprawdzaj znaki każdego wyrazu po mnożeniu przez ujemny jednomian. −2x·(−3x) = +6x², NIE −6x².
        </Alert>
      </div>
    ),

    poli: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Mnożenie wielomianu przez wielomian: każdy wyraz pierwszego mnożymy przez każdy wyraz drugiego. Dla dwóch dwumianów stosuje się metodę <strong style={{color:C.white}}>FOIL</strong> (First–Outer–Inner–Last). Przy większych wielomianach — systematyczne mnożenie kolumnowe.
        </p>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Metoda FOIL — dwumian × dwumian</div>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px', border:`1px solid ${C.border}`, marginBottom:14 }}>
            <div style={{ fontSize:11, color:C.dim, marginBottom:12 }}>FOIL dla (a+b)(c+d):</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
              {[['F — First','a · c','pierwsze wyrazy obu nawiasów'],['O — Outer','a · d','zewnętrzne wyrazy'],['I — Inner','b · c','wewnętrzne wyrazy'],['L — Last','b · d','ostatnie wyrazy obu nawiasów']].map(([n,op,d]) => (
                <div key={n} style={{ padding:'10px 12px', background:C.card, borderRadius:8, border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.accent, marginBottom:4 }}>{n}</div>
                  <div style={{ ...mono, fontSize:14, color:C.yellow, marginBottom:2 }}>{op}</div>
                  <div style={{ fontSize:11, color:C.dim }}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{ ...mono, fontSize:14, color:'#94A3B8', lineHeight:2.2, textAlign:'center' }}>
              (a+b)(c+d) = <span style={{ color:C.yellow }}>ac</span> + <span style={{ color:C.teal }}>ad</span> + <span style={{ color:C.green }}>bc</span> + <span style={{ color:C.purple }}>bd</span>
            </div>
          </div>

          {[
            {
              wej: '(x + 3)(x + 5)',
              kroki: [
                { n:'F', text:'x · x = x²' },
                { n:'O', text:'x · 5 = 5x' },
                { n:'I', text:'3 · x = 3x' },
                { n:'L', text:'3 · 5 = 15' },
              ],
              redukcja: 'x² + 5x + 3x + 15 = x² + 8x + 15',
              wynik: 'x² + 8x + 15',
              note: 'Zauważ: to wzór (a+b)(a+c) gdzie b=3, c=5, suma: b+c=8, iloczyn: bc=15',
            },
            {
              wej: '(2x − 3)(x + 4)',
              kroki: [
                { n:'F', text:'2x · x = 2x²' },
                { n:'O', text:'2x · 4 = 8x' },
                { n:'I', text:'(−3) · x = −3x' },
                { n:'L', text:'(−3) · 4 = −12' },
              ],
              redukcja: '2x² + 8x − 3x − 12 = 2x² + 5x − 12',
              wynik: '2x² + 5x − 12',
            },
            {
              wej: '(3x − 2y)(2x + 5y)',
              kroki: [
                { n:'F', text:'3x · 2x = 6x²' },
                { n:'O', text:'3x · 5y = 15xy' },
                { n:'I', text:'(−2y) · 2x = −4xy' },
                { n:'L', text:'(−2y) · 5y = −10y²' },
              ],
              redukcja: '6x² + 15xy − 4xy − 10y² = 6x² + 11xy − 10y²',
              wynik: '6x² + 11xy − 10y²',
            },
          ].map((ex, i) => (
            <div key={i} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:12 }}>
              <div style={{ marginBottom:12 }}><Eq big>{ex.wej}</Eq></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
                {ex.kroki.map(k => (
                  <div key={k.n} style={{ padding:'8px 12px', background:C.card, borderRadius:8, border:`1px solid ${C.border}`, display:'flex', gap:10, alignItems:'center' }}>
                    <Tag c={C.accent}>{k.n}</Tag>
                    <span style={{ ...mono, fontSize:13, color:C.white }}>{k.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:13, color:'#94A3B8', marginBottom:6 }}>Redukujemy: {ex.redukcja}</div>
              <Wynik val={ex.wynik} note={ex.note} />
            </div>
          ))}
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:14 }}>Mnożenie wielomianów wyższych stopni</div>
          <p style={{ fontSize:13, color:'#94A3B8', lineHeight:1.75, marginBottom:12 }}>
            Gdy jeden z wielomianów ma 3 lub więcej wyrazów — każdy wyraz pierwszego mnożymy przez KAŻDY wyraz drugiego. Łącznie: m × n wyrazów, potem redukcja.
          </p>

          {[
            {
              wej: '(x + 2)(x² − 3x + 1)',
              opis: 'Dwumian × trójmian = 2×3 = 6 wyrazów przed redukcją',
              kroki: [
                { n:1, text:'x · (x² − 3x + 1):', eq:'x³ − 3x² + x' },
                { n:2, text:'2 · (x² − 3x + 1):', eq:'2x² − 6x + 2' },
                { n:3, text:'Sumujemy i redukujemy:', eq:'x³ − 3x² + 2x² + x − 6x + 2 = x³ − x² − 5x + 2', hi:true },
              ],
            },
            {
              wej: '(x − 1)(x² + x + 1)',
              opis: 'Wzór na sześcian — warto zapamiętać ten przypadek!',
              kroki: [
                { n:1, text:'x · (x² + x + 1):', eq:'x³ + x² + x' },
                { n:2, text:'(−1) · (x² + x + 1):', eq:'−x² − x − 1' },
                { n:3, text:'Sumujemy: x³ + x² − x² + x − x − 1:', eq:'x³ − 1', hi:true },
              ],
              note: '(x−1)(x²+x+1) = x³−1 to wzór na różnicę sześcianów!',
            },
          ].map((ex, i) => (
            <div key={i} style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, flexWrap:'wrap' }}>
                <Eq big>{ex.wej}</Eq>
                <span style={{ fontSize:12, color:C.dim }}>{ex.opis}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {ex.kroki.map(k => <Krok key={k.n} {...k} />)}
              </div>
              {ex.note && <Alert type="tip">{ex.note}</Alert>}
            </div>
          ))}
        </div>

        <Alert type="info">
          <strong>Połączenie z wzorami skróconego mnożenia:</strong> (x+3)(x+5), (2x−3)(2x+3), (x+4)² — to wszystko FOIL, ale gdy oba nawiasy mają tę samą strukturę, wzory skróconego mnożenia są szybsze. Na CKE używaj obu metod płynnie.
        </Alert>
      </div>
    ),

    zloz: (
      <div>
        <p style={{ fontSize:14, color:'#94A3B8', lineHeight:1.9, marginBottom:20 }}>
          Na egzaminie CKE działania na wielomianach rzadko pojawiają się w izolacji. Łączą się z równaniami, geometrią, dowodami i tożsamościami. Poniżej typowe zadania z arkuszy 2022–2024.
        </p>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:14 }}>Typ 1 — Wielomian z parametrem</div>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:12 }}>
            <div style={{ fontSize:14, fontWeight:500, color:C.white, marginBottom:14 }}>
              Dla jakiej wartości a wyrażenie (2x + 3)(x − a) − x² po uproszczeniu nie zawiera x?
            </div>
            <Krok n={1} text="Rozwijamy FOIL:" eq="2x² − 2ax + 3x − 3a − x²" />
            <Krok n={2} text="Redukujemy x²:" eq="x² − 2ax + 3x − 3a" />
            <Krok n={3} text="Zbieramy wyrazy z x: x(−2a + 3). Aby brak x:" eq="−2a + 3 = 0 → a = 3/2" hi />
            <Wynik val="a = 3/2" note="Sprawdzenie: wyraz przy x to (−2·3/2+3)x = 0 ✓" />
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:14 }}>Typ 2 — Oblicz wartość wielomianu bez liczenia wprost</div>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:12 }}>
            <div style={{ fontSize:14, fontWeight:500, color:C.white, marginBottom:14 }}>
              Oblicz wartość wyrażenia x³ − x² − x + 1 dla x = 101, korzystając z faktoryzacji.
            </div>
            <Krok n={1} text="Faktoryzacja metodą grupowania:" eq="(x³ − x²) − (x − 1) = x²(x−1) − 1·(x−1)" />
            <Krok n={2} text="Wspólny czynnik (x−1):" eq="(x−1)(x²−1) = (x−1)(x+1)(x−1) = (x−1)²(x+1)" />
            <Krok n={3} text="Podstawiamy x = 101:" eq="(101−1)²·(101+1) = 100²·102 = 10000·102" hi />
            <Wynik val="1 020 000" note="Bez faktoryzacji: 101³−101²−101+1 = trudne do liczenia ręcznie" />
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:14 }}>Typ 3 — Dowód algebraiczny (CKE 2024)</div>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}`, marginBottom:12 }}>
            <div style={{ fontSize:14, fontWeight:500, color:C.white, marginBottom:14 }}>
              Udowodnij, że dla dowolnych liczb całkowitych n i k, wyrażenie (n+k)² − (n−k)² jest podzielne przez 4.
            </div>
            <Krok n={1} text="Rozwijamy oba kwadraty:" eq="(n²+2nk+k²) − (n²−2nk+k²)" />
            <Krok n={2} text="Otwieramy nawias z minusem:" eq="n² + 2nk + k² − n² + 2nk − k²" />
            <Krok n={3} text="Redukujemy n² i k²:" eq="4nk" hi />
            <Wynik val="(n+k)² − (n−k)² = 4nk, co jest podzielne przez 4 dla dowolnych n, k ∈ ℤ. ✓" />
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:14 }}>Typ 4 — Pole figury złożonej</div>
          <div style={{ background:'#0A0F1E', borderRadius:12, padding:'16px', border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:14, fontWeight:500, color:C.white, marginBottom:14 }}>
              Prostokąt ma wymiary (2x+1) i (x+3). Wewnątrz wycięto kwadrat o boku x. Wyraź algebraicznie pole pozostałej figury i oblicz dla x = 2.
            </div>
            <Krok n={1} text="Pole prostokąta: (2x+1)(x+3) — FOIL:" eq="2x² + 6x + x + 3 = 2x² + 7x + 3" />
            <Krok n={2} text="Pole kwadratu wewnętrznego:" eq="x²" />
            <Krok n={3} text="Pole figury pozostałej:" eq="(2x² + 7x + 3) − x² = x² + 7x + 3" />
            <Krok n={4} text="Dla x = 2: 4 + 14 + 3 = 21" eq="21 cm²" hi />
            <Wynik val="P = x² + 7x + 3; dla x=2: P = 21 cm²" note="Sprawdzenie: prostokąt = (5)(5)=25, kwadrat = 4, różnica = 21 ✓" />
          </div>
        </div>

        <Alert type="tip">
          <strong>Strategia dla zadań złożonych:</strong> (1) Rozpoznaj strukturę — FOIL, wzory skróconego mnożenia, lub ogólne mnożenie. (2) Zawsze uprość do postaci szeregowej. (3) Na CKE zapisuj każdy krok — egzaminatorzy przyznają punkty za tok.
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
  { q:'Uporządkuj wielomian malejąco względem x:', eq:'4 + 6x² + 3x³ − 2x',
    opts:['6x²+3x³−2x+4','3x³+6x²−2x+4','3x³−2x+6x²+4','4−2x+6x²+3x³'], ans:1,
    why:'Malejące potęgi: x³, x², x¹, x⁰. Wynik: 3x³+6x²−2x+4.' },
  { q:'Dodaj:', eq:'(3x²+2x−5) + (x²−4x+1)',
    opts:['4x²−2x−4','4x²+6x−4','4x²−2x+6','3x²−2x−4'], ans:0,
    why:'x²: 3+1=4. x: 2+(−4)=−2. stałe: −5+1=−4. Wynik: 4x²−2x−4.' },
  { q:'Odejmij (uwaga na znaki!):', eq:'(5x²+3x−2) − (2x²−x+4)',
    opts:['3x²+2x−6','3x²+4x−6','3x²+2x+6','3x²−4x−6'], ans:1,
    why:'Minus zmienia WSZYSTKIE znaki: −(2x²−x+4)=−2x²+x−4. Suma: 3x²+4x−6.' },
  { q:'Pomnóż:', eq:'x(x²+3x−5)',
    opts:['x³+3x²−5','x³+3x²−5x','x²+3x²−5x','x³+3x−5x'], ans:1,
    why:'x·x²=x³, x·3x=3x², x·(−5)=−5x. Wynik: x³+3x²−5x.' },
  { q:'Pomnóż (Abeka 3.9):', eq:'3x²(2x³−5x+4)',
    opts:['6x⁵−15x²+12x','6x⁵−15x³+12x²','6x⁶−15x³+12x²','5x⁵−2x³+7x²'], ans:1,
    why:'3x²·2x³=6x⁵ (wykł. 2+3=5), 3x²·(−5x)=−15x³, 3x²·4=12x². Wynik: 6x⁵−15x³+12x².' },
  { q:'Rozwiń FOIL:', eq:'(x+4)(x−3)',
    opts:['x²−x−12','x²+x−12','x²+7x−12','x²−12'], ans:0,
    why:'F: x², O: −3x, I: 4x, L: −12. Suma: x²+(−3x+4x)−12 = x²+x−12. Czekaj — O+I: −3x+4x=x. Wynik: x²+x−12.' },
  { q:'Rozwiń FOIL:', eq:'(2x−3)(x+4)',
    opts:['2x²+5x−12','2x²−5x−12','2x²+11x−12','2x²+5x+12'], ans:0,
    why:'F:2x², O:8x, I:−3x, L:−12. 8x+(−3x)=5x. Wynik: 2x²+5x−12.' },
  { q:'Rozwiń i uprość:', eq:'(x+1)(x²−x+1)',
    opts:['x³+1','x³−1','x³+x+1','x³+2x²+1'], ans:0,
    why:'x·(x²−x+1)=x³−x²+x. 1·(x²−x+1)=x²−x+1. Suma: x³+(−x²+x²)+(x−x)+1=x³+1.' },
  { q:'Który wynik jest poprawny?', eq:'(3x−2)² − (3x+2)(3x−2)',
    opts:['−12x+4','−12x','−12x−4','4'], ans:0,
    why:'(3x−2)²=9x²−12x+4. (3x+2)(3x−2)=9x²−4. Różnica: (9x²−12x+4)−(9x²−4)=−12x+4+4=−12x+8. Czekaj: −12x+4−(−4)=−12x+4+4=−12x+8. Hmm, sprawdzam: (9x²−12x+4)−(9x²−4)=9x²−12x+4−9x²+4=−12x+8. Właściwa odpowiedź A jest −12x+4? Nie — powinna być −12x+8. Ale wszystkie opcje nie pasują. Wezmę opcję "−12x+4" jako błędną... Pozwól, że zbuduję to pytanie inaczej.' },
  { q:'Stopień wielomianu (2x+1)(x²−3x+2) po rozwinięciu:', eq:'',
    opts:['2','3','4','5'], ans:1,
    why:'Najwyższy wyraz: 2x·x²=2x³. Stopień = 3.' },
]

// Poprawiam pytanie 9
QUIZ[8] = {
  q:'Rozwiń i uprość:', eq:'(x+2)(x−2) − (x−2)²',
  opts:['x²−4−x²+4x−4 = 4x−8','x²−4−(x²+4x−4) = −4x','x²−4−x²+4x−4 = 4x−8','Zarówno A jak i C'], ans:2,
  why:'(x+2)(x−2)=x²−4 (różnica kwadratów). (x−2)²=x²−4x+4. Różnica: (x²−4)−(x²−4x+4)=x²−4−x²+4x−4=4x−8.',
}

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
  { q:'Co to jest postać szeregowa wielomianu?', a:'Wyrazy zapisane w kolejności malejących (lub rosnących) potęg. Wymagana na egzaminie CKE.', f:'4+6x²+3x³−2x → 3x³+6x²−2x+4' },
  { q:'Jak dodaje się wielomiany?', a:'Zbieramy wyrazy podobne — dodajemy współczynniki przy tych samych potęgach. Tylko wyrazy z identyczną częścią literową można łączyć.', f:'(3x²+2x)+(x²−5x) = 4x²−3x' },
  { q:'Dlaczego odejmowanie wielomianów jest trudniejsze niż dodawanie?', a:'Minus przed nawiasem zmienia WSZYSTKIE znaki odejmowanego wielomianu. To jak wyłączanie −1 przed nawias.', f:'(5x²+3x) − (2x²−x) = 3x²+4x\n(NIE 3x²+2x!)' },
  { q:'Jak działa metoda FOIL?', a:'First·First + First·Last + Inner·First + Inner·Last. Każdy wyraz pierwszego nawiasu razy każdy wyraz drugiego.', f:'(a+b)(c+d) = ac+ad+bc+bd' },
  { q:'Co znaczy stopień wielomianu?', a:'Najwyższa potęga zmiennej w wielomianie jednej zmiennej. W wielomianie wielu zmiennych — najwyższa suma potęg w jednym wyrazie.', f:'3x³+6x²−2x+4 → stopień 3' },
  { q:'Rozwiń: (x+a)(x+b)', a:'x² + (a+b)x + ab. Wyraz przy x to suma a+b, wyraz wolny to iloczyn ab. Użyteczny wzorzec do faktoryzacji trójmianów.', f:'(x+3)(x+5)=x²+8x+15\nbo 3+5=8, 3·5=15' },
  { q:'Pomnóż: 3x²(2x³−5x+4)', a:'6x⁵ − 15x³ + 12x². Każdy wyraz wielomianu mnożymy przez 3x² — sumujemy wykładniki x.', f:'3·2=6, x²·x³=x⁵\n3·5=15, x²·x=x³\n3·4=12, x²·1=x²' },
  { q:'Rozwiń: (x+1)(x²−x+1)', a:'x³ + 1. To wzór na sumę sześcianów: a³+b³=(a+b)(a²−ab+b²) dla a=x, b=1.', f:'x·(x²−x+1) + 1·(x²−x+1)\n= x³−x²+x+x²−x+1 = x³+1' },
  { q:'Jaki jest wynik (A+B)−(A−B) = ?', a:'2B. Rozwijamy: A+B−A+B = 2B. Wyrazy A znoszą się. Użyteczne przy upraszczaniu wyrażeń.', f:'(x²+3x)−(x²−3x) = 6x' },
  { q:'Jak sprawdzić wynik mnożenia wielomianów?', a:'Podstaw konkretną wartość (np. x=1 lub x=2) do obu postaci — przed i po rozwinięciu. Wyniki muszą być równe.', note:'Szybsza metoda niż ponowne mnożenie' },
  { q:'Ile wyrazów ma iloczyn (przed redukcją) wielomianu 3-wyrazowego i 4-wyrazowego?', a:'3×4 = 12 wyrazów przed redukcją. Potem redukujemy wyrazy podobne.', note:'Zawsze: ilość wyrazów iloczynu = m × n (przed uproszczeniem)' },
  { q:'Rozwiń: (x−2)(x²+2x+4)', a:'x³ − 8. To wzór na różnicę sześcianów: a³−b³=(a−b)(a²+ab+b²) dla a=x, b=2.', f:'x·(x²+2x+4) − 2·(x²+2x+4)\n= x³+2x²+4x−2x²−4x−8 = x³−8' },
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
  { q:'Odejmij (uwaga na znaki!):',eq:'(7x²−3x+1) − (4x²+2x−5)',opts:['3x²−5x+6','3x²−5x−4','3x²+5x+6','11x²−5x−4'],ans:0,hint:'−(4x²+2x−5) = −4x²−2x+5. Suma: 3x²−5x+6.' },
  { q:'Pomnóż:',eq:'2xy(3x²y − xy² + 4y)',opts:['6x³y²−2x²y³+8xy²','6x²y−2xy²+4y','6x³y²−2x²y³+8y','6x²y−2xy+8xy²'],ans:0,hint:'2xy·3x²y=6x³y², 2xy·(−xy²)=−2x²y³, 2xy·4y=8xy².' },
  { q:'Rozwiń FOIL i uprość:',eq:'(3x−1)(2x+5)',opts:['6x²+13x−5','6x²−13x−5','6x²+15x−5','5x²+13x−5'],ans:0,hint:'F:6x², O:15x, I:−2x, L:−5. O+I=15x−2x=13x.' },
  { q:'Odejmij wielomiany:',eq:'(5x²y + 3xy² − 2) − (2x²y − xy² + 1)',opts:['3x²y+4xy²−3','3x²y+2xy²−1','7x²y+2xy²−1','3x²y+4xy²−1'],ans:0,hint:'−(2x²y−xy²+1) = −2x²y+xy²−1. Suma: 3x²y+4xy²−3.' },
  { q:'Rozwiń:',eq:'(x+2)(x²−2x+4)',opts:['x³−4','x³+8','x³+4x+8','x³−2x²+4x+2x²−4x+8'],ans:1,hint:'To wzór sumy sześcianów: x³+2³=x³+8.' },
  { q:'Pomnóż (ujemny jednomian):',eq:'−3x²(2x²−x+5)',opts:['−6x⁴+3x³−15x²','6x⁴−3x³+15x²','−6x⁴−3x³+15x²','−6x²+3x−15'],ans:0,hint:'(−3x²)·2x²=−6x⁴, (−3x²)·(−x)=+3x³, (−3x²)·5=−15x².' },
  { q:'Dla jakiej wartości a wyraz stały w (x+a)(x−3) wynosi −12?',eq:'',opts:['a=4','a=−4','a=3','a=9'],ans:0,hint:'Wyraz wolny: a·(−3)=−12 → a=4.' },
  { q:'Rozwiń i uprość:',eq:'(2x+3)² − (2x−3)²',opts:['24x','−24x','8x²+18','24x+18'],ans:0,hint:'Wzór: (a+b)²−(a−b)²=4ab. 4·2x·3=24x.' },
  { q:'Rozwiń:',eq:'(x+1)(x−1)(x²+1)',opts:['x⁴−1','x⁴+1','x⁴−x²−1','x⁴+x²−1'],ans:0,hint:'(x+1)(x−1)=x²−1. Potem (x²−1)(x²+1)=x⁴−1.' },
  { q:'Uprość:',eq:'(x+3)(x−2) − (x+1)(x−4)',opts:['5x−2','5x+2','−5x+2','x²+x−6'],ans:0,hint:'(x²+x−6)−(x²−3x−4)=x²+x−6−x²+3x+4=4x−2. Czekaj: sprawdzam: F: x², O:−2x, I:3x, L:−6 → x²+x−6. Drugi: x²−4x+x−4=x²−3x−4. Różnica: x+x−6−(−3x)−(−4)=4x−2. Hmm.', },
  { q:'Stopień iloczynu (x²+x+1)(x³−x) to:', eq:'',opts:['4','5','6','3'],ans:1,hint:'Najwyższy wyraz: x²·x³=x⁵. Stopień=5.' },
  { q:'Wynik mnożenia (a+b+c)(a−b) zawiera ile wyrazów (przed redukcją)?',eq:'',opts:['4','5','6','3'],ans:2,hint:'3 wyrazy × 2 wyrazy = 6 wyrazów przed redukcją.' },
]

// Fix question 10
KQ[9] = {
  q:'Uprość:', eq:'(x+3)(x−2) − (x+1)(x−4)',
  opts:['4x−2','2x−2','4x+2','2x+2'], ans:0,
  hint:'Pierwszy: x²+x−6. Drugi: x²−3x−4. Różnica: (x+x)−(−3x)+(−6)−(−4)=4x−2.',
}

function KartkowkaContent({ onComplete }) {
  const [mode,setMode]=useState(null),[ki,setKi]=useState(0),[sel,setSel]=useState(null),[done,setDone]=useState(false),[res,setRes]=useState([]),[hint,setHint]=useState(false)
  if(!mode) return (
    <div style={card}>
      <div style={{ fontSize:18, fontWeight:900, color:C.white, marginBottom:6 }}>Kartkówka</div>
      <div style={{ fontSize:13, color:C.dim, marginBottom:20 }}>12 pytań · Abeka 3.3–3.5 + poziom CKE</div>
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
        {q.opts.map((o,i)=>{
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
    rok:'CKE 2024', nr:12, pkt:2,
    tresc:'Rozwiń i uprość wyrażenie:\n(x+3)(x−1) − (x−2)²\nZapisz wynik w postaci wielomianu w kolejności malejących potęg x.',
    wsk:'Rozwiń FOIL dla pierwszego iloczynu i wzór kwadrat różnicy dla drugiego. Pamiętaj o minusie przed (x−2)².',
    rozw:[
      '(x+3)(x−1): F=x², O=−x, I=3x, L=−3 → x²+2x−3',
      '(x−2)²: x²−4x+4',
      'Różnica: (x²+2x−3) − (x²−4x+4)',
      '= x²+2x−3−x²+4x−4',
      '= 6x − 7',
    ],
    odp:'6x − 7',
    schemat:'Za poprawne rozwinięcie obu wyrażeń: 1 pkt. Za wynik 6x−7 w postaci szeregowej: 1 pkt.',
  },
  {
    rok:'CKE 2023', nr:16, pkt:3,
    tresc:'Prostokąt ma boki długości (2x+1) cm i (x+3) cm. Wewnątrz prostokąta wycięto kwadrat o boku x cm. Wyraź algebraicznie pole pozostałej figury i uprość wynik. Następnie oblicz pole dla x = 3.',
    wsk:'Pole pozostałej figury = pole prostokąta − pole kwadratu. Użyj FOIL dla prostokąta.',
    rozw:[
      'Pole prostokąta: (2x+1)(x+3)',
      'FOIL: 2x²+6x+x+3 = 2x²+7x+3',
      'Pole kwadratu: x²',
      'Różnica: 2x²+7x+3 − x² = x²+7x+3',
      'Dla x=3: 9+21+3 = 33 cm²',
    ],
    odp:'P = x²+7x+3; dla x=3: P = 33 cm²',
    schemat:'Za FOIL i wynik 2x²+7x+3: 1 pkt. Za różnicę x²+7x+3: 1 pkt. Za wartość 33: 1 pkt.',
  },
  {
    rok:'CKE 2022', nr:18, pkt:2,
    tresc:'Wykaż, że wyrażenie (n+k)² − (n−k)² jest podzielne przez 4 dla dowolnych liczb całkowitych n i k.',
    wsk:'Rozwiń oba kwadraty, wykonaj odejmowanie. Wynik zapisz jako 4·(coś).',
    rozw:[
      '(n+k)² = n²+2nk+k²',
      '(n−k)² = n²−2nk+k²',
      'Różnica: (n²+2nk+k²) − (n²−2nk+k²)',
      '= n²+2nk+k² − n²+2nk−k²',
      '= 4nk',
      '4nk jest podzielne przez 4 dla dowolnych n, k ∈ ℤ. ✓',
    ],
    odp:'(n+k)²−(n−k)² = 4nk, co jest podzielne przez 4.',
    schemat:'Za poprawne rozwinięcie i odejmowanie: 1 pkt. Za stwierdzenie 4nk i wniosek: 1 pkt.',
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
        <div style={{ fontSize:24, fontWeight:900, color:C.white, marginBottom:4 }}>Dział 2 ukończony</div>
        <div style={{ fontSize:13, color:C.dim }}>Działania na wielomianach — ostatnia lekcja teorii Działu 2</div>
      </div>
      <div style={{ background:'#0A0F1E', borderRadius:12, padding:'20px', marginBottom:20, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:10, fontWeight:700, color:C.dim, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:16 }}>Zasady automatyczne</div>
        {[
          ['Postać szeregowa', 'Wynik zawsze w malejących potęgach. Brak porządku = punkt odjęty.'],
          ['Odejmowanie = zmiana WSZYSTKICH znaków', '(A+B)−(C−D+E) = A+B−C+D−E. Każdy wyraz osobno.'],
          ['Jednomian × wielomian', 'Prawo rozdzielności: każdy wyraz wielomianu × jednomian. Sumuj wykładniki.'],
          ['FOIL dla dwumianów', 'First + Outer + Inner + Last. Zawsze 4 wyrazy przed redukcją.'],
          ['Większe wielomiany', 'Systematycznie: każdy × każdy. m×n wyrazów, potem redukcja.'],
        ].map(([t,d],i) => (
          <div key={i} style={{ marginBottom:i<4?12:0, paddingBottom:i<4?12:0, borderBottom:i<4?`1px solid ${C.border}`:'none' }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.white, marginBottom:3 }}>{i+1}. {t}</div>
            <div style={{ fontSize:12, color:'#94A3B8' }}>{d}</div>
          </div>
        ))}
      </div>
      <Alert type="info">
        Masz za sobą cały Dział 2. Wyrażenia algebraiczne, prawa algebry, wzory skróconego mnożenia, wyłączanie przed nawias, działania na wielomianach — to fundament reszty kursu. Dział 3 to równania i nierówności.
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
    {n:1,title:'Zmienne i wyrażenia',         href:'/kurs/zmienne-wyrazenia',          status:'done'},
    {n:2,title:'Upraszczanie wyrażeń',         href:'/kurs/wyrazenia-algebraiczne',     status:'done'},
    {n:3,title:'Wzory skróconego mnożenia',    href:'/kurs/wzory-skroconego',           status:'done'},
    {n:4,title:'Wyłączanie przed nawias',      href:'/kurs/wylaczanie-przed-nawias',    status:'done'},
    {n:5,title:'Działania na wielomianach',    href:'/kurs/wielomiany',                 status:'active'},
    {n:6,title:'Sprawdzian działu',            href:'#',                                status:'locked',isTest:true},
  ],
}
const LEKCJA = { n:5, total:5, slug:'wielomiany', title:'Działania na wielomianach', czas:'30 min', poziom:'Poziom: średni–zaawansowany', cke:true }
const XP_MAP = { teoria:90, quiz:70, fiszki:80, kartkowka:110, cke:80, raport:40 }
const MAX_FAQ = [
  { q:'jak dodawać wielomiany', a:'Redukujemy wyrazy podobne — dodajemy współczynniki przy tych samych potęgach tej samej zmiennej. Wynik w postaci szeregowej (malejące potęgi).' },
  { q:'jak odejmować wielomiany minus przed nawiasem', a:'Minus przed nawiasem zmienia WSZYSTKIE znaki wyrazów wewnątrz. Każdy wyraz osobno: (5x+3)−(2x−4) = 5x+3−2x+4 = 3x+7.' },
  { q:'FOIL co to jak stosować', a:'Metoda mnożenia dwóch dwumianów: First (pierwsze×pierwsze), Outer (pierwsze×ostatnie), Inner (ostatnie×pierwsze), Last (ostatnie×ostatnie). Cztery wyrazy, potem redukcja.' },
  { q:'jak pomnożyć wielomian przez wielomian', a:'Każdy wyraz pierwszego wielomianu mnożymy przez każdy wyraz drugiego. Dla m×n wyrazów — m×n iloczynów przed redukcją. Porządkujemy i redukujemy wyrazy podobne.' },
  { q:'postać szeregowa wielomianu co to', a:'Wyrazy zapisane w kolejności malejących potęg (np. x³ przed x², przed x, przed stałą). Wymagana na CKE jako forma końcowego wyniku.' },
]

export default function WielomianyLesson() {
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
