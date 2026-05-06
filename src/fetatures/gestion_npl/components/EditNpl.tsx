'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import { NplInput, NplSchema } from '../schemas/nplSchema';
import { Form, FormSubmit } from '@/src/shared/components/forms';
import { editNplAction } from '../actions/npl-actions';
import NplForm from './NplForm';
import { SelectNpl } from '../types/npl.types';

type Props = {
  npl: SelectNpl;
};

const n2s = (v: string | null | undefined) => v ?? '';

export default function EditNpl({ npl }: Props) {
  const methods = useForm<NplInput>({
    resolver: zodResolver(NplSchema),
    mode: 'all',
    defaultValues: {
      tituloOperacion: npl.tituloOperacion,
      referenciaOrigen: npl.referenciaOrigen ?? '',
      direccion: npl.direccion ?? '',
      municipio: npl.municipio ?? '',
      provincia: npl.provincia ?? '',
      codigoPostal: npl.codigoPostal ?? '',
      tipoInmueble: npl.tipoInmueble,
      distribucion: npl.distribucion ?? '',
      distribucionResumida: npl.distribucionResumida ?? '',
      superficieConst: n2s(npl.superficieConst),
      superficieParcela: n2s(npl.superficieParcela),
      superficieDetalles: npl.superficieDetalles ?? '',
      anyConstruccion: npl.anyConstruccion ? String(npl.anyConstruccion) : '',
      refCatastral: npl.refCatastral ?? '',
      fincaRegistral: npl.fincaRegistral ?? '',
      datosRegistro: npl.datosRegistro ?? '',
      tasacionSubasta: n2s(npl.tasacionSubasta),
      imagenAsociada: npl.imagenAsociada ?? '',
      imagenesAdicionales: npl.imagenesAdicionales,
      costeAdquisicionCredito: n2s(npl.costeAdquisicionCredito),
      derechoCobroPrincipal: n2s(npl.derechoCobroPrincipal),
      intereses: n2s(npl.intereses),
      costas: n2s(npl.costas),
      impuestosAjd: n2s(npl.impuestosAjd),
      costesNotariaRegistro: n2s(npl.costesNotariaRegistro),
      gastosDacion: n2s(npl.gastosDacion),
      precioMercado: n2s(npl.precioMercado),
      precioVentaRapida: n2s(npl.precioVentaRapida),
      comisionIntermediacion: n2s(npl.comisionIntermediacion),
      pujaProbable: n2s(npl.pujaProbable),
      fechaCompra: npl.fechaCompra ?? '',
      fechaTerminacion: npl.fechaTerminacion ?? '',
      gastosDiversos: (npl.gastosDiversos as { titulo: string; valor: number }[]) ?? [],
      procedimiento: npl.procedimiento ?? undefined,
      nig: npl.nig ?? '',
      juzgado: npl.juzgado ?? '',
      ejecutante: npl.ejecutante ?? '',
      procuradores: npl.procuradores,
      ejecutados: npl.ejecutados,
      autoDespachoJuez: npl.autoDespachoJuez ?? '',
      prestamoHipotecaDetalles: npl.prestamoHipotecaDetalles ?? '',
      importeDespachado: n2s(npl.importeDespachado),
      actuacionesSeguidas: npl.actuacionesSeguidas ?? '',
      informacionInversor: npl.informacionInversor ?? '',
      estado: npl.estado,
      esPublico: npl.esPublico,
    },
  });

  const onSubmit = async (data: NplInput) => {
    const { error, success } = await editNplAction(data, npl.id);
    if (error) toast.error(error);
    if (success) {
      toast.success(success);
      redirect('/dashboard/npl');
    }
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* nplId permite a la sección D mostrar el enlace a gestión de deudores */}
        <NplForm nplId={npl.id} />
        <FormSubmit value="Guardar cambios" className="mt-6 text-white" />
      </Form>
    </FormProvider>
  );
}
