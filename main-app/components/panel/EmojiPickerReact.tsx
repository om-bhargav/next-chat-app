"use client";

import { useState } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Smile } from "lucide-react";

import Button from "@/components/elements/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerButtonProps {
  disabled?: boolean;
  onSelect: (emoji: string) => void;
}

export default function EmojiPickerButton({
  disabled,
  onSelect,
}: EmojiPickerButtonProps) {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = ({ emoji }: EmojiClickData) => {
    onSelect(emoji);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={disabled}
        >
          <Smile className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="top"
        className="w-auto overflow-hidden border-0 p-0 shadow-xl"
      >
        <EmojiPicker
          lazyLoadEmojis
          previewConfig={{
            showPreview: false,
          }}
          theme={Theme.DARK}
          skinTonesDisabled={false}
          searchDisabled={false}
          onEmojiClick={handleEmojiClick}
        />
      </PopoverContent>
    </Popover>
  );
}