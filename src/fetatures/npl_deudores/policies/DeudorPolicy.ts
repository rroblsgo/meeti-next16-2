import { User } from 'better-auth';
import { SelectNpl } from '@/src/fetatures/gestion_npl/types/npl.types';

// La política de deudores se basa en el NPL al que pertenecen:
// solo el creador del NPL puede gestionar sus deudores.

export class DeudorPolicy {
  static canCreate(user: User, npl: SelectNpl): boolean {
    return npl.creatorId === user.id;
  }

  static canEdit(user: User, npl: SelectNpl): boolean {
    return npl.creatorId === user.id;
  }

  static canDelete(user: User, npl: SelectNpl): boolean {
    return npl.creatorId === user.id;
  }
}
