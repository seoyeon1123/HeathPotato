'use client';

import { InitialProducts } from '@/app/(tabs)/products/page';
import ListProduct from './list-product';
import { useState } from 'react';
import { getMoreProducts } from '@/app/(tabs)/products/actions';

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const onLoadMoreClick = async () => {
    setIsLoading(true);
    const newProducts = await getMoreProducts(page + 1);

    if (newProducts.length !== 0) {
      setPage((prev) => prev + 1);
      //새 product의 length이 0과 같으면, 이는 우리가 마지막 page에 도달했음을 의미함.
      //새 product의 길이가 0이 아닌 경우, 새 page를 추가하겠다는 의미기도 함.
      setProducts((prev) => [...prev, ...newProducts]);
    } else {
      setIsLastPage(true);
    }

    setIsLoading(false);
  };
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {isLastPage ? (
        'no more items'
      ) : (
        <button
          onClick={onLoadMoreClick}
          disabled={isLoading}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? '로딩 중' : 'Load more'}
        </button>
      )}
    </div>
  );
}
