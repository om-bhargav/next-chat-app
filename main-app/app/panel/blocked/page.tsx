"use client";

import { Ban, Search } from "lucide-react";
import Heading from "@/components/elements/Heading";
import SubHeading from "@/components/elements/SubHeading";
import Paragraph from "@/components/elements/Paragraph";
import Icon from "@/components/elements/icon";
import Div from "@/components/elements/div";
import { Input } from "@/components/ui/input";
import ErrorLoading from "@/components/global/ErrorLoading";
import AppPagination from "@/components/global/AppPagination";
import BlockedContactCard, {
  BlockedContactSkeleton,
} from "@/components/panel/cards/BlockedContactCard";

import { usePagination } from "@/hooks/usePagination";
import { mutate } from "swr";
import { globalSocket } from "@/components/global/SocketAnnouncer";
import { Chats } from "@/components/panel/ChatList";

type BlockedUser = {
  user: {
    id: string;
    fullname: string;
    username: string;
    email: string;
    image?: string;
  }
  blockedAt: string;
  conversationId: string;
};

export default function BlockedContactsPage() {
  const {
    rows: blockedUsers,
    pagination,
    loading,
    search,
    setSearch,
    goToPage,
    refresh
  } = usePagination<BlockedUser>({
    url: "/api/user/blocked",
    limit: 10,
  });
  const blockUser = (id: string) => {
    globalSocket.emit("unblock_user", id);
    mutate("/api/user/chats", (old?: Chats) => {
      if (!old) return old;
      return {
        success: old.success,
        data: old.data?.map((contact) => {
          if (contact.id !== id) return contact;
          return {
            ...contact,
            blockedAt: null,
            blockedById: null
          }
        })
      }
    }, false);
    refresh();
  }
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 max-md:pb-20">
      <div>
        <Heading>Blocked Contacts</Heading>

        <Paragraph className="mt-2">
          Manage users you have blocked. Blocked users cannot send you
          messages or chat requests.
        </Paragraph>
      </div>

      <Div className="rounded-2xl dark:border-0 dark:bg-card shadow-md p-6 shadow-md">
        <div className="mb-4 flex items-center gap-3">
          <Icon icon={Ban} />
          <SubHeading>Search Blocked Users</SubHeading>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <Input
            placeholder="Search by name, username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 pl-10 shadow-md dark:border"
          />
        </div>
      </Div>

      <Div className="rounded-2xl dark:border-0 dark:bg-card shadow-md p-6 shadow-md">
        <div className="mb-5 flex items-center gap-3">
          <Icon icon={Ban} />

          <SubHeading>
            Blocked Users ({pagination?.total ?? 0})
          </SubHeading>
        </div>

        <ErrorLoading
          loading={loading}
          dataLength={blockedUsers.length}
          emptyMessage="No blocked contacts found."
          loadingCard={BlockedContactSkeleton}
          loadingCount={5}
        >
          <>
            <div className="space-y-3">
              {blockedUsers.map((conversation) => (
                <BlockedContactCard
                  key={conversation.conversationId}
                  conversation={conversation}
                  onClick={blockUser}
                />
              ))}
            </div>

            {pagination && (
              <div className="mt-8">
                <AppPagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={goToPage}
                />
              </div>
            )}
          </>
        </ErrorLoading>
      </Div>
    </div>
  );
}