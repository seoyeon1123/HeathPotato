'use client';

import { useState } from 'react';
import Input from './input';
import CommentAction from '@/app/posts/[id]/actions';

interface IEditCommentProps {
  payload: string;
  commentId: number;
}

export default function EditComment({ payload, commentId }: IEditCommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newPayload, setNewPayload] = useState(payload);
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPayload(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('payload', newPayload);
    formData.append('commentId', commentId.toString());

    try {
      const result = await CommentAction(null, formData);
      if (result.errors) {
        setError(result.errors.formErrors?.[0] || 'An error occurred');
      } else {
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred');
    }
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            name="payload"
            type="text"
            required
            value={newPayload}
            onChange={handleChange}
            className="text-black"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      ) : (
        <button
          onClick={handleEditClick}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Edit
        </button>
      )}
    </div>
  );
}
