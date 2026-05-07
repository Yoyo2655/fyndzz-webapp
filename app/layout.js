import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Welcome to Fyndzz',
  description: 'Find available parking spots in real time.',
  openGraph: {
    title: 'Fyndzz — Trouvez une place en temps réel',
    description: 'Des capteurs IoT connectés en temps réel pour trouver une place de stationnement sans tourner.',
    url: 'https://fyndzz.vercel.app',
    siteName: 'Fyndzz',
    images: [
      {
        url: 'https://fyndzz.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fyndzz',
      }
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fyndzz — Trouvez une place en temps réel',
    description: 'Des capteurs IoT pour trouver une place de stationnement sans tourner.',
    images: ['https://fyndzz.vercel.app/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
