import type { Metadata } from 'next';
import { Poor_Story, Dongle, Gothic_A1 } from 'next/font/google';
import './globals.css';

const poor = Poor_Story({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  variable: '--poor-text',
});

const dongle = Dongle({
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
          ${poor.className}
        max-w-screen-sm
        bg-stone-900 
        text-white mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
