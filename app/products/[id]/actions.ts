'use server';

import { IProduct } from '@/components/createChatRoom';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { ProductStatus } from '@/lib/utils';
import { redirect } from 'next/navigation';

export async function UpdateProduct(
  id: number,
  newStatus: keyof typeof ProductStatus
) {
  await db.product.update({
    where: {
      id,
    },
    data: {
      status: newStatus,
    },
  });
}

export const createRoom = async (id: number, product: IProduct) => {
  const session = await getSession();
  const room = await db.chatRoom.create({
    data: {
      users: {
        connect: [
          {
            id: product.userId,
          },
          {
            id: session.id,
          },
        ],
      },
      product: {
        connect: { id },
      },
    },

    select: {
      id: true,
    },
  });
  redirect(`/chats/${room.id}`);
};
