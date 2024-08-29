'use client';

import { useState } from 'react';
import Input from './input';
import ListComment from './List-comment';
import CommentAction from '@/app/posts/[id]/actions'; // Ensure this import is correct

interface ICommentFormProps {
  postId: number;
  userId: number;
}

export default function CommentForm({ postId, userId }: ICommentFormProps) {
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<any>(null); // Handle form errors

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('payload', comment);
    formData.append('postId', postId.toString());
    formData.append('userId', userId.toString());

    const result = await CommentAction(null, formData);

    if (result.errors) {
      setErrors(result.errors);
    } else {
      setComment(''); // Clear input field
      // Optionally refresh comments or handle UI changes
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            name="payload"
            type="text"
            required
            placeholder="댓글을 입력해주세요."
            onChange={handleChange}
            value={comment}
            errors={errors?.formErrors}
          />
          <input name="postId" value={postId} type="hidden" readOnly />
          <input name="userId" value={userId} type="hidden" readOnly />
          <div className="self-end">
            <button type="submit" className="bg-orange-500 p-2 px-4 rounded-lg">
              작성하기
            </button>
          </div>
        </form>
        <ListComment postId={postId} userId={userId} />
      </div>
    </>
  );
}
