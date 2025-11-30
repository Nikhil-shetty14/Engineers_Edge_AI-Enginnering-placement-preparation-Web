
'use client';
import { useMemoFirebase, useAuth, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, type WithId } from '@/firebase/firestore/use-collection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface GeneratedResume {
  jobDescription: string;
  resumeContent: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function PreviousResumes() {
  const auth = useAuth();
  const firestore = useFirestore();

  const resumesQuery = useMemoFirebase(() => {
    if (!auth.currentUser) return null;
    return query(
      collection(firestore, 'users', auth.currentUser.uid, 'generatedResumes'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
  }, [auth.currentUser, firestore]);

  const { data: resumes, isLoading } = useCollection<GeneratedResume>(resumesQuery);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-headline font-bold mb-4">
        Recently Generated Resumes
      </h2>
      {isLoading && (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {!isLoading && (!resumes || resumes.length === 0) && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              You haven't generated any resumes yet.
            </p>
          </CardContent>
        </Card>
      )}
      {!isLoading && resumes && resumes.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {resumes.map((resume: WithId<GeneratedResume>) => (
                <AccordionItem key={resume.id} value={resume.id}>
                  <AccordionTrigger>
                    <div className='flex justify-between w-full pr-4'>
                        <span className='truncate'>
                            For: {resume.jobDescription.substring(0, 50)}...
                        </span>
                        <span className='text-sm text-muted-foreground shrink-0'>
                        {resume.createdAt?.seconds
                            ? formatDistanceToNow(new Date(resume.createdAt.seconds * 1000), {
                                addSuffix: true,
                            })
                            : ''}
                        </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none bg-muted p-4 rounded-md">
                      <ReactMarkdown>{resume.resumeContent}</ReactMarkdown>
                    </div>
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
