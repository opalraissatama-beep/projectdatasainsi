"use client";

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, Send } from 'lucide-react';

import { detectAttack, simulateVulnerable } from '@/services/api';
import type { DetectionResponse } from '@/lib/types';

const samples = [
  'Hello admin',
  "' OR 1=1 --",
  "<script>alert('xss')</script>",
];

export function LiveComparisonDemo() {
  const [input, setInput] = useState(samples[0]);
  const [loading, setLoading] = useState(false);
  const [vulnerableResult, setVulnerableResult] = useState<DetectionResponse | null>(null);
  const [protectedResult, setProtectedResult] = useState<DetectionResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const [vulnerableResponse, protectedResponse] = await Promise.all([
        simulateVulnerable(input),
        detectAttack(input),
      ]);
      setVulnerableResult(vulnerableResponse);
      setProtectedResult(protectedResponse);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live demo</p>
          <h2 className="mt-2 text-2xl font-semibold text-black">One input, two results</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Use this to show the difference instantly without extra explanation.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {samples.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setInput(sample)}
              className="rounded-full border border-black/10 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 transition hover:border-black hover:bg-black hover:text-white"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-h-[140px] w-full rounded-3xl border border-black/10 bg-white p-4 text-sm text-black outline-none placeholder:text-slate-400 focus:border-black"
          placeholder="Type normal text, SQLi, or XSS payload"
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-600">Vulnerable shows exposure. Protected shows block.</p>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {loading ? 'Running demo...' : 'Run demo'}
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ResultCard
          title="Vulnerable mode"
          icon={<AlertTriangle className="h-4 w-4" />}
          result={vulnerableResult}
          mode="vulnerable"
        />
        <ResultCard
          title="Protected mode"
          icon={<ShieldCheck className="h-4 w-4" />}
          result={protectedResult}
          mode="protected"
        />
      </div>
    </section>
  );
}

function ResultCard({
  title,
  icon,
  result,
  mode,
}: {
  title: string;
  icon: React.ReactNode;
  result: DetectionResponse | null;
  mode: 'vulnerable' | 'protected';
}) {
  const blocked = mode === 'protected' && result?.blocked;
  const toneClass = mode === 'protected'
    ? blocked
      ? 'border-black bg-black text-white'
      : 'border-black/10 bg-white text-black'
    : 'border-black/10 bg-slate-50 text-black';

  return (
    <div className={`rounded-3xl border p-5 ${toneClass}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
          <h3 className="mt-2 text-xl font-semibold">{result?.prediction ?? 'Waiting'}</h3>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-3 text-black">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-600">{result?.message ?? 'Run the demo to see the result.'}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-black/5 bg-white p-3">
          <span className="block text-slate-500">Status</span>
          <span className="mt-1 block font-semibold text-black">{result?.status ?? 'idle'}</span>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-3">
          <span className="block text-slate-500">Confidence</span>
          <span className="mt-1 block font-semibold text-black">{result ? `${Math.round(result.confidence * 100)}%` : '--'}</span>
        </div>
      </div>

      {mode === 'vulnerable' && result?.simulatedData?.length ? (
        <div className="mt-4 rounded-2xl border border-black/5 bg-white p-3 text-sm text-black">
          <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Exposed data</span>
          <div className="mt-2 space-y-1 font-mono text-xs text-slate-700">
            {result.simulatedData.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}