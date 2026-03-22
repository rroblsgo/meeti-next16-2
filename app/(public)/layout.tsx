import Header from '@/components/ui/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meeti - Next',
  description: 'Proyecto Meeti-next16 con Next.js y Drizzle ORM',
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
