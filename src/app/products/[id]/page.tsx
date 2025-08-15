'use client';
import { products } from '@/lib/mock-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Zap } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { notFound } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square relative rounded-lg overflow-hidden border">
                    <Image
                      src={img}
                      alt={`${product.name} image ${index + 1}`}
                      fill
                      className="object-cover"
                      data-ai-hint={`${product.category.toLowerCase()} ${product.tags[0]}`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold font-headline">{product.name}</h1>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-primary">₹{product.price}</p>
              {hasDiscount && (
                <p className="text-xl text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <p className="text-lg">{product.description}</p>
          
          <div className="flex gap-4">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              <Zap className="mr-2 h-5 w-5" /> Buy Now
            </Button>
          </div>
          <p className="text-center text-sm text-green-600 font-semibold">COD Available</p>
          
          <Separator />

          <div className="space-y-4 text-sm">
            <h3 className="text-xl font-headline font-semibold">Product Details</h3>
            <ul className="list-disc list-inside space-y-2">
              {product.details.material && <li><strong>Material:</strong> {product.details.material}</li>}
              {product.details.beadCount && <li><strong>Bead Count:</strong> {product.details.beadCount}</li>}
              {product.details.origin && <li><strong>Origin:</strong> {product.details.origin}</li>}
              {product.details.certification && <li><strong>Certification:</strong> <span className="text-green-700 font-medium">{product.details.certification}</span> - <a href="#" className="text-primary underline">Download Certificate</a></li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
