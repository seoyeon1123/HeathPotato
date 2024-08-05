import { InputHTMLAttributes } from 'react';

interface Input {
  errors?: string[];
  name: string;
}

export default function Input({
  errors = [],
  name,
  ...rest
}: Input & InputHTMLAttributes<HTMLInputElement>) {
  //FormInput 컴포넌트는 이것들을 props로 받는데. 그것 뿐만 아니라 input이 받을 수 있는 attributes 또한 받을 수 있다고 하는 것임.
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
