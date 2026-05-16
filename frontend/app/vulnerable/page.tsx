"use client";

import { DemoWebsitePage } from '@/components/DemoWebsitePage';

export default function VulnerablePage() {
  return (
    <DemoWebsitePage
      mode="vulnerable"
      title="News Portal"
      subtitle="A normal-looking site where search, login, and comments all keep working, even when the input is suspicious."
    />
  );
}
