"use client";

import { useEffect, useRef } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

import type { StatsPayload } from '@/lib/types';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type ThreatChartProps = {
  stats: StatsPayload | null;
};

export function ThreatChart({ stats }: ThreatChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !stats) {
      return;
    }

    const context = canvasRef.current.getContext('2d');
    if (!context) {
      return;
    }

    const chart = new Chart(context, {
      type: 'bar',
      data: {
        labels: ['Blocked', 'XSS', 'SQLi', 'Normal'],
        datasets: [
          {
            label: 'Traffic Distribution',
            data: [stats.blockedRequests, stats.xssCount, stats.sqliCount, stats.normalTraffic],
            borderWidth: 1,
            borderRadius: 12,
            backgroundColor: ['rgba(17, 17, 17, 0.86)', 'rgba(17, 17, 17, 0.58)', 'rgba(17, 17, 17, 0.38)', 'rgba(17, 17, 17, 0.18)'],
            borderColor: 'rgba(17, 17, 17, 0.12)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#111111',
            },
          },
        },
        scales: {
          x: {
            ticks: { color: '#6b7280' },
            grid: { color: 'rgba(17, 17, 17, 0.06)' },
          },
          y: {
            ticks: { color: '#6b7280' },
            grid: { color: 'rgba(17, 17, 17, 0.06)' },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [stats]);

  return (
    <div className="glass-panel rounded-3xl p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Threat Analytics</p>
        <h3 className="mt-1 text-xl font-semibold text-black">Detection chart</h3>
      </div>
      <div className="h-[320px]">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
