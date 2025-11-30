'use client';
import { useState } from 'react';
import Hero from '@/app/landing/_components/Hero';
import Features from '@/app/landing/_components/Features';
import Pricing from '@/app/landing/_components/Pricing';
import Testimonials from '@/app/landing/_components/Testimonials';
import FAQ from '@/app/landing/_components/FAQ';
import Footer from '@/app/landing/_components/Footer';
import Sidebar from '@/components/layout/sidebar';
import Link from 'next/link';
import { ArrowRight, Briefcase, MessageSquare, FileText } from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';


const features = [
  {
    icon: Briefcase,
    title: 'AI Job Matcher',
    description: 'Find your perfect job role.',
    href: '/dashboard/jobs',
  },
  {
    icon: MessageSquare,
    title: 'Interview Simulator',
    description: 'Practice for your interview.',
    href: '/dashboard/interview',
  },
  {
    icon: FileText,
    title: 'Resume Builder',
    description: 'Optimize your resume.',
    href: '/dashboard/resume',
  },
];

export default function LandingPage() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative w-full bg-background text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>
      
      {user && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
      
      <div className={cn(
        "min-h-screen transition-all duration-300 ease-in-out"
        )}>
        
        <TopNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="relative z-10 pt-16">
          <Hero setSidebarOpen={setSidebarOpen} />
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up [animation-delay:600ms]">
                {features.map((feature) => (
                  <Link
                    href={feature.href}
                    key={feature.title}
                    className="glass-card p-6 rounded-xl transition-all duration-300 hover:-translate-y-2 hover:border-accent flex flex-col text-left h-full group"
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mb-4 self-start border border-primary/20">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-headline text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground flex-grow">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                      Go to {feature.title.split(' ')[0]}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
            </div>
          </div>
          <Features />
          <Pricing />
          <Testimonials />
          <FAQ />
          <Footer />
        </div>
      </div>
    </div>
  );
}
