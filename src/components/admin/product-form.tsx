// src/components/admin/product-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';
import { addProduct, updateProduct } from '@/lib/firebase/firestore';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  originalPrice: z.coerce.number().optional(),
  category: z.string().min(1, 'Category is required.'),
  tags: z.string().min(1, 'Tags are required.'),
  images: z.string().url('Please enter a valid image URL.'),
  material: z.string().optional(),
  certification: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const isEditing = !!product;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      originalPrice: product?.originalPrice || undefined,
      category: product?.category || '',
      tags: product?.tags.join(', ') || '',
      images: product?.images[0] || '',
      material: product?.details.material || '',
      certification: product?.details.certification || '',
    },
  });

  async function onSubmit(values: ProductFormValues) {
    const productData = {
      name: values.name,
      description: values.description,
      price: values.price,
      originalPrice: values.originalPrice,
      category: values.category,
      tags: values.tags.split(',').map(tag => tag.trim()),
      images: [values.images],
      details: {
        material: values.material,
        certification: values.certification,
      },
    };

    let result;
    if (isEditing) {
      result = await updateProduct(product.id, productData);
    } else {
      result = await addProduct(productData);
    }

    if ('error' in result) {
      toast({
        title: `Error ${isEditing ? 'updating' : 'creating'} product`,
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: `Product ${isEditing ? 'Updated' : 'Created'}`,
        description: `The product "${values.name}" has been saved.`,
      });
      router.push('/admin/products');
    }
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-headline">
              {isEditing ? 'Edit Product' : 'Create New Product'}
            </CardTitle>
            <CardDescription>
              {isEditing ? 'Update the details of this product.' : 'Fill out the form to add a new product.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Lord Ganesha Idol" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="A beautiful and authentic..." {...field} rows={4} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Original Price (₹) (Optional)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormDescription>The price to show as struck-through.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl><Input placeholder="e.g., Ganesha" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl><Input placeholder="e.g., ganesha, idol, brass" {...field} /></FormControl>
                             <FormDescription>Comma-separated list of tags.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl><Input placeholder="https://placehold.co/600x600.png" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <FormField
                        control={form.control}
                        name="material"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Material</FormLabel>
                            <FormControl><Input placeholder="e.g., Brass" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="certification"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Certification</FormLabel>
                            <FormControl><Input placeholder="e.g., Hand-crafted" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? isEditing ? 'Saving...' : 'Creating...'
                    : isEditing ? 'Save Changes' : 'Create Product'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
