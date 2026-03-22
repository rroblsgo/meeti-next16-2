import { db } from '@/src/db';
import { community, task, users } from '@/src/db/schema';
import { asc, desc, eq, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import {
  InsertTask,
  SelectTask,
  TaskListItem,
  TaskStatus,
} from '../types/task.types';

export interface ITaskRepository {
  create(data: InsertTask): Promise<SelectTask>;
  findById(taskId: number): Promise<SelectTask | undefined>;
  listByUser(userId: string): Promise<TaskListItem[]>;
  update(
    taskId: number,
    data: Partial<SelectTask>
  ): Promise<SelectTask | undefined>;
  updateStatus(
    taskId: number,
    status: TaskStatus,
    completedAt: Date | null
  ): Promise<SelectTask | undefined>;
  remove(taskId: number): Promise<void>;
  listCommunityOptions(): Promise<Array<{ id: string; name: string }>>;
  listUserOptions(): Promise<
    Array<{ id: string; name: string; email: string }>
  >;
}

class TaskRepository implements ITaskRepository {
  async create(data: InsertTask) {
    const [result] = await db.insert(task).values(data).returning();
    return result;
  }

  async findById(taskId: number) {
    const [result] = await db
      .select()
      .from(task)
      .where(eq(task.id, taskId))
      .limit(1);
    return result;
  }

  async listByUser(userId: string) {
    const creator = alias(users, 'task_creator');
    const assignee = alias(users, 'task_assignee');

    const rows = await db
      .select({
        id: task.id,
        title: task.title,
        description: task.description,
        expediente: task.expediente,
        communityId: task.communityId,
        status: task.status,
        priority: task.priority,
        category: task.category,
        attachments: task.attachments,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        completedAt: task.completedAt,
        creatorId: task.creatorId,
        assigneeId: task.assigneeId,
        communityName: community.name,
        creatorName: creator.name,
        assigneeName: assignee.name,
      })
      .from(task)
      .innerJoin(community, eq(task.communityId, community.id))
      .innerJoin(creator, eq(task.creatorId, creator.id))
      .innerJoin(assignee, eq(task.assigneeId, assignee.id))
      .where(or(eq(task.creatorId, userId), eq(task.assigneeId, userId)))
      .orderBy(desc(task.createdAt));

    return rows;
  }

  async update(taskId: number, data: Partial<SelectTask>) {
    const [result] = await db
      .update(task)
      .set({ ...data })
      .where(eq(task.id, taskId))
      .returning();

    return result;
  }

  async updateStatus(
    taskId: number,
    status: TaskStatus,
    completedAt: Date | null
  ) {
    const [result] = await db
      .update(task)
      .set({
        status,
        completedAt,
      })
      .where(eq(task.id, taskId))
      .returning();

    return result;
  }

  async remove(taskId: number) {
    await db.delete(task).where(eq(task.id, taskId));
  }

  async listCommunityOptions() {
    return db
      .select({ id: community.id, name: community.name })
      .from(community)
      .orderBy(asc(community.name));
  }

  async listUserOptions() {
    return db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .orderBy(asc(users.name));
  }
}

export const taskRepository = new TaskRepository();
