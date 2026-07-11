"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatCard, { ContactListItem, ChatCardSkeleton } from "./cards/ChatCard";
import ErrorLoading from "../global/ErrorLoading";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { globalSocket } from "../global/SocketAnnouncer";
import { Message } from "./cards/MessageCard";
import { useEffect, useMemo, useState } from "react";
import { mutate } from "swr";
import { useUserStore } from "@/context";
interface Props {
  selectedChat: ContactListItem | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<null | ContactListItem>>;
}
export interface ChatContactResponse {
  success: boolean;
  data?: ChatContact[];
}
interface User {
  id: string | null;
  clerkId: string | null;
  fullname: string | null;
  email: string | null;
  imageUrl: string | null;
}
export interface ChatContact {
  id: string;
  createdAt: string | Date;
  blockedAt: string | Date | null;
  blockedById: string | null;
  user: User;
  unReadCount: number;
}
interface MessageResponse { success: boolean, data: Message[] };
export interface Chats { success: boolean; data: ContactListItem[] };
export default function ChatList({ selectedChat, setSelectedChat }: Props) {
  const {
    data,
    error,
    isLoading,
    mutate: mutateChats
  } = useSWR(
    "/api/user/chats",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      keepPreviousData: true,
    }
  );
  const [search,setSearch] = useState("");
  const chats = data?.data ?? [];
  const { id } = useUserStore();
  const filteredChats = useMemo(() => {
    if(!chats) return [];
    return (chats as ContactListItem[]).filter((item)=>{
      return item.user.fullname.toLowerCase().includes(search.toLowerCase());
    });
  },[chats,search]);
  const handleSelectChat = (chat: ContactListItem) => {
    setSelectedChat(chat);
    mutateChats(
      (prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev?.data?.map((c: ContactListItem) =>
            c.id === chat.id
              ? {
                ...c,
                unReadCount: 0,
              }
              : c
          ),
        };
      },
      false
    );
  };

  const handleReceiveMessage = (message: Message, chatId: string) => {
    mutateChats(
      (old?: ChatContactResponse) => {
        if (!old) {
          return {
            success: true,
            data: [],
          };
        }

        return {
          ...old,
          data: old.data?.map((contact) =>
            contact.id === chatId
              ? {
                ...contact,
                unReadCount: contact.unReadCount + ((message.senderId !== id && !message.isSeen) ? 1 : 0),
                createdAt: message.createdAt
              }
              : contact
          ),
        };
      },
      false
    );
    mutate(
      `/api/user/chats/${chatId}/messages`,
      (old?: MessageResponse) => {
        if (!old) {
          return;
        }

        return {
          ...old,
          data: [...old.data, message],
        };
      },
      false
    )
  };

  const handleEditMessage = (id: string, content: string, chatId: string) => {
    mutate(
      `/api/user/chats/${chatId}/messages`,
      (old?: MessageResponse) => {
        if (!old) {
          return;
        }

        return {
          ...old,
          data: old.data.map((message) =>
            message.id === id
              ? { ...message, content }
              : message
          ),
        };
      },
      false
    );
  };

  const handleDeleteMessage = (id: string, chatId: string) => {
    mutate(
      `/api/user/chats/${chatId}/messages`,
      (old?: MessageResponse) => {
        if (!old) {
          return {
            success: true,
            data: [],
          };
        }

        return {
          ...old,
          data: old.data.map((message) =>
            message.id === id
              ? {
                ...message,
                isDeleted: true,
                content: "",
              }
              : message
          ),
        };
      },
      false
    );
  };

  const handleAllUserStatus = (usersStatus: Record<string, boolean>) => {
    mutateChats((old: Chats) => {
      if (isLoading) return old;
      return {
        success: old.success,
        data: old.data.map((contact) => {
          return { ...contact, user: { ...contact.user, isOnline: usersStatus[contact.user.id] } }
        })
      }
    }, false);
  }

  const handleUserStatus = (payload: { userId: string; isOnline: boolean; }) => {
    const { isOnline, userId } = payload;
    mutateChats((old: { success: boolean; data: ContactListItem[] }) => {
      return {
        success: old.success,
        data: old.data.map((contact) => {
          if (contact.user.id !== userId) return contact;
          return {
            ...contact,
            user: { ...contact.user, isOnline }
          }
        })
      }
    }, false);
  }

  const handleBlock = (contactId: string, blockedById: string, blockedAt: string) => {
    console.log("Blocked Running");
    mutateChats((old: Chats) => {
      setSelectedChat((prev) => {
        if (!prev || prev.id !== contactId) return prev;

        return {
          ...prev,
          blockedById,
          blockedAt,
        };
      });
      return {
        success: old.success,
        data: old.data?.map((contact) => {
          if (contact.id !== contactId) return contact;
          return {
            ...contact,
            blockedAt: blockedAt,
            blockedById: blockedById
          }
        })
      }
    }, false);
  }

  const handleUnBlock = (contactId: string) => {
    mutateChats((old: Chats) => {
      setSelectedChat((prev) => {
        if (!prev || prev.id !== contactId) return prev;

        return {
          ...prev,
          blockedById: null,
          blockedAt: null,
        };
      });
      return {
        success: old.success,
        data: old.data?.map((contact) => {
          if (contact.id !== contactId) return contact;
          return {
            ...contact,
            blockedAt: null,
            blockedById: null
          }
        })
      }
    }, false);
  }

  useEffect(() => {
    if (isLoading || !chats) return;
    globalSocket.emit("check_multiple_users_status", chats.map((chat: ContactListItem) => { return chat.user.id }));
    globalSocket.on("multiple_users_status_result", handleAllUserStatus);
    globalSocket.on("user_status_change", handleUserStatus);
    globalSocket.on("receive_dm", handleReceiveMessage);
    globalSocket.on("message_edited", handleEditMessage);
    globalSocket.on("message_deleted", handleDeleteMessage);
    globalSocket.on("blocked_user", handleBlock);
    globalSocket.on("unblocked_user", handleUnBlock);
    return () => {
      globalSocket.off("multiple_users_status_result", handleAllUserStatus);
      globalSocket.off("user_status_change", handleUserStatus);
      globalSocket.off("receive_dm", handleReceiveMessage);
      globalSocket.off("message_edited", handleEditMessage);
      globalSocket.off("message_deleted", handleDeleteMessage);
      globalSocket.off("blocked_user", handleBlock);
      globalSocket.off("unblocked_user", handleUnBlock);
    }
  }, [isLoading]);
  return (
    <div className="flex h-full w-full flex-col shadow bg-transparent">
      {/* Header */}
      <div className="shadow p-4">
        <h2 className="text-xl font-semibold">
          Chats
        </h2>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search chats..."
            className="pl-9 shadow-md border-0"
            value={search}
            onChange={(e)=>{setSearch(e.target.value)}}
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1  overflow-y-auto">
        <div className="p-2">
          <ErrorLoading
            loading={isLoading}
            error={error}
            dataLength={filteredChats.length}
            emptyMessage="No conversations found."
            loadingCard={ChatCardSkeleton}
            loadingCount={8}
          >
            <div className="space-y-2">
              {filteredChats.map((chat: ContactListItem) => (
                <ChatCard
                  key={chat.id}
                  chat={chat}
                  active={selectedChat?.id === chat.id}
                  onClick={handleSelectChat}
                />
              ))}
            </div>

          </ErrorLoading>
        </div>
      </ScrollArea>
    </div>
  );
}