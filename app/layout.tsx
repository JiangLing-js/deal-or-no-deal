import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '成交还是不成交｜开箱挑战',
  description: '选中你的幸运箱子，与银行家斗智斗勇，挑战百万美元大奖。',
  openGraph: {
    title: '成交还是不成交｜开箱挑战',
    description: '选中你的幸运箱子，与银行家斗智斗勇，挑战百万美元大奖。',
    type: 'website',
    siteName: '成交还是不成交',
  },
  twitter: {
    card: 'summary',
    title: '成交还是不成交｜开箱挑战',
    description: '选中你的幸运箱子，与银行家斗智斗勇，挑战百万美元大奖。',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
