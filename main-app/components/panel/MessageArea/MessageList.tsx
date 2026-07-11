import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef } from 'react'
import useSWR from 'swr';
import { ContactListItem } from '../cards/ChatCard';
import { fetcher } from '@/lib/fetcher';
import { Message, MessageCard, MessageCardSkeleton } from '../cards/MessageCard';
import { globalSocket } from '@/components/global/SocketAnnouncer';
import ErrorLoading from '@/components/global/ErrorLoading';

interface Props {
    chat: ContactListItem;
    setEditMessage: React.Dispatch<React.SetStateAction<Message | null>>;
}

export default function MessageList({ chat, setEditMessage }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { data, isLoading, error, mutate } = useSWR(chat ? `/api/user/chats/${chat.id}/messages` : null, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: true,
        revalidateOnMount: false,
        keepPreviousData: false
    });
    useEffect(() => {
        if (!data) {
            mutate();
        }
    }, []);
    const messages = data?.data ?? [];


    useEffect(() => {
        if (!chat) return;
        globalSocket.emit("join_dm", chat?.id);
        return () => {
            globalSocket.emit("leave_dm", chat?.id);
        }
    }, [chat]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
    }, [messages, chat]);
    return (
        <ScrollArea className="flex-1 overflow-y-auto">
            <ErrorLoading
                loading={isLoading}
                error={error}
                dataLength={messages.length}
                emptyMessage="No messages yet."
                loadingCard={MessageCardSkeleton}
                loadingCount={3}
                loaderClassName="flex flex-col gap-4 p-6"
            >
                <div className="mx-auto flex flex-col gap-4 p-6">
                    {messages.map((message: Message, index: number) => (
                        <MessageCard
                            key={message.id}
                            message={message}
                            index={index}
                            setEditMessage={setEditMessage}
                        />
                    ))}
                    <div className='h-px' ref={bottomRef} />
                </div>
            </ErrorLoading>
        </ScrollArea>
    )
}
