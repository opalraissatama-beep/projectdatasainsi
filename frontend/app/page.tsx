import { Hero } from '@/components/Hero';
import { LiveComparisonDemo } from '@/components/LiveComparisonDemo';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Hero />
      <LiveComparisonDemo />
    </div>
  );
}
