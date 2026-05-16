"use client";

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Shield, TerminalSquare } from 'lucide-react';

import { detectAttack, simulateVulnerable } from '@/services/api';
import type { DetectionResponse } from '@/lib/types';

type AttackFormProps = {
  mode: 'protected' | 'vulnerable';
  onResult: (response: DetectionResponse) => void;
};

const examples = [
  "<script>alert('xss')</script>",
  "' OR 1=1 --",
  'Hello admin',
  "<img src=x onerror=alert('xss')>",
];

export function AttackForm({ mode, onResult }: AttackFormProps) {
  const [text, setText] = useState(examples[0]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = mode === 'protected' ? await detectAttack(text) : await simulateVulnerable(text);
      onResult(response);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl p-6"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-black/10 bg-black p-3 text-white">
          <TerminalSquare className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Input Tester</p>
          <h2 className="text-xl font-semibold text-black">Try a payload or normal input</h2>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-600">
        Choose an example below or type your own input. Vulnerable mode will show simulated exposed data, protected mode will block risky requests.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {examples.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => setText(sample)}
            className="rounded-full border border-black/10 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 transition hover:border-black hover:bg-black hover:text-white"
          >
            {sample}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="mt-4 min-h-[160px] w-full rounded-3xl border border-black/10 bg-white p-4 text-sm text-black outline-none ring-0 placeholder:text-slate-400 focus:border-black"
        placeholder="Paste payload or normal input here"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Shield className="h-4 w-4 text-black" />
          {mode === 'protected' ? 'Protected mode sends input to FastAPI and blocks attacks.' : 'Vulnerable mode renders the input and simulates exposure.'}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {loading ? 'Processing...' : mode === 'protected' ? 'Check and Block' : 'Show Exposure Demo'}
        </button>
      </div>
    </motion.form>
  );
}
