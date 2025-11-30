'use client';

import { useState, useRef, useEffect } from 'react';
import { aiCodingAssistant } from '@/ai/flows/ai-coding-assistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Bot, Terminal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AiCodingAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport =
        scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = newMessages.slice(0, -1).map(msg => ({
          role: msg.role,
          content: msg.content
      }));

      const result = await aiCodingAssistant({
        prompt: currentInput,
        conversationHistory,
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'model', content: result.response },
      ]);
    } catch (error) {
      toast({
        title: 'Error getting response',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setMessages(messages); // Revert to previous messages on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-10rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-headline font-bold flex items-center gap-2">
          <Terminal className="w-8 h-8" />
          AI Coding Assistant
        </h1>
        <p className="text-muted-foreground">
          Your personal AI pair programmer. Ask questions, paste code, and get help.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea
          className="flex-1 p-4 border rounded-lg bg-card/50 backdrop-blur-sm"
          ref={scrollAreaRef}
        >
          <div className="space-y-6">
            {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <p>Start a conversation by typing a question below.</p>
                </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-4', message.role === 'user' && 'justify-end')}
              >
                {message.role === 'model' && (
                  <div className="p-2 rounded-full bg-primary text-primary-foreground self-start">
                    <Bot size={20} />
                  </div>
                )}
                <div className={cn('max-w-[85%] space-y-2', message.role === 'user' ? 'text-right' : 'text-left')}>
                  <div
                    className={cn(
                      'p-4 rounded-lg prose prose-sm dark:prose-invert max-w-none',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <ReactMarkdown
                      components={{
                        pre: ({node, ...props}) => <pre className="bg-background/50 p-2 rounded-md" {...props} />,
                        code: ({node, ...props}) => <code className="bg-background/50 px-1 py-0.5 rounded" {...props} />,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="p-2 rounded-full bg-accent text-accent-foreground self-start">
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
            placeholder="Ask a coding question or paste a code snippet..."
            className="flex-1 bg-background/80"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
