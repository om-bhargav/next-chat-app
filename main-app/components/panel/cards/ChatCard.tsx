"use client";

import { formatDistanceToNow } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Badge from "@/components/elements/badge";
import { Message } from "./MessageCard";

export interface ContactListItem {
  id: string;
  createdAt: string;
  blockedAt: string | null;
  blockedById: string | null;
  unReadCount: number;
  messages: Message[];
  user: {
    id: string;
    fullname: string;
    username: string;
    email: string;
    bio: string;
    image?: string | null;
    isOnline: boolean;
  };
}

interface ChatCardProps {
  chat: ContactListItem;
  active?: boolean;
  onClick?: (id: ContactListItem) => void;
}

export default function ChatCard({
  chat,
  active = false,
  onClick,
}: ChatCardProps) {
  const initials = chat.user.fullname
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card
      onClick={() => onClick?.(chat)}
      className={cn(
        "cursor-pointer border-0 bg-transparent py-0 shadow-none ring-0 transition-colors hover:bg-card",
        active && "bg-card"
      )}
    >
      <div className="flex items-center gap-3 p-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={chat.user.image ?? undefined}
              alt={chat.user.fullname}
            />

            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <span
            className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background ${chat.user.isOnline
                ? "bg-emerald-500"
                : "bg-zinc-400 dark:bg-zinc-600"
              }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-medium">
              {chat.user.fullname}
            </h3>

            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(chat.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="truncate text-sm text-muted-foreground">
              @{chat.user.username}
            </p>

            {chat.unReadCount > 0 && (
              <Badge
                className="min-w-5 rounded-full px-2 py-0 text-[11px] font-semibold"
              >
                {chat.unReadCount > 99 ? "99+" : chat.unReadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ChatCardSkeleton() {
  return (
    <Card className="border-none bg-transparent py-0 shadow-none">
      <div className="flex items-center gap-3 p-3">
        <Skeleton className="h-12 w-12 rounded-full" />

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-12" />
          </div>

          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </Card>
  );
}