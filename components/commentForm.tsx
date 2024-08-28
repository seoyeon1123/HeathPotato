'use client';

import { useFormState } from 'react-dom';
import Input from './input';
import ListComment from './list-comment';
import CommentAction from '@/app/posts/[id]/actions';
import { useOptimistic, useState } from 'react';

interface ICommentFormProps {
  postId: number;
  userId: number;
}

export default function CommentForm({ postId, userId }: ICommentFormProps) {
  const [state, action] = useFormState(CommentAction, null);
  const [comment, setComment] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <form className="flex flex-col gap-4" action={action}>
          <Input
            name="payload"
            type="text"
            required
            placeholder="댓글을 입력해주세요."
            onChange={handleChange}
            value={comment}
            errors={state?.errors?.formErrors}
          />
          <input name="postId" value={postId} type="hidden" readOnly />{' '}
          <input name="userId" value={userId} type="hidden" readOnly />{' '}
          <div className="self-end">
            <button className="bg-orange-500 p-2 px-4 rounded-lg">
              작성하기
            </button>
          </div>
        </form>
        <ListComment postId={postId} userId={userId} />
      </div>
    </>
  );
}
