<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait HandlesImageStorage
{
    /**
     * Detecta el disco de almacenamiento basándose en la URL de la imagen
     *
     * @param  string  $imageUrl  URL de la imagen
     * @return string 'local' o 's3'
     */
    protected function detectStorageDisk(string $imageUrl): string
    {
        $host = parse_url($imageUrl, PHP_URL_HOST);

        // Detectar si es S3-compatible (AWS S3, Cloudflare R2, Laravel Cloud)
        if ($host && (
            Str::contains($host, 'amazonaws.com') ||
            Str::contains($host, 's3') ||
            Str::contains($host, 'cloudflarestorage.com') ||
            Str::contains($host, 'laravel.cloud')
        )) {
            return 's3';
        }

        // Detectar si es storage local por el path
        $path = parse_url($imageUrl, PHP_URL_PATH);
        if ($path && Str::startsWith($path, '/storage/')) {
            return 'local';
        }

        // Por defecto, asumir S3 en producción
        return config('filesystems.default') === 'local' ? 'local' : 's3';
    }

    /**
     * Extrae el path relativo de la URL de la imagen
     *
     * @param  string  $imageUrl  URL de la imagen
     * @return string|null Path relativo
     */
    protected function extractPathFromUrl(string $imageUrl): ?string
    {
        $parsed = parse_url($imageUrl);
        $path = $parsed['path'] ?? null;

        if (! $path) {
            \Log::warning('No se pudo extraer el path de la URL: '.$imageUrl);

            return null;
        }

        // Eliminar el prefijo /storage/ si existe (para URLs de disco local)
        if (Str::startsWith($path, '/storage/')) {
            $path = substr($path, 9);
        }

        // Eliminar slash inicial del path (requerido por Storage::exists y Storage::delete)
        return ltrim($path, '/');
    }

    /**
     * Elimina una imagen del almacenamiento correspondiente
     *
     * @param  string  $imageUrl  URL de la imagen a eliminar
     * @return bool True si se eliminó correctamente, false en caso contrario
     */
    protected function deleteImage(string $imageUrl): bool
    {
        try {
            $disk = $this->detectStorageDisk($imageUrl);
            $path = $this->extractPathFromUrl($imageUrl);

            if (! $path) {
                \Log::warning('No se pudo extraer el path de la URL: '.$imageUrl);

                return false;
            }

            // Verificar si el archivo existe antes de eliminar
            if (! Storage::disk($disk)->exists($path)) {
                \Log::warning('La imagen no existe en '.$disk.': '.$path);

                return false;
            }

            // Eliminar el archivo
            $deleted = Storage::disk($disk)->delete($path);

            if (! $deleted) {
                \Log::error('No se pudo eliminar la imagen de '.$disk.': '.$path);

                return false;
            }

            // Verificar que ya no existe después de eliminar
            $stillExists = Storage::disk($disk)->exists($path);
            if ($stillExists) {
                \Log::error('La imagen aún existe después de intentar eliminarla: '.$disk.' '.$path);

                return false;
            }

            \Log::info('Imagen eliminada exitosamente de '.$disk.': '.$path);

            return true;
        } catch (\Exception $e) {
            \Log::error('Error al eliminar la imagen: '.$e->getMessage(), [
                'url' => $imageUrl,
                'trace' => $e->getTraceAsString(),
            ]);

            return false;
        }
    }

    /**
     * Guarda una imagen en el almacenamiento especificado
     *
     * @param  \Illuminate\Http\UploadedFile  $file  Archivo a guardar
     * @param  string  $directory  Directorio donde guardar el archivo
     * @param  string|null  $filename  Nombre del archivo (opcional)
     * @param  string  $disk  Disco de almacenamiento (default: 's3')
     * @return string URL de la imagen guardada
     */
    protected function storeImage($file, string $directory, ?string $filename = null, string $disk = 's3'): string
    {
        // Para Laravel Cloud, siempre generar nombre único con hash para evitar cache CDN
        if ($disk === 's3' && Str::contains(env('AWS_URL', ''), 'laravel.cloud')) {
            $extension = $file->getClientOriginalExtension();

            if ($filename) {
                $pathInfo = pathinfo($filename);
                $filename = $pathInfo['filename'].'_'.md5($file->get()).'.'.$extension;
            } else {
                // Generar nombre único con hash cuando no se proporciona filename
                $filename = Str::random(40).'_'.md5($file->get()).'.'.$extension;
            }

            $path = $file->storeAs($directory, $filename, $disk);
        } elseif ($filename) {
            // Para otros casos con filename, agregar hash
            $pathInfo = pathinfo($filename);
            $filename = $pathInfo['filename'].'_'.md5($file->get()).'.'.$pathInfo['extension'];
            $path = $file->storeAs($directory, $filename, $disk);
        } else {
            // Comportamiento original para otros discos
            $path = $file->store($directory, $disk);
        }

        return Storage::disk($disk)->url($path);
    }

    /**
     * Actualiza una imagen: elimina la anterior y guarda la nueva
     *
     * @param  string|null  $oldImageUrl  URL de la imagen anterior
     * @param  \Illuminate\Http\UploadedFile  $newFile  Nuevo archivo
     * @param  string  $directory  Directorio donde guardar el archivo
     * @param  string|null  $filename  Nombre del archivo (opcional)
     * @param  string  $disk  Disco de almacenamiento (default: 's3')
     * @return string URL de la nueva imagen guardada
     */
    protected function updateImage(?string $oldImageUrl, $newFile, string $directory, ?string $filename = null, string $disk = 's3'): string
    {
        // Eliminar la imagen anterior si existe
        if ($oldImageUrl) {
            $this->deleteImage($oldImageUrl);
        }

        // Guardar la nueva imagen
        return $this->storeImage($newFile, $directory, $filename, $disk);
    }
}
