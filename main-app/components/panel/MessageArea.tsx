"use client";
import { ContactListItem } from "./cards/ChatCard";
import MessageHeader from "./MessageArea/MessageHeader";
import MessageInput from "./MessageArea/MessageInput";
import NoChatSelected from "./MessageArea/NoChatSelected";
import MessageList from "./MessageArea/MessageList";
import { useCallback, useEffect, useState } from "react";
import Div from "../elements/div";
import { Message } from "./cards/MessageCard";
import { globalSocket } from "../global/SocketAnnouncer";
import { mutate } from "swr";
interface Props {
  chat: ContactListItem | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<null | ContactListItem>>;
}

export default function MessageArea({ chat, setSelectedChat }: Props) {
  const handleBack = useCallback(() => {
    setSelectedChat(null);
  }, [setSelectedChat])
  const [editMessage, setEditMessage] = useState<null | Message>(null);
  const isEditMode = !!editMessage;
  
  if (!chat) return <NoChatSelected />;

  return (
    <Div className="flex w-full h-full flex-col dark:border-l max-md:z-100 relative bg-background">
      <MessageHeader chat={chat} setSelectedChat={setSelectedChat} onBack={handleBack} />

      <MessageList chat={chat} setEditMessage={setEditMessage} />

      <MessageInput chat={chat} isEditMode={isEditMode} editMessage={editMessage} setEditMessage={setEditMessage} />
    </Div>
  );
}