'use client';
import { Briefcase, FileText, MessageSquare, Brain } from 'lucide-react';

const features = [
  {
    icon: Briefcase,
    title: 'AI Job Matcher',
    description: 'Our AI analyzes your unique skills and aspirations to find the perfect job roles you might have missed.',
  },
  {
    icon: FileText,
    title: 'Smart Resume Builder',
    description: 'Instantly tailor and optimize your resume for any job description, highlighting your strengths.',
  },
  {
    icon: MessageSquare,
    title: 'Interview Simulator',
    description: 'Practice with a hyper-realistic AI to ace your technical and behavioral interviews.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Quizzes',
    description: 'Sharpen your technical knowledge with adaptive quizzes that challenge you where you need it most.',
  },
];

export default function Features() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up [animation-delay:800ms]">
        {features.map((feature, i) => (
          <div key={i} className="glass-card p-6 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:border-accent flex flex-col text-left">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mb-4 self-start border border-primary/20">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="font-headline text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground flex-grow">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
