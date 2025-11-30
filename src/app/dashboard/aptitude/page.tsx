'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Variable, BarChart } from 'lucide-react';
import AptitudeTestClient from './AptitudeTestClient';
import PastAptitudeTests from './PastAptitudeTests';

const topics = [
  { name: 'Logical Reasoning', icon: Lightbulb },
  { name: 'Numerical Ability', icon: BarChart },
  { name: 'Verbal Ability', icon: Variable },
];

export default function AptitudeTestPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  if (selectedTopic) {
    return (
      <AptitudeTestClient 
        topic={selectedTopic} 
        onBack={() => setSelectedTopic(null)} 
      />
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-headline font-bold mb-4">Aptitude Tests</h1>
      <p className="text-muted-foreground mb-6">
        Sharpen your cognitive skills with our AI-powered aptitude tests.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Choose a Category</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <Button
              key={topic.name}
              variant="outline"
              className="p-6 h-auto flex flex-col items-center justify-center gap-2"
              onClick={() => setSelectedTopic(topic.name)}
            >
              <topic.icon className="w-8 h-8 text-primary" />
              <span className="text-lg font-medium">{topic.name}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
      <PastAptitudeTests />
    </div>
  );
}
