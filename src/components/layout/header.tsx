'use client';

import Link from 'next/link';
import { Menu, ShoppingCart, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Logo from '@/components/icons/logo';
import { categories } from '@/lib/mock-data';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/blog', label: 'Blog' },
  { href: '/recommendations', label: 'Recommendations' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              DivineGems
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {mainNav.map((item) =>
              item.href === '/products' ? (
                <ProductDropdown key={item.href} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <SheetContent side="left" className="w-full max-w-sm">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b pb-4">
                 <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline">DivineGems</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
              </div>
              <nav className="flex flex-col space-y-2 mt-6">
                {mainNav.map((item) =>
                  item.href === '/products' ? (
                    <MobileProductDropdown key={item.href} setMobileMenuOpen={setMobileMenuOpen} />
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="py-2 text-lg transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Link href="/" className="flex items-center space-x-2">
                <Logo className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline">DivineGems</span>
            </Link>
          </div>
          <div className="relative">
            <Button variant="ghost" size="icon" aria-label="Open cart">
              <ShoppingCart className="h-6 w-6" />
            </Button>
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              0
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const ProductDropdown = () => {
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary focus:outline-none", pathname.startsWith('/products') && 'text-primary')}>
        Products <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href="/products">All Products</Link>
        </DropdownMenuItem>
        {categories.map((category) => (
          <DropdownMenuItem key={category.id} asChild>
            <Link href={`/products?category=${category.id}`}>{category.name}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


const MobileProductDropdown = ({ setMobileMenuOpen }: { setMobileMenuOpen: (open: boolean) => void }) => {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex justify-between items-center w-full py-2 text-lg">
        Products
        <ChevronDown className="h-5 w-5" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col pl-4 space-y-2 mt-2">
          <Link href="/products" className="py-2 text-md" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`} className="py-2 text-md" onClick={() => setMobileMenuOpen(false)}>{category.name}</Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
