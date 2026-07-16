"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ban, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { globalSocket } from "@/components/global/SocketAnnouncer";
import { ImageGalleryDialog } from "../dialogs/ImageGallery";

export interface Message {
    id: string;
    contactId: string;
    senderId: string;
    content: string;
    images: string[];
    createdAt: string;
    isDeleted: boolean;
    isSeen: boolean;
}

interface MessageCardProps {
    index: number;
    message: Message;
    setEditMessage: React.Dispatch<React.SetStateAction<Message | null>>;
}

export function MessageCard({ message, setEditMessage }: MessageCardProps) {
    const { id } = useUserStore();

    const images = message.images ?? [];
    const onDelete = () => {
        globalSocket.emit("delete_dm", {
            contactId: message.contactId,
            messageId: message.id
        })
    };
    const onEdit = () => {
        setEditMessage(message);
    };
    const isSender = message.senderId === id;
    return (
        <div
            className={cn(
                "flex group",
                isSender
                    ? "justify-end"
                    : "justify-start"
            )}
        >
            <div
                className={cn(
                    "max-w-[70%] md:max-w-[60%] rounded-2xl px-3 py-3 shadow",
                    isSender
                        ? "bg-primary text-primary-foreground"
                        : "dark:bg-gray-500/30",
                    images.length > 0 ? "md:min-w-[30%] max-md:w-full" : ""
                )}
            >
                <ImageGalleryDialog images={images}>
                    {images.length > 0 && (
                        <div
                            className={cn(
                                "mb-3 grid gap-2 overflow-hidden rounded-2xl",
                                images.length === 1 && "grid-cols-1",
                                images.length === 2 && "grid-cols-2",
                                images.length >= 3 && "grid-cols-2"
                            )}
                        >
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "relative overflow-hidden rounded-xl",
                                        images.length === 1
                                            ? "h-64 w-full"
                                            : images.length === 2
                                                ? "h-40"
                                                : index === 0
                                                    ? "col-span-2 h-52"
                                                    : "h-36"
                                    )}
                                >
                                <Image
                                    src={image}
                                    alt={`Attachment ${index + 1}`}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                    sizes="(max-width:768px) 100vw, 400px"
                                />
                                </div>
                            ))}
                        </div>
                    )}
                </ImageGalleryDialog>
                {message.isDeleted ? (
                    <div
                        className={cn(
                            "flex items-center gap-2 text-sm italic",
                            isSender
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                        )}
                    >
                        <Ban className="size-4 shrink-0" />
                        <span>This message was deleted</span>
                    </div>
                ) : (
                    message.content && (
                        <p className="whitespace-pre-wrap wrap-break-all text-sm leading-relaxed">
                            {message.content}
                        </p>
                    )
                )}

                <p
                    className={cn(
                        "mt-2 text-[10px]",
                        isSender
                            ? "text-primary-foreground/70 text-right"
                            : "text-muted-foreground text-left"
                    )}
                >
                    {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                    })}
                </p>
            </div>
            {isSender && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mt-1 h-8 w-8 shrink-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100 md:opacity-0 max-md:opacity-100"
                        >
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="z-300">
                        <DropdownMenuItem
                            onClick={onEdit}
                        >
                            <Pencil className="mr-2 size-4" />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={onDelete}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}

export function MessageCardSkeleton({
    index,
}: {
    index: number;
}) {
    const isMe = index % 2 === 0;

    return (
        <div
            className={cn(
                "flex",
                isMe ? "justify-end" : "justify-start"
            )}
        >
            <div className="max-w-[80%] space-y-3 rounded-3xl border px-3 py-3 shadow">
                <Skeleton className="h-40 w-full rounded-2xl" />

                <Skeleton className="h-4 w-56 rounded-full" />

                <Skeleton className="h-4 w-40 rounded-full" />

                <div className="flex justify-end">
                    <Skeleton className="h-3 w-12 rounded-full" />
                </div>
            </div>
        </div>
    );
}
