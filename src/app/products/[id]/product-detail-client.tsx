'use client';
import type { Product } from '@/types';
import Image from 'next/image';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Zap, Loader2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { checkPincodeServicability } from './actions';
import { createRazorpayOrder } from './razorpay-actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

declare const Razorpay: any;

export default function ProductDetailClient({ product }: { product: Product }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [pincode, setPincode] = useState('');
  const [isServiceable, setIsServiceable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handlePincodeCheck = async () => {
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
        toast({ title: 'Invalid Pincode', description: 'Please enter a valid 6-digit pincode.', variant: 'destructive' });
        return;
    }
    setIsChecking(true);
    setIsServiceable(null);
    try {
        const result = await checkPincodeServicability(pincode);
        if (result.serviceable) {
            setIsServiceable(true);
            toast({ title: 'Pincode Serviceable!', description: 'Great news! We can deliver to your location.' });
        } else {
            setIsServiceable(false);
            toast({ title: 'Pincode Not Serviceable', description: result.message, variant: 'destructive' });
        }
    } catch (error) {
        setIsServiceable(false);
        toast({ title: 'Error', description: 'Could not check pincode serviceability. Please try again.', variant: 'destructive' });
    } finally {
        setIsChecking(false);
    }
  };
  
  const handlePayment = async () => {
    setIsPaying(true);
    if (!user) {
        toast({ title: 'Not Logged In', description: 'Please log in to make a purchase.', variant: 'destructive'});
        setIsPaying(false);
        return;
    }

    const { success, order, error } = await createRazorpayOrder({
        amount: product.price,
        currency: 'INR'
    });

    if (!success) {
        toast({ title: 'Error', description: error || 'Could not create payment order.', variant: 'destructive'});
        setIsPaying(false);
        return;
    }

    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'God Idols',
        description: `Payment for ${product.name}`,
        order_id: order.id,
        handler: function (response: any) {
            toast({
                title: 'Payment Successful',
                description: `Payment ID: ${response.razorpay_payment_id}`,
            });
            // Here you would typically save the order details to your database
        },
        prefill: {
            name: user.displayName || 'Customer',
            email: user.email || '',
        },
        theme: {
            color: '#358060'
        }
    };
    
    const rzp1 = new Razorpay(options);
    
    rzp1.on('payment.failed', function (response: any){
            toast({
                title: 'Payment Failed',
                description: response.error.description,
                variant: 'destructive',
            });
    });

    rzp1.open();
    setIsPaying(false);
  };


  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
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

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-xl font-headline font-semibold">Check Delivery Availability</h3>
              <div className="flex items-center space-x-2">
                <Input 
                  type="text" 
                  placeholder="Enter 6-digit Pincode" 
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="max-w-xs"
                />
                <Button onClick={handlePincodeCheck} disabled={isChecking}>
                  {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Check
                </Button>
              </div>
              {isServiceable === true && <p className="text-sm font-medium text-green-600">This location is serviceable!</p>}
              {isServiceable === false && <p className="text-sm font-medium text-destructive">Sorry, we do not deliver to this pincode yet.</p>}
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1" disabled={isServiceable !== true}>
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={handlePayment} disabled={isServiceable !== true || isPaying}>
                {isPaying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                {isPaying ? 'Processing...' : 'Buy Now'}
              </Button>
            </div>
            
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
    </>
  );
}
