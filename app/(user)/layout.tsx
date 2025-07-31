import { type Metadata } from 'next'

import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/globals.css'
import { Header } from '@/components/Header'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'EduNova - Learn and Grow',
  description: 'Your gateway to online learning and skill development',
}

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable}`}>
      <Header />
      {children}
    </div>
  );
}

