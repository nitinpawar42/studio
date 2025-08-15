import { blogPosts } from '@/lib/mock-data';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
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
