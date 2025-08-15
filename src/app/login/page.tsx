// src/app/login/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useState } from 'react';
import { getUserProfile } from '@/lib/firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Separator } from '@/components/ui/separator';
import { Chrome } from 'lucide-react';


const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});


export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resellerForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const adminForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'nitinpawar41@gmail.com',
      password: '',
    },
  });

  async function handleLogin(values: z.infer<typeof formSchema>, role: 'reseller' | 'admin') {
    setIsSubmitting(true);
    const { email, password } = values;
    const { user, error } = await signInWithEmail(email, password);

    if (error || !user) {
      toast({
        title: 'Login Failed',
        description: error?.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Verify role from Firestore
    const { profile, error: profileError } = await getUserProfile(user.uid);
    
    if (profileError || !profile) {
      await signOut(auth); // Sign out if profile doesn't exist
      toast({
        title: 'Login Failed',
        description: 'Could not find a user profile for this account.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    if (profile.role !== role) {
       await signOut(auth); // Sign out if role is incorrect
       toast({
        title: 'Access Denied',
        description: `You are not authorized to log in as a ${role}.`,
        variant: 'destructive',
      });
       setIsSubmitting(false);
       return;
    }

    toast({
      title: 'Success!',
      description: 'You have successfully logged in.',
    });

    if (role === 'admin') {
        router.push('/admin/products');
    } else {
        router.push('/account');
    }
    setIsSubmitting(false);
  }

  const handleAdminGoogleSignIn = async () => {
    setIsSubmitting(true);
    const { user, error } = await signInWithGoogle();

    if (error || !user) {
      toast({ title: 'Login Failed', description: error?.message || 'Could not sign in with Google.', variant: 'destructive'});
      setIsSubmitting(false);
      return;
    }

    // This is a critical security check.
    // Only the specified admin email can proceed.
    if (user.email !== 'nitinpawar41@gmail.com') {
      await signOut(auth);
      toast({ title: 'Access Denied', description: 'This Google account is not authorized for admin access.', variant: 'destructive'});
      setIsSubmitting(false);
      return;
    }

    // Verify the role from Firestore as an extra precaution.
    const { profile, error: profileError } = await getUserProfile(user.uid);
    if (profileError || profile?.role !== 'admin') {
        await signOut(auth);
        toast({ title: 'Access Denied', description: 'This Google account is not configured as an admin in the database.', variant: 'destructive'});
        setIsSubmitting(false);
        return;
    }

    toast({ title: 'Success!', description: 'Admin logged in successfully.' });
    router.push('/admin/products');
    setIsSubmitting(false);
  }

  return (
    <div className="container py-12">
       <div className="max-w-md mx-auto">
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-4xl font-headline">Login</CardTitle>
                <CardDescription>Access your account</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="reseller" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="reseller">Reseller</TabsTrigger>
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                    </TabsList>
                    <TabsContent value="reseller">
                        <Form {...resellerForm}>
                            <form onSubmit={resellerForm.handleSubmit((values) => handleLogin(values, 'reseller'))} className="space-y-4 pt-4">
                            <FormField
                                control={resellerForm.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <Input type="email" placeholder="reseller@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={resellerForm.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" placeholder="Your Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Logging in...' : 'Login as Reseller'}
                            </Button>
                            </form>
                        </Form>
                         <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="underline">
                                Create an account
                            </Link>
                        </div>
                    </TabsContent>
                    <TabsContent value="admin">
                       <Form {...adminForm}>
                            <form onSubmit={adminForm.handleSubmit((values) => handleLogin(values, 'admin'))} className="space-y-4 pt-4">
                            <FormField
                                control={adminForm.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                    <Input type="email" {...field} readOnly />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={adminForm.control}
                                name="password"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" placeholder="Admin Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Logging in...' : 'Login as Admin'}
                            </Button>
                            </form>
                        </Form>
                        <div className="relative my-4">
                            <Separator />
                            <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">OR</span>
                        </div>
                         <Button variant="outline" className="w-full" onClick={handleAdminGoogleSignIn} disabled={isSubmitting}>
                           <Chrome className="mr-2 h-4 w-4" /> Sign in with Google
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
