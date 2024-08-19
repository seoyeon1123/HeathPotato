//프론트, 백 둘다 schema를 사용하기 위해서 따로 schema.ts 파일을 생성함

import z from 'zod';

export const productSchema = z.object({
  photo: z.string({
    required_error: 'photo is required',
  }),
  title: z.string({
    required_error: 'Title is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
  price: z.coerce.number({
    required_error: 'Price is required',
  }),
});

export type ProductType = z.infer<typeof productSchema>;

//z.infer이란, Schema로부터 typescript에서 쓸 수 있는 type을 가져올 수 있도록 해줌 z.infer<typeof productSchema>
//--> 즉, productSchema의 타입을 infer 가져온다! 그리고 ProductType에 저장한다! 라고 이해하면 된다 ! ㅋㅋ
