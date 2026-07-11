"use client";

import { Loader2, Paperclip, SendHorizonal, X } from "lucide-react";
import { RefObject, useEffect, useRef, useState, useTransition } from "react";

import Button from "@/components/elements/Button";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPickerButton from "../EmojiPickerReact";
import { onEnter } from "@/utils/keyboard";
import { globalSocket } from "@/components/global/SocketAnnouncer";
import { useUserStore } from "@/context";
import { toast } from "sonner";
import { Message } from "../cards/MessageCard";
import { ContactListItem } from "../cards/ChatCard";
import axios from "axios";
interface Props {
    chat: ContactListItem | null;
    isEditMode: boolean;
    editMessage: Message | null;
    setEditMessage: React.Dispatch<React.SetStateAction<Message | null>>;
}
export default function MessageInput({ chat, editMessage, isEditMode, setEditMessage }: Props) {
    const [message, setMessage] = useState("");
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [pending, startTransition] = useTransition();
    const { id } = useUserStore();
    const isBlocked = !!(chat?.blockedById);
    useEffect(() => {
        if (editMessage) {
            setMessage(editMessage.content);
        }
    }, [editMessage]);

    const uploadImages = (images: File[]) => {

        startTransition(async () => {
            try {
                const fd = new FormData();

                images.forEach((image) => {
                    fd.append("images", image);
                });

                const { data } = await axios.post("/api/user/upload-images", fd);

                if (!data.success) {
                    throw new Error(data.message);
                }
                setPreviewUrls(data.urls ?? []);
            } catch (error: any) {
                toast.error(
                    error.response?.data?.message ??
                    error.message ??
                    "Failed to upload images."
                );
            }
        });
    };

    const sendMessage = () => {
        if (!chat) return;

        if (!message.trim() && previewUrls.length === 0) return;
        if (isEditMode) {
            globalSocket.emit("edit_dm", {
                contactId: editMessage?.contactId,
                content: message,
                messageId: editMessage?.id
            }, (res: {
                success: boolean;
                message?: string;
                data?: Message;
            }) => {
                if (!res.success) {
                    toast.error(res.message ?? "Failed to send message.");
                    return;
                }
                setEditMessage(null);
                setMessage("");
                setPreviewUrls([]);
            });

        } else {
            globalSocket.emit(
                "send_dm",
                {
                    contactId: chat.id,
                    senderId: id,
                    content: message.trim() || null,
                    images: previewUrls
                },
                (res: {
                    success: boolean;
                    message?: string;
                    data?: Message;
                }) => {
                    if (!res.success) {
                        toast.error(res.message ?? "Failed to send message.");
                        return;
                    }

                    setMessage("");
                    setPreviewUrls([]);
                }
            );
        }
    };

    const handleImageSelect = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files ?? []);

        if (!files.length) return;

        uploadImages(files);

        e.target.value = "";
    };

    const removeImage = (index: number) => {
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="border-t p-4 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
            {previewUrls.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-3">
                    {previewUrls.map((image, index) => (
                        <div
                            key={`${image}-${index}`}
                            className="relative"
                        >
                            <img
                                src={image}
                                alt={`Attachment ${index + 1}`}
                                className="h-20 w-20 rounded-lg border object-cover"
                            />

                            {pending && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60">
                                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                                </div>
                            )}

                            <ShadcnButton
                                size="icon"
                                variant="destructive"
                                className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                                onClick={() => removeImage(index)}
                                disabled={pending}
                            >
                                <X className="size-3" />
                            </ShadcnButton>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2">
                <input
                    ref={inputRef}
                    id="message-images"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isBlocked}
                    hidden
                    onChange={handleImageSelect}
                />

                <label htmlFor="message-images">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={pending || isBlocked}
                    >
                        <Paperclip className="size-4" />
                    </Button>
                </label>

                <EmojiPickerButton
                    disabled={pending || isBlocked}
                    onSelect={(emoji) =>
                        setMessage((prev) => prev + emoji)
                    }
                />

                <Input
                    value={message}
                    disabled={pending || isBlocked}
                    placeholder="Type a message..."
                    className="flex-1 border-0 shadow-md"
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={onEnter(sendMessage)}
                />
                {editMessage &&
                    <Button onClick={() => { setEditMessage(null); setMessage(""); }} disabled={pending || isBlocked} variant={"secondary"}>
                        <X />
                    </Button>
                }
                <Button
                    size="icon"
                    onClick={sendMessage}
                    disabled={pending || isBlocked}
                >
                    <SendHorizonal className="size-4" />
                </Button>
            </div>
        </div>
    );
}