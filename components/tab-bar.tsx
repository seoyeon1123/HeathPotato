'use client';

import Link from 'next/link';
import {
  NewspaperIcon as OutlineNewspaperIcon,
  HomeIcon as OutlineHomeIcon,
  ChatBubbleOvalLeftEllipsisIcon as OutlineChatIcon,
  VideoCameraIcon as OutlineLiveIcon,
  UserIcon as OutlineUserIcon,
} from '@heroicons/react/24/outline';
import {
  NewspaperIcon as SolidNewspaperIcon,
  HomeIcon as SolidHomeIcon,
  ChatBubbleOvalLeftEllipsisIcon as SolidChatIcon,
  VideoCameraIcon as SolidLiveIcon,
  UserIcon as SolidUserIcon,
} from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';

export default function TabBar() {
  const pathname = usePathname();
  return (
    <>
      <div className="fixed bottom-0 w-full mx-auto max-w-screen-md grid grid-cols-5 border-neutral-600 border-t-2 px-5 py-3 *:text-white bg-neutral-800">
        <Link href="/products" className="flex flex-col items-center gap-px">
          {pathname === '/products' ? (
            <SolidHomeIcon className="size-7" />
          ) : (
            <OutlineHomeIcon className="size-7" />
          )}
          <span>홈</span>
        </Link>
        <Link href="/life" className="flex flex-col items-center gap-px">
          {pathname === '/life' ? (
            <SolidNewspaperIcon className="size-7" />
          ) : (
            <OutlineNewspaperIcon className="size-7" />
          )}
          <span>동네생활</span>
        </Link>
        <Link href="/chat" className="flex flex-col items-center gap-px">
          {pathname === '/chat' ? (
            <SolidChatIcon className="size-7" />
          ) : (
            <OutlineChatIcon className="size-7" />
          )}
          <span>채팅</span>
        </Link>
        <Link href="/live" className="flex flex-col items-center gap-px">
          {pathname === '/live' ? (
            <SolidLiveIcon className="size-7" />
          ) : (
            <OutlineLiveIcon className="size-7" />
          )}
          <span>쇼핑</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-px">
          {pathname === '/profile' ? (
            <SolidUserIcon className="size-7" />
          ) : (
            <OutlineUserIcon className="size-7" />
          )}
          <span>나의 당근</span>
        </Link>
      </div>
    </>
  );
}
