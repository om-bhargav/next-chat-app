import Image from "next/image";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import Heading from "@/components/elements/Heading";
import Paragraph from "@/components/elements/Paragraph";
import SubHeading from "@/components/elements/SubHeading";
import {
  MessageCircle,
  ShieldCheck,
  Users,
  Smartphone,
} from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 flex flex-col items-center text-center">

          <SubHeading className="mb-4">
            Built for Modern Communication
          </SubHeading>

          <Heading
            as="h2"
            className="max-w-xl leading-tight"
          >
            More Than Just{" "}
            <span className="text-primary">
              Messaging
            </span>
          </Heading>

          <Paragraph className="mt-6 max-w-lg">
            Stay connected with real-time conversations,
            intuitive group chats, and a seamless experience
            across all devices.
          </Paragraph>

        </div>
        <div className="grid gap-16 lg:grid-cols-2 items-end">
          {/* Content */}
          <div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <MessageCircle className="size-8 text-primary mb-3" />
                  <Heading
                    as="h5"
                    className="text-lg"
                  >
                    Instant Messaging
                  </Heading>

                  <Paragraph className="mt-2 text-sm">
                    Send and receive messages instantly.
                  </Paragraph>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Users className="size-8 text-primary mb-3" />
                  <Heading as="h5" className="text-lg">
                    Group Chats
                  </Heading>

                  <Paragraph className="mt-2 text-sm">
                    Collaborate and communicate with ease.
                  </Paragraph>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <ShieldCheck className="size-8 text-primary mb-3" />
                  <Heading as="h5" className="text-lg">
                    Secure Access
                  </Heading>

                  <Paragraph className="mt-2 text-sm">
                    Authentication built with security first.
                  </Paragraph>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Smartphone className="size-8 text-primary mb-3" />
                  <Heading as="h5" className="text-lg">
                    Responsive Design
                  </Heading>

                  <Paragraph className="mt-2 text-sm">
                    Optimized for desktop and mobile devices.
                  </Paragraph>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />

            <Card className="relative py-0 overflow-hidden border shadow-xl">
              <CardContent className="p-0">
                <Image
                  src="/default.png"
                  alt="Chat application preview"
                  width={700}
                  height={500}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}