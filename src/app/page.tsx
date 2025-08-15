import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { categories, products, blogPosts } from '@/lib/mock-data';
import ProductCard from '@/components/product-card';
import BlogPostCard from '@/components/blog-post-card';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const featuredProducts = products.slice(0, 4);
  const featuredBlogPosts = blogPosts.slice(0, 2);
  const featuredCategories = categories.slice(0, 4);

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-center text-white">
        <Image
          src="https://placehold.co/1600x900.png"
          alt="Divine items on a serene background"
          data-ai-hint="spiritual serene background"
          layout="fill"
          objectFit="cover"
          className="z-0 brightness-50"
        />
        <div className="z-10 container space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">
            Find Your Spiritual Path
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Discover authentic, certified spiritual items to enhance your practice and bring peace to your life.
          </p>
          <Button size="lg" asChild>
            <Link href="/products">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-headline">Featured Categories</h2>
          <p className="text-muted-foreground mt-2">Explore our most popular collections.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredCategories.map((category) => (
            <Link href={`/products?category=${category.id}`} key={category.id}>
              <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-headline font-semibold group-hover:text-primary transition-colors">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-headline">Featured Products</h2>
          <p className="text-muted-foreground mt-2">Handpicked items for the discerning spiritual seeker.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
         <div className="text-center mt-12">
          <Button variant="outline" asChild>
            <Link href="/products">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* From Our Blog */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-headline">From Our Blog</h2>
            <p className="text-muted-foreground mt-2">Spiritual knowledge and insights.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredBlogPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" asChild>
              <Link href="/blog">Read More Articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
