"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AppPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  const createPages = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>

        <PaginationItem>
          <PaginationPrevious
            onClick={() => page > 1 && onPageChange(page - 1)}
            className={
              page === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {createPages().map((item, index) =>
          item === "..." ? (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={page === item}
                onClick={() => onPageChange(item)}
                className="cursor-pointer"
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              page < totalPages &&
              onPageChange(page + 1)
            }
            className={
              page === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}