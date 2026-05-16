"use client";

import { DemoWebsitePage } from '@/components/DemoWebsitePage';

export default function ProtectedPage() {
  return (
    <DemoWebsitePage
      mode="protected"
      title="News Portal"
      subtitle="The same website, but every search, login, and comment is checked first and suspicious input gets blocked."
    />
  );
}
