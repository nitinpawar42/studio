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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { signInWithEmail, signInWithGoogleAsAdmin } from '@/lib/firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useState } from 'react';

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onResellerSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const { email, password } = values;
    const { error } = await signInWithEmail(email, password);

    if (error) {
        toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        });
    } else {
        toast({
            title: 'Success!',
            description: 'You have successfully logged in.',
        });
        router.push('/account');
    }
    setIsSubmitting(false);
  }
  
  async function onAdminSubmit() {
    setIsSubmitting(true);
    const { error } = await signInWithGoogleAsAdmin();
    if (error) {
        toast({
            title: 'Admin Login Failed',
            description: error.message,
            variant: 'destructive',
        });
    } else {
         toast({
            title: 'Success!',
            description: 'Admin login successful.',
        });
        router.push('/admin/products');
    }
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
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onResellerSubmit)} className="space-y-4 pt-4">
                            <FormField
                                control={form.control}
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
                                control={form.control}
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
                       <div className="pt-4 space-y-4">
                            <p className="text-center text-sm text-muted-foreground">Only authorized administrators can log in here.</p>
                             <Button onClick={onAdminSubmit} className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Signing in...' : 'Sign in with Google'}
                            </Button>
                       </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
