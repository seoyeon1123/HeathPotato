import Image from 'next/image';
import Link from 'next/link';

interface IListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
}

export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
}: IListProductProps) {
  return (
    <>
      <Link href={`/products/${id}`} className="flex gap-5">
        <div className="size-28 relative rounded-md overflow-hidden">
          <Image fill src={photo} alt={title} />
        </div>
        <div className="flex flex-col gap-1 *:text-white">
          <span className="text-xl">{title}</span>
          <span className="text-sm text-neutral-500">
            {created_at.toString()}
          </span>
          <span className="text-lg font-semibold">{price}</span>
        </div>
      </Link>
    </>
  );
}
