'use server';

import { requireAuth } from '@/src/lib/auth-server';
import { CommunityInput, CommunitySchema } from '../schemas/communitySchema';
import { communityService } from '../services/CommunityService';

export async function createCommunityAction(input: CommunityInput) {
  const { session } = await requireAuth();
  if (!session) {
    return {
      success: '',
      error: 'No estás autenticado',
    };
  }
  const data = CommunitySchema.safeParse(input);
  if (!data.success) {
    return {
      success: '',
      error: 'Hubo un error',
    };
  }
  await communityService.createCommunity(data.data, session.user.id);

  return {
    success: 'Comunidad creada Correctamente',
    error: '',
  };
}

export async function editCommunityAction(input: CommunityInput, id: string) {
  const { session } = await requireAuth();
  if (!session) {
    return {
      success: '',
      error: 'No estás autenticado',
    };
  }
  const data = CommunitySchema.safeParse(input);
  if (!data.success) {
    return {
      success: '',
      error: 'Hubo un error',
    };
  }
  await communityService.updateCommunity(data.data, id, session.user);

  return {
    success: 'Comunidad actualizada correctamente',
    error: '',
  };
}
