"use client";

import { AlertTriangle } from "lucide-react";

import Button from "@/components/elements/Button";
import Heading from "@/components/elements/Heading";
import Paragraph from "@/components/elements/Paragraph";

interface FullPageErrorProps {
  title: string;
  description: string;
  reset?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export default function FullPageError({
  title,
  description,
  reset,
  actionLabel = "Try Again",
  onAction,
}: FullPageErrorProps) {
  const handleClick = () => {
    if (onAction) {
      onAction();
    } else {
      reset?.();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex max-w-xl flex-col items-center text-center">
        <div className="mb-8 flex size-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-10" strokeWidth={2} />
        </div>

        <Heading className="text-3xl">
          {title}
        </Heading>

        <Paragraph className="mt-3 max-w-md text-muted-foreground">
          {description}
        </Paragraph>

        {(reset || onAction) && (
          <Button className="mt-8" onClick={handleClick}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}