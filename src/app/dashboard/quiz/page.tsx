'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Database, Brain, Cpu } from 'lucide-react';
import QuizClient from './QuizClient';
import PastQuizzes from './PastQuizzes';

const topics = [
  { name: 'Python', icon: Code },
  { name: 'C', icon: Cpu },
  { name: 'React', icon: Code },
  { name: 'SQL', icon: Database },
  { name: 'System Design', icon: Brain },
];

export default function QuizPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  if (selectedTopic) {
    return (
      <QuizClient 
        topic={selectedTopic} 
        onBack={() => setSelectedTopic(null)} 
      />
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-headline font-bold mb-4">Tech Quiz</h1>
      <p className="text-muted-foreground mb-6">
        Select a domain to start a quiz and test your knowledge.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Choose a Topic</CardTitle>
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
      <PastQuizzes />
    </div>
  );
}
