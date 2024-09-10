'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { useFormState } from 'react-dom';
import { startStream } from './actions';

export default function AddStream() {
  const [state, action] = useFormState(startStream, null);
  return (
    <>
      <h1 className="text-2xl text-center rounded-full py-3 border-orange-500 mt-5 mx-2 border-4 bg-orange-100 text-orange-700 font-semibold shadow-lg">
        Live Streaming을 시작하세요!
      </h1>
      <form
        action={action}
        className="p-8 bg-neutral-900 rounded-lg shadow-md flex flex-col gap-6 mx-auto w-full "
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-xl text-white font-semibold">
            스트리밍의 제목을 정해주세요!
          </h1>
          <Input
            name="title"
            required
            placeholder="Title of your stream"
            className="border-2 border-gray-300 rounded-md p-2 text-black"
            errors={state?.formErrors}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl text-white font-semibold">
            어떤 스트리밍인가요?
          </h1>
          <Input
            name="description"
            required
            placeholder="Describe your stream"
            className="border-2 border-gray-300 rounded-md p-2  text-black"
            errors={state?.formErrors}
          />
        </div>
        <Button text="Start Streaming ‼️" />
      </form>
    </>
  );
}
