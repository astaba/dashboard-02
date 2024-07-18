"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import { cn, generatePagination, getRandomIndex } from "@/lib/utils";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get("page")) || 1;

  // NOTE: generatePagination is just a util function that returns an array
  // used to design the pagination central console differently according
  // to the query result total pages number and the current page.
  const allPages = generatePagination(currentPage, totalPages);

  // NOTE: createPageURL returns a partial URL string with the page query updated
  // Which is required to make pagination links navigable base on their context page.
  const createPageURL = (pageNumber: string | number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <>
      <div className="inline-flex">
        <PaginationArrow
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
          ariaLabel="pagination left"
          className="mr-2 md:mr-4"
        >
          <ArrowLeftIcon className="w-4" />
        </PaginationArrow>

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: "first" | "last" | "single" | "middle" | undefined;

            if (index === 0) position = "first";
            if (index === allPages.length - 1) position = "last";
            if (allPages.length === 1) position = "single";
            if (page === "...") position = "middle";

            return (
              <PaginationNumber
                key={getRandomIndex(index)}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <PaginationArrow
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
          ariaLabel="pagination right"
          className="ml-2 md:ml-4"
        >
          <ArrowRightIcon className="w-4" />
        </PaginationArrow>
      </div>
    </>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = clsx(
    "flex h-10 w-10 items-center justify-center text-sm border",
    {
      "rounded-l-md": position === "first" || position === "single",
      "rounded-r-md": position === "last" || position === "single",
      "z-10 bg-blue-600 border-blue-600 text-white": isActive,
      "hover:bg-gray-100": !isActive && position !== "middle",
      "text-gray-300": position === "middle",
    },
  );

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  ariaLabel,
  isDisabled,
  className,
  children,
}: {
  href: string;
  ariaLabel: string;
  isDisabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const arrowStyle = cn(
    "flex h-10 w-10 items-center justify-center rounded-md border",
    isDisabled ? "pointer-events-none text-gray-300" : "hover:bg-gray-100",
    className,
  );

  return isDisabled ? (
    <div className={arrowStyle}>{children}</div>
  ) : (
    <Link href={href} className={arrowStyle} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
