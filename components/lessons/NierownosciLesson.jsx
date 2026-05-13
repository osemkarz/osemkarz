'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ── DANE EGZAMINACYJNE ─────────────────────────────────────────────────────
// Oparty na podstawie programowej MEN 2024 i informatorze CKE 2025
// Egzamin: 20-21 zadań, 30 punktów, 125 minut

const THEORY_TABS = [
  { id: 'def', label: 'Czym jest nierówność' },
  { id: 'solve', label: 'Rozwiązywanie' },
  { id: 'flip', label: '⚠️ Zasada znaku' },
  { id: 'axis', label: 'Oś liczbowa' },
  { id: 'word', label: 'Zadania tekstowe' },
]

const QUIZ = [
  {
    q: 'Rozwiąż nierówność:',
    eq: 'x + 5 > 9',
    opts: ['x > 4', 'x > 14', 'x < 4', 'x > −4'],
    ans: 0,
    concept: 'dodawanie',
    dlaczego: 'Odejmujemy 5 od obu stron: x + 5 − 5 > 9 − 5, więc x > 4. Dodawanie i odejmowanie nie zmienia znaku nierówności — ta zasada jest bezpieczna.',
  },
  {
    q: 'Rozwiąż nierówność:',
    eq: '3x ≤ 12',
    opts: ['x ≤ 36', 'x ≤ 9', 'x ≤ 4', 'x ≥ 4'],
    ans: 2,
    concept: 'mnozenie-plus',
    dlaczego: 'Dzielimy obie strony przez 3 (liczba dodatnia — znak się nie zmienia): x ≤ 12 ÷ 3 = 4. Wynik: x ≤ 4.',
  },
  {
    q: 'Rozwiąż nierówność (uwaga na znak!):',
    eq: '−2x > 8',
    opts: ['x > −4', 'x > 4', 'x < −4', 'x < 4'],
    ans: 2,
    concept: 'mnozenie-minus',
    dlaczego: 'Dzielimy przez −2 — to liczba UJEMNA, więc ODWRACAMY ZNAK! > zamienia się w <. Wynik: x < 8÷(−2) = −4. To najczęstszy błąd na egzaminie!',
  },
  {
    q: 'Które z podanych rozwiązań NIE spełnia nierówności 2x − 1 < 7?',
    eq: '',
    opts: ['x = 0', 'x = 3', 'x = 4', 'x = 2'],
    ans: 2,
    concept: 'sprawdzanie',
    dlaczego: 'Rozwiązanie: 2x < 8, x < 4. Sprawdzamy x = 4: 2·4−1 = 7, a 7 nie jest mniejsze od 7 (musi być ściśle mniejsze). x = 4 NIE spełnia nierówności.',
  },
  {
    q: 'Kacper musi zaoszczędzić co najmniej 80 zł. Ma już 35 zł. Ile jeszcze musi odłożyć?',
    eq: '',
    opts: ['x > 45', 'x ≥ 45', 'x ≤ 45', '35 + x = 80'],
    ans: 1,
    concept: 'zadanie-tekstowe',
    dlaczego: '"Co najmniej 80 zł" oznacza ≥ 80. Nierówność: 35 + x ≥ 80, więc x ≥ 45. Używamy ≥ bo "co najmniej" = "nie mniej niż" = granica należy do rozwiązania.',
  },
]

const FISZKI = [
  {
    q: 'Czym różni się nierówność od równania?',
    a: 'Równanie ma skończoną liczbę rozwiązań. Nierówność ma nieskończenie wiele rozwiązań — cały przedział liczb.',
    formula: 'x = 3 (jedno) vs x > 3 (nieskończenie wiele)',
  },
  {
    q: 'Jakie są 4 rodzaje nierówności i co oznaczają?',
    a: 'Ostra mniejsza, ostra większa, nieostra mniejsza lub równa, nieostra większa lub równa.',
    formula: '< &nbsp; > &nbsp; ≤ &nbsp; ≥',
    note: 'Ostra: granica NIE należy. Nieostra: granica NALEŻY.',
  },
  {
    q: 'Co się dzieje ze znakiem nierówności gdy dodajemy lub odejmujemy?',
    a: 'Nic — znak nierówności NIE zmienia się. To bezpieczna operacja.',
    formula: 'a < b ⟹ a + c < b + c',
    note: 'Działa tak samo jak w równaniach.',
  },
  {
    q: '⚠️ KLUCZOWA ZASADA: mnożenie/dzielenie przez liczbę ujemną',
    a: 'Znak nierówności ODWRACA SIĘ! < staje się >, ≤ staje się ≥ i odwrotnie.',
    formula: 'a < b ⟹ −a > −b',
    note: 'Najczęstszy błąd na egzaminie! Zawsze sprawdzaj czy dzielisz przez ujemną.',
  },
  {
    q: 'Jak zaznaczyć x > 4 na osi liczbowej?',
    a: 'Puste kółko przy 4 (4 nie należy) i strzałka w prawo — w kierunku liczb większych.',
    formula: '———○══════→',
    note: 'Nierówność OSTRA (>) = kółko puste ○',
  },
  {
    q: 'Jak zaznaczyć x ≤ 4 na osi liczbowej?',
    a: 'Pełne kółko przy 4 (4 należy) i strzałka w lewo — w kierunku liczb mniejszych.',
    formula: '←══════●———',
    note: 'Nierówność NIEOSTRA (≤) = kółko pełne ●',
  },
  {
    q: 'Jak rozwiązać nierówność −3x < 9?',
    a: 'Dzielimy przez −3 (ujemna!) i odwracamy znak < na >. Wynik: x > −3.',
    formula: '−3x < 9 ⟹ x > −3',
    note: 'Krok po kroku: −3x ÷ (−3) > 9 ÷ (−3) → x > −3',
  },
  {
    q: 'Jak przetłumaczyć słowa zadania tekstowego na znaki nierówności?',
    a: '"Co najmniej n" → ≥ n. "Co najwyżej n" → ≤ n. "Więcej niż n" → > n. "Mniej niż n" → < n.',
    formula: 'co najmniej → ≥ &nbsp; · &nbsp; co najwyżej → ≤',
    note: '"Nie więcej niż" = ≤. "Nie mniej niż" = ≥. Te zwroty są na egzaminie!',
  },
  {
    q: 'Jak sprawdzić poprawność rozwiązania nierówności?',
    a: 'Podstaw liczbę z rozwiązania do oryginalnej nierówności i sprawdź czy jest prawdziwa. Sprawdź też liczbę graniczną i liczbę spoza rozwiązania.',
    formula: 'x > 3: podstaw x=5 → 5>3 ✓ i x=2 → 2>3 ✗',
  },
  {
    q: 'Jak zapisać rozwiązanie x ≥ −2 jako przedział?',
    a: 'Przedział domknięty od lewej: od −2 (włącznie) do plus nieskończoności.',
    formula: '[−2, +∞)',
    note: '[ ] = domknięty (≤ lub ≥). ( ) = otwarty (< lub >). ∞ zawsze w nawiasie okrągłym.',
  },
]

const KARTKOWKA = [
  { q: 'Rozwiąż:', eq: 'x − 3 < 5', opts: ['x < 8', 'x < 2', 'x > 8', 'x < −2'], ans: 0, concept: 'dodawanie', hint: 'Dodaj 3 do obu stron.' },
  { q: 'Rozwiąż:', eq: '4x > 20', opts: ['x > 80', 'x > 16', 'x > 5', 'x < 5'], ans: 2, concept: 'mnozenie-plus', hint: 'Podziel obie strony przez 4 (liczba dodatnia).' },
  { q: 'Rozwiąż (uwaga na znak!):', eq: '−2x ≥ 6', opts: ['x ≥ −3', 'x ≤ −3', 'x ≤ 3', 'x ≥ 3'], ans: 1, concept: 'mnozenie-minus', hint: 'Dzielisz przez −2 → odwróć znak!' },
  { q: 'Rozwiąż:', eq: '2x + 1 ≤ 9', opts: ['x ≤ 4', 'x ≤ 5', 'x ≥ 4', 'x ≤ 8'], ans: 0, concept: 'dodawanie', hint: 'Najpierw odejmij 1 od obu stron, potem podziel przez 2.' },
  { q: 'Rozwiąż (uwaga!):', eq: '5 − x > 2', opts: ['x > −3', 'x < 3', 'x > 3', 'x < −3'], ans: 1, concept: 'mnozenie-minus', hint: 'Odejmij 5 od obu stron: −x > −3. Pomnóż przez −1 → odwróć znak.' },
  { q: 'Rozwiąż:', eq: 'x + 2 ≥ 0', opts: ['x ≥ −2', 'x ≥ 2', 'x ≤ 2', 'x > −2'], ans: 0, concept: 'dodawanie', hint: 'Odejmij 2 od obu stron.' },
  { q: 'Która liczba całkowita spełnia nierówność 3x < 15?', eq: '', opts: ['x = 5', 'x = 6', 'x = 4', 'x = 7'], ans: 2, concept: 'sprawdzanie', hint: 'Rozwiąż: x < 5. Która liczba jest mniejsza od 5?' },
  { q: 'Ola ma x złotych, Bartek 12 zł. Ola ma więcej niż Bartek. Nierówność:', eq: '', opts: ['x < 12', 'x ≤ 12', 'x > 12', 'x ≥ 12'], ans: 2, concept: 'zadanie-tekstowe', hint: '"Więcej niż" = znak >' },
  { q: 'Rozwiąż (dwa kroki, uważaj na znak!):', eq: '−x + 4 ≤ 10', opts: ['x ≤ −6', 'x ≥ −6', 'x ≤ 6', 'x ≥ 6'], ans: 1, concept: 'mnozenie-minus', hint: 'Odejmij 4: −x ≤ 6. Pomnóż przez −1 → odwróć ≤ na ≥.' },
  { q: 'Które zdanie o nierówności x ≥ 7 jest FAŁSZYWE?', eq: '', opts: ['x = 7 spełnia', 'x = 6 spełnia', 'x = 100 spełnia', 'x = 7.5 spełnia'], ans: 1, concept: 'sprawdzanie', hint: '≥ oznacza "większy lub równy". Sprawdź każdą opcję.' },
]

const CONCEPTS = {
  'dodawanie': 'Dodawanie/odejmowanie (bez zmiany znaku)',
  'mnozenie-plus': 'Mnożenie przez liczbę dodatnią',
  'mnozenie-minus': '⚠️ Mnożenie przez liczbę ujemną (flip!)',
  'sprawdzanie': 'Sprawdzanie i interpretacja rozwiązania',
  'zadanie-tekstowe': 'Zadania tekstowe z nierównościami',
}

const S = {
  navy: '#0F1729', navy2: '#1a2540',
  accent: '#F5541E', accent2: '#FF7A4D',
  green: '#00B894', yellow: '#FDCB6E',
  purple: '#6C5CE7', blue: '#185FA5',
  bg: '#F7F8FC', white: '#fff',
  text: '#0F1729', text2: '#4A5568', text3: '#8896A5',
  border: '#E2E8F0',
}

const btn = (extra = {}) => ({
  padding: '10px 22px', fontSize: 13, fontWeight: 500, borderRadius: 8,
  cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
  border: `1.5px solid ${S.border}`, background: S.white, color: S.text,
  ...extra,
})

export default function NierownosciLesson() {
  const [screen, setScreen] = useState('lekcja')
  const [unlocked, setUnlocked] = useState({ lekcja: true, quiz: false, fiszki: false, kartkowka: false, raport: false })
  const [theoryTab, setTheoryTab] = useState('def')

  // Quiz
  const [qi, setQi] = useState(0)
  const [qSel, setQSel] = useState(null)
  const [qDone, setQDone] = useState(false)
  const [qResults, setQResults] = useState([])

  // Fiszki
  const [deck, setDeck] = useState([])
  const [flipped, setFlipped] = useState(false)
  const [mastered, setMastered] = useState(0)
  const [deckInit, setDeckInit] = useState(false)

  // Kartkówka
  const [kMode, setKMode] = useState('trening')
  const [kStarted, setKStarted] = useState(false)
  const [kIdx, setKIdx] = useState(0)
  const [kSel, setKSel] = useState(null)
  const [kDone, setKDone] = useState(false)
  const [kResults, setKResults] = useState([])
  const [kTimer, setKTimer] = useState(600)
  const [kShowHint, setKShowHint] = useState(false)
  const timerRef = useRef(null)

  const unlock = (s) => setUnlocked(prev => ({ ...prev, [s]: true }))

  const goScreen = (s) => {
    if (!unlocked[s]) return
    setScreen(s)
    if (s === 'fiszki' && !deckInit) { setDeck(FISZKI.map((f, i) => ({ ...f, id: i }))); setDeckInit(true) }
  }

  useEffect(() => {
    if (kStarted && kMode === 'egzamin' && kIdx < KARTKOWKA.length) {
      timerRef.current = setInterval(() => {
        setKTimer(t => {
          if (t <= 1) { clearInterval(timerRef.current); finishKartkowka(); return 0 }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [kStarted, kMode])

  const finishKartkowka = () => {
    clearInterval(timerRef.current)
    setKIdx(KARTKOWKA.length)
    unlock('raport')
  }

  // ── TEORIA ────────────────────────────────────────────────────────
  const TheoryContent = {
    def: (
      <div>
        <p style={{ fontSize: 14, lineHeight: 1.85, color: S.text2, marginBottom: 16 }}>
          <strong style={{ color: S.text }}>Nierówność</strong> to zdanie matematyczne stwierdzające, że jedna wartość jest <strong style={{ color: S.text }}>większa lub mniejsza</strong> od drugiej. W odróżnieniu od równania, rozwiązaniem nierówności jest <strong style={{ color: S.text }}>nieskończony zbiór liczb</strong> — cały przedział.
        </p>
        <div style={{ background: S.navy, borderRadius: 10, padding: '16px 20px', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 20, color: '#fff', lineHeight: 2 }}>
            <span style={{ color: '#FF7A4D' }}>a</span> {'<'} <span style={{ color: '#FF7A4D' }}>b</span>
            {' · '}
            <span style={{ color: '#FF7A4D' }}>a</span> {'>'} <span style={{ color: '#FF7A4D' }}>b</span>
            {' · '}
            <span style={{ color: '#FF7A4D' }}>a</span> ≤ <span style={{ color: '#FF7A4D' }}>b</span>
            {' · '}
            <span style={{ color: '#FF7A4D' }}>a</span> ≥ <span style={{ color: '#FF7A4D' }}>b</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 6 }}>Cztery rodzaje nierówności</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: '#F5F3FF', borderLeft: '3px solid #6C5CE7', borderRadius: '0 8px 8px 0', padding: '12px 14px', fontSize: 13, color: '#4C1D95', lineHeight: 1.65 }}>
            <strong>{'< i >'} — nierówność ostra</strong><br />
            Liczba graniczna <strong>nie należy</strong> do rozwiązań.<br />
            Na osi: kółko puste ○
          </div>
          <div style={{ background: '#F0FFF4', borderLeft: '3px solid #00B894', borderRadius: '0 8px 8px 0', padding: '12px 14px', fontSize: 13, color: '#276749', lineHeight: 1.65 }}>
            <strong>≤ i ≥ — nierówność nieostra</strong><br />
            Liczba graniczna <strong>należy</strong> do rozwiązań.<br />
            Na osi: kółko pełne ●
          </div>
        </div>
      </div>
    ),
    solve: (
      <div>
        <p style={{ fontSize: 14, lineHeight: 1.85, color: S.text2, marginBottom: 14 }}>
          Nierówność liniową rozwiązujemy jak równanie — wykonujemy <strong style={{ color: S.text }}>te same działania po obu stronach</strong>, żeby wyizolować x.
        </p>
        <div style={{ background: 'linear-gradient(135deg,#FFF5EB,#FFFAF5)', border: '1px solid #FDDCBA', borderRadius: 8, padding: '12px 16px', marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: S.accent, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Przykład 1 — dodawanie</div>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: S.text, fontWeight: 500 }}>x + 3 {'>'} 7</div>
        </div>
        {[
          ['Odejmujemy 3 od obu stron:', 'x + 3 − 3 > 7 − 3'],
          ['Upraszczamy:', 'x > 4 ✓'],
        ].map(([a, r], i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ width: 22, height: 22, background: S.navy, color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 13, color: S.text2, marginBottom: 3 }}>{a}</div>
              <div style={{ background: i === 1 ? '#F0FFF4' : S.bg, borderLeft: i === 1 ? '3px solid #00B894' : 'none', padding: '6px 10px', borderRadius: i === 1 ? '0 6px 6px 0' : 6, fontFamily: 'monospace', fontSize: 14, color: i === 1 ? '#276749' : S.text, fontWeight: i === 1 ? 600 : 400, display: 'inline-block' }}>{r}</div>
            </div>
          </div>
        ))}
        <div style={{ background: 'linear-gradient(135deg,#FFF5EB,#FFFAF5)', border: '1px solid #FDDCBA', borderRadius: 8, padding: '12px 16px', marginBottom: 14, marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: S.accent, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Przykład 2 — mnożenie przez liczbę dodatnią</div>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: S.text, fontWeight: 500 }}>2x ≤ 10</div>
        </div>
        {[
          ['Dzielimy obie strony przez 2 (liczba dodatnia — znak bez zmian):', '2x ÷ 2 ≤ 10 ÷ 2'],
          ['Wynik:', 'x ≤ 5 ✓'],
        ].map(([a, r], i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ width: 22, height: 22, background: S.navy, color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 13, color: S.text2, marginBottom: 3 }}>{a}</div>
              <div style={{ background: i === 1 ? '#F0FFF4' : S.bg, borderLeft: i === 1 ? '3px solid #00B894' : 'none', padding: '6px 10px', borderRadius: i === 1 ? '0 6px 6px 0' : 6, fontFamily: 'monospace', fontSize: 14, color: i === 1 ? '#276749' : S.text, fontWeight: i === 1 ? 600 : 400, display: 'inline-block' }}>{r}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    flip: (
      <div>
        <div style={{ background: '#FFF5F5', borderLeft: '3px solid #E17055', borderRadius: '0 8px 8px 0', padding: '14px 16px', marginBottom: 16, fontSize: 13, color: '#9B2C2C', lineHeight: 1.75 }}>
          <strong>⚠️ KLUCZOWA ZASADA — najczęstszy błąd na egzaminie!</strong><br /><br />
          Gdy mnożymy lub dzielimy obie strony nierówności przez <strong>liczbę ujemną</strong>, musimy <strong>odwrócić znak nierówności</strong>.<br /><br />
          {'<'} zamienia się w {'>'} i odwrotnie. ≤ zamienia się w ≥ i odwrotnie.
        </div>
        <div style={{ background: S.navy, borderRadius: 10, padding: '14px 20px', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#fff', lineHeight: 2 }}>
            jeśli <span style={{ color: '#FF7A4D' }}>a</span> {'<'} <span style={{ color: '#FF7A4D' }}>b</span>, to <span style={{ color: '#FF7A4D' }}>−a</span> <span style={{ color: '#00B894' }}>{'>'}</span> <span style={{ color: '#FF7A4D' }}>−b</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 6 }}>Mnożenie przez −1 odwraca znak</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg,#FFF5EB,#FFFAF5)', border: '1px solid #FDDCBA', borderRadius: 8, padding: '12px 16px', marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: S.accent, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>Przykład — UWAGA na znak!</div>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: S.text, fontWeight: 500 }}>−2x {'>'} 8</div>
        </div>
        {[
          ['Dzielimy przez −2 (liczba ujemna!) — ODWRACAMY ZNAK > na <:', 'x < 8 ÷ (−2)'],
          ['Wynik:', 'x < −4 ✓'],
        ].map(([a, r], i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ width: 22, height: 22, background: '#E17055', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 13, color: S.text2, marginBottom: 3 }}>{a}</div>
              <div style={{ background: i === 1 ? '#F0FFF4' : S.bg, borderLeft: i === 1 ? '3px solid #00B894' : 'none', padding: '6px 10px', borderRadius: i === 1 ? '0 6px 6px 0' : 6, fontFamily: 'monospace', fontSize: 14, color: i === 1 ? '#276749' : S.text, fontWeight: i === 1 ? 600 : 400, display: 'inline-block' }}>{r}</div>
            </div>
          </div>
        ))}
        <div style={{ background: '#FFF5EB', borderLeft: '3px solid #F5541E', borderRadius: '0 8px 8px 0', padding: '10px 14px', fontSize: 13, color: '#C05621', lineHeight: 1.65 }}>
          💡 <strong>Jak zapamiętać:</strong> Pomyśl o osi liczbowej. Gdy odwracasz liczby przez mnożenie przez −1, kolejność się odwraca — co było większe, staje się mniejsze.
        </div>
      </div>
    ),
    axis: (
      <div>
        <p style={{ fontSize: 14, lineHeight: 1.85, color: S.text2, marginBottom: 16 }}>
          Rozwiązanie nierówności zaznaczamy na osi liczbowej. Kluczowa jest różnica między <strong style={{ color: S.text }}>kółkiem pustym</strong> (ostra) a <strong style={{ color: S.text }}>pełnym</strong> (nieostra).
        </p>
        {[
          { label: 'x > 4 — kółko puste (4 nie należy)', diagram: '←———————○══════════→', sub: '0              4              8', color: '#6C5CE7', bg: '#F5F3FF', border: '#6C5CE7' },
          { label: 'x ≤ 4 — kółko pełne (4 należy)', diagram: '←══════════●———————→', sub: '0              4              8', color: '#276749', bg: '#F0FFF4', border: '#00B894' },
          { label: 'x ≥ −3 — kółko pełne, kierunek prawy', diagram: '←———●══════════════→', sub: '-6            -3              0', color: '#185FA5', bg: '#EBF4FF', border: '#185FA5' },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: S.text, marginBottom: 6 }}>{item.label}</div>
            <div style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 8, padding: '12px 16px', fontFamily: 'monospace', fontSize: 14, color: item.color, textAlign: 'center', lineHeight: 1.8 }}>
              {item.diagram}<br />
              <span style={{ fontSize: 11, fontFamily: 'sans-serif', color: S.text3 }}>{item.sub}</span>
            </div>
          </div>
        ))}
        <div style={{ background: '#FFF5EB', borderLeft: '3px solid #F5541E', borderRadius: '0 8px 8px 0', padding: '10px 14px', fontSize: 13, color: '#C05621', lineHeight: 1.65 }}>
          💡 <strong>Zapis przedziałowy:</strong> x {'>'} 4 → (4, +∞) · x ≤ 4 → (−∞, 4] · x ≥ −3 → [−3, +∞)
        </div>
      </div>
    ),
    word: (
      <div>
        <p style={{ fontSize: 14, lineHeight: 1.85, color: S.text2, marginBottom: 14 }}>
          Na egzaminie często pojawiają się <strong style={{ color: S.text }}>zadania tekstowe</strong>, w których musisz ułożyć i rozwiązać nierówność. Kluczem jest właściwe przetłumaczenie słów na symbole.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[
            ['co najmniej n', '≥ n', '#F0FFF4', '#276749'],
            ['co najwyżej n', '≤ n', '#EBF4FF', '#185FA5'],
            ['więcej niż n', '> n', '#FAEEDA', '#633806'],
            ['mniej niż n', '< n', '#F5F3FF', '#4C1D95'],
            ['nie mniej niż n', '≥ n', '#F0FFF4', '#276749'],
            ['nie więcej niż n', '≤ n', '#EBF4FF', '#185FA5'],
          ].map(([text, sign, bg, color], i) => (
            <div key={i} style={{ background: bg, borderRadius: 8, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color }}>{text}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color }}>{sign}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'linear-gradient(135deg,#FFF5EB,#FFFAF5)', border: '1px solid #FDDCBA', borderRadius: 8, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: S.accent, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Przykład CKE</div>
          <div style={{ fontSize: 14, color: S.text2, lineHeight: 1.75, marginBottom: 12 }}>
            <em>"Do autobusu wchodzi co najmniej 3 razy więcej pasażerów niż do tramwaju. W tramwaju jedzie 24 osoby. Ile co najmniej osób jedzie autobusem?"</em>
          </div>
          {[
            ['Oznaczamy: x = liczba osób w autobusie', ''],
            ['"Co najmniej 3 razy więcej niż 24" → x ≥ 3 · 24', 'x ≥ 72'],
            ['Odpowiedź: co najmniej 72 osoby', '✓'],
          ].map(([a, r], i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <div style={{ width: 20, height: 20, background: S.navy, color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 13, color: S.text2 }}>{a}</div>
              {r && <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#276749', fontWeight: 600, marginLeft: 'auto' }}>{r}</div>}
            </div>
          ))}
        </div>
      </div>
    ),
  }

  // ── SCREENS ───────────────────────────────────────────────────────
  const ScreenLekcja = () => (
    <div style={{ background: S.white, borderRadius: 14, border: `1px solid ${S.border}`, padding: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6C5CE7', marginBottom: 12 }}>📖 Teoria</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {THEORY_TABS.map(t => (
          <button key={t.id} onClick={() => setTheoryTab(t.id)} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 500, borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s', border: `1.5px solid ${theoryTab === t.id ? S.navy : S.border}`, background: theoryTab === t.id ? S.navy : S.white, color: theoryTab === t.id ? '#fff' : S.text2 }}>{t.label}</button>
        ))}
      </div>
      {TheoryContent[theoryTab]}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: 8 }}>
        {theoryTab !== 'word'
          ? <button onClick={() => { const idx = THEORY_TABS.findIndex(t => t.id === theoryTab); setTheoryTab(THEORY_TABS[Math.min(idx + 1, THEORY_TABS.length - 1)].id) }} style={btn()}>Następna sekcja →</button>
          : <button onClick={() => { unlock('quiz'); setScreen('quiz') }} style={btn({ background: S.navy, color: '#fff', border: 'none' })}>Przejdź do quizu →</button>
        }
      </div>
    </div>
  )

  const ScreenQuiz = () => {
    if (qi >= QUIZ.length) {
      const correct = qResults.filter(r => r.correct).length
      return (
        <div style={{ background: S.white, borderRadius: 14, border: `1px solid ${S.border}`, padding: 24 }}>
          <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{correct >= 4 ? '🎯' : correct >= 3 ? '👍' : '📚'}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 900, color: S.text, marginBottom: 6 }}>{correct}/{QUIZ.length} poprawnych</div>
            <div style={{ fontSize: 14, color: S.text2 }}>{correct >= 4 ? 'Świetnie! Czas na fiszki.' : 'Wróć do sekcji "Zasada znaku ⚠️" i spróbuj ponownie.'}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={() => { setQi(0); setQSel(null); setQDone(false); setQResults([]) }} style={btn()}>Powtórz quiz</button>
            <button onClick={() => { unlock('fiszki'); setScreen('fiszki'); setDeck(FISZKI.map((f, i) => ({ ...f, id: i }))); setDeckInit(true) }} style={btn({ background: S.navy, color: '#fff', border: 'none' })}>Fiszki →</button>
          </div>
        </div>
      )
    }
    const q = QUIZ[qi]
    return (
      <div style={{ background: S.white, borderRadius: 14, border: `1px solid ${S.border}`, padding: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#00B894', marginBottom: 12 }}>🧠 Quiz — pytanie {qi + 1}/{QUIZ.length}</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {QUIZ.map((_, i) => <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i < qi ? '#00B894' : i === qi ? S.accent : S.border, transition: 'background .3s' }} />)}
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: S.text, marginBottom: 10, lineHeight: 1.5 }}>{q.q}</div>
        {q.eq && <div style={{ background: S.navy, borderRadius: 8, padding: '12px 18px', marginBottom: 16, display: 'inline-block' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#fff' }}>{q.eq}</div>
        </div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {q.opts.map((o, i) => {
            let bg = S.white, border = S.border, color = S.text
            if (qDone) {
              if (i === q.ans) { bg = '#F0FFF4'; border = '#00B894'; color = '#276749' }
              else if (i === qSel) { bg = '#FFF5F5'; border = '#E17055'; color = '#9B2C2C' }
            }
            return <div key={i} onClick={() => { if (qDone) return; setQSel(i); setQDone(true); setQResults(prev => [...prev, { correct: i === q.ans, concept: q.concept }]) }} style={{ border: `1.5px solid ${border}`, borderRadius: 8, padding: '11px 16px', cursor: qDone ? 'default' : 'pointer', fontFamily: 'monospace', fontSize: 15, fontWeight: 500, textAlign: 'center', background: bg, color, transition: 'all .15s' }}>{o}</div>
          })}
        </div>
        {qDone && (
          <>
            <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 10, display: 'flex', gap: 10, alignItems: 'flex-start', background: qSel === q.ans ? '#F0FFF4' : '#FFF5F5', border: `1px solid ${qSel === q.ans ? '#C6F6D5' : '#FED7D7'}`, color: qSel === q.ans ? '#276749' : '#9B2C2C' }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{qSel === q.ans ? '✅' : '❌'}</span>
              <div style={{ fontSize: 13, lineHeight: 1.7 }}><strong>{qSel === q.ans ? 'Świetnie!' : 'Nie tym razem.'}</strong>
                <div style={{ background: '#F5F3FF', border: '1px solid #C4B5FD', borderRadius: 6, padding: '8px 12px', marginTop: 8, fontSize: 12, color: '#4C1D95', lineHeight: 1.7 }}>
                  💡 <strong>Dlaczego?</strong> {q.dlaczego}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => { if (qi < QUIZ.length - 1) { setQi(q => q + 1); setQSel(null); setQDone(false) } else setQi(QUIZ.length) }} style={btn({ background: S.navy, color: '#fff', border: 'none' })}>
                {qi < QUIZ.length - 1 ? 'Następne pytanie →' : 'Zobacz wynik →'}
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  const ScreenFiszki = () => {
    if (deck.length === 0 && deckInit) return (
      <div style={{ background: S.white, borderRadius: 14, border: `1px solid ${S.border}`, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎴</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 900, color: S.text, marginBottom: 6 }}>Wszystkie {FISZKI.length} kart opanowane!</div>
        <div style={{ fontSize: 14, color: S.text2, marginBottom: 20 }}>Wzory i zasady są w głowie. Czas na kartkówkę!</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <button onClick={() => { setDeck(FISZKI.map((f, i) => ({ ...f, id: i }))); setFlipped(false); setMastered(0) }} style={btn()}>Powtórz fiszki</button>
          <button onClick={() => { unlock('kartkowka'); setScreen('kartkowka') }} style={btn({ background: S.navy, color: '#fff', border: 'none' })}>Kartkówka →</button>
        </div>
      </div>
    )
    if (!deckInit) return null
    const card = deck[0]
    const pct = Math.round((mastered / FISZKI.length) * 100)
    return (
      <div style={{ background: S.white, borderRadius: 14, border: `1px solid ${S.border}`, padding: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: S.accent, marginBottom: 12 }}>🃏 Fiszki ({mastered}/{FISZKI.length} opanowane)</div>
        <div style={{ height: 4, background: S.border, borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#00B894', borderRadius: 2, width: `${pct}%`, transition: 'width .3s' }} />
        </div>
        <div style={{ fontSize: 12, color: S.text3, textAlign: 'center', marginBottom: 12 }}>Pozostało: {deck.length} kart · Kliknij kartę żeby obrócić</div>
        <div onClick={() => setFlipped(f => !f)} style={{ cursor: 'pointer', minHeight: 180, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center', background: flipped ? S.white : S.navy, border: `1px solid ${flipped ? S.border : 'rgba(255,255,255,.08)'}`, transition: 'background .3s', marginBottom: 14 }}>
          {!flipped ? (
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Fiszka {mastered + 1} / {FISZKI.length}</div>
              <div style={{ fontSize: 17, fontWeight: 500, color: '#fff', lineHeight: 1.5 }}>{card.q}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 12 }}>Kliknij żeby zobaczyć odpowiedź</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: S.text, lineHeight: 1.6, marginBottom: 8 }}>{card.a}</div>
              {card.formula && <div style={{ fontFamily: 'monospace', fontSize: 18, color: S.accent, fontWeight: 600, margin: '10px 0', dangerouslySetInnerHTML: { __html: card.formula } }} />}
              {card.note && <div style={{ fontSize: 12, color: S.text3, lineHeight: 1.5 }}>{card.note}</div>}
            </div>
          )}
        </div>
        {flipped && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={() => { const [, ...rest] = deck; setDeck([...rest, deck[0]]); setFlipped(false) }} style={btn({ background: '#E17055', color: '#fff', border: 'none', textAlign: 'center' })}>😅 Trudna — powtórz</button>
            <button onClick={() => { const [, ...rest] = deck; setDeck(rest); setMastered(m => m + 1); setFlipped(false) }} style={btn({ background: '#00B894', color: '#fff', border: 'none', textAlign: 'center' })}>✅ Łatwa — następna</button>
          </div>
        )}
      </div>
    )
  }

  const ScreenKartkowka = () => {
    if (!kStarted) return (
      <div style={{ background: S.white, borderRadius: 14, border: `1px solid ${S.border}`, padding: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: S.blue, marginBottom: 12 }}>✏️ Kartkówka — 10 pytań</div>
        <p style={{ fontSize: 14, color: S.text2, lineHeight: 1.75, marginBottom: 20 }}>Sprawdź całą wiedzę z lekcji. Wybierz tryb nauki:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[['trening', '🏋️', 'Tryb trening', 'Podpowiedzi dostępne, bez presji czasu'], ['egzamin', '🎯', 'Tryb egzamin', 'Timer 10 min, bez podpowiedzi — jak prawdziwy egzamin']].map(([mode, icon, title, desc]) => (
            <div key={mode} onClick={() => setKMode(mode)} style={{ border: `2px solid ${kMode === mode ? S.navy : S.border}`, borderRadius: 12, padding: '16px', cursor: 'pointer', background: kMode === mode ? S.navy : S.white, transition: 'all .15s', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: kMode === mode ? '#fff' : S.text, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: kMode === mode ? 'rgba(255,255,255,.6)' : S.text3, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        <button onClick={() => { setKStarted(true); setKIdx(0); setKSel(null); setKDone(false); setKResults([]); setKTimer(600) }} style={btn({ width: '100%', textAlign: 'center', background: S.navy, color: '#fff', border: 'none', padding: '13px' })}>Zacznij kartkówkę →</button>
      </div>
    )
    if (kIdx >= KARTKOWKA.length) {
      const correct = kResults.filter(r => r.correct).length
      return (
        <div style={{ background: S.white, borderRadius: 14, border: `1px solid ${S.border}`, padding: 24 }}>
          <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
            <div style={{ fontSize: 52, marginBottom: 8 }}>{correct >= 8 ? '🏆' : correct >= 6 ? '⭐' : '📚'}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 900, color: S.text, marginBottom: 6 }}>{correct}/10 poprawnych</div>
            <div style={{ fontSize: 14, color: S.text2 }}>Ocena: {correct >= 9 ? 'A' : correct >= 7 ? 'B' : correct >= 5 ? 'C' : 'D'}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={() => { setKStarted(false); setKIdx(0); setKSel(null); setKDone(false); setKResults([]) }} style={btn()}>Powtórz</button>
            <button onClick={() => { unlock('raport'); setScreen('raport') }} style={btn({ background: S.navy, color: '#fff', border: 'none' })}>Raport Maxa →</button>
          </div>
        </div>
      )
    }
    const q = KARTKOWKA[kIdx]
    const mins = Math.floor(kTimer / 60).toString().padStart(2, '0')
    const secs = (kTimer % 60).toString().padStart(2, '0')
    return (
      <div style={{ background: S.white, borderRadius: 14, border: `1px solid ${S.border}`, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: S.blue }}>✏️ Kartkówka {kIdx + 1}/{KARTKOWKA.length}</div>
          {kMode === 'egzamin' && <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 600, color: kTimer < 60 ? '#E17055' : S.text, background: kTimer < 60 ? '#FFF5F5' : S.bg, padding: '5px 12px', borderRadius: 8, border: `1px solid ${kTimer < 60 ? '#FED7D7' : S.border}` }}>{mins}:{secs}</div>}
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {KARTKOWKA.map((_, i) => <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i < kIdx ? '#00B894' : i === kIdx ? S.accent : S.border }} />)}
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: S.text, marginBottom: 10, lineHeight: 1.5 }}>{q.q}</div>
        {q.eq && <div style={{ background: S.navy, borderRadius: 8, padding: '12px 18px', marginBottom: 16, display: 'inline-block' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#fff' }}>{q.eq}</div>
        </div>}
        {kMode === 'trening' && !kDone && (
          <div onClick={() => setKShowHint(h => !h)} style={{ background: '#FFF5EB', border: '1px solid #FDDCBA', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: '#C05621', cursor: 'pointer', lineHeight: 1.6 }}>
            💡 {kShowHint ? q.hint : 'Kliknij po podpowiedź'}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {q.opts.map((o, i) => {
            let bg = S.white, border = S.border, color = S.text
            if (kDone) {
              if (i === q.ans) { bg = '#F0FFF4'; border = '#00B894'; color = '#276749' }
              else if (i === kSel) { bg = '#FFF5F5'; border = '#E17055'; color = '#9B2C2C' }
            }
            return <div key={i} onClick={() => { if (kDone) return; setKSel(i); setKDone(true); setKShowHint(false); setKResults(prev => [...prev, { correct: i === q.ans, concept: q.concept }]) }} style={{ border: `1.5px solid ${border}`, borderRadius: 8, padding: '11px 16px', cursor: kDone ? 'default' : 'pointer', fontFamily: 'monospace', fontSize: 15, fontWeight: 500, textAlign: 'center', background: bg, color, transition: 'all .15s' }}>{o}</div>
          })}
        </div>
        {kDone && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => {
              if (kIdx < KARTKOWKA.length - 1) { setKIdx(k => k + 1); setKSel(null); setKDone(false); setKShowHint(false) }
              else finishKartkowka()
            }} style={btn({ background: S.navy, color: '#fff', border: 'none' })}>
              {kIdx < KARTKOWKA.length - 1 ? 'Dalej →' : 'Zakończ →'}
            </button>
          </div>
        )}
      </div>
    )
  }

  const ScreenRaport = () => {
    const all = [...qResults, ...kResults]
    const conceptStats = {}
    Object.keys(CONCEPTS).forEach(c => { conceptStats[c] = { total: 0, correct: 0 } })
    all.forEach(r => { if (conceptStats[r.concept]) { conceptStats[r.concept].total++; if (r.correct) conceptStats[r.concept].correct++ } })
    const totalCorrect = all.filter(r => r.correct).length
    const pct = all.length > 0 ? Math.round((totalCorrect / all.length) * 100) : 0
    const kCorrect = kResults.filter(r => r.correct).length
    const weak = Object.entries(conceptStats).filter(([, v]) => v.total > 0 && v.correct / v.total < 0.7)

    return (
      <div style={{ background: S.white, borderRadius: 14, border: `1px solid ${S.border}`, padding: 24 }}>
        <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '📚'}</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 900, color: S.text, marginBottom: 4 }}>{pct >= 80 ? 'Opanowane!' : pct >= 60 ? 'Dobry wynik!' : 'Potrzebujesz powtórki'}</div>
          <div style={{ fontSize: 14, color: S.text2 }}>Łączny wynik z quizu i kartkówki</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {[['⚡', `${totalCorrect}/${all.length}`, 'Poprawnych'], ['📊', `${pct}%`, 'Skuteczność'], ['🎓', kCorrect >= 9 ? 'A' : kCorrect >= 7 ? 'B' : kCorrect >= 5 ? 'C' : 'D', 'Ocena']].map(([ico, val, lbl], i) => (
            <div key={i} style={{ background: S.bg, borderRadius: 8, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{ico}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: S.text }}>{val}</div>
              <div style={{ fontSize: 11, color: S.text3, marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: S.text, marginBottom: 10 }}>Wyniki wg tematu:</div>
          {Object.entries(conceptStats).filter(([, v]) => v.total > 0).map(([key, v]) => {
            const p = Math.round((v.correct / v.total) * 100)
            const col = p >= 80 ? '#00B894' : p >= 60 ? '#FDCB6E' : '#E17055'
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 14px', borderRadius: 8, marginBottom: 6, background: S.bg }}>
                <div style={{ flex: 1, fontSize: 13, color: S.text }}>{CONCEPTS[key]}</div>
                <div style={{ width: 120, height: 5, background: S.border, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: col, width: `${p}%`, transition: 'width .5s' }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: col, minWidth: 32, textAlign: 'right' }}>{p}%</div>
              </div>
            )
          })}
        </div>
        <div style={{ background: S.navy, borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F5541E,#FF7A4D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Max — Feedback</div>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', lineHeight: 1.75, marginBottom: 10 }}>
            {weak.length === 0
              ? 'Rewelacyjny wynik! Opanowałeś cały materiał o nierównościach. Możesz śmiało przejść do następnego tematu. Pamiętaj tylko o jednej zasadzie:'
              : 'Widzę kilka tematów do poprawy przed egzaminem. Skup się na nich:'}
          </div>
          {(weak.length === 0
            ? [['Mnożenie przez liczbę ujemną ZAWSZE odwraca znak nierówności — to wychodzi na każdym egzaminie CKE.']]
            : weak.map(([key]) => [[key === 'mnozenie-minus' ? '⚠️ Zasada znaku: dzielenie/mnożenie przez ujemną odwraca znak! Wróć do sekcji teorii i fiszki nr 4.' : key === 'zadanie-tekstowe' ? '"Co najmniej" = ≥, "co najwyżej" = ≤ — zapamiętaj te 6 zwrotów z sekcji "Zadania tekstowe".' : 'Powtórz podstawowe kroki rozwiązywania nierówności krok po kroku.']])
          ).map(([text], i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: 12, color: 'rgba(255,255,255,.75)', lineHeight: 1.6 }}>
              <span style={{ color: S.accent, flexShrink: 0 }}>→</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 8 }}>
          <button onClick={() => { setScreen('lekcja'); setTheoryTab('def') }} style={btn()}>Wróć do lekcji</button>
          <Link href="/kurs" style={{ ...btn({ background: S.navy, color: '#fff', border: 'none' }), display: 'inline-block', textDecoration: 'none' }}>Wróć do kursu →</Link>
        </div>
      </div>
    )
  }

  const screens = { lekcja: ScreenLekcja, quiz: ScreenQuiz, fiszki: ScreenFiszki, kartkowka: ScreenKartkowka, raport: ScreenRaport }
  const steps = [
    { id: 'lekcja', icon: '📖', label: 'Lekcja' },
    { id: 'quiz', icon: '🧠', label: 'Quiz' },
    { id: 'fiszki', icon: '🃏', label: 'Fiszki' },
    { id: 'kartkowka', icon: '✏️', label: 'Kartkówka' },
    { id: 'raport', icon: '📊', label: 'Raport' },
  ]
  const CurrentScreen = screens[screen]

  return (
    <div style={{ minHeight: '100vh', background: S.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ background: S.navy, padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', alignItems: 'center', height: 54, gap: 16 }}>
          <Link href="/kurs/dzial-3" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', transition: 'all .15s' }}>
            ← Dział 3
          </Link>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Lekcja 4 z 6</div>
          <Link href="/kurs" style={{ marginLeft: 'auto', fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', textDecoration: 'none' }}>Ósem<span style={{ color: S.accent }}>karz</span></Link>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: S.text3, marginBottom: 3 }}>Dział 3 — Równania i nierówności</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 900, color: S.text }}>Nierówności liniowe</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            {[['⏱ 15 min', '#EBF4FF', '#2B6CB0'], ['Poziom: podstawowy+', '#F0FFF4', '#276749'], ['CKE ✓', '#FFF5EB', '#C05621']].map(([t, bg, c], i) => (
              <span key={i} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: bg, color: c }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, marginBottom: 18, background: S.white, borderRadius: 12, border: `1px solid ${S.border}`, overflow: 'hidden' }}>
          {steps.map(s => {
            const isActive = screen === s.id
            const isDone = unlocked[s.id] && !isActive
            return (
              <div key={s.id} onClick={() => goScreen(s.id)} style={{ flex: 1, padding: '10px 4px', textAlign: 'center', fontSize: 11, fontWeight: 500, cursor: unlocked[s.id] ? 'pointer' : 'default', borderRight: `1px solid ${S.border}`, background: isActive ? S.navy : isDone ? '#F0FFF4' : S.white, color: isActive ? '#fff' : isDone ? '#276749' : S.text3, opacity: unlocked[s.id] ? 1 : 0.4, transition: 'all .15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span>{s.label}</span>
              </div>
            )
          })}
        </div>

        <CurrentScreen />
      </div>
    </div>
  )
}
