"use client";

import { useState, useTransition } from "react";
import { Mail, Send, UserPlus } from "lucide-react";
import Heading from "@/components/elements/Heading";
import SubHeading from "@/components/elements/SubHeading";
import Paragraph from "@/components/elements/Paragraph";
import Button from "@/components/elements/Button";
import Icon from "@/components/elements/icon";
import Div from "@/components/elements/div";
import { EMAIL_PATTERN } from "@/lib/patterns";
import { toast } from "sonner";
import axios from "axios";
import { Input } from "@/components/ui/input";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import ErrorLoading from "@/components/global/ErrorLoading";
import IncomingRequestCard, { IncomingRequest, IncomingRequestSkeleton } from "@/components/panel/cards/IncomingRequestCard";
import SentRequestCard, { SentRequest, SentRequestSkeleton } from "@/components/panel/cards/SentRequestCard";
import { usePagination } from "@/hooks/usePagination";
import AppPagination from "@/components/global/AppPagination";
export default function RequestsPage() {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();
  const {
    rows: incomingRequests,
    loading: isLoading,
    pagination: incomingRequestsPagination,
    goToPage: goToPageIncomingRequests,
    page: incomingRequestspage
  } = usePagination<SentRequest>({
    url: "/api/user/requests",
    limit: 10,
  });
  const {
    rows: sentRequests,
    loading,
    pagination,
    goToPage,
    page
  } = usePagination<SentRequest>({
    url: "/api/user/contact-invitation",
    limit: 10,
  });
  const handleSendRequest = () => {
    if (!email.trim() || !EMAIL_PATTERN.test(email)) return;
    startTransition(async () => {
      try {
        const req = await axios.post("/api/user/contact-invitation", { email }, {
          validateStatus: (status) =>
            status >= 100
        });
        const res = await req.data;
        if (!res.success) throw Error(res.message);
        toast.success(res.message);
      } catch (error: any) {
        toast.error(error.message);
      }
    })
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 max-md:pb-20">
      <div>
        <Heading>Chat Requests</Heading>

        <Paragraph className="mt-2">
          Search users by email and manage incoming chat requests.
        </Paragraph>
      </div>

      {/* Search */}
      <Div className="rounded-2xl shadow-md dark:border dark:bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <Icon icon={UserPlus} />

          <SubHeading>Send New Request</SubHeading>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              type="email"
              placeholder="Enter email address..."
              value={email}
              disabled={pending}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 pl-10 shadow-md dark:border border-0"
            />
          </div>

          <Button className="h-full" disabled={email.trim() === "" || EMAIL_PATTERN.test(email) === false || pending} onClick={handleSendRequest}>
            <Send size={16} />
            Send Request
          </Button>
        </div>
      </Div>

      <div className="grid gap-6">
        {/* Incoming */}
        <Div className="rounded-2xl shadow-md dark:border dark:bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <SubHeading>
              Incoming Requests
              {incomingRequestsPagination && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({incomingRequestsPagination.total})
                </span>
              )}
            </SubHeading>
          </div>

          <ErrorLoading
            loading={isLoading}
            dataLength={incomingRequests.length}
            emptyMessage="No incoming requests."
            loadingCard={IncomingRequestSkeleton}
            loadingCount={5}
          >
            <>
              <div className="space-y-3">
                {incomingRequests.map((request) => (
                  <IncomingRequestCard
                    key={request.id}
                    request={request}
                  />
                ))}
              </div>

              {incomingRequestsPagination && incomingRequestsPagination.totalPages > 1 && (
                <div className="mt-6">
                  <AppPagination
                    page={incomingRequestspage}
                    totalPages={incomingRequestsPagination.totalPages}
                    onPageChange={goToPageIncomingRequests}
                  />
                </div>
              )}
            </>
          </ErrorLoading>
        </Div>

        {/* Sent */}
        <Div className="rounded-2xl shadow-md dark:border dark:bg-card p-6">
          <div className="mb-5">
            <SubHeading>
              Sent Requests
              {pagination && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({pagination.total})
                </span>
              )}
            </SubHeading>
          </div>

          <ErrorLoading
            loading={loading}
            dataLength={sentRequests.length}
            emptyMessage="No sent requests."
            loadingCard={SentRequestSkeleton}
            loadingCount={5}
          >
            <>
              <div className="space-y-3">
                {sentRequests.map((request) => (
                  <SentRequestCard
                    key={request.id}
                    request={request}
                  />
                ))}
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6">
                  <AppPagination
                    page={page}
                    totalPages={pagination.totalPages}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </>
          </ErrorLoading>
        </Div>
      </div>
    </div>
  );
}