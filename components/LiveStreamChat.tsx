import db from '@/lib/db';
import getSession from '@/lib/session';
import LiveStreamMessageForm from './LiveStreamMessageForm';
import { Prisma } from '@prisma/client';
import { notFound } from 'next/navigation';

// 스트림 ID를 기준으로 진행자의 userId를 가져오는 함수
async function getLiveStream(id: number) {
  return await db.liveStream.findUnique({
    where: { id },
    select: { userId: true }, // 진행자의 userId를 선택
  });
}

// 현재 세션의 사용자 정보를 가져오는 함수
async function getUserProfile() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      username: true,
      avatar: true,
    },
  });
  return user;
}

// 특정 스트림의 채팅 메시지를 가져오는 함수
async function getLiveStreamChat(id: number) {
  const liveStreamChat = await db.liveChatMessage.findMany({
    where: {
      streamId: id,
    },
    select: {
      payload: true,
      userId: true,
      created_at: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return liveStreamChat;
}

// InitialChatMessages 타입 정의
export type InitialChatMessages = Prisma.PromiseReturnType<
  typeof getLiveStreamChat
>;

// LiveStreamChat 컴포넌트
export default async function LiveStreamChat({ id }: { id: number }) {
  const liveStreamChat = await getLiveStreamChat(id);
  const liveStream = await getLiveStream(id);
  const session = await getSession();

  if (!liveStreamChat || !liveStream) {
    return notFound();
  }

  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }

  return (
    <div className="mt-10">
      <LiveStreamMessageForm
        id={id}
        initialMessages={liveStreamChat!}
        userId={session.id!}
        username={user.username}
        avatar={user.avatar!}
        streamId={id}
      />
    </div>
  );
}
