import React from "react";

export function onEnter(
  callback: () => void,
  options?: {
    preventDefault?: boolean;
    requireShift?: boolean;
  }
) {
  return (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      preventDefault = true,
      requireShift = false,
    } = options ?? {};

    if (requireShift) {
      if (e.key === "Enter" && e.shiftKey) {
        if (preventDefault) e.preventDefault();
        callback();
      }

      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      if (preventDefault) e.preventDefault();
      callback();
    }
  };
}