// src/app/signup/page.tsx
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
import Link from 'next/link';
import { signUpWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  name: z.string().min(2, {message: 'Name must be at least 2 characters.'}),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  role: z.enum(['reseller'], {
    required_error: "You need to select a role."
  })
});

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'reseller',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, email, password, role } = values;
    const { error } = await signUpWithEmail(name, email, password, role);

    if (error) {
        toast({
            title: 'Error',
            description: error.message,
            variant: 'destructive',
        });
    } else {
        toast({
            title: 'Success!',
            description: "Your reseller account has been created and is pending approval."
        });
        router.push('/login');
    }
  }
  
  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle('reseller');
    if (error) {
      toast({
        title: 'Error signing in with Google',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success!',
        description: 'You have successfully signed in.',
      });
      router.push('/account');
    }
  };


  return (
    <div className="container py-12">
       <div className="max-w-md mx-auto">
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-4xl font-headline">Create a Reseller Account</CardTitle>
                <CardDescription>Start your spiritual journey with us</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder="Your Email" {...field} />
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
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Creating account...' : 'Sign Up with Email'}
                    </Button>
                    </form>
                </Form>
                 <Separator className="my-6" />
                 <div className="space-y-4">
                    <p className="text-center text-sm text-muted-foreground">Or sign up as a Reseller with</p>
                    <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
                        Sign Up with Google
                    </Button>
                     <p className="text-center text-sm text-muted-foreground">Admin sign-in is available via Google on the login page.</p>
                 </div>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="underline">
                        Login
                    </Link>
                </div>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
