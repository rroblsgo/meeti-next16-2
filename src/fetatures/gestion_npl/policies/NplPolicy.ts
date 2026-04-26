import { User } from 'better-auth';
import { SelectNpl } from '../types/npl.types';

export class NplPolicy {
  static canView(user: User, npl: SelectNpl): boolean {
    // NPLs públicos los puede ver cualquier usuario autenticado
    if (npl.esPublico) return true;
    return npl.creatorId === user.id;
  }

  static canEdit(user: User, npl: SelectNpl): boolean {
    return npl.creatorId === user.id;
  }

  static canDelete(user: User, npl: SelectNpl): boolean {
    return npl.creatorId === user.id;
  }

  static canChangeEstado(user: User, npl: SelectNpl): boolean {
    return npl.creatorId === user.id;
  }

  static canTogglePublico(user: User, npl: SelectNpl): boolean {
    return npl.creatorId === user.id;
  }
}
