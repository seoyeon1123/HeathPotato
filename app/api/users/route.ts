//route.ts라는 파일도 특별함
//api/users/route.ts -> HTTP 요청을 받아서 json 같은걸 반환하거나 사용자를 다른 어딘가로 이동시킬 거임
//route.ts는 UI를 렌더링하지 않는다는 점을 기억하면 된다.

import { NextRequest } from 'next/server';

//여러 HTTP Method를 처리하는 방법을 배워보자
//어떨때는 GET요청을 받을거고, 어떨떄는 POST 요청을 받을 거기 때문

export async function GET(request: NextRequest) {
  console.log(request);
  return Response.json({
    ok: true,
  });
}
//Next JS는 NextRequest 타입의 request 객체를 제공하고 있음.

export async function POST(request: NextRequest) {
  const data = await request.json();

  return Response.json(data);
}
