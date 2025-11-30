'use client';

import { useState } from 'react';
import { suggestProjects, type SuggestProjectsOutput } from '@/ai/flows/suggest-projects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, ArrowRight } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import PastProjectSuggestions from './PastProjectSuggestions';

export default function ProjectSuggestionsPage() {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestProjectsOutput['projects']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleGenerateSuggestions = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt is empty',
        description: 'Please describe the project you want to build.',
        variant: 'destructive',
      });
      return;
    }
    if (!auth.currentUser) {
        toast({ title: "Not Authenticated", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    setSuggestions([]);

    try {
      const result = await suggestProjects({ prompt });
      setSuggestions(result.projects);

      const suggestionsCol = collection(
        firestore,
        'users',
        auth.currentUser.uid,
        'projectSuggestions'
      );
      for (const project of result.projects) {
        addDocumentNonBlocking(suggestionsCol, {
          ...project,
          userId: auth.currentUser.uid,
          originalPrompt: prompt,
          createdAt: serverTimestamp(),
        });
      }
      
      toast({
        title: 'Suggestions Generated!',
        description: 'Your new project ideas have been saved.',
      });

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Generating Suggestions',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-headline font-bold mb-4">
        AI Project Suggestions
      </h1>
      <p className="text-muted-foreground mb-6">
        Describe the kind of project you want to build (e.g., "a to-do list with React and Firebase") and let our AI generate ideas for you.
      </p>
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="project-prompt">Your Project Idea</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="project-prompt"
                placeholder="e.g., a fitness tracker using Next.js and AI"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleGenerateSuggestions();
                }}
              />
              <Button onClick={handleGenerateSuggestions} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Generating project ideas...</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-headline font-bold mb-4">
            Here are some ideas...
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((project, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <h4 className="font-semibold mb-2 text-sm">Key Features:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {project.features.map((feature, i) => <li key={i}>{feature}</li>)}
                  </ul>
                   <h4 className="font-semibold mt-4 mb-2 text-sm">Tech Stack:</h4>
                   <p className="text-sm text-muted-foreground">{project.techStack.join(', ')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <PastProjectSuggestions />
    </div>
  );
}
