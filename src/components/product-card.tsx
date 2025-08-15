import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} className="block">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-auto aspect-square object-cover"
            data-ai-hint={`${product.category.toLowerCase()} ${product.tags[0]}`}
          />
        </Link>
        {hasDiscount && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            SALE
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-2">
          <Link href={`/products/${product.id}`} className="hover:text-primary">
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center mt-auto">
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-bold text-primary">₹{product.price}</p>
          {hasDiscount && (
            <p className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice}
            </p>
          )}
        </div>
        <Button asChild>
          <Link href={`/products/${product.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
