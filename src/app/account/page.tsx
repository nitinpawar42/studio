// src/app/account/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/firebase/auth';
import { getUserProfile } from '@/lib/firebase/firestore';
import type { UserProfile } from '@/types';
import Link from 'next/link';
import { User, DollarSign, ShoppingBag, Loader2, LogOut } from 'lucide-react';

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      const fetchProfile = async () => {
        setLoading(true);
        const { profile, error } = await getUserProfile(user.uid);
        if (profile) {
          setProfile(profile);
        } else {
          // If profile not found, might be an issue, sign out
          await signOut();
          router.push('/login');
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [user, authLoading, router]);


  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || authLoading) {
    return (
      <div className="container py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect Admin to their dashboard, but prevent a redirect loop if already there.
  if (profile?.role === 'admin' && !pathname.startsWith('/admin')) {
      router.push('/admin/products');
      return (
        <div className="container py-12 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
  }
  
  if (!profile) {
     return (
      <div className="container py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }


  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-headline">Reseller Dashboard</CardTitle>
            <CardDescription>Welcome back, {profile.displayName || profile.email}!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Customers</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Manage your customer profiles</p>
                    </CardContent>
                    <CardFooter>
                       <Button asChild className="w-full">
                            <Link href="/account/customers">Manage Customers</Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Order History</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                     <CardContent>
                        <p className="text-xs text-muted-foreground">View past orders</p>
                    </CardContent>
                    <CardFooter>
                       <Button asChild className="w-full" disabled>
                            <Link href="#">View Orders</Link>
                        </Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Commissions</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Track your earnings</p>
                    </CardContent>
                     <CardFooter>
                       <Button asChild className="w-full" disabled>
                            <Link href="#">View Commissions</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            
             <Button onClick={handleSignOut} variant="outline">
                <LogOut className="mr-2" /> Sign Out
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
