'use client';

import { useFormState } from 'react-dom';
import Input from './input';
import ListComment from './List-comment';
import CommentAction from '@/app/posts/[id]/actions';

interface ICommentFormProps {
  postId: number;
  userId: number;
  comments: Array<{
    id: number;
    payload: string;
    created_at: Date;
    user: {
      username: string;
      avatar: string | null;
    };
  }>;
}

export default function CommentForm({
  postId,
  userId,
  comments,
}: ICommentFormProps) {
  const [state, action] = useFormState(CommentAction, null);

  return (
    <div className="flex flex-col gap-4">
      <form className="flex flex-col gap-4" action={action}>
        <Input
          name="payload"
          type="text"
          required
          placeholder="댓글을 입력해주세요."
          errors={state?.errors?.fieldErrors?.payload}
        />
        <input name="postId" value={postId} type="hidden" readOnly />
        <input name="userId" value={userId} type="hidden" readOnly />
        <div className="self-end">
          <button type="submit" className="bg-red-500 p-2 px-4 rounded-lg">
            작성하기
          </button>
        </div>
      </form>
      {/* Pass the comments prop down to ListComment */}
      <ListComment comments={comments} />
    </div>
  );
}
