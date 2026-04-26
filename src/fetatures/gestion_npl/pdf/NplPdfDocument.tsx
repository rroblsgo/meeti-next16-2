/**
 * NplPdfDocument v2
 * - Sin emojis (sustituidos por marcadores visuales CSS)
 * - Saltos de página controlados con break y wrap={false}
 * - HTML de TipTap renderizado con tablas y listas nativas de react-pdf
 */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';

import { styles, COLORS } from './npl-pdf.styles';
import {
  fmtEuros,
  fmtEurosShort,
  fmtPct,
  fmtM2,
  fmtVal,
  htmlToText,
  renderHtml,
} from './npl-pdf.utils';

import type { SelectNpl } from '../types/npl.types';
import type { SelectNplDeudor } from '../../npl_deudores/types/deudor.types';

type Props = {
  npl: SelectNpl;
  deudores: SelectNplDeudor[];
  empresaNombre?: string;
  empresaContacto?: string;
  empresaWeb?: string;
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

// Cabecera de sección: barra azul oscura con marcador de color en lugar de emoji
function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionMarker} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// Tabla de datos en grid (label/valor)
function DataTable({
  rows,
}: {
  rows: Array<Array<{ label: string; value: string; green?: boolean }>>;
}) {
  return (
    <View style={styles.table}>
      {rows.map((row, ri) => (
        <View
          key={ri}
          style={[
            styles.tableRow,
            ri === rows.length - 1 ? styles.tableRowLast : {},
            ri % 2 === 1 ? styles.tableRowAlt : {},
          ]}
        >
          {row.map((cell, ci) => (
            <View
              key={ci}
              style={[
                styles.tableCell,
                ci === row.length - 1 ? styles.tableCellLast : {},
              ]}
            >
              <Text style={styles.tableCellLabel}>{cell.label}</Text>
              <Text
                style={
                  cell.green
                    ? styles.tableCellValueGreen
                    : styles.tableCellValue
                }
              >
                {cell.value}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function Footer({
  empresaNombre,
  empresaContacto,
  empresaWeb,
}: {
  empresaNombre: string;
  empresaContacto: string;
  empresaWeb: string;
}) {
  return (
    <View style={styles.footer} fixed>
      <View>
        <Text style={styles.footerLeft}>{empresaNombre}</Text>
        {empresaContacto && (
          <Text style={[styles.footerLeft, { fontSize: 6 }]}>
            {empresaContacto}
          </Text>
        )}
        {empresaWeb && (
          <Text style={[styles.footerLeft, { fontSize: 6 }]}>{empresaWeb}</Text>
        )}
      </View>
      <Text style={styles.footerCenter}>
        Cualquier operación inmobiliaria conlleva riesgos. Los plazos y precios
        de venta son estimados y pueden variar.
      </Text>
      <Text
        style={styles.footerRight}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}
// ─── Documento principal ──────────────────────────────────────────────────────

export default function NplPdfDocument({
  npl,
  deudores,
  empresaNombre = 'ORENES PROPERTY FUND',
  empresaContacto = '',
  empresaWeb = '',
}: Props) {
  // Cálculos de rentabilidad
  const coste = npl.costeAdquisicionCredito
    ? parseFloat(npl.costeAdquisicionCredito)
    : null;
  const ajd = npl.impuestosAjd ? parseFloat(npl.impuestosAjd) : null;
  const notaria = npl.costesNotariaRegistro
    ? parseFloat(npl.costesNotariaRegistro)
    : null;
  const mercado = npl.precioMercado ? parseFloat(npl.precioMercado) : null;
  const ventaRapida = npl.precioVentaRapida
    ? parseFloat(npl.precioVentaRapida)
    : null;
  const principal = npl.derechoCobroPrincipal
    ? parseFloat(npl.derechoCobroPrincipal)
    : null;
  const intereses = npl.intereses ? parseFloat(npl.intereses) : null;
  const costas = npl.costas ? parseFloat(npl.costas) : null;

  const inversionBase =
    coste !== null && ajd !== null && notaria !== null
      ? coste + ajd + notaria
      : coste;

  const totalConIntereses =
    principal !== null && intereses !== null && costas !== null
      ? principal + intereses + costas
      : null;

  const beneficioEscPrincipal =
    inversionBase !== null && mercado !== null ? mercado - inversionBase : null;

  const roiEscPrincipal =
    beneficioEscPrincipal !== null &&
    inversionBase !== null &&
    inversionBase > 0
      ? (beneficioEscPrincipal / inversionBase) * 100
      : null;

  const beneficioVentaRapida =
    inversionBase !== null && ventaRapida !== null
      ? ventaRapida - inversionBase
      : null;

  const roiVentaRapida =
    beneficioVentaRapida !== null && inversionBase !== null && inversionBase > 0
      ? (beneficioVentaRapida / inversionBase) * 100
      : null;

  const location = [npl.municipio, npl.provincia]
    .filter(Boolean)
    .join(', ')
    .toUpperCase();

  // Determinar qué secciones tienen contenido
  const hasImagen = !!npl.imagenAsociada;
  const hasProcesal = !!(
    npl.procedimiento ||
    npl.nig ||
    npl.juzgado ||
    npl.ejecutante
  );
  const hasActuaciones = !!npl.actuacionesSeguidas;
  const hasInversor = !!npl.informacionInversor;
  const hasDeudores = deudores.length > 0;

  // Pie fijo
  // const Footer = () => (
  //   <View style={styles.footer} fixed>
  //     <Text style={styles.footerLeft}>{empresaNombre}</Text>
  //     <Text style={styles.footerCenter}>
  //       Cualquier operación inmobiliaria conlleva riesgos. Los plazos y precios de venta son estimados y pueden variar.
  //     </Text>
  //     <Text
  //       style={styles.footerRight}
  //       render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
  //     />
  //   </View>
  // );

  return (
    <Document
      title={npl.tituloOperacion}
      author={empresaNombre}
      subject="Informe de Inversion NPL"
    >
      <Page size="A4" style={styles.page}>
        <Footer
          empresaNombre={empresaNombre}
          empresaContacto={empresaContacto}
          empresaWeb={empresaWeb}
        />

        {/* ── CABECERA (nunca se parte) ──────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerBrand}>{empresaNombre}</Text>
              <Text style={styles.headerSubbrand}>INFORME DE INVERSION</Text>
            </View>
            <Text style={styles.headerConfidential}>CONFIDENCIAL</Text>
          </View>
          <View style={styles.headerDivider} />
          <Text style={styles.headerTitle}>{npl.tituloOperacion}</Text>
          {(npl.direccion || location) && (
            <Text style={styles.headerAddress}>
              {[npl.direccion, location].filter(Boolean).join(' · ')}
            </Text>
          )}
        </View>

        {/* ── BARRA KPIs ────────────────────────────────────────────────── */}
        <View style={styles.kpiBar} wrap={false}>
          <View style={[styles.kpiItem, styles.kpiItemFirst]}>
            <Text style={styles.kpiLabel}>ROI NETO</Text>
            <Text style={styles.kpiValue}>
              {roiEscPrincipal !== null
                ? `${roiEscPrincipal.toFixed(2)}% neto`
                : '--'}
            </Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiLabel}>INVERSION TOTAL</Text>
            <Text style={styles.kpiValueWhite}>
              {fmtEurosShort(inversionBase)}
            </Text>
          </View>
          <View style={styles.kpiItem}>
            <Text style={styles.kpiLabel}>BENEFICIO NETO</Text>
            <Text style={styles.kpiValueWhite}>
              {fmtEurosShort(beneficioEscPrincipal)}
            </Text>
          </View>
          <View style={[styles.kpiItem, styles.kpiItemLast]}>
            <Text style={styles.kpiLabel}>PRECIO MERCADO</Text>
            <Text style={styles.kpiValueWhite}>
              {fmtEurosShort(npl.precioMercado)}
            </Text>
          </View>
        </View>

        {/* ── IMAGEN (no se parte) ──────────────────────────────────────── */}
        {hasImagen && (
          <Image src={npl.imagenAsociada!} style={styles.mainImage} />
        )}

        <View style={styles.content}>
          {/* ── A. CUADRO REGISTRAL (no se parte) ────────────────────────── */}
          <View wrap={false}>
            <SectionHeader title="CUADRO DE SUPERFICIES Y DATOS REGISTRALES" />
            <DataTable
              rows={[
                [
                  {
                    label: 'TIPO DE INMUEBLE',
                    value: fmtVal(npl.tipoInmueble),
                  },
                  {
                    label: 'SUPERFICIE CONSTRUIDA',
                    value: npl.superficieDetalles
                      ? npl.superficieDetalles
                      : fmtM2(npl.superficieConst),
                  },
                  {
                    label: 'AÑO DE CONSTRUCCION',
                    value: fmtVal(npl.anyConstruccion),
                  },
                ],
                [
                  { label: 'DISTRIBUCION', value: fmtVal(npl.distribucion) },
                  { label: 'REF. CATASTRAL', value: fmtVal(npl.refCatastral) },
                  {
                    label: 'FINCA REGISTRAL',
                    value: fmtVal(npl.fincaRegistral),
                  },
                ],
                [
                  {
                    label: 'TASACION SUBASTA',
                    value: fmtEuros(npl.tasacionSubasta),
                  },
                  {
                    label: 'PRECIO DE MERCADO',
                    value: fmtEuros(npl.precioMercado),
                    green: true,
                  },
                  {
                    label: 'PRECIO VENTA RAPIDA',
                    value: fmtEuros(npl.precioVentaRapida),
                  },
                ],
              ]}
            />
          </View>

          {/* ── B. RENTABILIDAD ───────────────────────────────────────────── */}
          {/* La tabla de costes puede fluir pero los escenarios no se parten */}
          <SectionHeader title="RENTABILIDAD Y ESCENARIOS DE INVERSION" />
          <DataTable
            rows={[
              [
                {
                  label: 'COSTE ADQUISICION CREDITO',
                  value: fmtEuros(npl.costeAdquisicionCredito),
                },
                {
                  label: 'DERECHO DE COBRO (PRINCIPAL)',
                  value: fmtEuros(npl.derechoCobroPrincipal),
                },
                {
                  label: 'TOTAL CON INTERESES Y COSTAS',
                  value: fmtEuros(totalConIntereses),
                },
              ],
              [
                { label: 'IMPUESTOS AJD', value: fmtEuros(npl.impuestosAjd) },
                {
                  label: 'NOTARIA Y REGISTRO',
                  value: fmtEuros(npl.costesNotariaRegistro),
                },
                {
                  label: 'INVERSION TOTAL',
                  value: fmtEuros(inversionBase),
                  green: true,
                },
              ],
            ]}
          />

          {/* Escenarios: forzar salto de página si no caben juntos */}
          <View wrap={false} style={styles.scenariosGrid}>
            {/* Escenario principal */}
            <View style={[styles.scenarioCard, styles.scenarioCardHighlight]}>
              <View style={styles.scenarioBadge} />
              <Text style={styles.scenarioTitle}>
                ESCENARIO PRINCIPAL -- ADJUDICACION Y VENTA
              </Text>
              <View style={styles.scenarioRow}>
                <Text style={styles.scenarioLabel}>Inversion</Text>
                <Text style={styles.scenarioValue}>
                  {fmtEurosShort(inversionBase)}
                </Text>
              </View>
              <View style={styles.scenarioRow}>
                <Text style={styles.scenarioLabel}>Valoracion mercado</Text>
                <Text style={styles.scenarioValue}>
                  {fmtEurosShort(npl.precioMercado)}
                </Text>
              </View>
              <View style={styles.scenarioRow}>
                <Text style={styles.scenarioLabel}>Beneficio</Text>
                <Text style={styles.scenarioValue}>
                  {fmtEurosShort(beneficioEscPrincipal)}
                </Text>
              </View>
              <Text style={styles.scenarioRoi}>{fmtPct(roiEscPrincipal)}</Text>
            </View>

            {/* Escenario venta rápida */}
            <View style={[styles.scenarioCard, styles.scenarioCardLast]}>
              <View style={[styles.scenarioBadge, styles.scenarioBadgeAlt]} />
              <Text style={styles.scenarioTitle}>VENTA RAPIDA</Text>
              <View style={styles.scenarioRow}>
                <Text style={styles.scenarioLabel}>Inversion</Text>
                <Text style={styles.scenarioValue}>
                  {fmtEurosShort(inversionBase)}
                </Text>
              </View>
              <View style={styles.scenarioRow}>
                <Text style={styles.scenarioLabel}>Precio venta rapida</Text>
                <Text style={styles.scenarioValue}>
                  {fmtEurosShort(npl.precioVentaRapida)}
                </Text>
              </View>
              <View style={styles.scenarioRow}>
                <Text style={styles.scenarioLabel}>Beneficio</Text>
                <Text style={styles.scenarioValue}>
                  {fmtEurosShort(beneficioVentaRapida)}
                </Text>
              </View>
              <Text style={styles.scenarioRoi}>{fmtPct(roiVentaRapida)}</Text>
            </View>
          </View>

          {/* ── C. ESTADO PROCESAL ────────────────────────────────────────── */}
          {hasProcesal && (
            <>
              {/* Salto antes del estado procesal si hay mucho contenido arriba */}
              <View wrap={false}>
                <SectionHeader title="ESTADO REAL Y PROCESAL" />
                <DataTable
                  rows={[
                    [
                      {
                        label: 'PROCEDIMIENTO',
                        value: fmtVal(npl.procedimiento),
                      },
                      { label: 'NIG', value: fmtVal(npl.nig) },
                      { label: 'JUZGADO', value: fmtVal(npl.juzgado) },
                    ],
                    [
                      { label: 'EJECUTANTE', value: fmtVal(npl.ejecutante) },
                      {
                        label: 'EJECUTADOS',
                        value: npl.ejecutados?.join(', ') || '—',
                      },
                      {
                        label: 'IMPORTE DESPACHADO',
                        value: fmtEuros(npl.importeDespachado),
                      },
                    ],
                  ]}
                />
              </View>

              {/* Actuaciones seguidas */}
              {hasActuaciones && (
                <View style={styles.hitosList}>
                  {htmlToText(npl.actuacionesSeguidas)
                    .split('\n')
                    .filter((l) => l.trim())
                    .map((linea, i, arr) => (
                      <View
                        key={i}
                        style={[
                          styles.hitoRow,
                          i === arr.length - 1 ? styles.hitoRowLast : {},
                        ]}
                      >
                        <Text style={styles.hitoBullet}>
                          {linea.startsWith('\u2022') ? '\u2022' : '>'}
                        </Text>
                        <Text style={styles.hitoText}>
                          {linea.replace(/^\u2022\s*/, '')}
                        </Text>
                      </View>
                    ))}
                </View>
              )}
            </>
          )}

          {/* ── DEUDORES (cada deudor no se parte) ───────────────────────── */}
          {hasDeudores && (
            <View wrap={false}>
              <SectionHeader title="INFORMACION DE DEUDORES" />
              <View style={styles.deudorCard}>
                {deudores.map((d, i) => (
                  <View
                    key={d.id}
                    style={[
                      styles.tableRow,
                      i === deudores.length - 1 ? styles.tableRowLast : {},
                      i % 2 === 1 ? styles.tableRowAlt : {},
                    ]}
                  >
                    <View style={[styles.tableCell, { flex: 1.5 }]}>
                      <Text style={styles.tableCellLabel}>
                        {d.esPrincipal ? 'DEUDOR PRINCIPAL' : `DEUDOR ${i + 1}`}
                      </Text>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Text style={styles.tableCellValue}>{d.nombre}</Text>
                        {d.esPrincipal && (
                          <Text style={styles.deudorBadge}>PRINCIPAL</Text>
                        )}
                      </View>
                      {d.dni && (
                        <Text style={styles.tableCellValueMuted}>
                          DNI: {d.dni}
                        </Text>
                      )}
                    </View>
                    <View style={[styles.tableCell, { flex: 2 }]}>
                      <Text style={styles.tableCellLabel}>
                        ESTADO OCUPACIONAL
                      </Text>
                      <Text style={styles.tableCellValue}>
                        {fmtVal(d.estadoOcupacional)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell,
                        styles.tableCellLast,
                        { flex: 2 },
                      ]}
                    >
                      <Text style={styles.tableCellLabel}>VULNERABILIDAD</Text>
                      <Text style={styles.tableCellValue}>
                        {fmtVal(d.vulnerabilidad)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── INFORMACION PARA EL INVERSOR (con HTML rico) ─────────────── */}
          {hasInversor && (
            <View>
              <SectionHeader title="INFORMACION PARA EL INVERSOR" />
              <View style={styles.richTextContainer}>
                {renderHtml(npl.informacionInversor)}
              </View>
            </View>
          )}

          <View style={styles.spacer} />
        </View>
      </Page>
    </Document>
  );
}
