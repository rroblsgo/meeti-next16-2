import { User } from 'better-auth';
import { SelectTask } from '../types/task.types';

export class TaskPolicy {
  static canView(user: User, task: SelectTask) {
    return task.creatorId === user.id || task.assigneeId === user.id;
  }

  static canEdit(user: User, task: SelectTask) {
    return task.creatorId === user.id || task.assigneeId === user.id;
  }

  static canDelete(user: User, task: SelectTask) {
    return task.creatorId === user.id;
  }

  static canChangeStatus(user: User, task: SelectTask) {
    return task.creatorId === user.id || task.assigneeId === user.id;
  }
}
