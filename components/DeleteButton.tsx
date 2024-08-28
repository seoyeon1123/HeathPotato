// components/DeleteButton.tsx
import { useRouter } from 'next/navigation';
import { deleteComment } from '@/lib/commentActions'; // Import the server function

interface IDeleteButtonProps {
  commentId: number;
}

export default function DeleteButton({ commentId }: IDeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteComment(commentId); // Call the server function
      router.refresh(); // Refresh the page to reflect the deletion
    } catch (error) {
      console.error('Failed to delete comment', error);
    }
  };

  return (
    <button
      className="bg-red-500 p-2 px-4 rounded-lg text-white"
      onClick={handleDelete}
    >
      삭제
    </button>
  );
}
