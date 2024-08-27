import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToTimeAgo } from '@/lib/utils';
import { EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as OutlineHandThumbIcon } from '@heroicons/react/24/outline';
import {
  revalidatePath,
  unstable_cache as nextCache,
  revalidateTag,
} from 'next/cache';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import LikeButton from '@/components/like-button';
import Input from '@/components/input';
import Button from '@/components/button';
import { useState } from 'react';
import CommentForm from '@/components/commentForm';

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            Comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

const getCachePost = nextCache(getPost, ['post-detail'], {
  tags: ['post-detail'],
  revalidate: 30,
});

async function getLikeStatus(postId: number, userId: number) {
  //const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ['product-like-status'], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId!);
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const post = await getCachePost(id);
  if (!post) {
    return notFound();
  }

  const session = await getSession();
  const userId = session.id;
  const likePost = async () => {
    'use server';
    const session = await getSession();
    try {
      await db.like.create({
        data: {
          postId: id,
          userId: session.id!,
        },
      });
      revalidateTag(`like-status-${id}`);
    } catch (e) {}
  };
  const dislikePost = async () => {
    'use server';
    try {
      const session = await getSession();
      await db.like.delete({
        where: {
          id: {
            postId: id,
            userId: session.id!,
          },
        },
      });
      revalidateTag(`like-status-${id}`);
    } catch (e) {}
  };

  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  return (
    <div className="p-5 text-white flex flex-col gap-2">
      <div className="border-b-2 pb-5 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Image
            width={28}
            height={28}
            className="size-7 rounded-full"
            src={post.user.avatar!}
            alt={post.user.username}
          />
          <div>
            <span className="text-sm font-semibold">{post.user.username}</span>
            <div className="text-xs">
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="mb-5">{post.description}</p>
        <div className="flex flex-row justify-between gap-5 items-stretch">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>조회 {post.views}</span>
          </div>
          <form action={isLiked ? dislikePost : likePost}>
            <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
          </form>
        </div>
      </div>
      <CommentForm postId={id} userId={userId!} />
    </div>
  );
}
