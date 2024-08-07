'use server';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const checkUsername = (username: string) => {
  return username.includes('potato') ? false : true;
};

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const chenkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};
//우리는 문제가 발생했다면(email이 있다면), false를 return 하고 싶은 것임.
//문제가 발생하지 않는다면(email이 없다면) -> true를 return 하고 싶은 것임.

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
      .refine(
        (username) => checkUniqueUsername(username),
        'This username is already taken '
      )
      .refine((username) => checkUsername(username), 'No potato allowed'),

    email: z
      .string({
        invalid_type_error: 'Email must be a string!',
        required_error: 'Where is my email',
      })
      .email()
      .toLowerCase()
      .refine(
        (email) => chenkUniqueEmail(email),
        'There is an account already registered with that email'
      ),
    password: z.string().min(PASSWORD_MIN_LENGTH, 'Way too short!'),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
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
  const result = await formSchema.safeParseAsync(data);
  console.log(result.error?.flatten());
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    console.log(hashedPassword);

    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    const session = await getIronSession(cookies(), {
      cookieName: 'delicious -carrot',
      password: process.env.COOKIE_PASSWORD!,
    });

    //@ts-expect-error
    session.id = user.id;
    session.save();
    redirect('/profile');
  }
}

//사용자에게 쿠키를 전달하고 나면, 우리가 아무것도 하지 않아도 다음번ㄴ에 사용자 브라우저가 request를 보낼 때, 브라우저가 자동적으로 해당 쿠키를 서버로 보내게 된다.
