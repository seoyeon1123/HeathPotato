async function getProducts() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
}

export default async function Products() {
  const products = await getProducts();
  return (
    <div>
      <h1 className="text-white text-4xl">Product!</h1>
    </div>
  );
}

//loading State를 위한 skeleton을 만들고 -> 데이터베이스를 조회해 상품들을 보여주고 무한 스크롤링도 해볼 예정임.
