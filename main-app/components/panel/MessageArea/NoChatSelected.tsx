"use client";

import { Phone, SendHorizonal, Video } from "lucide-react";

export default function NoChatSelected() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <SendHorizonal className="size-10 text-primary" />
        </div>

        <h2 className="text-2xl font-semibold">
          Your Messages
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Select a conversation from the sidebar to start chatting.
          Your messages will appear here.
        </p>

        <div className="mt-8 grid w-full grid-cols-2 gap-3">
          <div className="rounded-xl border bg-card p-4 transition-colors hover:bg-accent">
            <Phone className="mx-auto mb-2 size-5 text-muted-foreground" />
            <p className="text-sm font-medium">
              Voice Calls
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4 transition-colors hover:bg-accent">
            <Video className="mx-auto mb-2 size-5 text-muted-foreground" />
            <p className="text-sm font-medium">
              Video Calls
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}