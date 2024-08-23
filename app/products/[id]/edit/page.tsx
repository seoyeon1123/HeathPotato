import Button from '@/components/button';
import Input from '@/components/input';
import db from '@/lib/db';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useActionState, useState } from 'react';
import { getUploadUrl } from '../../add/actions';
import { notFound } from 'next/navigation';
import ImageChange from '@/components/ImageChange';
import Image from 'next/image';

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      photo: true,
      title: true,
      price: true,
      description: true,
    },
  });

  return product;
}

export default async function EditPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }

  return (
    <>
      <div>
        <form className="p-5 flex flex-col gap-5">
          {product.photo ? (
            <div className="relative aspect-square w-full bg-cover bg-contain">
              <Image
                src={`${product.photo}/public`}
                alt={product.title}
                fill
                className="rounded-md"
              />
            </div>
          ) : (
            <ImageChange />
          )}

          <Input
            name="title"
            required
            placeholder="제목"
            type="text"
            errors={[]}
            value={product.title}
          />
          <Input
            name="price"
            type="number"
            required
            placeholder="가격"
            errors={[]}
            value={product.price}
          />
          <Input
            name="description"
            type="text"
            required
            placeholder="자세한 설명"
            errors={[]}
            value={product.description}
          />
          <Button text="작성 완료" />
        </form>
      </div>
    </>
  );
}
