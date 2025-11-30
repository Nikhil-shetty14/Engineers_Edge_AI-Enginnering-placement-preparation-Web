'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoveRight } from 'lucide-react';
import { Spherovanni } from './3d-spheres';
import { useUser } from '@/firebase';

export default function Hero({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const userName = user?.displayName?.split(' ')[0] || 'User';

  const handleGetStartedClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <Spherovanni />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center w-full">
        <div className="max-w-4xl w-full mx-auto">
          {!isUserLoading && user && (
            <div className="mb-8 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 light:from-blue-900 light:to-blue-500">
                Welcome, {userName}
              </h2>
              <p className="text-md text-muted-foreground mt-2">
                You're logged in. Click "Get Started" or use the sidebar to explore the features.
              </p>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 light:text-black light:bg-none animate-fade-in-up [animation-delay:200ms]">
            AI Powered Placement Preparation Platform
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up [animation-delay:400ms]">
            Unlock your potential with smart job discovery, personalized resume building, and AI interview simulations
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10 animate-fade-in-up [animation-delay:600ms]">
            <Button
              onClick={handleGetStartedClick}
              size="lg"
              className="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-300 w-full sm:w-auto group"
            >
              Get Started <MoveRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent/20 border-blue-400/50 hover:bg-blue-400/10 hover:text-white">
              <Link href="/dashboard/interview">Try Interview Sim</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
