import type { Metadata } from 'next';
import { Poor_Story, Jua } from 'next/font/google';
import './globals.css';

const poor = Poor_Story({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  variable: '--poor-text',
});

const jua = Jua({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Karrot Market',
    default: 'Karrot Market',
  },
  description: 'Sell and buy all the things',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${jua.className}
        max-w-screen-sm
        bg-stone-900 
        text-white mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}

//Inter -> Google Fonts에 있는 폰트들을 쉽게 불러올 수 있도록 해주는 역할을 한다.
