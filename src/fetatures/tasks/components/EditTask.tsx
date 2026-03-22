'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Form, FormSubmit } from '@/src/shared/components/forms';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import { SelectTask, TaskFormOptions } from '../types/task.types';
import { TaskInput, TaskSchema } from '../schemas/taskSchema';
import { editTaskAction } from '../actions/task-actions';
import TaskForm from './TaskForm';

type Props = {
  task: SelectTask;
  options: TaskFormOptions;
};

export default function EditTask({ task, options }: Props) {
  const methods = useForm<TaskInput>({
    resolver: zodResolver(TaskSchema),
    mode: 'all',
    defaultValues: {
      title: task.title,
      description: task.description,
      expediente: task.expediente,
      communityId: task.communityId,
      status: task.status,
      priority: task.priority,
      category: task.category,
      attachments: task.attachments,
      assigneeId: task.assigneeId,
    },
  });

  const onSubmit = async (data: TaskInput) => {
    const { error, success } = await editTaskAction(data, task.id);
    if (error) toast.error(error);
    if (success) {
      toast.success(success);
      redirect('/dashboard/tasks');
    }
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit)}>
        <TaskForm options={options} />
        <FormSubmit value="Guardar cambios" className="mt-6 text-white" />
      </Form>
    </FormProvider>
  );
}
