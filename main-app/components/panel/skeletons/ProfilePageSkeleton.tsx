"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoadingCard() {
  return (
    <div className="space-y-8">

      <div className="rounded-2xl border space-y-8 p-6">

        <div className="rounded-2xl border p-6">
          <Skeleton className="mb-6 h-6 w-40" />

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Skeleton className="h-28 w-28 rounded-full" />

            <div className="space-y-3">
              <Skeleton className="h-10 w-40 rounded-xl" />
              <Skeleton className="h-4 w-52" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="mb-2 h-4 w-28" />
              <Skeleton
                className={i === 3 ? "h-28 w-full" : "h-11 w-full"}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
    </div>
  );
}