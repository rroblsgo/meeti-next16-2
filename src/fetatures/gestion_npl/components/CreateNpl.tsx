'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import { NplInput, NplSchema } from '../schemas/nplSchema';
import { Form, FormSubmit } from '@/src/shared/components/forms';
import { createNplAction } from '../actions/npl-actions';
import NplForm from './NplForm';

export default function CreateNpl() {
  const methods = useForm<NplInput>({
    resolver: zodResolver(NplSchema),
    mode: 'all',
    defaultValues: {
      tituloOperacion: '',
      referenciaOrigen: '',
      direccion: '',
      municipio: '',
      provincia: '',
      codigoPostal: '',
      tipoInmueble: 'VIVIENDA',
      distribucion: '',
      superficieConst: '',
      superficieParcela: '',
      superficieDetalles: '',
      anyConstruccion: '',
      refCatastral: '',
      fincaRegistral: '',
      datosRegistro: '',
      tasacionSubasta: '',
      imagenAsociada: '',
      imagenesAdicionales: [],
      costeAdquisicionCredito: '',
      derechoCobroPrincipal: '',
      intereses: '',
      costas: '',
      impuestosAjd: '',
      costesNotariaRegistro: '',
      gastosDacion: '',
      precioMercado: '',
      precioVentaRapida: '',
      procedimiento: 'EJECUCION_HIPOTECARIA',
      nig: '',
      juzgado: '',
      ejecutante: '',
      procuradores: [],
      ejecutados: [],
      autoDespachoJuez: '',
      prestamoHipotecaDetalles: '',
      importeDespachado: '',
      actuacionesSeguidas: '',
      informacionInversor: '',
      estado: 'ACTIVO',
      esPublico: false,
    },
  });

  const onSubmit = async (data: NplInput) => {
    const { error, success } = await createNplAction(data);
    if (error) toast.error(error);
    if (success) {
      toast.success(success);
      redirect('/dashboard/npl');
    }
  };

  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* Sin nplId — sección D muestra aviso de gestión post-creación */}
        <NplForm />
        <FormSubmit value="Crear NPL" className="mt-6 text-white" />
      </Form>
    </FormProvider>
  );
}
