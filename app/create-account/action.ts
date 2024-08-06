'use server';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import { z } from 'zod';

const checkUsername = (username: string) => {
  return username.includes('potato') ? false : true;
};

const checkPassword = ({
  password,
  comfirmPassword,
}: {
  password: string;
  comfirmPassword: string;
}) => password === comfirmPassword;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: 'Username must be a string! ',
        required_error: 'Where is my username?',
      })
      .trim()
      .toLowerCase()
      .transform((username) => `⭐️${username}⭐️`)

      .refine((username) => checkUsername(username), 'No potato allowed'),

    email: z
      .string({
        invalid_type_error: 'Email must be a string!',
        required_error: 'Where is my email',
      })
      .email()
      .toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, 'Way too short!')
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    comfirmPassword: z.string().min(PASSWORD_MIN_LENGTH, 'Way too short!'),
  })
  .refine(checkPassword, {
    message: 'Both passwords should be the same!',
    path: ['comfirmPassword'],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    comfirmPassword: formData.get('comfirmPassword'),
  };
  console.log(data);
  const result = formSchema.safeParse(data);
  console.log(result.error?.flatten());
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
