"use client";

import Link from 'next/link';
import { Shield } from 'lucide-react';

const links = [
  { href: '/vulnerable', label: 'Vulnerable' },
  { href: '/protected', label: 'Protected' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/logs', label: 'Logs' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.18em] text-black uppercase">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-white text-black shadow-sm">
            <Shield className="h-5 w-5 text-black" />
          </span>
          Sentinel AI WAF
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black transition hover:border-black hover:bg-black hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
