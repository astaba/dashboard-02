import { Suspense } from "react";

import Pagination from "@/components/invoices/pagination";
import Search from "@/components/search";
import Table from "@/components/invoices/table";
import { CreateInvoice } from "@/components/invoices/buttons";
import { lusitana } from "@/lib/fonts";
import { InvoicesTableSkeleton } from "@/components/skeletons";

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
    </div>
  );
}
