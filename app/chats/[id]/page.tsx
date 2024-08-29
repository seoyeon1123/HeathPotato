import db from '@/lib/db';
import getSession from '@/lib/session';
import { notFound } from 'next/navigation';

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id));

    if (!canSee) {
      //즉 현재 로그인한 사용자의 id와 같은 것을 가진 object가 room의 users array에 없다면,
      return null;
    }
  }
  return room;
}

//url을 가지고 있다고 해서 room의 메시지를 볼 수 있으면 안됨 -> 이를 위해서 room이 먼저 찾아지는지 확인해야 함 -> 기본적으로 array에서 검색을 하면 된다.
//find가 나에게 user를 주거나 undefined를 주게 됨 .

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
  return <h1>chat!</h1>;
}
//여기서 중요한 점이, 사용자가 이 room에 실제로 허용이 되는지 확인해야 한다는 점임. --> 이 room은 공개적인 것이 아니기 때문, 모든 사람을 위한게 아님 -> 사용자가 실제로 여기에 허용되는지 확인을 해야함.
//Room을 가져올 때, 그 Room에 있는 user의 id도 가져오고 싶은 것임.
