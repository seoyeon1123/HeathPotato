import fruit from '@/public/fresh-fruits-2305192_1280.jpg';
import Image from 'next/image';

export default async function Extra() {
  // const data = await getData();
  return (
    <>
      <div className="flex flex-col gap-3 py-10">
        <h1 className="text-6xl font-poor">Extrals!</h1>
        <h2 className="font-flower">So much more to learn</h2>
        <Image src={fruit} alt="" placeholder="blur" />
      </div>
    </>
  );
}
