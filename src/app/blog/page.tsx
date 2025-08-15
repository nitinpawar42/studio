import { blogPosts } from '@/lib/mock-data';
import BlogPostCard from '@/components/blog-post-card';

export default function BlogPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-headline">Our Blog</h1>
        <p className="text-muted-foreground mt-2">Spiritual knowledge, guides, and insights.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
