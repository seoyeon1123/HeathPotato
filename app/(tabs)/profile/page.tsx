import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToTimeAgo } from '@/lib/utils';
import {
  BellAlertIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  FaceFrownIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound(); //session에 ID가 없을 때 실행된다.
}

async function getUserProduct(id: number) {
  const userProduct = await db.product.findMany({
    where: {
      userId: id,
    },
    select: {
      id: true,
      price: true,
      title: true,
      created_at: true,
      photo: true,
    },
  });
  return userProduct;
}

export default async function Profile() {
  const user = await getUser();
  const userProduct = await getUserProduct(user.id);

  const logOut = async () => {
    'use server';
    const session = await getSession();
    session.destroy();
    redirect('/');
  };
  return (
    <div className="p-10 flex flex-col gap-8">
      <div className="flex justify-between items-center border-2 border-opacity-30 rounded-xl px-5 py-3">
        <div className="flex flex-row items-center gap-3 rounded-full">
          <Image
            src={`${user.avatar}/public`}
            alt={user.username}
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
          <h1 className="text-xl">{user.username}</h1>
        </div>
        <Link href={`/profile/edit/${user.id}`}>
          <ChevronRightIcon className="size-6 text-white" />
        </Link>
      </div>
      <div
        className="p-5 border-2 rounded-xl
      *:text-white flex flex-row justify-around"
      >
        <Link
          href={`/profile/product`}
          className="flex flex-col items-center gap-2"
        >
          <ClipboardDocumentListIcon className="size-8" />
          <h1>판매 내역</h1>
        </Link>
        <Link
          href={`/profile/life`}
          className="flex flex-col items-center gap-2"
        >
          <PencilSquareIcon className="size-8" />
          <h1>내가 쓴 글</h1>
        </Link>
        <Link
          href={`/profile/live`}
          className="flex flex-col items-center gap-2"
        >
          <BellAlertIcon className="size-8" />
          <h1>나의 라이브</h1>
        </Link>
      </div>

      <form action={logOut} className="flex flex-row gap-2">
        <FaceFrownIcon className="size-8" />
        <button>로그아웃</button>
      </form>
    </div>
  );
}
