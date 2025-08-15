// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { products } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return (
      <div className="container py-12 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const featuredIdols = products.slice(0, 4);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1600x900.png"
            alt="Interior of a temple"
            data-ai-hint="temple interior"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
          />
          <div className="absolute inset-0 bg-background/50"></div>
        </div>
        <div className="container relative z-20 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary">
            PREMIUM GOD IDOLS
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-foreground/80">
            Bring Home Divine Blessings
          </p>
          <div className="flex justify-center items-end gap-8 pt-8">
            <div className="flex flex-col items-center">
              <Image src="https://placehold.co/300x400.png" alt="Ganesha Idol" data-ai-hint="ganesha idol" width={250} height={350} className="object-contain hover:scale-105 transition-transform duration-500"/>
            </div>
            <div className="flex flex-col items-center">
              <Image src="https://placehold.co/400x500.png" alt="Krishna Idol" data-ai-hint="krishna idol" width={300} height={400} className="object-contain hover:scale-105 transition-transform duration-500"/>
            </div>
            <div className="flex flex-col items-center">
                <Image src="https://placehold.co/300x400.png" alt="Lakshmi Idol" data-ai-hint="lakshmi idol" width={250} height={350} className="object-contain hover:scale-105 transition-transform duration-500"/>
            </div>
          </div>
        </div>
      </section>

      <div className="container relative z-20 pb-24 space-y-24">
        {/* Featured Idols */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline text-primary/90 tracking-widest">
              FEATURED IDOLS
            </h2>
            <div className="flex justify-center mt-2">
                <div className="w-24 h-px bg-primary/50"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredIdols.map((product) => (
              <Card key={product.id} className="bg-card border-border/50 overflow-hidden text-center group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                <CardContent className="p-4 space-y-4">
                  <div className="aspect-square bg-background/30 rounded-md overflow-hidden border border-border/30">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      data-ai-hint={`${product.tags.join(' ')}`}
                    />
                  </div>
                  <h3 className="text-xl font-headline font-semibold text-foreground">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary">₹{product.price}</p>
                  <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                    BUY NOW
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Offers Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card/50 border-2 border-dashed border-primary/30 p-8 text-center flex flex-col justify-center items-center">
                <h3 className="text-2xl font-headline text-primary/80">FESTIVE OFFERS</h3>
                <p className="text-4xl font-bold text-foreground mt-2">UP TO 30% OFF</p>
            </Card>
            <Card className="bg-card/50 border-2 border-dashed border-primary/30 p-8 text-center flex flex-col justify-center items-center">
                <h3 className="text-2xl font-headline text-primary/80">FREE SHIPPING</h3>
                <p className="text-3xl font-bold text-foreground mt-2">on orders above ₹1,000</p>
            </Card>
        </section>

        {/* Customer Testimonials */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline text-primary/90 tracking-widest">
              CUSTOMER TESTIMONIALS
            </h2>
            <div className="flex justify-center mt-2">
                <div className="w-24 h-px bg-primary/50"></div>
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card className="bg-card border-border/50 p-8">
              <CardContent className="p-0 flex flex-col items-center text-center space-y-4">
                 <Avatar className="w-20 h-20 border-2 border-primary/50">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="Ananya R." data-ai-hint="woman portrait" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <blockquote className="text-lg italic text-foreground/90">
                  &ldquo;The Idols I bought from here are absolutely stunning: The quality is outstanding.&rdquo;
                </blockquote>
                <p className="font-semibold text-primary">- Ananya R.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
