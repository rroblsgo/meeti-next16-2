import { User } from 'better-auth';
import { notFound } from 'next/navigation';
import { NplInput } from '../schemas/nplSchema';
import { NplPolicy } from '../policies/NplPolicy';
import { INplRepository, nplRepository } from './NplRepository';
import { NplEstado, NplListItem, SelectNpl } from '../types/npl.types';
import { calcularRentabilidad } from '../utils/npl-calc';
export { calcularRentabilidad };

class NplService {
  constructor(private nplRepository: INplRepository) {}

  async createNpl(data: NplInput, creatorId: string): Promise<SelectNpl> {
    return this.nplRepository.create({
      ...data,
      superficieConst: data.superficieConst || null,
      superficieParcela: data.superficieParcela || null,
      anyConstruccion: data.anyConstruccion
        ? parseInt(data.anyConstruccion)
        : null,
      tasacionSubasta: data.tasacionSubasta || null,
      costeAdquisicionCredito: data.costeAdquisicionCredito || null,
      derechoCobroPrincipal: data.derechoCobroPrincipal || null,
      intereses: data.intereses || null,
      costas: data.costas || null,
      impuestosAjd: data.impuestosAjd || null,
      costesNotariaRegistro: data.costesNotariaRegistro || null,
      gastosDacion: data.gastosDacion || null,
      precioMercado: data.precioMercado || null,
      precioVentaRapida: data.precioVentaRapida || null,
      importeDespachado: data.importeDespachado || null,
      creatorId,
    });
  }

  async getNpl(nplId: number): Promise<SelectNpl> {
    const current = await this.nplRepository.findById(nplId);
    if (!current) notFound();
    return current;
  }

  async getNplForEdit(nplId: number, user: User): Promise<SelectNpl> {
    const current = await this.getNpl(nplId);
    if (!NplPolicy.canEdit(user, current)) {
      throw new Error('No tienes permisos para editar este NPL');
    }
    return current;
  }

  async listUserNpls(userId: string): Promise<NplListItem[]> {
    return this.nplRepository.listByUser(userId);
  }

  async listPublicNpls(): Promise<NplListItem[]> {
    return this.nplRepository.listPublicos();
  }

  async updateNpl(
    nplId: number,
    data: NplInput,
    user: User
  ): Promise<SelectNpl> {
    const current = await this.getNpl(nplId);
    if (!NplPolicy.canEdit(user, current)) {
      throw new Error('No tienes permisos para editar este NPL');
    }

    const result = await this.nplRepository.update(nplId, {
      ...data,
      superficieConst: data.superficieConst || null,
      superficieParcela: data.superficieParcela || null,
      anyConstruccion: data.anyConstruccion
        ? parseInt(data.anyConstruccion)
        : null,
      tasacionSubasta: data.tasacionSubasta || null,
      costeAdquisicionCredito: data.costeAdquisicionCredito || null,
      derechoCobroPrincipal: data.derechoCobroPrincipal || null,
      intereses: data.intereses || null,
      costas: data.costas || null,
      impuestosAjd: data.impuestosAjd || null,
      costesNotariaRegistro: data.costesNotariaRegistro || null,
      gastosDacion: data.gastosDacion || null,
      precioMercado: data.precioMercado || null,
      precioVentaRapida: data.precioVentaRapida || null,
      importeDespachado: data.importeDespachado || null,
    });
    if (!result) notFound();
    return result;
  }

  async updateNplEstado(
    nplId: number,
    estado: NplEstado,
    user: User
  ): Promise<SelectNpl> {
    const current = await this.getNpl(nplId);
    if (!NplPolicy.canChangeEstado(user, current)) {
      throw new Error('No tienes permisos para cambiar el estado de este NPL');
    }
    const result = await this.nplRepository.updateEstado(nplId, estado);
    if (!result) notFound();
    return result;
  }

  async deleteNpl(nplId: number, user: User): Promise<void> {
    const current = await this.getNpl(nplId);
    if (!NplPolicy.canDelete(user, current)) {
      throw new Error('No tienes permisos para eliminar este NPL');
    }
    await this.nplRepository.remove(nplId);
  }
}

export const nplService = new NplService(nplRepository);
