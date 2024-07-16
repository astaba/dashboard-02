import { GlobeAltIcon } from "@heroicons/react/24/outline";

import { lusitana } from "@/lib/fonts";

export default function AcmeLogo() {
  return (
    <p
      className={`${lusitana.className} inline-flex items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <span className="text-[44px]">Acme</span>
    </p>
  );
}
