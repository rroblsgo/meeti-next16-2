# Implementación Task para meeti-next16

Se añadió una primera versión funcional para la gestión de tareas siguiendo el patrón existente de la app:

- Schema Drizzle para `tasks` en `src/db/schema/task.ts`
- Export del schema en `src/db/schema/index.ts`
- Feature completa en `src/fetatures/tasks/*`
  - `schemas/taskSchema.ts`
  - `services/TaskRepository.ts`
  - `services/TaskService.ts`
  - `actions/task-actions.ts`
  - componentes de formulario, listado, badges y acciones
- Páginas dashboard:
  - `/dashboard/tasks`
  - `/dashboard/tasks/create`
  - `/dashboard/tasks/[id]/edit`
- Endpoints API:
  - `GET/POST /api/tasks`
  - `PUT/DELETE /api/tasks/[id]`
  - `PATCH /api/tasks/[id]/status`
- Navegación dashboard actualizada para incluir “Tareas”
- UploadThing ampliado con `taskAttachmentsUploader` para adjuntos de tareas

## Pendientes recomendados

1. Generar y aplicar la migración de Drizzle para los enums y la tabla `tasks`.
2. Validar en local el comportamiento exacto de `blob` en UploadThing con los tipos de archivo que quieras permitir.
3. Añadir filtros en el listado (por estado, prioridad, comunidad, asignado).
4. Añadir vista de detalle de tarea y comentarios/histórico si lo necesitas.
5. Revisar permisos finos si quieres restringir edición solo al creador y cambio de estado al asignado.
