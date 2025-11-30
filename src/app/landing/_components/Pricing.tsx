'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const tiers = [
  {
    name: 'Starter',
    priceMonthly: '$0',
    priceYearly: '$0',
    description: 'For individuals starting their career journey.',
    features: ['5 Job Matches per month', '3 AI Resume Generations', '2 Interview Simulations'],
    isFeatured: false,
  },
  {
    name: 'Pro',
    priceMonthly: '$29',
    priceYearly: '$290',
    description: 'For professionals aiming for the top.',
    features: [
      'Unlimited Job Matches',
      'Unlimited AI Resume Generations',
      'Unlimited Interview Simulations',
      'Advanced Skill Tracking',
      'Priority Support',
    ],
    isFeatured: true,
  },
  {
    name: 'Enterprise',
    priceMonthly: 'Contact Us',
    priceYearly: 'Contact Us',
    description: 'For teams and organizations.',
    features: ['All Pro features', 'Team Management', 'Custom Integrations', 'Dedicated Account Manager'],
    isFeatured: false,
  },
];

export default function Pricing() {
    const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 light:from-blue-900 light:to-blue-500">
            Find the Plan That's Right for You
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're just starting out or leading a team, we have a plan that fits your needs.
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 my-10">
          <Label htmlFor="billing-cycle" className="text-muted-foreground">Monthly</Label>
          <Switch id="billing-cycle" checked={isYearly} onCheckedChange={setIsYearly} />
          <Label htmlFor="billing-cycle" className="text-muted-foreground">Yearly (Save 15%)</Label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                'glass-card flex flex-col transition-all duration-300',
                tier.isFeatured ? 'border-accent shadow-accent/20 shadow-2xl scale-105' : 'hover:-translate-y-2'
              )}
            >
              <CardHeader className="p-8">
                <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="text-4xl font-bold mt-4">
                  {isYearly ? tier.priceYearly : tier.priceMonthly}
                  {tier.name !== 'Enterprise' && <span className="text-sm font-normal text-muted-foreground">/ {isYearly ? 'year' : 'month'}</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-8 pt-0">
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-8">
                <Button className="w-full" variant={tier.isFeatured ? 'default' : 'outline'}>
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
