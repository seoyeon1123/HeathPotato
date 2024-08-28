import { useFormState } from 'react-dom';
import Input from './input';
import EditCommentAction from '@/lib/commentActions';

interface IEditComment {
  payload: string;
  commentId: number;
}

export default function EditComment({ payload, commentId }: IEditComment) {
  const [state, action] = useFormState(EditCommentAction, null);
  return (
    <>
      <form action={action}>
        <Input
          name="payload"
          type="text"
          required
          defaultValue={payload}
          placeholder="댓글을 입력해주세요."
          errors={state?.fieldErrors.payload}
        />
        <input name="commentId" value={commentId} type="hidden" readOnly />
        <button>수정하기</button>
      </form>
    </>
  );
}
