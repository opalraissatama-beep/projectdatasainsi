import axios from 'axios';

import type { DetectionResponse, LogItem, StatsPayload } from '@/lib/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000',
  timeout: 15000,
});

export async function detectAttack(text: string): Promise<DetectionResponse> {
  const response = await api.post<DetectionResponse>('/predict', { text, source: 'protected' });
  return response.data;
}

export async function simulateVulnerable(text: string): Promise<DetectionResponse> {
  const response = await api.post<DetectionResponse>('/vulnerable', { text });
  return response.data;
}

export async function fetchLogs(limit = 25): Promise<LogItem[]> {
  const response = await api.get<{ items: LogItem[] }>('/logs', { params: { limit } });
  return response.data.items;
}

export async function fetchStats(): Promise<StatsPayload> {
  const response = await api.get<StatsPayload>('/stats');
  return response.data;
}
