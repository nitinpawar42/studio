import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card text-secondary-foreground border-t border-border/50">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-8">
             <Link href="/contact" className="hover:text-primary transition-colors">CONTACT US</Link>
             <Link href="#" className="hover:text-primary transition-colors">PAYMENT METHODS</Link>
             <Link href="#" className="hover:text-primary transition-colors">QUICK LINKS</Link>
        </div>
      </div>
    </footer>
  );
}
