import React from 'react';

interface ICommentProps {
  comment: {
    user: {
      id: number;
    };
    id: number;
  };
  userId: number;
  handleDelete: (commentId: number) => void;
}

export default function DeleteCommentBtn({
  comment,
  userId,
  handleDelete,
}: ICommentProps) {
  return (
    <>
      {userId === comment.user.id && (
        <button
          onClick={() => {
            console.log('Delete button clicked for comment ID:', comment.id);
            handleDelete(comment.id);
          }}
          className="p-2 text-sm bg-orange-500 rounded-lg w-20"
        >
          삭제하기
        </button>
      )}
    </>
  );
}
