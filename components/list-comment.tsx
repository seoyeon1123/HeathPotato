// components/ListComment.tsx
import db from '@/lib/db';
import EditComment from './EditComment';
import { formatToTimeAgo } from '@/lib/utils';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import DeleteCommentBtn from './deleteBtn'; // Import corrected

interface IListProps {
  postId: number;
  userId: number;
}

async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: { postId },
    select: {
      id: true,
      payload: true,
      created_at: true,
      user: {
        select: {
          username: true,
          avatar: true,
          id: true,
        },
      },
    },
  });
  return comments;
}

export default async function ListComment({ postId, userId }: IListProps) {
  const comments = await getComments(postId);

  if (!comments) {
    return notFound();
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex flex-row gap-4 p-4 border-b-2 border-orange-500 last:border-b-0"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Image
                width={25}
                height={25}
                src={comment.user.avatar!}
                alt={comment.user.username}
                className="rounded-full"
              />
              <h1 className="font-semibold">{comment.user.username}</h1>
            </div>
            <p className="text-lg mt-2">{comment.payload}</p>
            <span className="text-gray-500 block mt-1">
              {formatToTimeAgo(comment.created_at.toString())}
            </span>
          </div>
          {userId === comment.user.id && (
            <div className="flex flex-row items-baseline justify-between ">
              <EditComment payload={comment.payload} commentId={comment.id} />

              {/* <DeleteCommentBtn commentId={comment.id} /> */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
