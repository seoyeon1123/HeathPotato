import { useFormState } from 'react-dom';
import Input from './input';
import EditCommentAction from '@/lib/commentActions';

interface IEditComment {
  payload: string;
  postId: number;
  userId: number;
  commentId: number;
}

export default function EditComment({
  payload,
  postId,
  userId,
  commentId,
}: IEditComment) {
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
        <input name="postId" value={postId} type="hidden" readOnly />
        <input name="userId" value={userId} type="hidden" readOnly />
        <input name="commentId" value={commentId} type="hidden" readOnly />
        <button>수정하기</button>
      </form>
    </>
  );
}
