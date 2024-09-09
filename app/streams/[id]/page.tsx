import db from '@/lib/db';
import getSession from '@/lib/session';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getStream(id: number) {
  const stream = await db.liveStream.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      stream_key: true,
      stream_id: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return stream;
}

//userId도 있어야 함 -> 이걸 업로드한 사람이 누구인지 알고 싶기 때문 -> 업로드한 사람이 이 스트림을 보고 있다면-> stream_key를 보고, 아니라면, stream_key를 보여주지 않을 것임. -> stream key가 있으면 비디오를 스트리밍할 수 있기 때문임. -> strem key는 생성자에게만 보이도록 제한해야 한다.

export default async function StreamDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const stream = await getStream(id);
  if (!stream) {
    return notFound();
  }

  const session = await getSession();

  return (
    <>
      <div className="p-10">
        <div className="relative aspect-video">
          <iframe
            src={`https://${process.env.CLOUDFLARE_DOMAIN}/f04006bbd0095aa29ebc8daad15baf20/iframe`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            className="w-full h-full rounded-md"
          ></iframe>
        </div>
        <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
          <div className="size-10 overflow-hidden rounded-full">
            {stream.user.avatar !== null ? (
              <Image
                src={stream.user.avatar}
                alt={stream.user.username}
                width={40}
                height={40}
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <div>
            <h3>{stream.user.username}</h3>
          </div>
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-semibold">{stream.title}</h1>
        </div>
        {stream.userId === session.id ? (
          <div className="bg-yellow-200 text-black p-5 rounded-md">
            <div className="flex flex-wrap">
              <span className="font-semibold">Stream URL : </span>
              <span>rtmps://live.cloudflare.com:443/live/</span>
            </div>
            <div className="flex flex-wrap">
              <span className="font-semibold">Secret Key : </span>
              <span>{stream.stream_key}</span>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
