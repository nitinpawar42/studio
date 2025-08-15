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
import { signInWithEmail } from '@/lib/firebase/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

type Role = 'admin' | 'reseller';

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>, role: Role) {
    const { email, password } = values;
    const { error } = await signInWithEmail(email, password, role);

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
                            <form onSubmit={form.handleSubmit((values) => onSubmit(values, 'reseller'))} className="space-y-4 pt-4">
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
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Logging in...' : 'Login as Reseller'}
                            </Button>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="admin">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit((values) => onSubmit(values, 'admin'))} className="space-y-4 pt-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Admin Email</FormLabel>
                                    <FormControl>
                                    <Input type="email" placeholder="admin@example.com" {...field} />
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
                                    <FormLabel>Admin Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" placeholder="Your Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Logging in...' : 'Login as Admin'}
                            </Button>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
