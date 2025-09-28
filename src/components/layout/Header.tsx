"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold">Rick & Morty Visualizer</Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm hover:underline">Home</Link>
          <Link href="/table" className="text-sm hover:underline">Table</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
