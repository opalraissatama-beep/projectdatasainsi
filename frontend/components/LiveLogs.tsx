"use client";

import { motion } from 'framer-motion';

import type { LogItem } from '@/lib/types';

type LiveLogsProps = {
  logs: LogItem[];
};

export function LiveLogs({ logs }: LiveLogsProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recent Logs</p>
          <h3 className="mt-1 text-xl font-semibold text-black">Latest activity</h3>
        </div>
        <span className="rounded-full border border-black/10 bg-black px-3 py-1 text-xs font-semibold text-white">
          {logs.length} events
        </span>
      </div>
      <div className="terminal-scroll mt-4 max-h-[420px] space-y-3 overflow-auto pr-1">
        {logs.map((log) => (
          <div key={log.id} className="rounded-2xl border border-black/5 bg-slate-50 p-4 text-sm">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
              <span className={log.blocked ? 'text-black font-semibold' : 'text-slate-700 font-semibold'}>{log.status}</span>
              <span>•</span>
              <span>{log.prediction}</span>
              <span>•</span>
              <span>{Math.round(log.confidence * 100)}%</span>
            </div>
            <p className="mt-2 text-slate-900">{log.text}</p>
            <p className="mt-1 text-xs text-slate-500">{log.timestamp}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
