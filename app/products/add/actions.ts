'use server';

export async function uploadProduct(formData: FormData) {
  const data = {
    photo: formData.get('photo'),
    price: formData.get('price'),
    title: formData.get('title'),
    description: formData.get('description'),
  };

  console.log(data);
}
