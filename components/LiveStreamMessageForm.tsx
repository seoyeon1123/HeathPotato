'use client';

import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from './chat-message';
import { InitialChatMessages } from './LiveStreamChat';
import { saveLiveChatMessage } from '@/app/streams/[id]/action';
import Image from 'next/image';

// LiveChatMessageListProps 인터페이스 정의
interface LiveChatMessageListProps {
  initialMessages: InitialChatMessages;
  id: number;
  userId: number;
  username: string;
  avatar: string;
  streamId: number;
}

// LiveStreamMessageForm 컴포넌트
export default function LiveStreamMessageForm({
  id,
  userId,
  initialMessages,
  username,
  avatar,
  streamId,
}: LiveChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState('');
  const channel = useRef<RealtimeChannel>();

  // 컴포넌트 마운트 시 Supabase 클라이언트를 설정하고 채널을 구독
  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

    channel.current = client.channel(`room -${id}`);
    channel.current
      .on('broadcast', { event: 'message' }, (payload) => {
        console.log(payload);
        // 여기에 실시간 메시지 수신 후의 처리 로직을 추가할 수 있습니다
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, [id]);

  // 입력 필드 변화 처리
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMessage(value);
  };

  // 메시지 제출 처리
  const onsubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMsg = {
      id: Date.now(),
      payload: message,
      created_at: new Date(),
      userId,
      user: {
        username,
        avatar,
      },
    };

    setMessages((prevMessages) => [...prevMessages, newMsg]);
    channel.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: newMsg,
    });
    await saveLiveChatMessage(message, streamId);
    setMessage(''); // 메시지 전송 후 입력 필드 초기화
  };

  return (
    <>
      <div className="flex flex-col gap-3 mb-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-row gap-3">
            <Image
              src={msg.user.avatar! || '/path/to/default/image.png'} // 기본 이미지 설정
              alt={msg.user.username}
              width={50}
              height={50}
              className="size-5 rounded-full"
            />
            <h3 className="text-neutral-500">{msg.user.username}</h3>
            {userId === msg.userId ? (
              <p className="text-orange-500 font-semibold">{msg.payload}</p>
            ) : (
              <p className="font-semibold">{msg.payload}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mb-5">
        <form className="flex flex-row w-full gap-3" onSubmit={onsubmit}>
          <input
            name="liveStreamMessage"
            required
            value={message}
            onChange={onChange}
            type="text"
            placeholder="소통해볼까요?"
            className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          />
          <button type="submit">
            <ChatBubbleOvalLeftEllipsisIcon className="size-8" />
          </button>
        </form>
      </div>
    </>
  );
}
