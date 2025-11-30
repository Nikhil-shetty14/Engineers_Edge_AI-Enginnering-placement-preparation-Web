'use client';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const colors = [
  '#2563eb', // blue-600
  '#8b5cf6', // violet-500
  '#4f46e5', // indigo-600
  '#0ea5e9', // sky-500
];

export function Sphere({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [color, setColor] = useState<string | null>(null);

  useEffect(() => {
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  }, []);

  if (!color) {
    return null; // Or a placeholder
  }

  return (
    <div
      className={cn(
        'absolute rounded-full mix-blend-lighten animate-pulse',
        className
      )}
      style={{
        backgroundColor: color,
        boxShadow: `0 0 1rem ${color}, 0 0 2rem ${color}, 0 0 4rem ${color}`,
      }}
      {...props}
    />
  );
}

export function Spherovanni() {
  return (
    <div className="relative h-full w-full">
      <Sphere className="h-1/3 w-1/3 left-[-10%] top-[-5%]" />
      <Sphere className="h-1/2 w-1/2 right-[-20%] bottom-[-10%]" />
      <Sphere className="h-1/4 w-1/4 left-[30%] bottom-[20%]" />
    </div>
  );
}
