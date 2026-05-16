"use client";

import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

import type { DetectionResponse } from '@/lib/types';

type DetectionCardProps = {
  result: DetectionResponse | null;
  title: string;
};

export function DetectionCard({ result, title }: DetectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel relative overflow-hidden rounded-3xl p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(17,17,17,0.04),transparent_40%)]" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-black">{result?.prediction ?? 'Waiting for input'}</h3>
            <p className="mt-2 text-sm text-slate-600">{result?.message ?? 'Submit an input to see the result.'}</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-3 text-black">
            {result?.blocked ? <AlertTriangle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-black/5 bg-slate-50 p-3">
            <span className="block text-slate-500">Status</span>
            <span className="mt-1 block font-semibold text-black">{result?.status ?? 'idle'}</span>
          </div>
          <div className="rounded-2xl border border-black/5 bg-slate-50 p-3">
            <span className="block text-slate-500">Confidence</span>
            <span className="mt-1 block font-semibold text-black">{result ? `${Math.round(result.confidence * 100)}%` : '--'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
