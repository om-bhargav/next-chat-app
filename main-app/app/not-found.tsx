"use client";
import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Search,
} from "lucide-react";

import Heading from "@/components/elements/Heading";
import Paragraph from "@/components/elements/Paragraph";
import Button from "@/components/elements/Button";
import SubHeading from "@/components/elements/SubHeading";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 size-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <SubHeading>
            Error 404
          </SubHeading>

          <Heading
            as="h1"
            className="mt-4 text-7xl md:text-9xl"
          >
            Lost in Space
          </Heading>

          <Heading
            as="h3"
            className="mt-4"
          >
            This page doesn't exist.
          </Heading>

          <Paragraph className="mx-auto mt-6 max-w-xl">
            The page you're looking for may have been
            moved, deleted, or never existed in the first
            place.
          </Paragraph>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="mr-2 size-4" />
                Back Home
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <Link href="/projects">
                <Search className="mr-2 size-4" />
                Explore
              </Link>
            </Button>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="rounded-2xl border bg-card px-8 py-6 shadow-sm">
              <p className="font-geist-mono text-5xl font-bold text-primary">
                404
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Route not found
              </p>
            </div>
          </div>

          <button
            onClick={() => history.back()}
            className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Go back
          </button>
        </div>
      </div>
    </main>
  );
}