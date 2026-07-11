"use client";
import ChatList from '@/components/panel/ChatList'
import MessageArea from '@/components/panel/MessageArea'
import { useEffect, useState } from 'react'
import { ContactListItem } from '@/components/panel/cards/ChatCard';
import { cn } from '@/lib/utils';
import { globalSocket } from '@/components/global/SocketAnnouncer';
import { mutate } from 'swr';
import { Message } from "@/components/panel/cards/MessageCard";
export default function page() {
  const [selectedChat, setSelectedChat] = useState<null | ContactListItem>(null);
  return (
    <main className='flex w-full h-screen overflow-hidden'>
      <div className={cn(`flex-1`, !selectedChat ? "" : "max-md:hidden")}>
        <ChatList selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
      </div>
      <div className={cn(`flex-3`, selectedChat ? "" : "max-md:hidden")}>
        <MessageArea chat={selectedChat} setSelectedChat={setSelectedChat} />
      </div>
    </main>
  )
}
