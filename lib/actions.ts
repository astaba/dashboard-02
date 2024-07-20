"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sql } from "@vercel/postgres";

const DBInvoiceCodex = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoiceCodex = DBInvoiceCodex.omit({ id: true, date: true });
const UpdateInvoiceCodex = DBInvoiceCodex.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoiceCodex.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCent = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCent}, ${status}, ${date})
    `;

    revalidatePath("/dashboard/invoices");
  } catch (error) {
    console.error(error);
    return {
      message: "Database error: Failed to Create Invoice",
    };
  }
  // WARN: redirect is called outside the trycatch block because
  // it works by throwing an error we don't want to be caught.
  // Thus, redirect won't fire until all the block is successful
  redirect("/dashboard/invoices");
}

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoiceCodex.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCent = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
    UPDATE invoices
    SET
      customer_id = ${customerId},
      amount = ${amountInCent},
      status = ${status},
      date = ${date}
    WHERE id = ${id}
    `;

    revalidatePath("/dashboard/invoices");
  } catch (error) {
    console.error(error);
    return {
      message: "Database error: Failed to Update Invoice",
    };
  }

  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  // TEST:
  // throw Error("Failed to delete invoice");
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted invoice" };
  } catch (error) {
    console.error(error);
    return {
      message: "Database error: Failed to Delete Invoice",
    };
  }
}
