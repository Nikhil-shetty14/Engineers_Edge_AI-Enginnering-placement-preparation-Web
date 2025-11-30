'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  simulateTechnicalInterview,
  type SimulateTechnicalInterviewOutput,
} from '@/ai/flows/simulate-technical-interviews';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  User,
  Bot,
  CheckCircle,
  XCircle,
  Mic,
  MicOff,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const Spline = dynamic(() => import('@splinetool/react-spline/next'), {
  ssr: false,
});


interface Message {
  role: 'user' | 'bot';
  content: string;
  feedback?: string;
  isSuitable?: boolean;
}

const userProfile =
  'Software Engineer with 5 years experience in web development, specializing in React and Node.js. Looking for a senior role.';
const jobDescription =
  'Senior Full-Stack Engineer role at a fast-growing tech startup. Requires strong knowledge of JavaScript, React, Node.js, and system design principles.';

export default function InterviewSimulatorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport =
        scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        toast({
          title: 'Speech recognition error',
          description: event.error,
          variant: 'destructive',
        });
        setIsRecording(false);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        setInput(interimTranscript);

        if (finalTranscript) {
          handleSendMessage(finalTranscript);
          setInput("");
        }
      };
    }

    return () => {
      recognitionRef.current?.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  const speak = async (text: string) => {
    try {
      const { audio } = await textToSpeech(text);
      if (audioRef.current) {
        audioRef.current.src = audio;
        audioRef.current.play();
      }
    } catch (error) {
      toast({ title: 'Error playing audio', variant: 'destructive' });
    }
  };

  const startInterview = async () => {
    setIsLoading(true);
    setMessages([]);
    try {
      const result = await simulateTechnicalInterview({
        userProfile,
        jobDescription,
      });
      setMessages([{ role: 'bot', content: result.question }]);
      await speak(result.question);
    } catch (error) {
      toast({ title: 'Error starting interview', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (answer: string) => {
    if (!answer.trim() || isLoading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: answer },
    ];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const previousQuestions = messages
        .filter((m) => m.role === 'bot')
        .map((m) => m.content);
      const result = await simulateTechnicalInterview({
        userProfile,
        jobDescription,
        userAnswer: answer,
        previousQuestions,
      });

      setMessages((currentMessages) => {
        const updatedMessages: Message[] = [...currentMessages];
        const lastUserMessageIndex = updatedMessages.findLastIndex(
          (m) => m.role === 'user'
        );
        if (lastUserMessageIndex !== -1) {
          updatedMessages[lastUserMessageIndex].feedback = result.feedback;
          updatedMessages[lastUserMessageIndex].isSuitable =
            result.isSuitableQuestion;
        }
        updatedMessages.push({ role: 'bot', content: result.question });
        return updatedMessages;
      });

      let speech = '';
      if (result.feedback) {
        speech += result.feedback + ' ';
      }
      speech += result.question;
      await speak(speech);

    } catch (error) {
      toast({ title: 'Error getting next question', variant: 'destructive' });
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
     if (!recognitionRef.current) {
      toast({
        title: 'Speech recognition not supported',
        description: 'Your browser does not support speech recognition.',
        variant: 'destructive',
      });
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };
  
  return (
    <div className="w-full h-[calc(100vh-10rem)] flex flex-col relative">
       <div className="absolute inset-0 z-0">
          <Spline scene="https://prod.spline.design/WYUDdzCjrWtHtZfp/scene.splinecode" />
       </div>
       <div className="relative z-10 flex flex-col flex-1 h-full">
        <audio ref={audioRef} className="hidden" />
        <h1 className="text-3xl font-headline font-bold mb-4">
            Voice Interview Simulator
        </h1>
        {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-6 max-w-sm p-4 rounded-lg bg-background/50 backdrop-blur-sm">
                Prepare for your technical interview with a voice assistant. Click start when you're ready.
            </p>
            <Button onClick={startInterview} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start Interview
            </Button>
            </div>
        ) : (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            <ScrollArea
                className="flex-1 p-4 border rounded-lg bg-card/50 backdrop-blur-sm"
                ref={scrollAreaRef}
            >
                <div className="space-y-6">
                {messages.map((message, index) => (
                    <div
                    key={index}
                    className={`flex items-start gap-4 ${
                        message.role === 'user' ? 'justify-end' : ''
                    }`}
                    >
                    {message.role === 'bot' && (
                        <div className="p-2 rounded-full bg-primary text-primary-foreground">
                        <Bot size={20} />
                        </div>
                    )}
                    <div className={`max-w-[75%] space-y-2`}>
                        <div
                        className={`p-4 rounded-lg ${
                            message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                        >
                        <p className="text-sm">{message.content}</p>
                        </div>
                        {message.feedback && (
                        <Card className="p-3 bg-background/80 border-dashed">
                            <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                            {message.isSuitable ? (
                                <CheckCircle className="text-green-500" size={16} />
                            ) : (
                                <XCircle className="text-red-500" size={16} />
                            )}
                            AI Feedback
                            </div>
                            <p className="text-xs text-muted-foreground">
                            {message.feedback}
                            </p>
                        </Card>
                        )}
                    </div>
                    {message.role === 'user' && (
                        <div className="p-2 rounded-full bg-accent text-accent-foreground">
                        <User size={20} />
                        </div>
                    )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary text-primary-foreground">
                        <Bot size={20} />
                    </div>
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}
                </div>
            </ScrollArea>
            <div className="flex items-start gap-4">
                <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRecording ? "Listening..." : "Type or speak your answer..."}
                className="flex-1 bg-background/80"
                rows={3}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(input);
                    }
                }}
                />
                <Button onClick={toggleRecording} variant={isRecording ? 'destructive' : 'outline'} size="icon" disabled={isLoading}>
                {isRecording ? <MicOff /> : <Mic />}
                </Button>
                <Button onClick={() => handleSendMessage(input)} disabled={isLoading}>
                Send
                </Button>
            </div>
            </div>
        )}
        </div>
    </div>
  );
}
