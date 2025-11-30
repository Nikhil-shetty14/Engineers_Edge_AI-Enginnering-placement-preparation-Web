'use client';

import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function JobMatchingForm({ profile }: { profile: string }) {
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProfile = formData.get('profile') as string;
    router.push(`/dashboard/jobs?profile=${encodeURIComponent(newProfile)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        name="profile"
        placeholder="e.g., Senior Frontend Engineer with 5 years of experience in React, TypeScript, and Next.js..."
        className="min-h-[200px] mb-4"
        defaultValue={profile}
      />
      <Button type="submit">Generate Suggestions</Button>
    </form>
  );
}
