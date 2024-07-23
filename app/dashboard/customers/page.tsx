import { fetchFilteredCustomers } from "@/lib/data";
import CustomersTable from "@/components/customers/table";

export default async function Page({
  searchParams,
}: {
  searchParams: { query?: string; page?: string };
}) {
  const query = searchParams?.query || "";
  const customers = await fetchFilteredCustomers(query);

  return <CustomersTable customers={customers} />;
}
