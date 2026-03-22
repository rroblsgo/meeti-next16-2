import Hero from '@/components/ui/Hero';
import { auth } from '@/src/lib/auth';
import { generatePageTitle } from '@/utils/metadata';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: generatePageTitle('Inicio'),
  description: 'Home Page nuestra aplicación Meeti-next16',
};

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log('Session en Home:', session);
  return (
    <>
      <Hero />
    </>
  );
}
