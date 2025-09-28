import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import Header from '@/components/layout/Header';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Sidebar from '@/components/layout/Sidebar';
import ThemeColorUpdater from '@/components/layout/ThemeColorUpdater';
import { SelectionProvider } from '@/context/SelectionContext';
import { ViewProvider } from '@/context/ViewContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rick and Morty Visualizer',
  description:
    'Explore characters from the Rick and Morty universe with advanced filtering, sorting, and detailed views',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set initial theme class before React hydration to avoid mismatches and FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');var d=t? t==='dark' : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark', d);var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement('meta');m.setAttribute('name','theme-color');document.head.appendChild(m);}m.setAttribute('content', d ? '#0a0a0a' : '#ffffff');}catch(e){}`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider>
          <NotificationProvider>
            <FavoritesProvider>
              <SelectionProvider>
                <ViewProvider>
                  <Header />
                  <ThemeColorUpdater />
                  <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="flex gap-6">
                      <Sidebar />
                      <main className="flex-1 min-w-0">{children}</main>
                    </div>
                  </div>
                </ViewProvider>
              </SelectionProvider>
            </FavoritesProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
