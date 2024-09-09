import { PlusIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function Chat() {
  return (
    <div>
      <Link
        href="/streams/add"
        shallow
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
      <h1 className="text-white text-4xl">Live Shopping!</h1>
    </div>
  );
}
