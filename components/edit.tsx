import db from '@/lib/db';
import Input from './input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import Button from './button';

async function getProduct(id: ) {
  const product = await db.product.findUnique({
    where: {
      id,
    },include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product
}

export default function Edit({params} : {params : { id : string}}) {
  const id = Number(params.id)
  const product = await getProduct(id)
  return (
    <>
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
          <Button text="수정 완료" />
        </form>
      </div>
    </>
  );
}
