"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, ShieldAlert, Waves } from 'lucide-react';

import { DashboardCards } from '@/components/DashboardCards';
import { LiveLogs } from '@/components/LiveLogs';
import { ThreatChart } from '@/components/ThreatChart';
import { StatusBadge } from '@/components/StatusBadge';
import { fetchLogs, fetchStats } from '@/services/api';
import type { LogItem, StatsPayload } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const [statsData, logsData] = await Promise.all([fetchStats(), fetchLogs(12)]);
      if (mounted) {
        setStats(statsData);
        setLogs(logsData);
      }
    }

    load();
    const interval = setInterval(load, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const metrics = [
    { label: 'Total', value: stats?.totalAttacks ?? 0, detail: 'All demo requests.', icon: 'activity' as const },
    { label: 'Blocked', value: stats?.blockedRequests ?? 0, detail: 'Stopped by AI-WAF.', icon: 'shield' as const },
    { label: 'XSS', value: stats?.xssCount ?? 0, detail: 'Script-like payloads.', icon: 'scan' as const },
    { label: 'SQLi', value: stats?.sqliCount ?? 0, detail: 'Injection-like payloads.', icon: 'lock' as const },
  ];

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2rem] p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-black">Simple overview</h1>
            <p className="mt-3 max-w-3xl text-slate-600">Quick view of traffic, blocks, and recent activity.</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={stats?.systemStatus ?? 'monitoring'} />
            <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black">Avg confidence {Math.round((stats?.averageConfidence ?? 0) * 100)}%</div>
          </div>
        </div>
      </section>

      <DashboardCards metrics={metrics} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ThreatChart stats={stats} />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <Waves className="h-5 w-5 text-black" />
            <h2 className="text-xl font-semibold text-black">What to look at</h2>
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-4">Total traffic and blocks.</div>
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-4">Latest requests and verdicts.</div>
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-4">Confidence of each detection.</div>
            <div className="rounded-2xl border border-black/5 bg-slate-50 p-4 flex items-center gap-2 text-black"><Database className="h-4 w-4" /> Data from SQLite.</div>
          </div>
        </motion.div>
      </div>

      <LiveLogs logs={logs} />
    </div>
  );
}
