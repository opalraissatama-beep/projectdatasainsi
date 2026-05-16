"use client";

import { motion } from 'framer-motion';
import { ShieldCheck, Lock, ScanSearch, Activity } from 'lucide-react';

type DashboardCardsProps = {
  metrics: Array<{ label: string; value: number | string; detail: string; icon: 'shield' | 'lock' | 'scan' | 'activity' }>;
};

const iconMap = {
  shield: ShieldCheck,
  lock: Lock,
  scan: ScanSearch,
  activity: Activity,
};

export function DashboardCards({ metrics }: DashboardCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = iconMap[metric.icon];
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="glass-panel rounded-3xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold text-black">{metric.value}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-black p-3 text-white">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{metric.detail}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
