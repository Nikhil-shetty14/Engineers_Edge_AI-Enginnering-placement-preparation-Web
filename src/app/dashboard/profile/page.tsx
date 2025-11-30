'use client';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useDoc } from '@/firebase/firestore/use-doc';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useMemo, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  linkedInProfile: z.string().url().optional().or(z.literal('')),
  gitHubProfile: z.string().url().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userProfileRef = useMemo(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading } = useDoc<ProfileFormValues>(
    userProfileRef
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      linkedInProfile: '',
      gitHubProfile: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      reset(userProfile);
    }
  }, [userProfile, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    if (!user) return;
    const profileRef = doc(firestore, 'users', user.uid);
    setDocumentNonBlocking(profileRef, { ...data, id: user.uid }, { merge: true });
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been saved successfully.',
    });
    reset(data);
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-headline font-bold mb-4">User Profile</h1>
      <p className="text-muted-foreground mb-6">
        Manage your personal and professional information.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            Update your information below. Your email is used for login and
            cannot be changed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input id="firstName" {...field} />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => <Input id="lastName" {...field} />}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input id="email" type="email" {...field} disabled />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedInProfile">LinkedIn Profile</Label>
                <Controller
                  name="linkedInProfile"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="linkedInProfile"
                      placeholder="https://linkedin.com/in/your-profile"
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gitHubProfile">GitHub Profile</Label>
                <Controller
                  name="gitHubProfile"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="gitHubProfile"
                      placeholder="https://github.com/your-username"
                      {...field}
                    />
                  )}
                />
              </div>
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
