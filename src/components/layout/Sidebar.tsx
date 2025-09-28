'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const linkBase =
    'block rounded px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors';
  const active = (href: string) =>
    pathname === href ? ' font-semibold bg-black/5 dark:bg-white/10' : '';

  return (
    <aside className="hidden md:block w-64 shrink-0">
      <nav className="rounded border border-black/10 dark:border-white/10 p-2 bg-background sticky top-20">
        <Link href="/" className={linkBase + active('/')}>
          Home
        </Link>
        <Link href="/favorites" className={linkBase + active('/favorites')}>
          My favorites
        </Link>
      </nav>
    </aside>
  );
}
