'use client';

import { getUploadUrl, uploadProduct } from '@/app/products/add/actions';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function ImageChange() {
  const [preview, setPreview] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [photoId, setPhotoId] = useState('');
  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = e;
    if (!files) {
      return;
    }
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      return {
        error: '이미지 파일만 업로드 가능합니다. ',
      };
    }

    const fileSizeInMd = file.size / (1024 * 1024);

    if (fileSizeInMd > 2) {
      return {
        error:
          '이미지의 크기가 2MD를 초과하는 이미지는 업로드 할 수 없습니다. ',
      };
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    const { result, success } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setPhotoId(id);
    }
  };

  return (
    <>
      <label
        htmlFor="photo"
        className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
        style={{
          backgroundImage: `url(${preview})`,
        }}
      >
        {preview ? null : (
          <>
            <PhotoIcon className="w-20" />
            <div className="text-neutral-400 text-sm">사진을 추가해주세요.</div>
          </>
        )}
      </label>
      <input
        onChange={onImageChange}
        type="file"
        id="photo"
        name="photo"
        accept="image/*"
      />
    </>
  );
}
