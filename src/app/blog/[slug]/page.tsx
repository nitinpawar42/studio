// src/app/blog/[slug]/page.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, notFound, useParams } from 'next/navigation';
import { blogPosts } from '@/lib/mock-data';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function BlogPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const post = blogPosts.find((p) => p.slug === slug);

  if (!loading && !post) {
    notFound();
  }

  if (loading || !user || !post) {
    return (
      <div className="container py-12 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <article className="space-y-8">
        <header className="text-center space-y-4">
          <p className="text-muted-foreground">{post.date}</p>
          <h1 className="text-4xl md:text-5xl font-bold font-headline">{post.title}</h1>
        </header>

        <div className="relative w-full h-96 rounded-lg overflow-hidden border">
           <Image
            src={post.imageUrl}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="hindu spiritual"
          />
        </div>

        <div
          className="text-lg leading-relaxed space-y-4 [&_p]:mb-4 [&_h2]:text-2xl [&_h2]:font-headline [&_h2]:mt-8 [&_h2]:mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
