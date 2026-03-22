import Link from 'next/link';
import { Metadata } from 'next';
import MyTasks from '@/src/fetatures/tasks/components/MyTasks';
import Heading from '@/src/shared/components/typography/Heading';
import { generatePageTitle } from '@/src/shared/utils/metadata';

const title = 'Gestión de tareas';

export const metadata: Metadata = {
  title: generatePageTitle(title),
};

export default function TasksPage() {
  return (
    <>
      <Heading className="text-center text-amber-500">{title}</Heading>
      <div className="flex justify-between flex-col lg:flex-row">
        <Link
          href="/dashboard/tasks/create"
          className="mt-5 block rounded-lg bg-orange-500 px-10 py-3 text-center text-xs font-bold text-white transition-colors hover:bg-orange-600 lg:inline-block lg:text-xl"
        >
          Crear una tarea
        </Link>
      </div>
      <MyTasks />
    </>
  );
}
