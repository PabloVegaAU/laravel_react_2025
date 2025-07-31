<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Http\UploadedFile;

class StringOrImage implements Rule
{
    protected $allowedExtensions;

    public function __construct($allowedExtensions = 'jpeg,png,jpg,webp')
    {
        $this->allowedExtensions = $allowedExtensions;
    }

    public function passes($attribute, $value)
    {
        // Si es string, asumimos que es una URL válida
        if (is_string($value)) {
            return true;
        }

        // Si es un archivo, validamos que sea una imagen
        if ($value instanceof UploadedFile) {
            return in_array($value->getClientOriginalExtension(), explode(',', $this->allowedExtensions));
        }

        return false;
    }

    public function message()
    {
        return 'El campo :attribute debe ser una URL válida o un archivo de tipo: '.$this->allowedExtensions;
    }
}
