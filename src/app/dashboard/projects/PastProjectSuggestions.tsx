'use client';
import { useMemoFirebase, useAuth, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, type WithId } from '@/firebase/firestore/use-collection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import type { SuggestProjectsOutput } from '@/ai/flows/suggest-projects';

type ProjectSuggestion = SuggestProjectsOutput['projects'][0] & {
  originalPrompt: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function PastProjectSuggestions() {
  const auth = useAuth();
  const firestore = useFirestore();

  const suggestionsQuery = useMemoFirebase(() => {
    if (!auth.currentUser) return null;
    return query(
      collection(firestore, 'users', auth.currentUser.uid, 'projectSuggestions'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [auth.currentUser, firestore]);

  const { data: suggestions, isLoading } = useCollection<ProjectSuggestion>(suggestionsQuery);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-headline font-bold mb-4">
        Recent Project Suggestions
      </h2>
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {!isLoading && (!suggestions || suggestions.length === 0) && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              You haven't generated any project suggestions yet.
            </p>
          </CardContent>
        </Card>
      )}
      {!isLoading && suggestions && suggestions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {suggestions.map((suggestion: WithId<ProjectSuggestion>) => (
                <AccordionItem key={suggestion.id} value={suggestion.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4 text-left">
                      <span className="truncate">
                        {suggestion.title}
                      </span>
                      <span className="text-sm text-muted-foreground shrink-0 ml-4">
                        {suggestion.createdAt?.seconds
                          ? formatDistanceToNow(new Date(suggestion.createdAt.seconds * 1000), { addSuffix: true })
                          : ''}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base">{suggestion.title}</CardTitle>
                             <CardDescription>From prompt: "{suggestion.originalPrompt}"</CardDescription>
                        </CardHeader>
                         <CardContent>
                            <p className="text-sm mb-4">{suggestion.description}</p>
                            <h4 className="font-semibold mb-2 text-sm">Key Features:</h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {suggestion.features.map((feature, i) => <li key={i}>{feature}</li>)}
                            </ul>
                            <h4 className="font-semibold mt-4 mb-2 text-sm">Tech Stack:</h4>
                            <p className="text-sm text-muted-foreground">{suggestion.techStack.join(', ')}</p>
                         </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
