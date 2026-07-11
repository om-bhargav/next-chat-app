import { Quote, Star } from "lucide-react";

import Heading from "@/components/elements/Heading";
import Paragraph from "@/components/elements/Paragraph";
import SubHeading from "@/components/elements/SubHeading";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Designer",
    message:
      "The experience was seamless. Fast, reliable, and beautifully designed.",
  },
  {
    name: "Michael Brown",
    role: "Software Engineer",
    message:
      "Real-time messaging works flawlessly. One of the cleanest chat experiences I've used.",
  },
  {
    name: "Emily Wilson",
    role: "Startup Founder",
    message:
      "Simple onboarding and a fantastic user experience across devices.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-muted/40 py-24"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14 flex flex-col items-center text-center">
          <SubHeading>
            Testimonials
          </SubHeading>

          <Heading
            as="h2"
            className="mt-2"
          >
            Loved by Users
          </Heading>

          <Paragraph className="mt-3 max-w-2xl">
            Thousands of conversations delivered with speed,
            reliability, and simplicity.
          </Paragraph>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card
              key={item.name}
              className="group h-full transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-5 flex items-center justify-between">
                  <Quote className="h-8 w-8 text-muted-foreground/40" />

                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-current"
                      />
                    ))}
                  </div>
                </div>

                <Paragraph className="flex-1 text-base leading-7">
                  "{item.message}"
                </Paragraph>

                <div className="mt-6 border-t pt-4">
                  <Heading
                    as="h5"
                    className="text-base"
                  >
                    {item.name}
                  </Heading>

                  <Paragraph className="text-sm">
                    {item.role}
                  </Paragraph>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}