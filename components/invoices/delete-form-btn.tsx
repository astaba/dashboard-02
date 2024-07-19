"use client";
import { TrashIcon } from "@heroicons/react/24/outline";

import { deleteInvoice } from "@/lib/actions";

export default function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  const handleSubmit = (event: React.FormEvent) => {
    const isOk = confirm("Are you sure you want to delete this item?");
    if (!isOk) event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} action={deleteInvoiceWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
