"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Waves } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white p-8 sm:p-10">
      <div className="absolute inset-0 cyber-grid opacity-70" />
      <div className="absolute -right-16 top-6 h-48 w-48 rounded-full bg-black/[0.03] blur-3xl" />
      <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-black/[0.02] blur-3xl" />
      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white">
            <Waves className="h-4 w-4" />
            AI WAF Demo
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-black sm:text-5xl lg:text-6xl">
            One clean demo. Two results.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Try the same input in both modes. See how the vulnerable site exposes data and the protected site blocks the request.
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/protected" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
              Open Protected Mode
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-black hover:text-white">
              <ShieldCheck className="h-4 w-4" />
              View Dashboard
            </Link>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="glass-panel rounded-[1.75rem] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">Flow</span>
            <span className="h-3 w-3 rounded-full bg-black" />
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-4">1. Pick a mode.</div>
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-4">2. Paste input or payload.</div>
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-4 text-black">3. See the result.</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
