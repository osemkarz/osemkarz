# Ósemkarz 🎯
Platforma do przygotowania do egzaminu ósmoklasisty z matematyki.

## Szybki start lokalny

```bash
npm install
npm run dev
# otwórz http://localhost:3000
```

## Wdrożenie na Vercel (5 minut)

### Krok 1 — GitHub
1. Utwórz nowe repozytorium na github.com
2. Wgraj pliki projektu:
```bash
git init
git add .
git commit -m "Initial commit — Ósemkarz MVP"
git remote add origin https://github.com/TWOJ_USERNAME/osemkarz.git
git push -u origin main
```

### Krok 2 — Vercel
1. Wejdź na vercel.com → zaloguj przez GitHub
2. "Add New Project" → wybierz repozytorium `osemkarz`
3. Kliknij "Deploy" — nic nie zmieniaj w ustawieniach
4. Za ~2 minuty masz stronę pod `osemkarz.vercel.app`

### Krok 3 — Klucz API (dla Maxa)
Max działa bez klucza dzięki proxy w Claude.ai.
Gdy wdrażasz na własny serwer:
1. Anthropic Console → API Keys → utwórz klucz
2. Vercel → Settings → Environment Variables → dodaj `ANTHROPIC_API_KEY`
3. Zaktualizuj fetch w `LessonViewer.jsx` aby używał `/api/max` (endpoint do dodania)

## Struktura projektu

```
osemkarz/
├── app/
│   ├── layout.js          # Fonty, metadata
│   ├── page.js            # Landing page
│   ├── globals.css        # Style globalne + zmienne CSS
│   └── kurs/
│       ├── page.js        # Dashboard kursu
│       └── uklady-rownan/
│           └── page.js    # Lekcja: Układy równań
├── components/
│   └── LessonViewer.jsx   # Interaktywna lekcja z Maxem AI
└── README.md
```

## Następne kroki

- [ ] System logowania (NextAuth.js)
- [ ] Baza danych (Supabase) — zapis postępów
- [ ] Więcej lekcji w każdym dziale
- [ ] Panel rodzica
- [ ] Sprawdziany po działach
- [ ] Tryb "przed egzaminem"
- [ ] Aplikacja mobilna (React Native / Expo)
