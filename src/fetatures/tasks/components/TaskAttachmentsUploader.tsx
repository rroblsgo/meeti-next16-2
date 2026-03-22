'use client';

import { UploadDropzone } from '@/shared/utils/uploadthing';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { TaskInput } from '../schemas/taskSchema';
import { FormError } from '@/src/shared/components/forms';

export default function TaskAttachmentsUploader() {
  const {
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<TaskInput>();

  const attachments = watch('attachments') ?? [];

  return (
    <div className="space-y-3">
      <UploadDropzone
        endpoint="taskAttachmentsUploader"
        className="ut-button:bg-orange-600 hover:ut-button:bg-orange-700"
        onClientUploadComplete={(res) => {
          const uploaded = res.map((file) => file.ufsUrl);
          setValue('attachments', [...attachments, ...uploaded], {
            shouldDirty: true,
            shouldValidate: true,
          });
          clearErrors('attachments');
        }}
        appearance={{
          button:
            'font-black py-3 w-full block h-auto after:bg-orange-500 after:h-4 after:top-0',
          label: 'text-sm text-gray-500 hover:text-gray-800',
          allowedContent: 'text-sm',
        }}
        content={{
          button: 'Adjuntar documentos',
          label: 'PDF, Word, imágenes u otros archivos',
          allowedContent: 'Máximo 5 archivos de 8 MB',
        }}
        config={{
          cn: twMerge,
          mode: 'auto',
        }}
      />

      {errors.attachments && <FormError>{errors.attachments.message}</FormError>}

      {!!attachments.length && (
        <ul className="space-y-2 rounded-lg border border-gray-200 p-4 text-sm">
          {attachments.map((attachment, index) => (
            <li key={`${attachment}-${index}`} className="flex items-center justify-between gap-3">
              <a
                href={attachment}
                target="_blank"
                rel="noreferrer"
                className="truncate text-orange-600 hover:underline"
              >
                {attachment}
              </a>
              <button
                type="button"
                onClick={() =>
                  setValue(
                    'attachments',
                    attachments.filter((_, currentIndex) => currentIndex !== index),
                    { shouldDirty: true, shouldValidate: true }
                  )
                }
                className="rounded-md bg-red-50 px-3 py-1 font-semibold text-red-600 hover:bg-red-100"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
