import { User } from 'better-auth';
import { notFound } from 'next/navigation';
import { TaskInput } from '../schemas/taskSchema';
import { TaskPolicy } from '../policies/TaskPolicy';
import { ITaskRepository, taskRepository } from './TaskRepository';
import { SelectTask, TaskFormOptions, TaskStatus } from '../types/task.types';

class TaskService {
  constructor(private taskRepository: ITaskRepository) {}

  async getTaskFormOptions(): Promise<TaskFormOptions> {
    const [communities, users] = await Promise.all([
      this.taskRepository.listCommunityOptions(),
      this.taskRepository.listUserOptions(),
    ]);

    return { communities, users };
  }

  async createTask(data: TaskInput, creatorId: string) {
    return this.taskRepository.create({
      ...data,
      creatorId,
      completedAt: data.status === 'COMPLETADA' ? new Date() : null,
    });
  }

  async getTask(taskId: number) {
    const currentTask = await this.taskRepository.findById(taskId);
    if (!currentTask) notFound();
    return currentTask;
  }

  async getTaskDetails(taskId: number, user: User) {
    const currentTask = await this.getTask(taskId);
    if (!TaskPolicy.canView(user, currentTask)) {
      throw new Error('No tienes permisos para ver esta tarea');
    }
    return currentTask;
  }

  async listUserTasks(user: User) {
    return this.taskRepository.listByUser(user.id);
  }

  async updateTask(taskId: number, data: TaskInput, user: User) {
    const currentTask = await this.getTask(taskId);
    if (!TaskPolicy.canEdit(user, currentTask)) {
      throw new Error('No tienes permisos para editar esta tarea');
    }

    const completedAt = data.status === 'COMPLETADA'
      ? currentTask.completedAt ?? new Date()
      : null;

    return this.taskRepository.update(taskId, {
      ...data,
      completedAt,
    } as Partial<SelectTask>);
  }

  async updateTaskStatus(taskId: number, status: TaskStatus, user: User) {
    const currentTask = await this.getTask(taskId);
    if (!TaskPolicy.canChangeStatus(user, currentTask)) {
      throw new Error('No tienes permisos para cambiar el estado de esta tarea');
    }

    const completedAt = status === 'COMPLETADA' ? new Date() : null;
    return this.taskRepository.updateStatus(taskId, status, completedAt);
  }

  async deleteTask(taskId: number, user: User) {
    const currentTask = await this.getTask(taskId);
    if (!TaskPolicy.canDelete(user, currentTask)) {
      throw new Error('No tienes permisos para eliminar esta tarea');
    }

    await this.taskRepository.remove(taskId);
  }
}

export const taskService = new TaskService(taskRepository);
