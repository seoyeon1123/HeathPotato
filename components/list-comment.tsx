// components/ListComment.tsx
import db from '@/lib/db';
import DeleteButton from './DeleteButton';
import EditComment from './EditComment';
import { formatToTimeAgo } from '@/lib/utils';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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
    <div>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex flex-row gap-2 justify-between items-center border-b-2 border-orange-500 p-4 last:border-b-0"
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
            {userId === comment.user.id && (
              <div className="flex gap-2 mt-2">
                <EditComment payload={comment.payload} commentId={comment.id} />
                <DeleteButton commentId={comment.id} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
