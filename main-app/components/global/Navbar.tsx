import { SITE_NAME } from '@/config'
import { MessageCircle } from 'lucide-react'
import { Button } from '../ui/button'
import Link from "next/link";
import Image from 'next/image';
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        <Link href={"/"}>
        <div className="flex items-center gap-3">
          <div className='relative h-8 w-10'>
          <Image src={"/logo.png"} fill alt={"Logo"}/>
          </div>
          <span className="text-xl font-bold">
            {SITE_NAME}
          </span>
        </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-sm text-muted-foreground hover:text-foreground">
            Home
          </a>
          <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground">
            Testimonials
          </a>
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </a>
          <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </a>
        </nav>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/sign-in">Login</Link>
          </Button>

          <Button asChild>
            <Link href="/sign-up">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
