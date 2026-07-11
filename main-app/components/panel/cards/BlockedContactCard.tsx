"use client";

import { Unlock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Button from "@/components/elements/Button";
import Paragraph from "@/components/elements/Paragraph";
import {formatDistanceToNow} from "date-fns";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/context";
type Props = {
  conversation: {
    user: {
      id: string;
      fullname: string;
      username: string;
      email: string;
      image?: string;
    }
    blockedAt: string;
    conversationId: string;
  };
  onClick: (id: string) => void
};

export default function BlockedContactCard({ conversation, onClick }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{conversation.user.fullname}</p>

        <Paragraph className="text-sm">
          @{conversation.user.username}
        </Paragraph>

        <Paragraph className="text-sm">
          {conversation.user.email}
        </Paragraph>

        <Paragraph className="mt-1 text-xs">
          Blocked {formatDistanceToNow(conversation.blockedAt)}
        </Paragraph>
      </div>

      <Button variant="outline" onClick={() => { onClick(conversation.conversationId) }}>
        <Unlock size={16} />
        Unblock
      </Button>
    </div>
  );
}


export function BlockedContactSkeleton() {
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-28" />
        </div>

        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}