# Next.js Tutorial

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the **[course curriculum](https://nextjs.org/learn)** on the Next.js Website, and the **[final project](https://next-learn-dashboard.vercel.sh/)** (`user@nextmail.com`, 123456)

## Styling

**Tailwind** and **CSS modules** are the two most common ways of styling Next.js applications. Whether you use one or the other is a matter of preference - **you can even use both in the same application!**

Consider also **[styled-components](https://github.com/vercel/next.js/tree/canary/examples/with-styled-components)**

### Using the `clsx` library to toggle class names

**[clsx](https://github.com/lukeed/clsx)** is tiny utility for constructing className strings conditionally.

There may be cases where you may need to conditionally style an element based on state or some other condition.

```tsx
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
)}
```

