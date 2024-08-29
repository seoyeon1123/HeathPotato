// app/posts/[id]/page.tsx
import Image from 'next/image';
import { notFound } from 'next/navigation';
import LikeButton from '@/components/like-button';
import { EyeIcon } from '@heroicons/react/24/solid';
import { formatToTimeAgo } from '@/lib/utils';
import getSession from '@/lib/session';
import db from '@/lib/db';
import CommentForm from '@/components/commentForm';

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        user: { select: { username: true, avatar: true } },
        _count: { select: { Comments: true } },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

async function getLikeStatus(postId: number) {
  const session = await getSession();
  if (!session || !session.id) {
    return { likeCount: 0, isLiked: false };
  }

  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: session.id,
      },
    },
  });

  const likeCount = await db.like.count({ where: { postId } });
  return { likeCount, isLiked: Boolean(isLiked) };
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

  const post = await getPost(id);
  if (!post) {
    return notFound();
  }

  const { likeCount, isLiked } = await getLikeStatus(id);
  const session = await getSession();
  const userId = session?.id || null;

  return (
    <div className="p-5 text-white">
      <div className="flex flex-col gap-4">
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
        <div className="flex flex-col gap-5 items-start">
          <div className="flex items-center gap-2 text-neutral-400 text-sm">
            <EyeIcon className="size-5" />
            <span>조회 {post.views}</span>
          </div>
          <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
        </div>
        <CommentForm postId={id} userId={userId!} />
      </div>
    </div>
  );
}
