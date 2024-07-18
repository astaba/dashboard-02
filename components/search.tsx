"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useDebouncedCallback } from "use-debounce";

// NOTE: (1) Capture the user input with an inline handler
// (2) Append the search term to the already existing URLSearchParams
// if any, and push to the browser History API.
// (3) Keep the URL in sync with input field via its defaultValue
// (4) Make sure each new search starts from page 1
// (5) Debounce the event handler to avoid colapsing the database API

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((value: string) => {
    const term = value.trim();
    // TEST:
    // console.log("Search Input:", term);
    const params = new URLSearchParams(searchParams);
    if (params.has("page")) params.set("page", "1");
    if (term) params.set("query", term);
    else params.delete("query");
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(event) => handleSearch(event.target.value)}
        defaultValue={searchParams.get("query") as string}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
