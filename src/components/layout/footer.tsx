import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Logo from '@/components/icons/logo';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline">DivineGems</span>
            </Link>
            <p className="text-sm">
              Authentic spiritual items for your journey. Handpicked and certified for purity.
            </p>
            <p className="text-sm font-semibold">GST: 12ABCDE3456F7Z8</p>
            <p className="text-sm font-semibold">COI: U12345AB67890C123456</p>
          </div>
          
          <div>
            <h3 className="font-headline text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cart</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic space-y-2 text-sm">
              <p>123 Divine Street, Varanasi, India</p>
              <p>Email: <a href="mailto:support@divinegems.com" className="hover:text-primary">support@divinegems.com</a></p>
              <p>Phone: <a href="tel:+911234567890" className="hover:text-primary">+91 12345 67890</a></p>
            </address>
          </div>

          <div>
            <h3 className="font-headline text-lg font-bold mb-4">Newsletter</h3>
            <p className="mb-4 text-sm">Get our exclusive offers and spiritual insights.</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="bg-background" />
              <Button type="submit" variant="default">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DivineGems. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
