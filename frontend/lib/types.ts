export type DetectionResponse = {
  status: 'blocked' | 'allowed' | 'success' | 'unprotected';
  prediction: string;
  confidence: number;
  message?: string | null;
  blocked?: boolean;
  simulatedData?: string[];
};

export type LogItem = {
  id: number;
  timestamp: string;
  text: string;
  prediction: string;
  confidence: number;
  status: string;
  blocked: number;
  source: string;
};

export type StatsPayload = {
  totalAttacks: number;
  blockedRequests: number;
  xssCount: number;
  sqliCount: number;
  normalTraffic: number;
  averageConfidence: number;
  timeline: Array<{
    timestamp: string;
    prediction: string;
    confidence: number;
    status: string;
    blocked: number;
  }>;
  systemStatus: string;
};
