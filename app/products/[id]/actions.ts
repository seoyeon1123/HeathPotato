'use server';

import db from '@/lib/db';
import { ProductStatus } from '@/lib/utils';

export async function UpdateProduct(
  id: number,
  newStatus: keyof typeof ProductStatus
) {
  await db.product.update({
    where: {
      id,
    },
    data: {
      status: newStatus,
    },
  });
}
