'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-foreground/10 bg-background backdrop-blur transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="md:hidden rounded border px-2 py-1 text-sm"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(true)}
          >
            ☰
          </button>
          <Link href="/" className="font-semibold">
            Rick & Morty Visualizer
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <ThemeToggle />
        </nav>
      </div>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
