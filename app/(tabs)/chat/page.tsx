import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToTime } from '@/lib/utils';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

async function getChatRoom() {
  const chatRooms = await db.chatRoom.findMany({
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
  return chatRooms;
}

export default async function Chat() {
  const chatRooms = await getChatRoom();
  const session = await getSession();

  return (
    <>
      <div className="p-5 flex flex-col gap-5">
        {chatRooms.map((chatRoom) => (
          <Link
            key={chatRoom.id}
            href={`/chats/${chatRoom.id}`}
            className="block text-white"
          >
            <div>
              {chatRoom.users
                .filter((user) => user.id !== session.id)
                .map((user) => (
                  <div key={user.id} className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          width={45}
                          height={45}
                          className="rounded-full"
                        />
                      ) : (
                        <UserCircleIcon className="w-10 h-10 text-gray-500" />
                      )}
                    </div>
                    <div className="ml-4">
                      {chatRoom.messages.map((message) => (
                        <div key={message.created_at.toString()}>
                          <div className="flex flex-row gap-3">
                            <div className="text-right">
                              <span className="block text-sm font-semibold">
                                {user.username}
                              </span>
                            </div>
                            <span>・</span>
                            <span className="block text-sm font-light text-neutral-300">
                              {formatToTime(message.created_at.toString())}
                            </span>
                          </div>
                          <span className="block text-lg text-neutral-200">
                            {message.payload}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
