import {
  FormError,
  FormInput,
  FormLabel,
  FormTextarea,
} from '@/src/shared/components/forms';
import { useFormContext } from 'react-hook-form';
import { TaskInput } from '../schemas/taskSchema';
import TaskAttachmentsUploader from './TaskAttachmentsUploader';
import {
  TASK_CATEGORIES,
  TASK_CATEGORY_LABELS,
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TaskFormOptions,
} from '../types/task.types';

type Props = {
  options: TaskFormOptions;
};

export default function TaskForm({ options }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TaskInput>();

  return (
    <div className="space-y-6">
      <div>
        <FormLabel htmlFor="title">Título</FormLabel>
        <FormInput id="title" type="text" placeholder="Título de la tarea" {...register('title')} />
        {errors.title && <FormError>{errors.title.message}</FormError>}
      </div>

      <div>
        <FormLabel htmlFor="description">Descripción</FormLabel>
        <FormTextarea id="description" placeholder="Describe la actividad a registrar" {...register('description')} />
        {errors.description && <FormError>{errors.description.message}</FormError>}
      </div>

      <div>
        <FormLabel htmlFor="expediente">Expediente</FormLabel>
        <FormInput id="expediente" type="text" placeholder="Ej. NPL-2026-001" {...register('expediente')} />
        {errors.expediente && <FormError>{errors.expediente.message}</FormError>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <FormLabel htmlFor="communityId">Comunidad</FormLabel>
          <select
            id="communityId"
            className="block w-full rounded-md border border-gray-300 px-3 py-2"
            {...register('communityId')}
          >
            <option value="">Selecciona una comunidad</option>
            {options.communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
          {errors.communityId && <FormError>{errors.communityId.message}</FormError>}
        </div>

        <div>
          <FormLabel htmlFor="assigneeId">Asignar a</FormLabel>
          <select
            id="assigneeId"
            className="block w-full rounded-md border border-gray-300 px-3 py-2"
            {...register('assigneeId')}
          >
            <option value="">Selecciona un usuario</option>
            {options.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          {errors.assigneeId && <FormError>{errors.assigneeId.message}</FormError>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <FormLabel htmlFor="status">Estado</FormLabel>
          <select id="status" className="block w-full rounded-md border border-gray-300 px-3 py-2" {...register('status')}>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          {errors.status && <FormError>{errors.status.message}</FormError>}
        </div>

        <div>
          <FormLabel htmlFor="priority">Prioridad</FormLabel>
          <select id="priority" className="block w-full rounded-md border border-gray-300 px-3 py-2" {...register('priority')}>
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {TASK_PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
          {errors.priority && <FormError>{errors.priority.message}</FormError>}
        </div>

        <div>
          <FormLabel htmlFor="category">Categoría</FormLabel>
          <select id="category" className="block w-full rounded-md border border-gray-300 px-3 py-2" {...register('category')}>
            {TASK_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {TASK_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
          {errors.category && <FormError>{errors.category.message}</FormError>}
        </div>
      </div>

      <div>
        <FormLabel>Adjuntos</FormLabel>
        <TaskAttachmentsUploader />
      </div>
    </div>
  );
}
