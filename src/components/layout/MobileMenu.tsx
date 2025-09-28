"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import ThemeToggle from "./ThemeToggle";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="md:hidden fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/40" 
        onClick={onClose} 
        role="presentation"
        aria-hidden="true"
      />
      
      <div 
        className="absolute left-0 top-0 bottom-0 w-72 bg-background border-r border-foreground/10 p-4 flex flex-col gap-4 shadow-lg overflow-y-auto"
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-lg">Menu</span>
          <button 
            className="rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10" 
            onClick={onClose} 
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        
        <nav className="flex-1 -mx-2 -my-2 space-y-1">
          <Link 
            href="/" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-black/5 dark:hover:bg-white/10"
            onClick={onClose}
          >
            Home
          </Link>
          <Link 
            href="/favorites" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-black/5 dark:hover:bg-white/10"
            onClick={onClose}
          >
            My Favorites
          </Link>
        </nav>
        
        <div className="pt-4 mt-auto border-t border-foreground/10">
          <ThemeToggle />
        </div>
      </div>
    </div>,
    document.body
  );
}
