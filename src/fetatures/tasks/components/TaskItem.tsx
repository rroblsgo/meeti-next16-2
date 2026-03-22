import Link from 'next/link';
import { TaskListItem, TASK_CATEGORY_LABELS } from '../types/task.types';
import TaskPriorityBadge from './TaskPriorityBadge';
import TaskStatusBadge from './TaskStatusBadge';
import TaskActions from './TaskActions';

type Props = {
  task: TaskListItem;
};

export default function TaskItem({ task }: Props) {
  return (
    <li className="space-y-4 py-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/dashboard/tasks/${task.id}/edit`} className="text-lg font-bold text-gray-900 hover:text-orange-600">
              {task.title}
            </Link>
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
          </div>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{task.description}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
            <p><span className="font-semibold">Expediente:</span> {task.expediente}</p>
            <p><span className="font-semibold">Comunidad:</span> {task.communityName}</p>
            <p><span className="font-semibold">Categoría:</span> {TASK_CATEGORY_LABELS[task.category]}</p>
            <p><span className="font-semibold">Creador:</span> {task.creatorName}</p>
            <p><span className="font-semibold">Asignada a:</span> {task.assigneeName}</p>
            <p><span className="font-semibold">Adjuntos:</span> {task.attachments.length}</p>
          </div>
          {!!task.attachments.length && (
            <div className="mt-3 flex flex-col gap-1 text-sm">
              {task.attachments.map((attachment) => (
                <a key={attachment} href={attachment} target="_blank" rel="noreferrer" className="truncate text-orange-600 hover:underline">
                  {attachment}
                </a>
              ))}
            </div>
          )}
        </div>
        <TaskActions taskId={task.id} />
      </div>
    </li>
  );
}
