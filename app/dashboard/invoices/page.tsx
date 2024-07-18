import { Suspense } from "react";

import Pagination from "@/components/invoices/pagination";
import Search from "@/components/search";
import Table from "@/components/invoices/table";
import { CreateInvoice } from "@/components/invoices/buttons";
import { lusitana } from "@/lib/fonts";
import { InvoicesTableSkeleton } from "@/components/skeletons";
import { fetchInvoicesPages } from "@/lib/data";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  // HACK: invoices/page doesn't need the totalPages, only Pagination component
  // does. But since Pagination is a client component and we are not using an API
  // layer, fetching there would expose your database secrets.
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
