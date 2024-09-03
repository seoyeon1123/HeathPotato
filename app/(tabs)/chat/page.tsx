import getSession from '@/lib/session';
import { formatToTime } from '@/lib/utils';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { getChatRoom } from './actions';

export default async function Chat() {
  const chatRooms = await getChatRoom();
  const session = await getSession();

  return (
    <div className="mt-5 p-5 flex flex-col gap-5">
      <h1 className="text-center text-3xl font-semibold pb-10 border-orange-600">
        🥕당근을 흔들어주세요🥕
      </h1>
      {chatRooms.map((chatRoom, index) => (
        <Link
          key={chatRoom.id}
          href={`/chats/${chatRoom.id}`}
          className="block text-white relative"
        >
          <div
            className={`flex items-center mb-4 relative pb-4 ${
              index !== chatRooms.length - 1
                ? 'border-b-2 border-neutral-600'
                : ''
            }`}
          >
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

            {chatRoom.unreadMessagesCount > 0 && (
              <div className="absolute right-0 bg-orange-600 text-white rounded-full text-xs font-semibold px-3 py-1.5">
                {chatRoom.unreadMessagesCount}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
