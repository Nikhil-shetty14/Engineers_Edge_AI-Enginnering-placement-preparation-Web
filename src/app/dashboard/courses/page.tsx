'use client';
import { useMemoFirebase } from '@/firebase';
import { useCollection, type WithId } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Loader2, BookOpen, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { seedCourses } from '@/lib/seed-courses';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface Course {
  title: string;
  description: string;
  category: string;
}

function CourseCard({ course }: { course: WithId<Course> }) {
  return (
    <Link href={`/dashboard/courses/${course.id}`}>
      <Card className="h-full hover:border-primary transition-all hover:-translate-y-1 glass-card">
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-4">
            <span className="font-headline">{course.title}</span>
            <Badge variant="secondary">{course.category}</Badge>
          </CardTitle>
          <CardDescription className="pt-2">{course.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default function CoursesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const coursesQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'courses'));
  }, [firestore]);

  const { data: courses, isLoading, error, refetch } = useCollection<Course>(coursesQuery);

  const handleSeedCourses = async () => {
    setIsSeeding(true);
    try {
      await seedCourses(firestore);
      toast({
        title: 'Courses Seeded',
        description: 'The database has been populated with sample courses.',
      });
      refetch(); // Refetch the collection data
    } catch (e) {
      console.error('Error seeding courses:', e);
      toast({
        title: 'Error Seeding Courses',
        description: 'Could not seed the database. Check the console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-headline font-bold mb-4">Courses</h1>
      <p className="text-muted-foreground mb-8">
        Expand your knowledge with our curated collection of courses.
      </p>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {error && (
         <Alert variant="destructive">
            <BookOpen className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Could not load courses. Please try again later.
            </AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && (
        <>
          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Courses Found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your course catalog is empty. Populate it with our sample placement-related courses.
              </p>
              <Button onClick={handleSeedCourses} disabled={isSeeding} className="mt-4">
                {isSeeding ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                Seed Courses
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
