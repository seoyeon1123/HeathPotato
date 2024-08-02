'use server';

export async function handleForm(prevState: any, data: FormData) {
  console.log(prevState);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log('logged in');
  return {
    errors: ['wrong password', 'password too short'],
  };
}
