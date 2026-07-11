"use client";

import { Check, X } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransition } from "react";
import { toast } from "sonner";
import axios from "axios";
import { mutate } from "swr";

export interface IncomingRequest {
  id: string;
  fullname: string;
  username: string;
  email: string;
  image?: string | null;
}

interface IncomingRequestCardProps {
  request: IncomingRequest;
}

export default function IncomingRequestCard({
  request,
}: IncomingRequestCardProps) {
  const initials = request.fullname
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [pending,startTransition] = useTransition();
  const updateInvitationStatus = (status: "ACCEPTED" | "REJECTED")=> {
    startTransition(async ()=>{
      try{
        const req = await axios.put(`/api/user/requests/${request.id}`,{status});
        const res = await req.data;
        if(!res.success) throw Error(res.message);
        toast.success(res.message);
      }catch(error: any){
        toast.error(error.message);
      }
      await mutate("/api/user/chats");
    })
  } 
  return (
    <Card className="transition-all duration-300 py-0 hover:border-primary/30 hover:shadow-md">
      <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={request.image ?? undefined}
              alt={request.fullname}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">
                {request.fullname}
              </h3>

              <Badge variant="secondary">
                Request
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              @{request.username}
            </p>

            <p className="text-sm text-muted-foreground">
              {request.email}
            </p>
          </div>
        </div>

        <div className="flex w-full gap-2 md:w-auto">
          <Button
            className="flex-1 md:flex-none"
            disabled={pending}
            onClick={() => {updateInvitationStatus("ACCEPTED")}}
          >
            <Check className="mr-2 h-4 w-4" />
            Accept
          </Button>

          <Button
            variant="outline"
            className="flex-1 md:flex-none"
            disabled={pending}
            onClick={() => {updateInvitationStatus("REJECTED")}}
          >
            <X className="mr-2 h-4 w-4" />
            Decline
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function IncomingRequestSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>

        <div className="flex w-full gap-2 md:w-auto">
          <Skeleton className="h-10 flex-1 md:w-28" />
          <Skeleton className="h-10 flex-1 md:w-28" />
        </div>
      </CardContent>
    </Card>
  );
}