import { DM_Sans, Fraunces } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
  preload: false,
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-display',
  display: 'swap',
  preload: false,
})

export const metadata = {
  title: 'Ósemkarz — Matematyka na egzamin ósmoklasisty',
  description: 'Platforma do nauki matematyki dla klas 7-8. Strukturyzowany kurs, quizy i AI tutor Max przygotują Cię do egzaminu ósmoklasisty.',
  keywords: 'egzamin ósmoklasisty, matematyka, nauka online, klasa 7, klasa 8',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body style={{ margin: 0, fontFamily: 'var(--font-sans, DM Sans, sans-serif)' }}>
        {children}
      </body>
    </html>
  )
}
