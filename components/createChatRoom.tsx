'use client';

import { createRoom } from '@/app/products/[id]/actions';

interface IUser {
  username: string;
  avatar: string | null;
}

export interface IProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  photo: string;
  created_at: Date;
  updated_at: Date;
  userId: number; // userId 추가
  status: string;
  user: IUser; // user 정보 포함
}

export interface IProductProps {
  product: IProduct | null;
}

export default async function CreateChatRoom({ product }: IProductProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 제출 동작 방지
    if (product) {
      await createRoom(product.id, product); // 채팅방 생성 호출
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <button className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold">
          채팅하기
        </button>
      </form>
    </>
  );
}
