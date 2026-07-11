"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

interface UseGoBackOptions {
  fallback?: string;
}

export function useGoBack({
  fallback = "/",
}: UseGoBackOptions = {}) {
  const router = useRouter();

  return useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace(fallback);
    }
  }, [router, fallback]);
}