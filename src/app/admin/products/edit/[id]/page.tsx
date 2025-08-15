// src/app/admin/products/edit/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/product-form';
import type { Product } from '@/types';
import { getProduct } from '@/lib/firebase/firestore';
import { notFound } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProduct() {
      const { product, error } = await getProduct(params.id);
      if (error) {
        toast({
          title: 'Error fetching product',
          description: 'There was an issue retrieving the product data.',
          variant: 'destructive',
        });
        notFound();
      } else if (product) {
        setProduct(product);
      } else {
        notFound();
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params.id, toast]);

  if (loading) {
    return <div className="container py-12">Loading product details...</div>;
  }

  if (!product) {
    return null; // notFound() will have been called
  }

  return <ProductForm product={product} />;
}
