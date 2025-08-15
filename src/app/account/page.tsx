// src/app/account/page.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/firebase/auth';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return <div className="container py-12">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-headline">My Account</CardTitle>
            <CardDescription>Welcome back, {user.displayName || user.email}!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Email:</strong> {user.email}</p>
            {/* Add more user details here */}
            <Button onClick={handleSignOut} variant="destructive">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
