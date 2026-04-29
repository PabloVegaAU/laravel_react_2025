<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Logout;

class LogSuccessfulLogout
{
    public function handle(Logout $event): void
    {
        // Opcional: Log de logout
        // Se puede agregar lógica adicional aquí si se necesita
    }
}
