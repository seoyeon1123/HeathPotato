import db from '@/lib/db';
import getSession from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      //데이터베이스에 저장된 user의 id와 session의 id를 확인하고 일치한 User를 찾을거임
    });
    if (user) {
      return user;
    }
  }
  notFound(); //session에 ID가 없을 때 실행된다.
}

export default async function Profile() {
  const user = await getUser();

  const logOut = async () => {
    'use server';
    const session = await getSession();
    session.destroy();
    redirect('/');
  };
  return (
    <div>
      <h1>Welcome! {user.username}!</h1>
      <form action={logOut}>
        <button>Log out</button>
      </form>
    </div>
  );
}

//우리가 Log out 버튼을 클릭할 때마다 form을 제출하고 lotOut server action을 trigger함
