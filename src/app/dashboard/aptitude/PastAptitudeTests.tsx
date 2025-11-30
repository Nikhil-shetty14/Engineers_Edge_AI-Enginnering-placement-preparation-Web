
'use client';

import { useMemoFirebase, useAuth, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection, type WithId } from '@/firebase/firestore/use-collection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AptitudeTestAttempt {
  topic: string;
  score: number;
  totalQuestions: number;
  completedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function PastAptitudeTests() {
  const auth = useAuth();
  const firestore = useFirestore();

  const attemptsQuery = useMemoFirebase(() => {
    if (!auth.currentUser) return null;
    return query(
      collection(firestore, 'users', auth.currentUser.uid, 'aptitudeTestAttempts'),
      orderBy('completedAt', 'desc'),
      limit(10)
    );
  }, [auth.currentUser, firestore]);

  const { data: attempts, isLoading } = useCollection<AptitudeTestAttempt>(attemptsQuery);

  const getScoreVariant = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-headline font-bold mb-4">
        Recent Aptitude Test Attempts
      </h2>
      <Card>
        <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>Your last 10 aptitude test attempts.</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading && (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            {!isLoading && (!attempts || attempts.length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                You haven't completed any aptitude tests yet.
                </p>
            )}
            {!isLoading && attempts && attempts.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Topic</TableHead>
                        <TableHead className="text-center">Score</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attempts.map((attempt: WithId<AptitudeTestAttempt>) => (
                        <TableRow key={attempt.id}>
                            <TableCell className="font-medium">{attempt.topic}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant={getScoreVariant(attempt.score, attempt.totalQuestions)}>
                                    {attempt.score} / {attempt.totalQuestions}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground text-xs">
                            {attempt.completedAt?.seconds
                                ? formatDistanceToNow(new Date(attempt.completedAt.seconds * 1000), {
                                    addSuffix: true,
                                })
                                : ''}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
