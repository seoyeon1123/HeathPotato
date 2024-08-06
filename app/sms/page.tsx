'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { useFormState } from 'react-dom';
import { smsLogin } from './action';
import { error } from 'console';

const initialState = {
  token: false,
  error: undefined,
};

//페이지가 처음 render 되면, state.token의 값이 false가 된다.
//이를 이용해서 input을 숨기는데 그걸 사용할 수 있다는 것을 의미함.
export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogin, initialState);
  //두번째 인자 null -> initial state임
  //initial state는 이 함수를 최초 호출할 때의 prevState의 값이 된다.

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="phone"
          type="text"
          required
          placeholder="Phone number"
          errors={state.error?.formErrors}
        />
        {state.token ? (
          <Input
            name="token"
            type="number"
            required
            placeholder="Verification code"
            min={100000}
            max={999999}
            errors={[]}
          />
        ) : null}
        <Button text={state.token ? 'Verify Token' : 'Send Verification SMS'} />
      </form>
    </div>
  );
}
