"use client";

import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type ContactRequestStatus =
  | "PENDING"
  | "ACCEPTED"
  | "DECLINED";

export interface SentRequest {
  id: string;
  fullname: string;
  username: string;
  email: string;
  image?: string | null;
  status: ContactRequestStatus;
}

interface SentRequestCardProps {
  request: SentRequest;
}

const statusConfig = {
  PENDING: {
    icon: Clock3,
    variant: "secondary" as const,
  },
  ACCEPTED: {
    icon: CheckCircle2,
    variant: "default" as const,
  },
  DECLINED: {
    icon: XCircle,
    variant: "destructive" as const,
  },
};

export default function SentRequestCard({
  request,
}: SentRequestCardProps) {
  const { icon: Icon, variant } =
    statusConfig[request.status];

  const initials = request.fullname
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="transition-all py-0 duration-300 hover:border-primary/30 hover:shadow-md">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={request.image ?? undefined}
              alt={request.fullname}
            />
            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="font-semibold leading-none">
              {request.fullname}
            </h3>

            <p className="text-sm text-muted-foreground">
              @{request.username}
            </p>

            <p className="text-sm text-muted-foreground">
              {request.email}
            </p>
          </div>
        </div>

        <Badge
          variant={variant}
          className="self-start gap-1 rounded-full px-3 py-1 sm:self-center"
        >
          <Icon className="h-3.5 w-3.5" />
          {request.status}
        </Badge>
      </CardContent>
    </Card>
  );
}

export function SentRequestSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-52" />
          </div>
        </div>

        <Skeleton className="h-8 w-28 rounded-full" />
      </CardContent>
    </Card>
  );
}