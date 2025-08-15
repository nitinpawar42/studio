'use client';

import Link from 'next/link';
import { Menu, Search, X, User, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Logo from '@/components/icons/logo';
import { Input } from '../ui/input';

const mainNav = [
  { href: '/products?category=ganesha', label: 'Ganesha' },
  { href: '/products?category=krishna', label: 'Krishna' },
  { href: '/products?category=lakshmi', label: 'Lakshmi' },
];

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline text-2xl tracking-wider">
              GOD IDOLS
            </span>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="relative w-full max-w-sm">
                 <Input type="search" placeholder="Search for products" className="bg-input border-border/60 pl-10" />
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-lg font-medium ml-auto">
            {mainNav.map((item) =>
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
            )}
             <Button variant="ghost" size="icon" asChild>
                <Link href="/account">
                    <User />
                    <span className="sr-only">Account</span>
                </Link>
            </Button>
            {user && (
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/products">
                        <Shield />
                        <span className="sr-only">Admin</span>
                    </Link>
                </Button>
            )}
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-full max-w-sm bg-background">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b pb-4">
                 <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline text-xl">GOD IDOLS</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
              </div>
              <div className="relative my-6">
                 <Input type="search" placeholder="Search for products" className="bg-input border-border/60 pl-10" />
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <nav className="flex flex-col space-y-4">
                {mainNav.map((item) =>
                    <Link
                      key={item.href}
                      href={item.href}
                      className="py-2 text-xl transition-colors hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                )}
                 <Link href="/account" className="py-2 text-xl transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Account</Link>
                 {user && <Link href="/admin/products" className="py-2 text-xl transition-colors hover:text-primary" onClick={() => setMobileMenuOpen(false)}>Admin</Link>}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
