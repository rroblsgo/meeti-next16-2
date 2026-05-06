import { db } from '@/src/db';
import { npl, users } from '@/src/db/schema';
import { desc, eq } from 'drizzle-orm';
import {
  InsertNpl,
  NplEstado,
  NplListItem,
  SelectNpl,
} from '../types/npl.types';

export interface INplRepository {
  create(data: InsertNpl): Promise<SelectNpl>;
  findById(nplId: number): Promise<SelectNpl | undefined>;
  listAll(): Promise<NplListItem[]>;
  listByUser(userId: string): Promise<NplListItem[]>;
  listPublicos(): Promise<NplListItem[]>;
  update(
    nplId: number,
    data: Partial<InsertNpl>
  ): Promise<SelectNpl | undefined>;
  updateEstado(
    nplId: number,
    estado: NplEstado
  ): Promise<SelectNpl | undefined>;
  remove(nplId: number): Promise<void>;
}

// Columnas comunes para listByUser y listPublicos
const nplSelectFields = {
  id: npl.id,
  tituloOperacion: npl.tituloOperacion,
  referenciaOrigen: npl.referenciaOrigen,
  direccion: npl.direccion,
  municipio: npl.municipio,
  provincia: npl.provincia,
  codigoPostal: npl.codigoPostal,
  tipoInmueble: npl.tipoInmueble,
  distribucion: npl.distribucion,
  distribucionResumida: npl.distribucionResumida,
  superficieConst: npl.superficieConst,
  superficieParcela: npl.superficieParcela,
  superficieDetalles: npl.superficieDetalles,
  anyConstruccion: npl.anyConstruccion,
  refCatastral: npl.refCatastral,
  fincaRegistral: npl.fincaRegistral,
  datosRegistro: npl.datosRegistro,
  tasacionSubasta: npl.tasacionSubasta,
  imagenAsociada: npl.imagenAsociada,
  imagenesAdicionales: npl.imagenesAdicionales,
  costeAdquisicionCredito: npl.costeAdquisicionCredito,
  derechoCobroPrincipal: npl.derechoCobroPrincipal,
  intereses: npl.intereses,
  costas: npl.costas,
  impuestosAjd: npl.impuestosAjd,
  costesNotariaRegistro: npl.costesNotariaRegistro,
  gastosDacion: npl.gastosDacion,
  precioMercado: npl.precioMercado,
  precioVentaRapida: npl.precioVentaRapida,
  comisionIntermediacion: npl.comisionIntermediacion,
  pujaProbable: npl.pujaProbable,
  fechaCompra: npl.fechaCompra,
  fechaTerminacion: npl.fechaTerminacion,
  gastosDiversos: npl.gastosDiversos,
  procedimiento: npl.procedimiento,
  nig: npl.nig,
  juzgado: npl.juzgado,
  ejecutante: npl.ejecutante,
  procuradores: npl.procuradores,
  ejecutados: npl.ejecutados,
  autoDespachoJuez: npl.autoDespachoJuez,
  prestamoHipotecaDetalles: npl.prestamoHipotecaDetalles,
  importeDespachado: npl.importeDespachado,
  actuacionesSeguidas: npl.actuacionesSeguidas,
  informacionInversor: npl.informacionInversor,
  estado: npl.estado,
  esPublico: npl.esPublico,
  createdAt: npl.createdAt,
  updatedAt: npl.updatedAt,
  creatorId: npl.creatorId,
  creatorName: users.name,
};

class NplRepository implements INplRepository {
  async create(data: InsertNpl) {
    const [result] = await db.insert(npl).values(data).returning();
    return result;
  }

  async findById(nplId: number) {
    const [result] = await db
      .select()
      .from(npl)
      .where(eq(npl.id, nplId))
      .limit(1);
    return result;
  }

  // OFFICE MODE: devuelve todos los NPLs de la oficina
  async listAll(): Promise<NplListItem[]> {
    return db
      .select(nplSelectFields)
      .from(npl)
      .innerJoin(users, eq(npl.creatorId, users.id))
      .orderBy(desc(npl.createdAt));
  }

  // Mantenido por compatibilidad; útil cuando se implementen filtros por usuario
  async listByUser(userId: string): Promise<NplListItem[]> {
    return db
      .select(nplSelectFields)
      .from(npl)
      .innerJoin(users, eq(npl.creatorId, users.id))
      .where(eq(npl.creatorId, userId))
      .orderBy(desc(npl.createdAt));
  }

  async listPublicos(): Promise<NplListItem[]> {
    return db
      .select(nplSelectFields)
      .from(npl)
      .innerJoin(users, eq(npl.creatorId, users.id))
      .where(eq(npl.esPublico, true))
      .orderBy(desc(npl.createdAt));
  }

  async update(nplId: number, data: Partial<InsertNpl>) {
    const [result] = await db
      .update(npl)
      .set({ ...data })
      .where(eq(npl.id, nplId))
      .returning();
    return result;
  }

  async updateEstado(nplId: number, estado: NplEstado) {
    const [result] = await db
      .update(npl)
      .set({ estado })
      .where(eq(npl.id, nplId))
      .returning();
    return result;
  }

  async remove(nplId: number) {
    await db.delete(npl).where(eq(npl.id, nplId));
  }
}

export const nplRepository = new NplRepository();
