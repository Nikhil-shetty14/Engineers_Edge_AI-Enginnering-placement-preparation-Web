'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc, type WithId } from '@/firebase/firestore/use-doc';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, BookOpen, Video, FileText } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Lesson {
  title: string;
  type: 'video' | 'text';
  content: string;
}

interface Course {
  title: string;
  description: string;
  category: string;
  lessons: Lesson[];
}

function LessonIcon({ type }: { type: 'video' | 'text' }) {
    if (type === 'video') {
        return <Video className="h-4 w-4 text-primary" />;
    }
    return <FileText className="h-4 w-4 text-primary" />;
}

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const firestore = useFirestore();

  const courseRef = useMemoFirebase(() => {
    if (typeof courseId !== 'string') return null;
    return doc(firestore, 'courses', courseId);
  }, [firestore, courseId]);

  const { data: course, isLoading, error } = useDoc<Course>(courseRef);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading course: {error.message}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center text-muted-foreground">
        Course not found.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-2">{course.category}</Badge>
        <h1 className="text-4xl font-headline font-bold mb-2">{course.title}</h1>
        <p className="text-lg text-muted-foreground">{course.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Course Curriculum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {course.lessons.map((lesson, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <LessonIcon type={lesson.type} />
                    <span>{lesson.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-muted/50 rounded-md">
                    {lesson.type === 'text' ? (
                       <p className="text-sm text-muted-foreground">{lesson.content}</p>
                    ) : (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Video content would be displayed here.</p>
                             <div className="mt-4 aspect-video bg-muted rounded-lg flex items-center justify-center">
                                <Video className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                        </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
