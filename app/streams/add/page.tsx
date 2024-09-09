'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { useFormState } from 'react-dom';
import { startStream } from './actions';

export default function AddStream() {
  const [state, action] = useFormState(startStream, null);
  return (
    <>
      <h1 className="text-2xl text-center py-2 rounded-full border-orange-600 m-2 border-2">
        Live Streaming을 시작하세요!
      </h1>
      <form action={action} className="p-5 flex flex-col gap-3">
        <Input
          name="title"
          required
          placeholder="Title or your stream."
          errors={state?.formErrors}
        />
        <Button text="Start streaming" />
      </form>
    </>
  );
}

//recoding -> automacit -> 즉각적으로 사람들이 볼 수 있게 될 것이라는 의미임. 그리고 그 기록이 cloudflare 서버에 저장된다는 의미 -> stream이 끝나면 cloudflare 서버에 저장이 될 것임.
