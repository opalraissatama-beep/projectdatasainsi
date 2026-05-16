"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, RefreshCw } from 'lucide-react';

import { fetchLogs } from '@/services/api';
import type { LogItem } from '@/lib/types';

export default function LogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchLogs(100).then((items) => {
      if (active) {
        setLogs(items);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2rem] p-8">
        <div className="flex items-center gap-3 text-black">
          <FileText className="h-5 w-5" />
          <p className="text-xs font-semibold uppercase tracking-[0.3em]">Incident archive</p>
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-black">Attack Logs</h1>
        <p className="mt-3 max-w-3xl text-slate-600">Every protected and vulnerable request is recorded here for quick review and easy understanding.</p>
      </section>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black">Recent entries</h2>
          <button className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black transition hover:bg-black hover:text-white">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-slate-500">Loading logs...</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-black/5 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>{log.timestamp}</span>
                  <span className={log.blocked ? 'text-black font-semibold' : 'text-slate-700 font-semibold'}>{log.status}</span>
                </div>
                <p className="mt-2 text-sm text-black">{log.text}</p>
                <p className="mt-2 text-xs text-slate-500">Prediction {log.prediction} • Confidence {Math.round(log.confidence * 100)}%</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
