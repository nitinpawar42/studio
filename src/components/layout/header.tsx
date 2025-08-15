// src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import { Menu, Search, X, User, Shield, Users, ShoppingCart, Newspaper, Wand2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { UserProfile } from '@/types';
import { getUserProfile } from '@/lib/firebase/firestore';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Logo from '@/components/icons/logo';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';


const mainNav: { href: string; label: string, icon: React.ReactNode }[] = [
    { href: '/products', label: 'Products', icon: <ShoppingCart /> },
    { href: '/blog', label: 'Blog', icon: <Newspaper /> },
    { href: '/recommendations', label: 'For You', icon: <Wand2 /> },
];

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

   useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { profile, error } = await getUserProfile(user.uid);
        if (profile) {
          setProfile(profile);
        }
      };
      fetchProfile();
    } else {
        setProfile(null);
    }
  }, [user]);

  const isAdmin = profile?.role === 'admin';


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline text-2xl tracking-wider">
              SWASTIK CONNECT
            </span>
          </Link>
        </div>
        
        {loading && (
          <div className='ml-auto hidden md:flex items-center gap-2'>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        )}
        
        {!loading && user && (
            <>
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

                <nav className="hidden md:flex items-center space-x-2 text-lg font-medium ml-auto">
                    {mainNav.map((item) =>
                        <Button variant="ghost" asChild key={item.href}>
                            <Link
                            href={item.href}
                            className="transition-colors hover:text-primary px-4 py-2 rounded-md text-sm"
                            >
                            {item.icon} {item.label}
                            </Link>
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/account">
                            <User />
                            <span className="sr-only">Account</span>
                        </Link>
                    </Button>
                    {isAdmin && (
                        <>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/products">
                                <Shield />
                                <span className="sr-only">Admin Products</span>
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/users">
                                <Users />
                                <span className="sr-only">Admin Users</span>
                            </Link>
                        </Button>
                        </>
                    )}
                </nav>
            </>
        )}


        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-full max-w-sm bg-background">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b pb-4">
                 <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                    <Logo className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline text-xl">SWASTIK CONNECT</span>
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
                      className="py-2 text-xl transition-colors hover:text-primary flex items-center gap-4"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon} {item.label}
                    </Link>
                )}
                 <Link href="/account" className="py-2 text-xl transition-colors hover:text-primary flex items-center gap-4" onClick={() => setMobileMenuOpen(false)}><User/> Account</Link>
                 {isAdmin && (
                    <>
                        <Link href="/admin/products" className="py-2 text-xl transition-colors hover:text-primary flex items-center gap-4" onClick={() => setMobileMenuOpen(false)}><Shield/> Admin: Products</Link>
                        <Link href="/admin/users" className="py-2 text-xl transition-colors hover:text-primary flex items-center gap-4" onClick={() => setMobileMenuOpen(false)}><Users/> Admin: Users</Link>
                    </>
                 )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
