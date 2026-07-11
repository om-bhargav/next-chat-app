"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface UserPreview {
  id: string;
  fullname: string;
  username: string;
  email: string;
  bio: string;
  image?: string | null;
}

interface UserPreviewModalProps {
  user: UserPreview;
  children: React.ReactNode;
}

export default function UserInfoModal({
  user,
  children,
}: UserPreviewModalProps) {
  const [open, setOpen] = React.useState(false);

  const initials = user.fullname
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <Avatar className="mb-4 h-24 w-24">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.fullname}
            />
            <AvatarFallback className="text-xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <DialogTitle className="text-xl">
            {user.fullname}
          </DialogTitle>

          <Badge
            variant="secondary"
            className="mt-2 rounded-full"
          >
            @{user.username}
          </Badge>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Email
            </p>

            <p className="break-all text-sm">
              {user.email}
            </p>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Bio
            </p>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {user.bio || "No bio available."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}