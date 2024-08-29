// components/DeleteCommentBtn.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteComment } from '@/app/posts/[id]/actions';

interface IDeleteCommentBtnProps {
  commentId: number;
  userId: number;
}

export default function DeleteCommentBtn({
  commentId,
  userId,
}: IDeleteCommentBtnProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDeleteClick = async () => {
    setIsDeleting(true);

    try {
      await deleteComment(commentId);
      router.refresh(); // Refresh the page to update the comments list
    } catch (error) {
      console.error(error);
      setError('An error occurred while deleting the comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDeleteClick}
      disabled={isDeleting}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
