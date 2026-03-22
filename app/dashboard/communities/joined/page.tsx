import Heading from '@/src/shared/components/typography/Heading';
import { generatePageTitle } from '@/src/shared/utils/metadata';
import { Metadata } from 'next';
import Link from 'next/link';

const title = 'Ver mis Comunidades';

export const metadata: Metadata = {
  title: generatePageTitle(title),
};

export default function JoinedCommunitiesPage() {
  return (
    <>
      <Heading className="text-amber-500 text-center">{title}</Heading>
      <Link
        href="/dashboard/communities"
        className="mt-5 block lg:inline-block text-center bg-orange-500 hover:bg-orange-600 transition-colors text-xs lg:text-xl text-white py-3 px-10 font-bold rounded-lg"
      >
        Volver a mis Comunidades
      </Link>
    </>
  );
}
