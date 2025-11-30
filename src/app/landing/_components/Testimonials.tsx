'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  {
    quote: "Engineering Edge AI completely transformed my job search. The AI-matched jobs were incredibly relevant, and the resume builder is a game-changer.",
    name: 'Sarah L.',
    title: 'Senior Frontend Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1080&auto=format&fit=crop',
  },
  {
    quote: "I used to dread technical interviews. The interview simulator helped me build confidence and land my dream job at a FAANG company.",
    name: 'Michael B.',
    title: 'Backend Developer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1080&auto=format&fit=crop',
  },
  {
    quote: "As a recent graduate, this platform was invaluable. The skill tracking and quizzes helped me identify my weaknesses and prepare effectively.",
    name: 'Jessica Y.',
    title: 'Software Engineer I',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1080&auto=format&fit=crop',
  },
  {
    quote: "The best career tool for engineers, period. It's like having a personal career coach, resume writer, and interview prep expert all in one.",
    name: 'David C.',
    title: 'DevOps Specialist',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1080&auto=format&fit=crop'
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background/50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300 light:from-purple-900 light:to-purple-500">
          Loved by Engineers Worldwide
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Don't just take our word for it. Here's what our users are saying.
        </p>

        <Carousel
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 5000 })]}
          className="mt-12"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-4">
                  <Card className="glass-card h-full">
                    <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                      <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                      <div className="flex items-center gap-4 mt-6">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name}/>
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='hidden md:flex' />
          <CarouselNext className='hidden md:flex' />
        </Carousel>
      </div>
    </section>
  );
}
