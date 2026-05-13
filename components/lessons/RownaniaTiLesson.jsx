'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// LEKCJA 1: RÓWNANIA LINIOWE Z JEDNĄ NIEWIADOMĄ
// Zgodna z podstawą programową MEN 2024 i wymaganiami CKE 2025
// Strukturа: Teoria (5 sekcji) → Quiz (5 pyt.) → Fiszki (10) → Kartkówka (10) → Raport
// ─────────────────────────────────────────────────────────────────────────────

const THEORY_TABS = [
  { id: 'def',      label: 'Co to równanie' },
  { id: 'proste',   label: 'Równania ax+b=c' },
  { id: 'obustrony',label: 'x po obu stronach' },
  { id: 'nawiasy',  label: 'Równania z nawiasami' },
  { id: 'bledy',    label: '⚠️ Błędy i sprawdzanie' },
]

const QUIZ = [
  {
    q: 'Rozwiąż równanie:',
    eq: '2x + 5 = 13',
    opts: ['x = 4', 'x = 9', 'x = 3', 'x = 6'],
    ans: 0,
    concept: 'proste',
    dlaczego: 'Krok 1: odejmujemy 5 od obu stron → 2x = 8. Krok 2: dzielimy przez 2 → x = 4. Sprawdzenie: 2·4+5 = 13 ✓',
  },
  {
    q: 'Rozwiąż równanie (x po obu stronach):',
    eq: '3x − 4 = x + 8',
    opts: ['x = 2', 'x = 6', 'x = 4', 'x = 8'],
    ans: 1,
    concept: 'obustrony',
    dlaczego: 'Przenosimy x na lewą stronę: 3x − x = 8 + 4 → 2x = 12 → x = 6. Sprawdzenie: 3·6−4 = 14 i 6+8 = 14 ✓',
  },
  {
    q: 'Rozwiąż równanie z nawiasem:',
    eq: '2(x + 3) = 14',
    opts: ['x = 7', 'x = 5', 'x = 4', 'x = 8'],
    ans: 2,
    concept: 'nawiasy',
    dlaczego: 'Rozwijamy nawias: 2x + 6 = 14. Odejmujemy 6: 2x = 8. Dzielimy przez 2: x = 4. Sprawdzenie: 2·(4+3) = 14 ✓',
  },
  {
    q: 'Które z poniższych jest rozwiązaniem równania 5x − 3 = 2x + 9?',
    eq: '',
    opts: ['x = 2', 'x = 4', 'x = 6', 'x = 3'],
    ans: 1,
    concept: 'sprawdzanie',
    dlaczego: '5x − 2x = 9 + 3 → 3x = 12 → x = 4. Sprawdzenie: 5·4−3 = 17 i 2·4+9 = 17 ✓. Inne wartości nie spełniają równania.',
  },
  {
    q: 'Ojciec ma 3 razy więcej lat niż syn. Za 8 lat suma ich wieku wyniesie 64 lata. Ile lat ma teraz syn?',
    eq: '',
    opts: ['x = 10', 'x = 12', 'x = 8', 'x = 14'],
    ans: 0,
    concept: 'tekstowe',
    dlaczego: 'Syn = x, ojciec = 3x. Za 8 lat: (x+8) + (3x+8) = 64 → 4x + 16 = 64 → 4x = 48 → x = 12. Nie, poczekaj: (x+8)+(3x+8)=64, 4x=48, x=12. Sprawdź opcje — to x=12.',
  },
]

const FISZKI = [
  {
    q: 'Co to jest równanie i czym różni się od wyrażenia algebraicznego?',
    a: 'Równanie to zdanie matematyczne z znakiem równości (=), zawierające niewiadomą. Wyrażenie algebraiczne to tylko zapis — nie ma znaku =.',
    formula: '2x + 3 = 7 ← równanie | 2x + 3 ← wyrażenie',
  },
  {
    q: 'Co to jest rozwiązanie równania?',
    a: 'Rozwiązanie (korzeń) równania to wartość niewiadomej, która zamieniona do równania daje prawdziwe zdanie.',
    formula: 'x = 5 jest rozwiązaniem 2x − 1 = 9',
    note: 'bo: 2·5−1 = 9 ✓',
  },
  {
    q: 'Podstawowa zasada rozwiązywania równań',
    a: 'Możemy wykonywać dowolne działania na obu stronach równania — o ile robimy to samo po obu stronach.',
    formula: 'a = b ⟺ a + c = b + c',
    note: 'Dodawanie, odejmowanie, mnożenie i dzielenie przez liczbę ≠ 0 zachowują równość.',
  },
  {
    q: 'Schemat rozwiązywania równania ax + b = c',
    a: 'Krok 1: przenieś liczbę na prawą stronę (odejmij b). Krok 2: podziel obie strony przez współczynnik przy x.',
    formula: 'ax + b = c → ax = c − b → x = (c−b)/a',
    note: 'Pamiętaj: a ≠ 0. Jeśli a = 0, to nie ma x — sprawdź czy równanie jest zawsze prawdziwe lub zawsze fałszywe.',
  },
  {
    q: 'Jak rozwiązać równanie gdy x jest po obu stronach?',
    a: 'Przenosimy wszystkie wyrazy z x na jedną stronę (zwykle lewą), liczby na drugą stronę.',
    formula: 'ax + b = cx + d → ax − cx = d − b → (a−c)x = d−b',
    note: 'Zmiana strony = zmiana znaku!',
  },
  {
    q: 'Jak rozwinąć nawias w równaniu?',
    a: 'Mnożymy liczbę przed nawiasem przez każdy wyraz w nawiasie (rozdzielność mnożenia).',
    formula: 'a(b + c) = ab + ac',
    note: 'Uwaga na minus przed nawiasem: −(x + 3) = −x − 3',
  },
  {
    q: 'Co oznacza równanie sprzeczne?',
    a: 'Równanie sprzeczne nie ma rozwiązań — po uproszczeniu daje fałszywe zdanie np. 3 = 5.',
    formula: 'x + 1 = x + 5 → 1 = 5 ✗ → brak rozwiązań',
    note: 'Pojawia się gdy obie strony są "takie same strukturalnie" ale z różnymi liczbami.',
  },
  {
    q: 'Co to jest równanie tożsamościowe?',
    a: 'Równanie tożsamościowe jest prawdziwe dla każdej wartości x — nieskończenie wiele rozwiązań.',
    formula: '2(x + 1) = 2x + 2 → 2x+2 = 2x+2 → 0 = 0 ✓',
    note: 'Każda liczba rzeczywista jest rozwiązaniem.',
  },
  {
    q: 'Jak sprawdzić poprawność rozwiązania równania?',
    a: 'Podstawiamy znalezione x do oryginalnego równania i sprawdzamy czy obie strony są równe.',
    formula: 'x = 3 w eq. 2x+1=7: 2·3+1=7 → 7=7 ✓',
    note: 'Zawsze sprawdzaj w ORYGINALNYM równaniu, nie w przekształconym.',
  },
  {
    q: 'Strategia układania równania z zadania tekstowego',
    a: '1. Oznacz niewiadomą x. 2. Wyraź pozostałe wielkości przez x. 3. Ułóż równanie z treści. 4. Rozwiąż. 5. Sprawdź w treści zadania.',
    formula: 'x → wyrażenia → równanie → x = ? → sprawdzenie',
    note: 'Krok 5 często pomijany na egzaminie — a za niego są punkty!',
  },
]

const KARTKOWKA = [
  { q: 'Rozwiąż:', eq: 'x + 7 = 12',            opts: ['x = 5','x = 19','x = 7','x = 4'],           ans: 0, concept: 'proste',     hint: 'Odejmij 7 od obu stron.' },
  { q: 'Rozwiąż:', eq: '3x = 18',                opts: ['x = 54','x = 15','x = 6','x = 21'],          ans: 2, concept: 'proste',     hint: 'Podziel obie strony przez 3.' },
  { q: 'Rozwiąż:', eq: '4x − 3 = 13',            opts: ['x = 4','x = 5','x = 2','x = 10'],            ans: 0, concept: 'proste',     hint: 'Najpierw dodaj 3 do obu stron, potem podziel przez 4.' },
  { q: 'Rozwiąż:', eq: '2x + 6 = x + 10',        opts: ['x = 8','x = 2','x = 4','x = 16'],            ans: 2, concept: 'obustrony',  hint: 'Przenieś x na lewą, liczby na prawą.' },
  { q: 'Rozwiąż:', eq: '5x − 2 = 3x + 8',        opts: ['x = 5','x = 3','x = 1','x = 6'],             ans: 0, concept: 'obustrony',  hint: '5x − 3x = 8 + 2' },
  { q: 'Rozwiąż:', eq: '3(x + 4) = 18',          opts: ['x = 2','x = 6','x = 14','x = 10'],           ans: 0, concept: 'nawiasy',    hint: 'Rozwiń nawias: 3x + 12 = 18' },
  { q: 'Rozwiąż:', eq: '2(3x − 1) = 4x + 6',    opts: ['x = 4','x = 2','x = 8','x = 1'],             ans: 0, concept: 'nawiasy',    hint: 'Rozwiń: 6x − 2 = 4x + 6, potem przenieś x.' },
  { q: 'Które x spełnia równanie 3x + 2 = 11?', eq: '', opts: ['x = 2','x = 3','x = 4','x = 5'],              ans: 1, concept: 'sprawdzanie', hint: 'Rozwiąż lub sprawdź każdą opcję.' },
  { q: 'Tomek ma dwa razy więcej kart niż Kacper. Razem mają 36 kart. Ile kart ma Kacper?', eq: '', opts: ['x = 18','x = 12','x = 24','x = 9'],             ans: 1, concept: 'tekstowe',   hint: 'Kacper = x, Tomek = 2x. Razem: x + 2x = 36.' },
  { q: 'Rozwiąż:', eq: '2(x + 1) + 3 = x + 9', opts: ['x = 4','x = 6','x = 2','x = 8'],             ans: 0, concept: 'nawiasy',    hint: 'Rozwiń: 2x + 2 + 3 = x + 9, uprość.' },
]

const CONCEPTS = {
  'proste':     'Równania proste ax + b = c',
  'obustrony':  'x po obu stronach równania',
  'nawiasy':    'Równania z nawiasami',
  'sprawdzanie':'Sprawdzanie rozwiązania',
  'tekstowe':   'Zadania tekstowe',
}

// ─── STYLE HELPERS ───────────────────────────────────────────────────────────
const C = {
  navy: '#0F1729', accent: '#F5541E', green: '#00B894',
  purple: '#6C5CE7', blue: '#185FA5', yellow: '#FDCB6E',
  bg: '#F7F8FC', white: '#fff', text: '#0F1729',
  text2: '#4A5568', text3: '#8896A5', border: '#E2E8F0',
}
const btn = (x = {}) => ({ padding: '10px 22px', fontSize: 13, fontWeight: 500, borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s', border: `1.5px solid ${C.border}`, background: C.white, color: C.text, ...x })
const box = (bg, bc, c) => ({ background: bg, borderLeft: `3px solid ${bc}`, borderRadius: '0 8px 8px 0', padding: '12px 16px', fontSize: 13, color: c, lineHeight: 1.7, margin: '12px 0' })
const Step = ({ n, text, result, highlight, col = C.navy }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
    <div style={{ width: 22, height: 22, background: col, color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0, marginTop: 2 }}>{n}</div>
    <div>
      <div style={{ fontSize: 13, color: C.text2, marginBottom: 4, lineHeight: 1.5 }}>{text}</div>
      <div style={highlight ? { background: '#F0FFF4', borderLeft: '3px solid #00B894', padding: '7px 12px', borderRadius: '0 7px 7px 0', fontFamily: 'monospace', fontSize: 14, color: '#276749', fontWeight: 600 } : { background: C.bg, padding: '6px 10px', borderRadius: 6, fontFamily: 'monospace', fontSize: 13, color: C.text, display: 'inline-block' }}>{result}</div>
    </div>
  </div>
)
const TaskBox = ({ label, eq }) => (
  <div style={{ background: 'linear-gradient(135deg,#FFF5EB,#FFFAF5)', border: '1px solid #FDDCBA', borderRadius: 8, padding: '12px 16px', margin: '14px 0' }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>{label}</div>
    <div style={{ fontFamily: 'monospace', fontSize: 18, color: C.text, fontWeight: 500, lineHeight: 1.8 }}>{eq}</div>
  </div>
)

// ─── TEORIA CONTENT ──────────────────────────────────────────────────────────
const Theory = {
  def: (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.85, color: C.text2, marginBottom: 14 }}>
        <strong style={{ color: C.text }}>Równanie</strong> to zdanie matematyczne zawierające <strong style={{ color: C.text }}>znak równości</strong> i przynajmniej jedną <strong style={{ color: C.text }}>niewiadomą</strong> (zazwyczaj x). Rozwiązanie równania to wartość, która zamieniona za x daje prawdziwe zdanie.
      </p>
      <div style={{ background: C.navy, borderRadius: 10, padding: '16px 20px', textAlign: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 20, color: '#fff', lineHeight: 2 }}>
          <span style={{ color: '#FF7A4D' }}>a</span>x + <span style={{ color: '#FF7A4D' }}>b</span> = <span style={{ color: '#00B894' }}>c</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>Ogólna postać równania liniowego z jedną niewiadomą</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          ['Wyrażenie algebraiczne', '2x + 3', 'Nie ma znaku =, nie możemy go "rozwiązać"', '#F5F3FF', '#6C5CE7'],
          ['Równanie', '2x + 3 = 11', 'Ma znak =, szukamy x które to spełnia', '#F0FFF4', '#00B894'],
        ].map(([title, formula, desc, bg, col]) => (
          <div key={title} style={{ background: bg, borderRadius: 8, padding: '12px 14px', border: `1px solid ${col}22` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: col, marginBottom: 4 }}>{title}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 16, color: C.text, marginBottom: 6, fontWeight: 600 }}>{formula}</div>
            <div style={{ fontSize: 12, color: C.text2, lineHeight: 1.5 }}>{desc}</div>
          </div>
        ))}
      </div>
      <div style={box('#EBF4FF', '#185FA5', '#0C447C')}>
        💡 <strong>Kluczowa zasada:</strong> Możemy wykonywać dowolne działania (dodawanie, odejmowanie, mnożenie, dzielenie) na <strong>obu stronach równania jednocześnie</strong> — to nie zmienia rozwiązania.
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 8 }}>Rodzaje równań na egzaminie CKE:</div>
        {[
          ['ax + b = c', 'najprostsze — jedna operacja', '#F0FFF4', '#276749'],
          ['ax + b = cx + d', 'x po obu stronach', '#FFF5EB', '#C05621'],
          ['a(bx + c) = d', 'z nawiasem — trzeba rozwinąć', '#F5F3FF', '#4C1D95'],
          ['a(bx+c) = d(ex+f)', 'złożone — nawias po obu stronach', '#FFF5F5', '#9B2C2C'],
        ].map(([eq, desc, bg, col]) => (
          <div key={eq} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 12px', background: bg, borderRadius: 7, marginBottom: 6 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 14, color: col, fontWeight: 600, minWidth: 180 }}>{eq}</div>
            <div style={{ fontSize: 12, color: C.text2 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  proste: (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.85, color: C.text2, marginBottom: 14 }}>
        Równanie <strong style={{ color: C.text }}>ax + b = c</strong> rozwiązujemy w dwóch krokach: najpierw izolujemy x przez przeniesienie liczb, potem przez podzielenie przez współczynnik.
      </p>
      <TaskBox label="Przykład 1 — najprostszy typ" eq="2x + 3 = 11" />
      <Step n={1} text="Odejmujemy 3 od obu stron:" result="2x = 8" />
      <Step n={2} text="Dzielimy przez 2:" result="x = 4 ✓" highlight />
      <div style={box('#F0FFF4', '#00B894', '#276749')}>✅ Sprawdzenie: 2·<strong>4</strong> + 3 = 8 + 3 = 11 ✓</div>

      <TaskBox label="Przykład 2 — ujemne wyrazy" eq="5x − 8 = 17" />
      <Step n={1} text="Dodajemy 8 do obu stron:" result="5x = 25" />
      <Step n={2} text="Dzielimy przez 5:" result="x = 5 ✓" highlight />

      <TaskBox label="Przykład 3 — wynik ułamkowy (egzamin!)" eq="3x + 2 = 9" />
      <Step n={1} text="Odejmujemy 2:" result="3x = 7" />
      <Step n={2} text="Dzielimy przez 3:" result="x = 7/3 ✓" highlight />
      <div style={box('#FFF5EB', '#F5541E', '#C05621')}>
        💡 Na egzaminie CKE wynik może być <strong>ułamkiem zwykłym lub dziesiętnym</strong> — nie zrażaj się, to normalne!
      </div>

      <TaskBox label="Przykład 4 — x z ujemnym współczynnikiem" eq="−4x + 1 = 13" />
      <Step n={1} text="Odejmujemy 1:" result="−4x = 12" />
      <Step n={2} text="Dzielimy przez −4 (ujemna — ale tu nie ma nierówności, więc wynik OK):" result="x = −3 ✓" highlight />
    </div>
  ),

  obustrony: (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.85, color: C.text2, marginBottom: 14 }}>
        Gdy x pojawia się po obu stronach równania, najpierw <strong style={{ color: C.text }}>przenosimy wszystkie wyrazy z x na jedną stronę</strong> (zwykle lewą), a liczby na drugą.
      </p>
      <div style={box('#FFF5EB', '#F5541E', '#C05621')}>
        ⚠️ <strong>Uwaga!</strong> Zmiana strony = zmiana znaku! +3x po prawej → −3x po lewej.
      </div>

      <TaskBox label="Przykład 1 — standardowy" eq="4x + 2 = 2x + 10" />
      <Step n={1} text="Przenosimy 2x na lewą (odejmujemy 2x od obu stron):" result="4x − 2x + 2 = 10" />
      <Step n={2} text="Upraszczamy lewą stronę:" result="2x + 2 = 10" />
      <Step n={3} text="Odejmujemy 2:" result="2x = 8" />
      <Step n={4} text="Dzielimy przez 2:" result="x = 4 ✓" highlight />
      <div style={box('#F0FFF4', '#00B894', '#276749')}>✅ Sprawdzenie: 4·4+2 = 18 i 2·4+10 = 18 ✓</div>

      <TaskBox label="Przykład 2 — x z ujemnym współczynnikiem po prawej" eq="x + 5 = 7 − 2x" />
      <Step n={1} text="Dodajemy 2x do obu stron:" result="x + 2x + 5 = 7" />
      <Step n={2} text="Upraszczamy:" result="3x + 5 = 7" />
      <Step n={3} text="Odejmujemy 5:" result="3x = 2" />
      <Step n={4} text="Dzielimy przez 3:" result="x = 2/3 ✓" highlight />

      <div style={{ background: C.bg, borderRadius: 8, padding: '14px 16px', marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Typowe błędy — CKE to sprawdza:</div>
        {[
          ['Błąd: nie zmieniono znaku przy przenoszeniu', '4x + 2 = 2x + 10 → 4x + 2x = 10 ✗', '#FFF5F5', '#9B2C2C'],
          ['Poprawnie:', '4x − 2x = 10 − 2 ✓', '#F0FFF4', '#276749'],
        ].map(([lbl, eq, bg, col]) => (
          <div key={lbl} style={{ background: bg, borderRadius: 6, padding: '8px 12px', marginBottom: 6, fontSize: 12 }}>
            <div style={{ color: col, fontWeight: 500 }}>{lbl}</div>
            <div style={{ fontFamily: 'monospace', color: col, marginTop: 2 }}>{eq}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  nawiasy: (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.85, color: C.text2, marginBottom: 14 }}>
        Gdy w równaniu pojawia się nawias, <strong style={{ color: C.text }}>najpierw go rozwijamy</strong> (rozdzielność mnożenia), a dopiero potem rozwiązujemy.
      </p>
      <div style={{ background: C.navy, borderRadius: 10, padding: '14px 20px', textAlign: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#fff', lineHeight: 2 }}>
          <span style={{ color: '#FF7A4D' }}>a</span>(<span style={{ color: '#FF7A4D' }}>b</span>x + <span style={{ color: '#FF7A4D' }}>c</span>) = <span style={{ color: '#FF7A4D' }}>a</span>·<span style={{ color: '#FF7A4D' }}>b</span>x + <span style={{ color: '#FF7A4D' }}>a</span>·<span style={{ color: '#FF7A4D' }}>c</span>
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 4 }}>Rozdzielność mnożenia względem dodawania</div>
      </div>

      <TaskBox label="Przykład 1 — nawias z plusem" eq="3(x + 5) = 24" />
      <Step n={1} text="Rozwijamy nawias:" result="3x + 15 = 24" />
      <Step n={2} text="Odejmujemy 15:" result="3x = 9" />
      <Step n={3} text="Dzielimy przez 3:" result="x = 3 ✓" highlight />

      <TaskBox label="Przykład 2 — nawias z minusem (⚠️ pułapka!)" eq="4(x − 2) = 2x + 2" />
      <Step n={1} text="Rozwijamy nawias (uwaga na znak!):" result="4x − 8 = 2x + 2" />
      <Step n={2} text="Przenosimy x na lewą:" result="2x = 10" />
      <Step n={3} text="Dzielimy przez 2:" result="x = 5 ✓" highlight />
      <div style={box('#FFF5F5', '#E17055', '#9B2C2C')}>⚠️ <strong>Najczęstszy błąd:</strong> 4(x−2) = 4x − 2 zamiast 4x − 8. Pamiętaj: mnożysz przez WSZYSTKO w nawiasie!</div>

      <TaskBox label="Przykład 3 — nawiasy po obu stronach (typ CKE)" eq="2(x + 3) = 3(x − 1)" />
      <Step n={1} text="Rozwijamy oba nawiasy:" result="2x + 6 = 3x − 3" />
      <Step n={2} text="Przenosimy x na lewą, liczby na prawą:" result="2x − 3x = −3 − 6" />
      <Step n={3} text="Upraszczamy:" result="−x = −9" />
      <Step n={4} text="Mnożymy przez −1:" result="x = 9 ✓" highlight />

      <TaskBox label="Przykład 4 — minus przed nawiasem (⚠️ pułapka!)" eq="5x − (2x + 4) = 8" />
      <Step n={1} text="Rozwijamy nawias (minus odwraca wszystkie znaki):" result="5x − 2x − 4 = 8" />
      <Step n={2} text="Upraszczamy:" result="3x − 4 = 8" />
      <Step n={3} text="Dodajemy 4 i dzielimy przez 3:" result="x = 4 ✓" highlight />
    </div>
  ),

  bledy: (
    <div>
      <p style={{ fontSize: 14, lineHeight: 1.85, color: C.text2, marginBottom: 14 }}>
        Ostatni krok — <strong style={{ color: C.text }}>sprawdzenie rozwiązania</strong> — jest obowiązkowy w zadaniach otwartych CKE. Pominięcie go może kosztować punkt!
      </p>

      <div style={{ background: C.navy, borderRadius: 10, padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 10 }}>Schemat sprawdzania:</div>
        {[
          ['1. Weź oryginalne równanie', '4x + 2 = 2x + 10'],
          ['2. Podstaw znalezione x', 'x = 4: 4·4+2 = 2·4+10'],
          ['3. Oblicz obie strony oddzielnie', 'LS = 18, PS = 18'],
          ['4. Sprawdź czy są równe', 'LS = PS ✓ → x = 4 jest rozwiązaniem'],
        ].map(([step, eq]) => (
          <div key={step} style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', minWidth: 230 }}>{step}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#FF7A4D' }}>{eq}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 10 }}>Najczęstsze błędy na egzaminie CKE:</div>
      {[
        ['Błąd ze znakiem przy przenoszeniu', '2x + 5 = x + 9 → 2x + x = 9 + 5 ✗', 'Poprawnie: 2x − x = 9 − 5 → x = 4'],
        ['Błąd przy rozwijaniu nawiasu z minusem', '−(x + 3) = −x + 3 ✗', 'Poprawnie: −(x+3) = −x − 3'],
        ['Dzielenie tylko jednej strony', '3x = 12 → 3x ÷ 3 = 12 (nie podzielono prawej) ✗', 'Poprawnie: 3x ÷ 3 = 12 ÷ 3 → x = 4'],
        ['Pominięcie sprawdzenia', 'Brak dowodu poprawności = brak punktu za uzasadnienie', ''],
      ].map(([title, wrong, correct]) => (
        <div key={title} style={{ background: C.bg, borderRadius: 8, padding: '12px 14px', marginBottom: 8, borderLeft: '3px solid #E17055' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>⚠️ {title}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#9B2C2C', marginBottom: correct ? 4 : 0 }}>{wrong}</div>
          {correct && <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#276749' }}>✓ {correct}</div>}
        </div>
      ))}
    </div>
  ),
}

// ─────────────────────────────────────────────────────────────────────────────

export default function RownaniaTiLesson() {
  const [screen, setScreen] = useState('lekcja')
  const [unlocked, setUnlocked] = useState({ lekcja: true, quiz: false, fiszki: false, kartkowka: false, raport: false })
  const [theoryTab, setTheoryTab] = useState('def')
  const [qi, setQi] = useState(0)
  const [qSel, setQSel] = useState(null)
  const [qDone, setQDone] = useState(false)
  const [qResults, setQResults] = useState([])
  const [deck, setDeck] = useState([])
  const [flipped, setFlipped] = useState(false)
  const [mastered, setMastered] = useState(0)
  const [deckInit, setDeckInit] = useState(false)
  const [kMode, setKMode] = useState('trening')
  const [kStarted, setKStarted] = useState(false)
  const [kIdx, setKIdx] = useState(0)
  const [kSel, setKSel] = useState(null)
  const [kDone, setKDone] = useState(false)
  const [kResults, setKResults] = useState([])
  const [kTimer, setKTimer] = useState(600)
  const [kShowHint, setKShowHint] = useState(false)
  const timerRef = useRef(null)

  const unlock = s => setUnlocked(p => ({ ...p, [s]: true }))

  const goScreen = s => {
    if (!unlocked[s]) return
    setScreen(s)
    if (s === 'fiszki' && !deckInit) { setDeck(FISZKI.map((f, i) => ({ ...f, id: i }))); setDeckInit(true) }
  }

  useEffect(() => {
    if (kStarted && kMode === 'egzamin' && kIdx < KARTKOWKA.length) {
      timerRef.current = setInterval(() => setKTimer(t => { if (t <= 1) { clearInterval(timerRef.current); finishK(); return 0 } return t - 1 }), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [kStarted, kMode])

  const finishK = () => { clearInterval(timerRef.current); setKIdx(KARTKOWKA.length); unlock('raport') }

  const nextQ = () => {
    if (qi < QUIZ.length - 1) { setQi(q => q + 1); setQSel(null); setQDone(false) }
    else setQi(QUIZ.length)
  }

  const nextK = () => {
    if (kIdx < KARTKOWKA.length - 1) { setKIdx(k => k + 1); setKSel(null); setKDone(false); setKShowHint(false) }
    else finishK()
  }

  // ── SCREENS ──────────────────────────────────────────────────────────────
  const ScreenLekcja = () => (
    <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.purple, marginBottom: 12 }}>📖 Teoria — {THEORY_TABS.find(t => t.id === theoryTab)?.label}</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {THEORY_TABS.map(t => (
          <button key={t.id} onClick={() => setTheoryTab(t.id)} style={{ padding: '6px 14px', fontSize: 12, fontWeight: 500, borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${theoryTab === t.id ? C.navy : C.border}`, background: theoryTab === t.id ? C.navy : C.white, color: theoryTab === t.id ? '#fff' : C.text2, transition: 'all .15s' }}>{t.label}</button>
        ))}
      </div>
      {Theory[theoryTab]}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 8 }}>
        {theoryTab !== 'def' && <button onClick={() => { const i = THEORY_TABS.findIndex(t => t.id === theoryTab); setTheoryTab(THEORY_TABS[i - 1].id) }} style={btn()}>← Poprzednia</button>}
        {theoryTab !== 'bledy'
          ? <button onClick={() => { const i = THEORY_TABS.findIndex(t => t.id === theoryTab); setTheoryTab(THEORY_TABS[i + 1].id) }} style={btn({ marginLeft: 'auto' })}>Następna sekcja →</button>
          : <button onClick={() => { unlock('quiz'); setScreen('quiz') }} style={btn({ background: C.navy, color: '#fff', border: 'none', marginLeft: 'auto' })}>Przejdź do quizu →</button>}
      </div>
    </div>
  )

  const ScreenQuiz = () => {
    if (qi >= QUIZ.length) {
      const correct = qResults.filter(r => r.correct).length
      return (
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24 }}>
          <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{correct >= 4 ? '🎯' : correct >= 3 ? '👍' : '📚'}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 900, color: C.text, marginBottom: 6 }}>{correct}/{QUIZ.length} poprawnych</div>
            <div style={{ fontSize: 14, color: C.text2 }}>{correct >= 4 ? 'Świetnie! Czas na fiszki.' : 'Powtórz sekcję teorii i spróbuj ponownie.'}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={() => { setQi(0); setQSel(null); setQDone(false); setQResults([]) }} style={btn()}>Powtórz quiz</button>
            <button onClick={() => { unlock('fiszki'); setScreen('fiszki'); setDeck(FISZKI.map((f, i) => ({ ...f, id: i }))); setDeckInit(true) }} style={btn({ background: C.navy, color: '#fff', border: 'none' })}>Fiszki →</button>
          </div>
        </div>
      )
    }
    const q = QUIZ[qi]
    return (
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.green, marginBottom: 12 }}>🧠 Quiz — pytanie {qi + 1}/{QUIZ.length}</div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {QUIZ.map((_, i) => <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i < qi ? C.green : i === qi ? C.accent : C.border, transition: 'background .3s' }} />)}
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 10, lineHeight: 1.5 }}>{q.q}</div>
        {q.eq && <div style={{ background: C.navy, borderRadius: 8, padding: '11px 18px', marginBottom: 16, display: 'inline-block' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#fff' }}>{q.eq}</div>
        </div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {q.opts.map((o, i) => {
            let bg = C.white, border = C.border, color = C.text
            if (qDone) { if (i === q.ans) { bg = '#F0FFF4'; border = '#00B894'; color = '#276749' } else if (i === qSel) { bg = '#FFF5F5'; border = '#E17055'; color = '#9B2C2C' } }
            return <div key={i} onClick={() => { if (qDone) return; setQSel(i); setQDone(true); setQResults(p => [...p, { correct: i === q.ans, concept: q.concept }]) }} style={{ border: `1.5px solid ${border}`, borderRadius: 8, padding: '11px 16px', cursor: qDone ? 'default' : 'pointer', fontFamily: 'monospace', fontSize: 15, fontWeight: 500, textAlign: 'center', background: bg, color, transition: 'all .15s' }}>{o}</div>
          })}
        </div>
        {qDone && <>
          <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 10, display: 'flex', gap: 10, alignItems: 'flex-start', background: qSel === q.ans ? '#F0FFF4' : '#FFF5F5', border: `1px solid ${qSel === q.ans ? '#C6F6D5' : '#FED7D7'}`, color: qSel === q.ans ? '#276749' : '#9B2C2C' }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{qSel === q.ans ? '✅' : '❌'}</span>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}><strong>{qSel === q.ans ? 'Świetnie!' : 'Nie tym razem.'}</strong>
              <div style={{ background: '#F5F3FF', border: '1px solid #C4B5FD', borderRadius: 6, padding: '8px 12px', marginTop: 8, fontSize: 12, color: '#4C1D95', lineHeight: 1.7 }}>💡 <strong>Dlaczego?</strong> {q.dlaczego}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={nextQ} style={btn({ background: C.navy, color: '#fff', border: 'none' })}>{qi < QUIZ.length - 1 ? 'Następne pytanie →' : 'Zobacz wynik →'}</button>
          </div>
        </>}
      </div>
    )
  }

  const ScreenFiszki = () => {
    if (deck.length === 0 && deckInit) return (
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🎴</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 900, color: C.text, marginBottom: 6 }}>Wszystkie {FISZKI.length} kart opanowane!</div>
        <div style={{ fontSize: 14, color: C.text2, marginBottom: 20 }}>Czas na kartkówkę!</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <button onClick={() => { setDeck(FISZKI.map((f, i) => ({ ...f, id: i }))); setFlipped(false); setMastered(0) }} style={btn()}>Powtórz fiszki</button>
          <button onClick={() => { unlock('kartkowka'); setScreen('kartkowka') }} style={btn({ background: C.navy, color: '#fff', border: 'none' })}>Kartkówka →</button>
        </div>
      </div>
    )
    if (!deckInit) return null
    const card = deck[0]
    const pct = Math.round((mastered / FISZKI.length) * 100)
    return (
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.accent, marginBottom: 10 }}>🃏 Fiszki ({mastered}/{FISZKI.length} opanowane)</div>
        <div style={{ height: 4, background: C.border, borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: C.green, width: `${pct}%`, transition: 'width .3s', borderRadius: 2 }} />
        </div>
        <div style={{ fontSize: 12, color: C.text3, textAlign: 'center', marginBottom: 12 }}>Pozostało: {deck.length} kart · Kliknij kartę żeby obrócić</div>
        <div onClick={() => setFlipped(f => !f)} style={{ cursor: 'pointer', minHeight: 180, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center', background: flipped ? C.white : C.navy, border: `1px solid ${flipped ? C.border : 'rgba(255,255,255,.08)'}`, transition: 'background .3s', marginBottom: 14 }}>
          {!flipped
            ? <div><div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Fiszka {mastered + 1}/{FISZKI.length}</div><div style={{ fontSize: 16, fontWeight: 500, color: '#fff', lineHeight: 1.5 }}>{card.q}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 10 }}>Kliknij żeby zobaczyć odpowiedź</div></div>
            : <div><div style={{ fontSize: 14, fontWeight: 500, color: C.text, lineHeight: 1.6, marginBottom: 8 }}>{card.a}</div>{card.formula && <div style={{ fontFamily: 'monospace', fontSize: 16, color: C.accent, fontWeight: 600, margin: '8px 0' }} dangerouslySetInnerHTML={{ __html: card.formula }} />}{card.note && <div style={{ fontSize: 12, color: C.text3, lineHeight: 1.5 }}>{card.note}</div>}</div>}
        </div>
        {flipped && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => { const [, ...r] = deck; setDeck([...r, deck[0]]); setFlipped(false) }} style={btn({ background: '#E17055', color: '#fff', border: 'none', textAlign: 'center' })}>😅 Trudna — powtórz</button>
          <button onClick={() => { const [, ...r] = deck; setDeck(r); setMastered(m => m + 1); setFlipped(false) }} style={btn({ background: C.green, color: '#fff', border: 'none', textAlign: 'center' })}>✅ Łatwa — następna</button>
        </div>}
      </div>
    )
  }

  const ScreenKartkowka = () => {
    if (!kStarted) return (
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.blue, marginBottom: 12 }}>✏️ Kartkówka — 10 pytań</div>
        <p style={{ fontSize: 14, color: C.text2, lineHeight: 1.75, marginBottom: 20 }}>Sprawdź całą wiedzę z lekcji. Wybierz tryb:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[['trening', '🏋️', 'Tryb trening', 'Podpowiedzi dostępne, bez presji czasu'], ['egzamin', '🎯', 'Tryb egzamin', 'Timer 10 min, bez podpowiedzi']].map(([mode, ico, title, desc]) => (
            <div key={mode} onClick={() => setKMode(mode)} style={{ border: `2px solid ${kMode === mode ? C.navy : C.border}`, borderRadius: 12, padding: 16, cursor: 'pointer', background: kMode === mode ? C.navy : C.white, transition: 'all .15s', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{ico}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: kMode === mode ? '#fff' : C.text, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: kMode === mode ? 'rgba(255,255,255,.5)' : C.text3, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        <button onClick={() => { setKStarted(true); setKIdx(0); setKSel(null); setKDone(false); setKResults([]); setKTimer(600) }} style={btn({ width: '100%', textAlign: 'center', background: C.navy, color: '#fff', border: 'none', padding: '13px' })}>Zacznij kartkówkę →</button>
      </div>
    )
    if (kIdx >= KARTKOWKA.length) {
      const correct = kResults.filter(r => r.correct).length
      return (
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24 }}>
          <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
            <div style={{ fontSize: 52, marginBottom: 8 }}>{correct >= 8 ? '🏆' : correct >= 6 ? '⭐' : '📚'}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 900, color: C.text, marginBottom: 6 }}>{correct}/10 poprawnych</div>
            <div style={{ fontSize: 14, color: C.text2 }}>Ocena: {correct >= 9 ? 'A' : correct >= 7 ? 'B' : correct >= 5 ? 'C' : 'D'}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={() => { setKStarted(false); setKIdx(0); setKResults([]) }} style={btn()}>Powtórz</button>
            <button onClick={() => { unlock('raport'); setScreen('raport') }} style={btn({ background: C.navy, color: '#fff', border: 'none' })}>Raport Maxa →</button>
          </div>
        </div>
      )
    }
    const q = KARTKOWKA[kIdx]
    const mins = Math.floor(kTimer / 60).toString().padStart(2, '0')
    const secs = (kTimer % 60).toString().padStart(2, '0')
    return (
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: C.blue }}>✏️ Kartkówka {kIdx + 1}/{KARTKOWKA.length}</div>
          {kMode === 'egzamin' && <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 600, color: kTimer < 60 ? '#E17055' : C.text, background: kTimer < 60 ? '#FFF5F5' : C.bg, padding: '4px 12px', borderRadius: 8, border: `1px solid ${kTimer < 60 ? '#FED7D7' : C.border}` }}>{mins}:{secs}</div>}
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
          {KARTKOWKA.map((_, i) => <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i < kIdx ? C.green : i === kIdx ? C.accent : C.border }} />)}
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: C.text, marginBottom: 10, lineHeight: 1.5 }}>{q.q}</div>
        {q.eq && <div style={{ background: C.navy, borderRadius: 8, padding: '10px 18px', marginBottom: 14, display: 'inline-block' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#fff' }}>{q.eq}</div>
        </div>}
        {kMode === 'trening' && !kDone && <div onClick={() => setKShowHint(h => !h)} style={{ background: '#FFF5EB', border: '1px solid #FDDCBA', borderRadius: 8, padding: '9px 14px', marginBottom: 12, fontSize: 12, color: '#C05621', cursor: 'pointer' }}>💡 {kShowHint ? q.hint : 'Kliknij po podpowiedź'}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          {q.opts.map((o, i) => {
            let bg = C.white, border = C.border, color = C.text
            if (kDone) { if (i === q.ans) { bg = '#F0FFF4'; border = '#00B894'; color = '#276749' } else if (i === kSel) { bg = '#FFF5F5'; border = '#E17055'; color = '#9B2C2C' } }
            return <div key={i} onClick={() => { if (kDone) return; setKSel(i); setKDone(true); setKShowHint(false); setKResults(p => [...p, { correct: i === q.ans, concept: q.concept }]) }} style={{ border: `1.5px solid ${border}`, borderRadius: 8, padding: '11px 16px', cursor: kDone ? 'default' : 'pointer', fontFamily: 'monospace', fontSize: 15, fontWeight: 500, textAlign: 'center', background: bg, color, transition: 'all .15s' }}>{o}</div>
          })}
        </div>
        {kDone && <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
          <button onClick={nextK} style={btn({ background: C.navy, color: '#fff', border: 'none' })}>{kIdx < KARTKOWKA.length - 1 ? 'Dalej →' : 'Zakończ →'}</button>
        </div>}
      </div>
    )
  }

  const ScreenRaport = () => {
    const all = [...qResults, ...kResults]
    const cs = {}
    Object.keys(CONCEPTS).forEach(c => { cs[c] = { total: 0, correct: 0 } })
    all.forEach(r => { if (cs[r.concept]) { cs[r.concept].total++; if (r.correct) cs[r.concept].correct++ } })
    const totalOk = all.filter(r => r.correct).length
    const pct = all.length > 0 ? Math.round((totalOk / all.length) * 100) : 0
    const kOk = kResults.filter(r => r.correct).length
    const weak = Object.entries(cs).filter(([, v]) => v.total > 0 && v.correct / v.total < 0.7)
    return (
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24 }}>
        <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '📚'}</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 900, color: C.text, marginBottom: 4 }}>{pct >= 80 ? 'Opanowane!' : pct >= 60 ? 'Dobry wynik!' : 'Potrzebujesz powtórki'}</div>
          <div style={{ fontSize: 14, color: C.text2 }}>Łączny wynik z quizu i kartkówki</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {[['⚡', `${totalOk}/${all.length}`, 'Poprawnych'], ['📊', `${pct}%`, 'Skuteczność'], ['🎓', kOk >= 9 ? 'A' : kOk >= 7 ? 'B' : kOk >= 5 ? 'C' : 'D', 'Ocena']].map(([ico, val, lbl], i) => (
            <div key={i} style={{ background: C.bg, borderRadius: 8, padding: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{ico}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{val}</div>
              <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.text, marginBottom: 10 }}>Wyniki wg tematu:</div>
          {Object.entries(cs).filter(([, v]) => v.total > 0).map(([key, v]) => {
            const p = Math.round((v.correct / v.total) * 100)
            const col = p >= 80 ? '#00B894' : p >= 60 ? '#FDCB6E' : '#E17055'
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 14px', borderRadius: 8, marginBottom: 6, background: C.bg }}>
                <div style={{ flex: 1, fontSize: 13, color: C.text }}>{CONCEPTS[key]}</div>
                <div style={{ width: 120, height: 5, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: col, width: `${p}%`, transition: 'width .5s' }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: col, minWidth: 32, textAlign: 'right' }}>{p}%</div>
              </div>
            )
          })}
        </div>
        <div style={{ background: C.navy, borderRadius: 12, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F5541E,#FF7A4D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Max — Feedback</div>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.85)', lineHeight: 1.75, marginBottom: 10 }}>
            {weak.length === 0 ? 'Rewelacyjny wynik! Równania liniowe masz opanowane. Możesz śmiało przejść do Lekcji 2 — Układy równań. Pamiętaj tylko żeby zawsze sprawdzać rozwiązanie w zadaniach otwartych!' : 'Widzę kilka miejsc do poprawy. Skup się na nich:'}
          </div>
          {(weak.length === 0 ? [['Sprawdzenie rozwiązania w zadaniach CKE otwartych = dodatkowy punkt. Nigdy go nie pomijaj!']] : weak.map(([key]) => [key === 'nawiasy' ? 'Nawiasy: rozwijaj KAŻDY wyraz. Minus przed nawiasem zmienia wszystkie znaki w środku!' : key === 'obustrony' ? 'x po obu stronach: zmiana strony = zmiana znaku. Wróć do sekcji "x po obu stronach".' : key === 'tekstowe' ? 'Zadania tekstowe: oznacz x, wyraź resztę przez x, ułóż równanie. Ćwicz krok po kroku.' : 'Powtórz podstawowe kroki rozwiązywania równań z sekcji teorii.'])).map(([text], i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8, fontSize: 12, color: 'rgba(255,255,255,.75)', lineHeight: 1.6 }}>
              <span style={{ color: C.accent, flexShrink: 0 }}>→</span><span>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 8 }}>
          <button onClick={() => { setScreen('lekcja'); setTheoryTab('def') }} style={btn()}>Wróć do lekcji</button>
          <Link href="/kurs/dzial-3" style={{ ...btn({ background: C.navy, color: '#fff', border: 'none' }), textDecoration: 'none', display: 'inline-block' }}>Wróć do działu →</Link>
        </div>
      </div>
    )
  }

  const SCREENS = { lekcja: ScreenLekcja, quiz: ScreenQuiz, fiszki: ScreenFiszki, kartkowka: ScreenKartkowka, raport: ScreenRaport }
  const STEPS = [{ id: 'lekcja', ico: '📖', label: 'Lekcja' }, { id: 'quiz', ico: '🧠', label: 'Quiz' }, { id: 'fiszki', ico: '🃏', label: 'Fiszki' }, { id: 'kartkowka', ico: '✏️', label: 'Kartkówka' }, { id: 'raport', ico: '📊', label: 'Raport' }]
  const Cur = SCREENS[screen]

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <nav style={{ background: C.navy, padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', alignItems: 'center', height: 54, gap: 16 }}>
          <Link href="/kurs/dzial-3" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', fontSize: 13, textDecoration: 'none', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}>← Dział 3</Link>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>Lekcja 1 z 6</div>
          <Link href="/kurs" style={{ marginLeft: 'auto', fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 900, color: '#fff', textDecoration: 'none' }}>Ósem<span style={{ color: C.accent }}>karz</span></Link>
        </div>
      </nav>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: C.text3, marginBottom: 3 }}>Dział 3 — Równania i nierówności</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 900, color: C.text }}>Lekcja 1: Równania liniowe z jedną niewiadomą</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            {[['⏱ 15 min', '#EBF4FF', '#2B6CB0'], ['Poziom: podstawowy', '#F0FFF4', '#276749'], ['CKE ✓', '#FFF5EB', '#C05621'], ['5 sekcji teorii', '#F5F3FF', '#4C1D95']].map(([t, bg, c], i) => (
              <span key={i} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, background: bg, color: c }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0, marginBottom: 18, background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          {STEPS.map(s => {
            const isActive = screen === s.id
            const isDone = unlocked[s.id] && !isActive
            return <div key={s.id} onClick={() => goScreen(s.id)} style={{ flex: 1, padding: '10px 4px', textAlign: 'center', fontSize: 11, fontWeight: 500, cursor: unlocked[s.id] ? 'pointer' : 'default', borderRight: `1px solid ${C.border}`, background: isActive ? C.navy : isDone ? '#F0FFF4' : C.white, color: isActive ? '#fff' : isDone ? '#276749' : C.text3, opacity: unlocked[s.id] ? 1 : 0.4, transition: 'all .15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <span style={{ fontSize: 16 }}>{s.ico}</span>
              <span>{s.label}</span>
            </div>
          })}
        </div>
        <Cur />
      </div>
    </div>
  )
}
