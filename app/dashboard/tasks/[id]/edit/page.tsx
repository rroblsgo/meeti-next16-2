import Link from 'next/link';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import EditTask from '@/src/fetatures/tasks/components/EditTask';
import { taskService } from '@/src/fetatures/tasks/services/TaskService';
import { requireAuth } from '@/src/lib/auth-server';
import Heading from '@/src/shared/components/typography/Heading';
import { generatePageTitle } from '@/src/shared/utils/metadata';

export async function generateMetadata(
  props: PageProps<'/dashboard/tasks/[id]/edit'>
): Promise<Metadata> {
  const { id } = await props.params;
  const task = await taskService.getTask(Number(id));

  return {
    title: generatePageTitle(`Editar tarea - ${task.title}`),
    description: task.description,
  };
}

export default async function EditTaskPage(
  props: PageProps<'/dashboard/tasks/[id]/edit'>
) {
  const { session } = await requireAuth();
  if (!session) redirect('/auth/login');

  const { id } = await props.params;
  const task = await taskService.getTaskDetails(Number(id), session.user);
  const options = await taskService.getTaskFormOptions();

  return (
    <>
      <Heading className="text-center text-amber-500">Editar tarea: {task.title}</Heading>
      <Link
        href="/dashboard/tasks"
        className="mt-5 block rounded-lg bg-orange-500 px-10 py-3 text-center text-xs font-bold text-white transition-colors hover:bg-orange-600 lg:inline-block lg:text-xl"
      >
        Volver a tareas
      </Link>
      <EditTask task={task} options={options} />
    </>
  );
}
