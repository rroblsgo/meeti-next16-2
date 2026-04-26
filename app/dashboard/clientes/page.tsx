import Link from 'next/link';
import { Metadata } from 'next';
import Heading from '@/src/shared/components/typography/Heading';
import { generatePageTitle } from '@/src/shared/utils/metadata';
import MyClientes from '@/src/fetatures/clientes/components/MyClientes';

export const metadata: Metadata = { title: generatePageTitle('Clientes') };

export default function ClientesDashboardPage() {
  return (
    <>
      <Heading className="text-center text-amber-500">Clientes</Heading>
      <div className="flex justify-between flex-col lg:flex-row">
        <Link
          href="/dashboard/clientes/create"
          className="mt-5 block rounded-lg bg-orange-500 px-10 py-3 text-center text-xs font-bold text-white hover:bg-orange-600 lg:inline-block lg:text-xl"
        >
          Nuevo cliente
        </Link>
      </div>
      <MyClientes />
    </>
  );
}
