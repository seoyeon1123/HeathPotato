import db from '@/lib/db';
import getSession from '@/lib/session';

export async function getUnreadMessagesCount(
  chatRoomId: string,
  userId: number
) {
  return await db.message.count({
    where: {
      chatRoomId,
      userId: {
        not: userId,
      },
      isRead: false,
    },
  });
}

export async function getChatRoom() {
  const session = await getSession();
  const userId = session.id;

  const chatRooms = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      created_at: true,
      messages: {
        select: {
          payload: true,
          created_at: true,
        },
        take: 1, // Show only the latest message
        orderBy: { created_at: 'desc' },
      },
      users: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  // 각 채팅방의 새 메시지 개수를 계산
  const chatRoomsWithUnreadCount = await Promise.all(
    chatRooms.map(async (chatRoom) => {
      const unreadMessagesCount = await getUnreadMessagesCount(
        chatRoom.id,
        userId!
      );
      return {
        ...chatRoom,
        unreadMessagesCount,
      };
    })
  );

  return chatRoomsWithUnreadCount;
}
