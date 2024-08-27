import db from '@/lib/db';
import { formatToTimeAgo } from '@/lib/utils';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { revalidateTag } from 'next/cache';

interface IListProps {
  postId: number;
}

async function getComment(postId: number) {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return comments;
}

async function deleteComment(id: number) {
  await db.comment.delete({
    where: {
      id,
    },
    select: null,
  });
  revalidateTag('post-detail');
}

export default async function ListComment({ postId }: IListProps) {
  const comments = await getComment(postId);
  if (!comments) {
    return notFound();
  }

  return (
    <>
      <div>
        {comments.map((comment) => (
          <div
            key={comment.payload}
            className="flex flex-row gap-2 justify-between items-center border-b-2 border-orange-500 p-4 last:border-b-0 "
          >
            <div>
              <div className="flex flex-row gap-3">
                <Image
                  width={25}
                  height={25}
                  src={comment.user.avatar!}
                  alt={comment.user.username}
                  className="rounded-full"
                />
                <h1>{comment.user.username}</h1>
              </div>
              <p className="text-lg">{comment.payload}</p>
              <span>{formatToTimeAgo(comment.created_at.toString())}</span>
            </div>
            <div>
              {/* <button
                onClick={() => deleteComment(comment.id)}
                className="p-2 text-sm bg-orange-500 rounded-lg w-20"
              >
                삭제하기
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
