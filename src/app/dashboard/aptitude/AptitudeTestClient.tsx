'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateQuiz, type GenerateQuizOutput, type QuizQuestion } from '@/ai/flows/generate-quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, ArrowLeft, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useAuth, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';

interface QuizResult {
  question: QuizQuestion;
  selectedAnswer: string;
  isCorrect: boolean;
}

export default function AptitudeTestClient({ topic, onBack }: { topic: string; onBack: () => void }) {
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const generatedQuiz = await generateQuiz({ topic: `Aptitude Test: ${topic}`, numQuestions: 10 });
        setQuiz(generatedQuiz);
      } catch (error) {
        toast({
          title: 'Error generating test',
          description: 'Could not fetch questions. Please try again.',
          variant: 'destructive',
        });
        onBack();
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const saveAptitudeTestAttempt = useCallback(async (finalResults: QuizResult[], finalQuiz: GenerateQuizOutput) => {
    if (!auth.currentUser) return;

    const score = finalResults.filter(r => r.isCorrect).length;
    const totalQuestions = finalQuiz.questions.length;

    const attemptsCol = collection(
      firestore,
      'users',
      auth.currentUser.uid,
      'aptitudeTestAttempts'
    );
    addDocumentNonBlocking(attemptsCol, {
      userId: auth.currentUser.uid,
      topic: topic,
      score,
      totalQuestions,
      completedAt: serverTimestamp(),
    });
    
    toast({
        title: "Test attempt saved!",
        description: "Your results have been saved to your profile."
    });

  }, [auth.currentUser, firestore, topic, toast]);

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const newResult = { question: currentQuestion, selectedAnswer, isCorrect };
    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    setIsAnswered(true);

    if (currentQuestionIndex === quiz.questions.length - 1) {
      saveAptitudeTestAttempt(updatedResults, quiz);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="mt-4 text-muted-foreground">Generating your {topic} test...</p>
      </div>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className="text-center">
        <p>Could not load the test. Please try again.</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const isQuizFinished = currentQuestionIndex >= quiz.questions.length;

  if (isQuizFinished) {
    const score = results.filter(r => r.isCorrect).length;
    const total = quiz.questions.length;
    return (
      <div className="w-full">
         <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2" /> Back to Topics
        </Button>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Test Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold">{score} / {total}</p>
            <p className="text-muted-foreground">Your Score</p>
          </CardContent>
        </Card>
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold">Review Your Answers</h2>
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base font-semibold">{index + 1}. {result.question.questionText}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  result.isCorrect ? 'text-green-600' : 'text-red-600'
                )}>
                  {result.isCorrect ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                  Your answer: {result.selectedAnswer}
                </p>
                {!result.isCorrect && <p className="text-sm mt-2">Correct answer: {result.question.correctAnswer}</p>}
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 border-t text-sm">
                <Lightbulb size={16} className="mr-2 shrink-0 text-amber-500" />
                <p>{result.question.explanation}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="w-full">
       <Button onClick={onBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2" /> Back to Topics
        </Button>
      <Progress value={progress} className="mb-4" />
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardTitle>
          <p className="pt-4 font-medium">{currentQuestion.questionText}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => {
              const isCorrect = option === currentQuestion.correctAnswer;
              const isSelected = option === selectedAnswer;
              
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={cn(
                    "w-full justify-start p-4 h-auto text-wrap",
                    isSelected && !isAnswered && "border-primary ring-2 ring-primary",
                    isAnswered && isCorrect && "bg-green-100 border-green-300 text-green-900 hover:bg-green-100",
                    isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-300 text-red-900 hover:bg-red-100"
                  )}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                >
                  {isAnswered && (isCorrect ? <CheckCircle className="mr-2 text-green-600" /> : (isSelected ? <XCircle className="mr-2 text-red-600"/> : <div className="w-6 mr-2"/>))}
                  {option}
                </Button>
              )
            })}
          </div>
          {isAnswered && (
            <Card className="p-4 bg-muted/50 border-dashed">
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                    <Lightbulb className="text-amber-500" size={16} />
                    Explanation
                </div>
                <p className="text-xs text-muted-foreground">{currentQuestion.explanation}</p>
            </Card>
          )}
        </CardContent>
        <CardFooter>
          {isAnswered ? (
            <Button onClick={handleNextQuestion} className="w-full">
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Test' : 'Next Question'}
            </Button>
          ) : (
            <Button onClick={handleSubmitAnswer} className="w-full" disabled={!selectedAnswer}>
              Submit Answer
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
