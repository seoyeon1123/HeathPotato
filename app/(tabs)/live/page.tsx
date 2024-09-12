// pages/live.tsx
'use client';

import ChooseStatus from '@/components/chooseStatus';
import { checkStreamStatus, getStreams } from './actions';
import { getStreamVideo } from '@/app/streams/[id]/action';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ClockIcon, PlusIcon } from '@heroicons/react/24/solid';

export default function Live() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>('생방송');
  const [streams, setStreams] = useState<any[]>([]);
  const [filteredStreams, setFilteredStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 변수

  useEffect(() => {
    async function fetchData() {
      setLoading(true); // 데이터를 가져오기 전에 로딩 시작
      const streamsData = await getStreams();
      if (!streamsData) {
        return notFound();
      }

      // 비디오 데이터를 스트림에 추가
      const streamsWithVideos = await Promise.all(
        streamsData.map(async (stream) => {
          const streamStatus = await checkStreamStatus(stream.stream_id);
          const videoData = await getStreamVideo(stream.stream_id);
          return {
            ...stream,
            status: streamStatus,
            video: videoData.result[0], // 최신 비디오 하나만 선택
          };
        })
      );

      setStreams(streamsWithVideos);
      setLoading(false); // 데이터 가져오기 완료 후 로딩 종료
    }

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = streams.filter(
      (stream) => stream.status === selectedStatus
    );
    setFilteredStreams(filtered);
  }, [selectedStatus, streams]);

  // 상태에 맞는 메시지 선택
  const getMessageForStatus = () => {
    switch (selectedStatus) {
      case 'connected':
        return '생방송 중인 스트리밍이 없습니다.';
      case 'disconnected':
        return '종료된 스트리밍이 없습니다.';
      case null:
        return '준비중인 스트리밍이 없습니다.';
      default:
        return '선택된 상태의 스트리밍 상품이 없습니다.';
    }
  };

  return (
    <div className="p-5">
      <div>
        <ChooseStatus onChange={setSelectedStatus} />
      </div>
      <div className="mt-5">
        {loading ? ( // 로딩 중일 때 표시할 UI
          <div className="flex justify-center items-center mt-32 flex-col gap-3">
            <p className="text-9xl text-white animate-bounce">🥕</p>
            <p className="text-sm font-semibold">(당근이 열심히 찾는 중..)</p>
          </div>
        ) : filteredStreams.length > 0 ? (
          filteredStreams.map((stream) => (
            <Link
              href={`/streams/${stream.id}`}
              key={stream.stream_id}
              className="stream-card border-b border-neutral-500
               bg-opacity-90
              shadow-md p-4 mb-4 pb-6 flex items-center
              hover:cursor-pointer
              last:border-none"
            >
              <div className="w-16 h-16 flex-shrink-0">
                {stream.video ? (
                  <Image
                    src={stream.video.thumbnail}
                    alt="비디오 썸네일"
                    className="w-full h-full object-cover rounded-lg"
                    width={50}
                    height={50}
                    onClick={() => window.open(stream.video.preview, '_blank')}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-neutral-400 ">
                    <ClockIcon className="size-12 text-orange-600" />
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                {selectedStatus === null ? (
                  <>
                    <h2 className="text-xl font-semibold text-orange-400">
                      {`${stream.title} ⌛️`}
                    </h2>
                  </>
                ) : (
                  <h2 className="text-xl font-semibold text-orange-400">
                    {`${stream.title}`}
                  </h2>
                )}
                <p className="text-neutral-300 mt-1 text-sm">
                  {stream.description}
                </p>
              </div>
              <div className="stream-user flex flex-col items-center ml-4">
                <Image
                  src={stream.user.avatar!}
                  alt={stream.user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="ml-2 text-sm text-white">
                  {stream.user.username}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div
            className="text-center font-semibold text-black border-4 border-orange-600 
          rounded-full flex flex-row items-center
          justify-center py-3 px-2 mt-32 mx-2 bg-white 
          "
          >
            <h1 className="text-3xl">🥕</h1>
            <p className="text-xl">{getMessageForStatus()}</p>
            <h1 className="text-3xl">🥕</h1>
          </div>
        )}
      </div>

      <div>
        <Link
          href="/streams/add"
          shallow
          className="bg-orange-500 flex items-center justify-center rounded-full size-12 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
        >
          <PlusIcon className="size-10" />
        </Link>
      </div>
    </div>
  );
}
