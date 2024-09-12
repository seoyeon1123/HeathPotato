'use client';

import { isToday, parseISO } from 'date-fns';
import {
  unstable_cache as nextCache,
  revalidatePath,
  revalidateTag,
} from 'next/cache';
import { InitialChatMessages } from '@/app/chats/[id]/page';
import { markMessagesAsRead, saveMessage } from '@/app/chats/actions';
import {
  formatDate,
  formatToDayAndTime,
  formatToTime,
  formatToTimeAgo,
} from '@/lib/utils';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export const SUPABASE_PUBLIC_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubHh0ZmZxZXNrbnJxdWRudXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyNDk5NTMsImV4cCI6MjA0MDgyNTk1M30.hp4xZkxE7HdtqzvoTVskCLGNi1JvaWuScQStzPsPpJk';

export const SUPABASE_URL = 'https://pnlxtffqesknrqudnusk.supabase.co';

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState('');
  const [newMessageCount, setNewMessageCount] = useState(0);
  const channel = useRef<RealtimeChannel>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newMsg = {
      id: Date.now(),
      payload: message,
      created_at: new Date(),
      userId,
      user: {
        username: 'string',
        avatar: 'xxx',
      },
    };

    setMessages((prevMsgs) => [...prevMsgs, newMsg]);
    channel.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: {
        id: newMsg.id,
        created_at: new Date().toISOString(),
        payload: newMsg.payload,
        userId,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage('');
  };
  const handleMessagesRead = () => {
    setNewMessageCount(0);
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on(
        'broadcast',
        {
          event: 'message',
        },
        (payload) => {
          setMessages((prevMsg) => [...prevMsg, payload.payload]);
        }
      )
      .subscribe();

    return () => {
      channel.current?.unsubscribe();

      // Handle the async operation separately
      const markAsRead = async () => {
        await markMessagesAsRead(chatRoomId, userId);
      };

      markAsRead(); // Call the async function
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.userId === userId ? 'justify-end' : ''
          }`}
        >
          {message.userId === userId ? null : (
            <Image
              src={message.user.avatar!}
              alt={message.user.username}
              width={50}
              height={50}
              className="size-8 rounded-full"
            />
          )}
          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? 'items-end' : ''
            }`}
          >
            <span
              className={`${
                message.userId === userId ? 'bg-neutral-500' : 'bg-orange-500'
              } p-2.5 rounded-md`}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {message.created_at.toString() === new Date().toISOString()
                ? formatToDayAndTime(message.created_at.toString())
                : formatToTime(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef}>
        <form className="flex relative" onSubmit={onSubmit}>
          <input
            required
            onChange={onChange}
            value={message}
            className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
            type="text"
            name="message"
            placeholder="Write a message..."
          />
          <button className="absolute right-0" onClick={handleMessagesRead}>
            <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
          </button>
        </form>
      </div>
    </div>
  );
}
