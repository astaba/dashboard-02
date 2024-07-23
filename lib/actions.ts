"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sql } from "@vercel/postgres";

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const DBInvoiceCodex = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoiceCodex = DBInvoiceCodex.omit({ id: true, date: true });
const UpdateInvoiceCodex = DBInvoiceCodex.omit({ id: true, date: true });

export async function createInvoice(_prevState: State, formData: FormData) {
  /* NOTE:
   * (1)--- Implement zod validation
   * (2)--- If validation fails, return errors early
   * (3)--- Prepare data for insertion into the Database
   * (4)--- Insert data into the Database
   * (4.1)- If datbase error occurs, return a more specific error
   * WARN:
   * (5)--- Redirect is called outside the trycatch block because
   * it works by throwing an error we don't want to be caught.
   * Thus, redirect won't fire until all the block is successful
   * */
  const codexAsses = CreateInvoiceCodex.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // TEST:
  // console.log({ ...codexAsses });
  if (!codexAsses.success) {
    return {
      errors: codexAsses.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create to Invoice.",
    };
  }

  const { customerId, amount, status } = codexAsses.data;
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

  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  _prevState: State,
  formData: FormData,
) {
  const codexAsses = UpdateInvoiceCodex.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!codexAsses.success) {
    return {
      errors: codexAsses.error.flatten().fieldErrors,
      message: "Database error: Failed to Update Invoice",
    };
  }

  const { status, amount, customerId } = codexAsses.data;
  const amountInCent = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET
        customer_id = ${customerId},
        amount = ${amountInCent},
        status = ${status}
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
