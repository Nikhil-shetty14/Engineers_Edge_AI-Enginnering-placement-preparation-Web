import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/landing" className="group flex items-center gap-2 font-semibold mb-4">
          <Image
            src="/logo.jpg"
            width={36}
            height={36}
            alt="Logo"
            className="transition-all group-hover:scale-110"
          />
            <span className="font-headline text-xl text-foreground">
              Engineering Edge AI
            </span>
          </Link>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            AI Powered Placement Preparation Platform
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Docs</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end">
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-4">
                <Button variant="ghost" size="icon" asChild><Link href="https://github.com/Nikhil-shetty14"><Github className="h-5 w-5 text-muted-foreground hover:text-foreground"/></Link></Button>
                <Button variant="ghost" size="icon" asChild><Link href="#"><Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground"/></Link></Button>
                <Button variant="ghost" size="icon" asChild><Link href="https://www.linkedin.com/in/nikhil-s-shetty0414/"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground"/></Link></Button>
            </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Engineering Edge AI, Inc. All rights reserved,Made by ⚡.
      </div>
    </footer>
  );
}
