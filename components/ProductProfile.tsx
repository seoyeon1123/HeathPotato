import Image from 'next/image';
import { formatToTimeAgo, formatToWon } from '@/lib/utils'; // Assuming you have this utility function
import Link from 'next/link';

interface IProduct {
  id: number;
  photo: string;
  title: string;
  created_at: Date;
  price: number; // Assuming you have this field
}

interface IProductProfile {
  userProduct: IProduct[]; // Updated to be an array of products
}

export default function ProduceProfile({ userProduct }: IProductProfile) {
  return (
    <div className="flex flex-col gap-4 pt-5">
      {userProduct.map((product) => (
        <Link
          href={`/products/${product.id}`}
          key={product.id}
          className="flex flex-row gap-5 py-2 *:text-white"
        >
          <div className="relative w-24 h-24">
            <Image
              src={`${product.photo}/public`}
              alt={product.title}
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl">{product.title}</h2>
            <h3 className="text-sm">
              {formatToTimeAgo(product.created_at.toString())}{' '}
            </h3>
            <p>{formatToWon(product.price)}원</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
