import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToWon } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache';

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }

  return false;
}

async function getProduct(id: number) {
  console.log('product');
  const product = db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return product;
}

const getCachedProduct = nextCache(getProduct, ['product-detail'], {
  tags: ['product-detail', 'xxx'],
});

async function getProductTitle(id: number) {
  console.log('title');
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(getProductTitle, ['product-title'], {
  tags: ['product-title', 'xxx'],
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getCachedProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  const onDelete = async () => {
    'use server';
    await db.product.delete({
      where: {
        id,
      },
      select: null,
    });

    redirect('/home');
  };

  const revalidate = async () => {
    'use server';
    revalidateTag('xxx');
  };
  return (
    <>
      <div>
        <div className="relative aspect-square">
          <Image
            className="object-cover"
            fill
            src={`${product.photo}/public`}
            alt={product.title}
          />
        </div>
        <div className="p-5 flex items-center gap-3 border-b border-neutral-600">
          <div className="size-10 rounded-full">
            {product.user.avatar !== null ? (
              <Image
                className="rounded-full"
                src={product.user.avatar}
                alt={product.title}
                width={40}
                height={40}
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <div>
            <h3>{product.user.username}</h3>
          </div>
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p>{product.description}</p>
        </div>
        <div
          className="
    mx-auto max-w-screen-sm w-full
    fixed bottom-0 left-1/2 transform -translate-x-1/2 p-5 bg-neutral-800 flex justify-between items-center"
        >
          <span className="font-semibold text-lg">
            {formatToWon(product.price)}원{' '}
          </span>
          {isOwner ? (
            <form action={revalidate}>
              <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                Revalidate title cache
              </button>
            </form>
          ) : null}
          <Link
            className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold active:bg-orange-400"
            href={``}
          >
            채팅하기
          </Link>
        </div>
      </div>
    </>
  );
}

//두가지의 cache가 한 페이지에 존재하지만, 오로지 'product-title'만 새로고침이 되었고, 'product-detail'은 새로고침이 되지 않은 것을 확인할 수있다. --> tag로 인해 제어권이 생겼다.

//경로를 기반으로 새로고침을 하면 그 경로의 모든 cache가 새로고침이 된다.
//단, tag로 새로고침을 하면, 오직 이 태그를 가진 cache만 새로고침이 된다.

//태그 하나가 여러 cache들을 새로고침할 수도 있음.
