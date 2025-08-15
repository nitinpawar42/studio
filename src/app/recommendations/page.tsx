// src/app/recommendations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { personalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import { Wand2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecommendationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [browsingHistory, setBrowsingHistory] = useState('');
  const [spiritualInterests, setSpiritualInterests] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRecommendations('');

    try {
      const result = await personalizedRecommendations({
        browsingHistory,
        spiritualInterests,
      });
      setRecommendations(result.recommendations);
    } catch (err) {
      console.error(err);
      setError('Sorry, we couldn\'t generate recommendations at this time. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="container py-12 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <Wand2 className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="text-4xl font-bold font-headline">Personalized Recommendations</h1>
                <p className="text-muted-foreground mt-2">Let our AI guide you to the perfect spiritual items.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Find Your Items</CardTitle>
                    <CardDescription>Tell us a bit about yourself and what you've looked at.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="browsing-history">What products have you viewed?</Label>
                            <Textarea
                                id="browsing-history"
                                placeholder="e.g., 5 Mukhi Rudraksha, Sandalwood Mala, Ganesha Idol"
                                value={browsingHistory}
                                onChange={(e) => setBrowsingHistory(e.target.value)}
                                rows={3}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="spiritual-interests">What are your spiritual interests or goals?</Label>
                            <Textarea
                                id="spiritual-interests"
                                placeholder="e.g., Meditation, protection from negative energy, connecting with Lord Shiva"
                                value={spiritualInterests}
                                onChange={(e) => setSpiritualInterests(e.target.value)}
                                rows={3}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Generating...' : 'Get Recommendations'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {isLoading && (
                <Card>
                    <CardHeader>
                        <CardTitle>Generating Your Recommendations...</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
            )}

            {error && (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">An Error Occurred</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                    </CardContent>
                </Card>
            )}
            
            {recommendations && !isLoading && (
                <Card className="bg-primary/10">
                    <CardHeader>
                        <CardTitle>Your Personal Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{recommendations}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}
