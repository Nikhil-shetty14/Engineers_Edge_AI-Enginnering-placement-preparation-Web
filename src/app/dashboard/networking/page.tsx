'use client';

import { useState, useRef, useEffect } from 'react';
import {
  provideAiNetworkingSuggestions,
  type NetworkingSuggestionOutput,
} from '@/ai/flows/provide-ai-networking-suggestions';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Users, Calendar, Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function NetworkingSuggestions({
  suggestions,
}: {
  suggestions: NetworkingSuggestionOutput;
}) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
          <Users className="text-primary" />
          Networking
        </h2>
        {suggestions.networkingSuggestions.length > 0 ? (
          suggestions.networkingSuggestions.map((s, i) => (
            <Card key={`net-${i}`}>
              <CardContent className="pt-6 text-sm">{s}</CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No suggestions.</p>
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
          <Lightbulb className="text-primary" />
          Mentorship
        </h2>
        {suggestions.mentorshipOpportunities.length > 0 ? (
          suggestions.mentorshipOpportunities.map((s, i) => (
            <Card key={`men-${i}`}>
              <CardContent className="pt-6 text-sm">{s}</CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No opportunities found.</p>
        )}
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
          <Calendar className="text-primary" />
          Events
        </h2>
        {suggestions.collaborationEvents.length > 0 ? (
          suggestions.collaborationEvents.map((s, i) => (
            <Card key={`evt-${i}`}>
              <CardContent className="pt-6 text-sm">{s}</CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No events found.</p>
        )}
      </div>
    </div>
  );
}

export default function NetworkingPage() {
  const [goals, setGoals] = useState('');
  const [suggestions, setSuggestions] =
    useState<NetworkingSuggestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const userProfile =
    'Software Engineer with 5 years experience in web development, specializing in React and Node.js. Interested in open-source and mentoring junior developers.';

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = (event: any) => {
        toast({
          title: 'Speech recognition error',
          description: event.error,
          variant: 'destructive',
        });
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setGoals((prev) => prev + finalTranscript + ' ');
        }
      };
    }

    return () => recognitionRef.current?.stop();
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

  const handleGetSuggestions = async () => {
    if (!goals.trim()) {
      toast({
        title: 'Goals cannot be empty',
        description: 'Please tell us your networking goals.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSuggestions(null);

    try {
      const result = await provideAiNetworkingSuggestions({
        userProfile,
        networkingGoals: goals,
      });
      setSuggestions(result);

      // Construct speech
      let speech = "Here are your suggestions. ";
      if (result.networkingSuggestions.length > 0) {
        speech += "For networking: " + result.networkingSuggestions.join('. ') + ". ";
      }
      if (result.mentorshipOpportunities.length > 0) {
        speech += "For mentorship: " + result.mentorshipOpportunities.join('. ') + ". ";
      }
      if (result.collaborationEvents.length > 0) {
        speech += "For events: " + result.collaborationEvents.join('. ') + ". ";
      }

      await speak(speech);

    } catch (error) {
      toast({
        title: 'Error getting suggestions',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Speech recognition not supported',
        description: 'Your browser does not support this feature.',
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
    <div className="w-full">
      <audio ref={audioRef} className="hidden" />
      <h1 className="text-3xl font-headline font-bold mb-4">
        AI Networking &amp; Mentorship
      </h1>
      <p className="text-muted-foreground mb-6">
        Tell us your networking goals, and our AI will connect you with the
        right people and opportunities. You can type or use your voice.
      </p>
      <div className="space-y-4">
        <Textarea
          name="goals"
          placeholder="e.g., I want to find a mentor in the AI/ML space, contribute to an open-source project, and attend local tech meetups."
          className="min-h-[150px]"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={handleGetSuggestions} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Suggestions
          </Button>
          <Button
            onClick={toggleRecording}
            variant={isRecording ? 'destructive' : 'outline'}
            size="icon"
            disabled={isLoading}
          >
            {isRecording ? <MicOff /> : <Mic />}
            <span className="sr-only">
              {isRecording ? 'Stop recording' : 'Start recording'}
            </span>
          </Button>
        </div>
      </div>

      {isLoading && !suggestions && (
         <div className="flex items-center justify-center mt-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Generating suggestions...</p>
         </div>
      )}

      {suggestions && <NetworkingSuggestions suggestions={suggestions} />}
    </div>
  );
}
