"use client";

import {
    Ban,
    ChevronLeft,
    Info,
    MoreVertical,
    Phone,
    Video,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Button from "@/components/elements/Button";
import { Button as ShadcnButton } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import UserInfoModal from "../modals/UserInfo";
import { ContactListItem } from "../cards/ChatCard";
import { useEffect } from "react";
import { globalSocket } from "@/components/global/SocketAnnouncer";
import { useUserStore } from "@/context";

interface MessageHeaderProps {
    chat: ContactListItem;
    onBack: () => void;
    setSelectedChat: React.Dispatch<React.SetStateAction<null | ContactListItem>>;
}

export default function MessageHeader({
    chat,
    onBack,
    setSelectedChat
}: MessageHeaderProps) {
    const initials = chat.user.fullname
        .split(" ")
        .map((x) => x[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const { id } = useUserStore();
    const isBlocked = chat.blockedById !== null;
    const isBlockedByMe = chat.blockedById === id;
    const isBlockedByOther = isBlocked && !isBlockedByMe;
    const blockUser = () => {
        if (chat.blockedById) {
            globalSocket.emit("unblock_user", chat.id);
        } else {
            globalSocket.emit("block_user", id, chat.user.id,chat.id);
        }
    }
    const handleUserStatus = (payload: { userId: string; isOnline: boolean; }) => {
        const { isOnline, userId } = payload;
        if (userId === chat.user.id) {
            setSelectedChat({
                ...chat,
                user: { ...chat.user, isOnline }
            });
        }
    }

    useEffect(() => {
        globalSocket.on("user_status_change", handleUserStatus);
        return () => {
            globalSocket.off("user_status_change", handleUserStatus);
        }
    }, []);
    return (
        <div className="flex h-16 items-center justify-between border-b px-2 shadow-md md:px-6">
            <div className="flex items-center gap-3">
                <div className="flex items-center">
                    <ShadcnButton
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                    >
                        <ChevronLeft />
                    </ShadcnButton>

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
                </div>

                <div>
                    <h3 className="font-semibold">
                        {chat.user.fullname}
                    </h3>

                    {chat.blockedById ? <>
                        <p className="text-xs flex gap-1 items-center text-muted-foreground">
                            <Ban className="size-4" />{
                                isBlockedByMe ? "You've Blocked This Contact" : "You've been blocked!"
                            }
                        </p>
                    </> :
                        <p className="text-xs text-muted-foreground">
                            @{chat.user.username}
                        </p>
                    }
                </div>
            </div>

            <div className="flex items-center gap-1">
                <Button size="icon" disabled={isBlockedByOther} variant="ghost">
                    <Phone className="size-4" />
                </Button>

                <Button size="icon" disabled={isBlockedByOther} variant="ghost">
                    <Video className="size-4" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger disabled={isBlockedByOther} asChild>
                        <Button size="icon" variant="ghost" disabled={isBlockedByOther}>
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-48"
                    >
                        <UserInfoModal user={chat.user}>
                            <DropdownMenuItem
                                disabled={isBlockedByOther}
                                onSelect={(e) => e.preventDefault()}
                            >
                                <Info className="mr-2 size-4" />
                                Contact Info
                            </DropdownMenuItem>
                        </UserInfoModal>

                        <DropdownMenuItem
                            onClick={blockUser}
                            disabled={isBlockedByOther}
                            className="text-destructive focus:text-destructive"
                        >
                            <Ban className="mr-2 size-4" />
                            {chat.blockedById
                                ? "Unblock Contact"
                                : "Block Contact"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}