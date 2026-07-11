import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import Button from "@/components/elements/Button";
import Heading from "@/components/elements/Heading";
import Paragraph from "@/components/elements/Paragraph";
import SubHeading from "@/components/elements/SubHeading";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
export default function Hero() {
  return (
    <section id="home" className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid gap-2">
          <div className="flex flex-col items-center text-center">
            <SubHeading className="mb-6">
              ⚡ Real-time Messaging Platform
            </SubHeading>

            <Heading
              as="h1"
              className="max-w-5xl text-center"
            >
              Messaging Made{" "}
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Effortless
              </span>
            </Heading>
            <Paragraph className="mt-8 max-w-2xl text-center">
              Connect with friends, collaborate with teams,
              and stay in sync through lightning-fast conversations,
              media sharing, and real-time communication.
            </Paragraph>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Badge variant="outline">⚡ Instant Chat</Badge>
              <Badge variant="outline">🔒 Secure</Badge>
              <Badge variant="outline">📱 Responsive</Badge>
              <Badge variant="outline">🚀 Fast</Badge>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="min-w-40" asChild>
                <Link href="/sign-up">
                  Start Messaging
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="min-w-40"
                asChild
              >
                <Link href="/sign-in">
                  Login
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
              <div>
                <span className="text-2xl font-bold text-foreground">
                  99.9%
                </span>
                <Paragraph className="text-sm">
                  Uptime
                </Paragraph>
              </div>

              <div className="h-8 w-px bg-border" />

              <div>
                <span className="text-2xl font-bold text-foreground">
                  Real-Time
                </span>
                <Paragraph className="text-sm">
                  Delivery
                </Paragraph>
              </div>

              <div className="h-8 w-px bg-border" />

              <div>
                <span className="text-2xl font-bold text-foreground">
                  Secure
                </span>
                <Paragraph className="text-sm">
                  Authentication
                </Paragraph>
              </div>
            </div>
          </div>
          <div className="relative w-full h-100 md:h-200 justify-center lg:flex">
            <Image
              src="/default.png"
              alt="App Preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
