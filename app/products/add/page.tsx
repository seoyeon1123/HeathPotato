'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { getUploadUrl, uploadProduct } from './actions';
import { useFormState } from 'react-dom';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [imageId, setImageId] = useState('');
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
      setImageId(id);
    }
  };

  //받아두었던 uploadURL에 이 cloudflareForm을 보내야 함.
  //여기서 cloudflareForm을 만들고, 그 form에 append를 통해서 file을 추가함. 그리고 추가된 cloudflareForm를 받아온 uploadURL에 보냄 (POST요청으로)

  const intercepAction = async (prevState: any, formData: FormData) => {
    //user가 form을 submit해서 form의 action이 호출되면, 이 intercepAction이 실행될 것임.

    //여기서는 cloudflare에 이미지를 업로드할 예정임
    const file = formData.get('photo');
    if (!file) {
      return {
        error: '이미지가 없습니다. ',
      };
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append('file', file);
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudflareForm,
    });

    //이렇게 이미지가 정상적으로 업로드가 되었다면, 우리가 해야할 일은 formData안에 photo를 image의 URL로 변경하는 것

    //그럼 formData의 photo는 어떻게 변경될까?-> user가 작성완료 (submit) 버튼을 클릭하면 formData가 우리에게 넘어오게 된다.

    const photoUrl = `https://imagedelivery.net/2YRH3jpkhrWOOYZOL3zGhA/${imageId}`;
    formData.set('photo', photoUrl);
    return uploadProduct(prevState, formData);

    //그리고 나서는 uploadProduct action을 정확히 같은 parameter로 호출될 것임. --> uploadProduct를 호출하려면 state를 보내야 한다.

    //여기서 return uploadProduct(prevState, formDate)를 하게 되는데, return을 하게 되는 것은 uploadProduct가 무엇을 return을 하던지 이건 interceptAction funcion에 의해서 return 될 것임!
  };
  const [state, action] = useFormState(intercepAction, null);
  return (
    <div>
      <form className="p-5 flex flex-col gap-5" action={action}>
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
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="가격"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="자세한 설명"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
