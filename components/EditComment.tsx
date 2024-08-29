import { useState } from 'react';
import Input from './input';
import { useFormState } from 'react-dom';
import EditAction from '@/app/products/[id]/edit/actions';
import updateCommentAction from '@/lib/commentActions';

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
    setNewPayload(payload); // 원래의 payload로 복원
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPayload(e.target.value);
  };

  // useFormState를 사용하지 않고 직접 수정 처리
  const [state, action] = useFormState(updateCommentAction, null);
  return (
    <div>
      <form
        action={action}
        className="flex flex-row gap-2 items-baseline justify-center"
      >
        <Input
          name="payload"
          type="text"
          required
          value={newPayload}
          onChange={handleChange}
          className="text-neutral-400 rounded-full text-sm"
          errors={state?.fieldErrors.payload}
        />
        <input name="commentId" value={commentId} className="hidden" />
        <div className="flex gap-2 mt-2">
          <button className=" text-white px-4 py-2 text-sm rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
