import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full">
      <CardHeader className="p-0">
        <Link href={`/blog/${post.slug}`}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
            data-ai-hint="hindu spiritual"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-muted-foreground mb-1">{post.date}</p>
        <CardTitle className="text-xl font-headline mb-2 leading-tight">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-4 mt-auto">
        <Link href={`/blog/${post.slug}`} className="text-primary font-bold hover:underline">
          Read More &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}
