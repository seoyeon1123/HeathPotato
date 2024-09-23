import ReviewForm from '@/components/reviewForm';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { notFound } from 'next/navigation';

async function getUsersByProductId(productId: number) {
  const chatRooms = await db.chatRoom.findMany({
    where: {
      productId: productId, // 상품 ID에 따라 필터링
    },
    include: {
      users: true, // 관련된 사용자 정보 포함
    },
  });

  const users = chatRooms.flatMap((chatRoom) => chatRoom.users);
  return users;
}

interface IReviewProps {
  id: number;
}

export default async function Review({ id }: IReviewProps) {
  const users = await getUsersByProductId(id);

  return (
    <>
      <div></div>
    </>
  );
}
