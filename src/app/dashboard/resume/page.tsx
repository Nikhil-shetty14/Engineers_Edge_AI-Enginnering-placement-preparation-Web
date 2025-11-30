
'use client';

import { useState } from 'react';
import { generateAiOptimizedResume } from '@/ai/flows/generate-ai-optimized-resume';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import ReactMarkdown from 'react-markdown';
import { useAuth, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import PreviousResumes from './PreviousResumes';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const fileToDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function ResumeBuilderPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [optimizedResumes, setOptimizedResumes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription) {
      toast({
        title: 'Missing Information',
        description: 'Please upload a resume and provide a job description.',
        variant: 'destructive',
      });
      return;
    }
    if (!auth.currentUser) {
      toast({
        title: 'Not Authenticated',
        description: 'You must be logged in to generate resumes.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setOptimizedResumes([]);

    try {
      const resumeDataUri = await fileToDataUri(resumeFile);
      const result = await generateAiOptimizedResume({
        resumeDataUri,
        jobDescription,
        numVariants: 3,
      });
      setOptimizedResumes(result.optimizedResumes);

      // Save to Firestore
      const generatedResumesCol = collection(
        firestore,
        'users',
        auth.currentUser.uid,
        'generatedResumes'
      );
      for (const resume of result.optimizedResumes) {
        addDocumentNonBlocking(generatedResumesCol, {
          userId: auth.currentUser.uid,
          jobDescription,
          resumeContent: resume,
          createdAt: serverTimestamp(),
        });
      }
      toast({
        title: 'Resumes Generated & Saved',
        description: 'Your new resume variants have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error Generating Resumes',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (resumeText: string, variant: number) => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    // Basic title for the PDF
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`AI-Optimized Resume - Variant ${variant}`, margin, margin);

    // Convert markdown-like text to plain text for PDF
    // This is a simplified conversion. For full markdown support, a more complex solution is needed.
    const plainText = resumeText
      .replace(/###\s/g, '')
      .replace(/##\s/g, '')
      .replace(/#\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '  - ')
      .replace(/__/g, '');

    const textLines = doc.splitTextToSize(plainText, pageWidth - margin * 2);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(textLines, margin, margin + 10);
    doc.save(`ai-optimized-resume-variant-${variant}.pdf`);
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-headline font-bold mb-4">
        Resume &amp; Portfolio Builder
      </h1>
      <p className="text-muted-foreground mb-6">
        Upload your current resume and paste a job description to generate
        AI-optimized variants. Your generated resumes will be saved.
      </p>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="resume-file">Upload Resume</Label>
              <Input
                id="resume-file"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) =>
                  setResumeFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                className="min-h-[200px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Resumes
            </Button>
          </form>
        </CardContent>
      </Card>

      {optimizedResumes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-headline font-bold mb-4">
            New AI-Optimized Resumes
          </h2>
          <Tabs defaultValue="variant-1">
            <TabsList>
              {optimizedResumes.map((_, index) => (
                <TabsTrigger key={index} value={`variant-${index + 1}`}>
                  Variant {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {optimizedResumes.map((resume, index) => (
              <TabsContent key={index} value={`variant-${index + 1}`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <p>Variant {index + 1}</p>
                      <Button
                        onClick={() => handleDownload(resume, index + 1)}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="prose prose-sm dark:prose-invert max-w-none bg-muted p-4 rounded-md">
                      <ReactMarkdown>{resume}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      <PreviousResumes />
    </div>
  );
}
