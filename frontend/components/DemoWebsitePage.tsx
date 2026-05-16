"use client";

import { useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Search, Shield, UserCircle2, MessageSquare, AlertTriangle, ShieldAlert } from 'lucide-react';

import { detectAttack, simulateVulnerable } from '@/services/api';
import type { DetectionResponse } from '@/lib/types';

type DemoWebsitePageProps = {
  mode: 'vulnerable' | 'protected';
  title: string;
  subtitle: string;
};

const sampleQueries = [
  'latest security article',
  "' OR 1=1 --",
  "<script>alert('xss')</script>",
];

export function DemoWebsitePage({ mode, title, subtitle }: DemoWebsitePageProps) {
  const [searchQuery, setSearchQuery] = useState('latest security article');
  const [username, setUsername] = useState('demo_admin');
  const [password, setPassword] = useState('password123');
  const [comment, setComment] = useState('');
  const [result, setResult] = useState<DetectionResponse | null>(null);
  const [lastAction, setLastAction] = useState('Waiting for your first action.');
  const [loading, setLoading] = useState(false);

  const exposedData = useMemo(() => result?.simulatedData ?? [], [result]);

  async function runAction(payload: string, label: string) {
    setLoading(true);
    setLastAction(label);
    try {
      const response = mode === 'protected' ? await detectAttack(payload) : await simulateVulnerable(payload);
      setResult(response);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction(`SEARCH query=${searchQuery}`, 'Search submitted');
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction(`LOGIN username=${username} password=${password}`, 'Login submitted');
  }

  async function handleComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await runAction(`COMMENT text=${comment}`, 'Comment posted');
    setComment('');
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{mode === 'protected' ? 'Protected site' : 'Vulnerable site'}</p>
            <h1 className="mt-2 text-3xl font-semibold text-black">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{subtitle}</p>
          </div>
          <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black">
            {loading ? 'Processing...' : result ? result.status : 'Ready'}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <header className="glass-panel rounded-[2rem] p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-black text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sentinel</p>
                <p className="text-sm text-slate-600">Security blog, profile, and activity feed</p>
              </div>
              <form onSubmit={handleSearch} className="flex w-full gap-2 sm:w-auto">
                <div className="flex w-full items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 sm:w-[320px]">
                  <Search className="h-4 w-4 text-slate-500" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full bg-transparent text-sm text-black outline-none placeholder:text-slate-400"
                    placeholder="Search site"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Search
                </button>
              </form>
            </div>
          </header>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="glass-panel rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Featured article</p>
              <h2 className="mt-2 text-xl font-semibold text-black">How websites get attacked</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Try typing normal text, SQL injection, or XSS payloads. The site still looks normal, but the protection behavior changes.</p>
            </article>

            <article className="glass-panel rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Profile</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-slate-50 text-black">
                  <UserCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-black">demo_admin</h2>
                  <p className="text-sm text-slate-600">Security analyst</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-black/5 bg-slate-50 p-3">
                  <span className="block text-slate-500">Posts</span>
                  <span className="mt-1 block font-semibold text-black">24</span>
                </div>
                <div className="rounded-2xl border border-black/5 bg-slate-50 p-3">
                  <span className="block text-slate-500">Role</span>
                  <span className="mt-1 block font-semibold text-black">Admin</span>
                </div>
              </div>
            </article>
          </section>

          <section className="glass-panel rounded-3xl p-5">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-black" />
              <h2 className="text-xl font-semibold text-black">Sign in</h2>
            </div>
            <form onSubmit={handleLogin} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-slate-400"
                placeholder="Username"
              />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-slate-400"
                placeholder="Password"
                type="password"
              />
              <button className="rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">Login</button>
            </form>
          </section>

          <section className="glass-panel rounded-3xl p-5">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-black" />
              <h2 className="text-xl font-semibold text-black">Community post</h2>
            </div>
            <form onSubmit={handleComment} className="mt-4 space-y-3">
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="min-h-[120px] w-full rounded-3xl border border-black/10 bg-white p-4 text-sm text-black outline-none placeholder:text-slate-400"
                placeholder="Write a post, request data, or test a payload"
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-600">Use this like a normal website comment box.</p>
                <button className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800">Publish</button>
              </div>
            </form>
          </section>

          <section className="glass-panel rounded-3xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recent posts</p>
            <div className="mt-4 space-y-3">
              {[
                'New security update is live.',
                'Weekly incident review published.',
                'User dashboard refreshed this morning.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 p-4 text-sm text-black">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <ResultStatus result={result} mode={mode} />

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Last action</p>
            <p className="mt-2 text-sm text-black">{lastAction}</p>
          </motion.div>

          <AnimatePresence>
            {mode === 'vulnerable' && exposedData.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                className="rounded-3xl border border-black/5 bg-white p-5"
              >
                <div className="flex items-center gap-3 text-black">
                  <AlertTriangle className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Exposed data</h2>
                </div>
                <div className="mt-4 space-y-2 rounded-2xl border border-black/5 bg-slate-50 p-4 text-sm text-black">
                  {exposedData.map((item) => (
                    <div key={item} className="font-mono text-xs">
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

function ResultStatus({
  result,
  mode,
}: {
  result: DetectionResponse | null;
  mode: 'vulnerable' | 'protected';
}) {
  const blocked = mode === 'protected' && result?.blocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl p-5 ${blocked ? 'bg-black text-white' : 'glass-panel text-black'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Security status</p>
          <h2 className="mt-2 text-xl font-semibold">{result?.prediction ?? 'Ready'}</h2>
        </div>
        <div className={`rounded-2xl border p-3 ${blocked ? 'border-white/10 bg-white text-black' : 'border-black/10 bg-white text-black'}`}>
          {blocked ? <ShieldAlert className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-black/5 bg-white p-3">
          <span className="block text-slate-500">Mode</span>
          <span className="mt-1 block font-semibold text-black">{mode}</span>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-3">
          <span className="block text-slate-500">Confidence</span>
          <span className="mt-1 block font-semibold text-black">{result ? `${Math.round(result.confidence * 100)}%` : '--'}</span>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600">{result?.message ?? 'Use the site actions to test normal text or suspicious input.'}</p>
    </motion.div>
  );
}