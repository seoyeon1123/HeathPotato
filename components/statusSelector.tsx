'use client';

import { useState } from 'react';
import { ProductStatus } from '@/lib/utils';
import { UpdateProduct } from '@/app/products/[id]/actions'; // Server-side function

interface IStatusSelectorProductId {
  productId: number;
  initialStatus: keyof typeof ProductStatus;
}

export default function StatusSelector({
  productId,
  initialStatus,
}: IStatusSelectorProductId) {
  const [status, setStatus] =
    useState<keyof typeof ProductStatus>(initialStatus);

  const initial = initialStatus as keyof typeof ProductStatus;

  const handleStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedStatus = event.target.value as keyof typeof ProductStatus;
    setStatus(selectedStatus);
    await UpdateProduct(productId, selectedStatus);
  };

  return (
    <div className="pb-3">
      <select
        value={status}
        onChange={handleStatusChange}
        defaultValue={initial}
        className="rounded-full text-black text-sm"
      >
        <option value="SALE">{ProductStatus.SALE}</option>
        <option value="RESERVED">{ProductStatus.RESERVED}</option>
        <option value="SOLD_OUT">{ProductStatus.SOLD_OUT}</option>
      </select>
    </div>
  );
}
