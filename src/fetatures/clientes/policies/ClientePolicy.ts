import { User } from 'better-auth';
import { SelectCliente } from '../types/cliente.types';

export class ClientePolicy {
  static canView(user: User, cliente: SelectCliente): boolean {
    return cliente.creatorId === user.id;
  }
  static canEdit(user: User, cliente: SelectCliente): boolean {
    return cliente.creatorId === user.id;
  }
  static canDelete(user: User, cliente: SelectCliente): boolean {
    return cliente.creatorId === user.id;
  }
}
