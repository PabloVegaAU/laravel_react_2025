<?php

namespace App\Providers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Validator::extend('string_or_image', function ($attribute, $value, $parameters, $validator) {
            return (new \App\Rules\StringOrImage($parameters[0] ?? null))->passes($attribute, $value);
        });
    }
}
