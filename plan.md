// @copilot: Este es un prompt detallado y adaptado a la arquitectura de Laravel 12 con el starter kit de React (Inertia.js, React 19, TypeScript, Tailwind 4 y shadcn/ui como tema). Sigue este plan paso a paso de manera estructurada y exhaustiva. Lee archivo por archivo para una comprensión profunda, considerando la integración backend-frontend vía Inertia (e.g., controllers que usan Inertia::render() para pasar props a páginas React). Al final de cada fase, genera una "memoria" (resumen clave en formato Markdown con hallazgos, riesgos y sugerencias iniciales). Luego, haz preguntas específicas para aclarar dudas y mejorar el análisis. El objetivo es evaluar la salud general, performance en producción (incluyendo SSR/Vite), arquitectura híbrida (Laravel backend + React SPA) y estandarizar el código end-to-end. Responde en español, usa tablas Markdown para comparaciones y listas para planes. No asumas nada; basa todo en el código real.

// PLAN GENERAL DE ANÁLISIS (ejecuta fase por fase):
// Fase 1: Comprensión Inicial del Proyecto
// Fase 2: Análisis de Tecnologías y Dependencias
// Fase 3: Estudio de Arquitectura (Controllers, Páginas React/Inertia, Migraciones y Partes Primordiales)
// Fase 4: Evaluación de Performance en Producción
// Fase 5: Estandarización End-to-End de Arquitectura y Código
// Fase 6: Generación de Preguntas para Profundizar
// Fase 7: Memorias Consolidadas y Mejoras Iterativas

// FASE 1: COMPRENSIÓN INICIAL DEL PROYECTO
// - Lee archivo por archivo: Empieza por composer.json, package.json, vite.config.js, .env.example, app/ (Models, Http/Controllers), routes/ (web.php con Inertia routes), database/migrations/, config/ (fortify.php, inertia.php), tests/, y el frontend en resources/js/ (Pages/, components/ui/ para shadcn, layouts/, hooks/, lib/, types/ para TypeScript).
// - Resume la estructura general del proyecto: ¿Es una SPA full-stack con Inertia? ¿Módulos principales (e.g., auth con Fortify/2FA, dashboard)? ¿Patrones usados (MVC en backend, componentes funcionales en React con hooks)?
// - Identifica flujos end-to-end: Por ejemplo, request desde ruta web -> controller -> Inertia::render('PageName', props) -> React page/component con shadcn UI y Tailwind.
// - Genera una "memoria" de esta fase: Tabla con columnas (Archivo/Directorio, Contenido Clave, Observaciones Iniciales), destacando integración Inertia (e.g., HandleInertiaRequests middleware).

// FASE 2: ANÁLISIS DE TECNOLOGIAS Y DEPENDENCIAS
// - Analiza composer.json: Lista dependencias clave (Laravel 12 core, inertiajs/inertia-laravel, laravel/fortify para auth/2FA, paquetes como Sanctum/Passport si aplican), versiones, y posibles vulnerabilidades/outdated (compara con versiones estables de Packagist para Laravel 12, e.g., Fortify ^1.22).
// - Analiza package.json y vite.config.js: Dependencias frontend (React 19, @inertiajs/react, typescript, tailwindcss ^4, clsx/tailwind-merge para shadcn/ui, @radix-ui para primitives), scripts de build (dev:ssr, build:ssr), y compatibilidad con Vite/Inertia SSR.
// - Evalúa compatibilidad: ¿Hay conflictos entre PHP/Laravel y JS/Node/TS (e.g., tipos en types/ con Eloquent props)? ¿Paquetes obsoletos que afecten seguridad/performance (e.g., shadcn/ui actualizado vía npx shadcn add)? ¿Uso de WorkOS para auth social si está configurado?
// - Genera una "memoria" de esta fase: Tabla con columnas (Archivo, Dependencia, Versión, Riesgos/Beneficios, Sugerencias de Actualización), separando backend (PHP) y frontend (JS/TS).

// FASE 3: ESTUDIO DE ARQUITECTURA
// - Controllers: Lee cada uno en app/Http/Controllers. Analiza métodos (GET/POST), inyección de dependencias, validaciones (Form Requests), middlewares (auth:api, verified). ¿Siguen SOLID? ¿Delgados, pasando props a Inertia::render()? ¿Manejo de auth con Fortify?
// - Páginas React/Inertia: Revisa resources/js/Pages/ (páginas como Dashboard.tsx), components/ui/ (shadcn components como Button, Switch), layouts/ (app-layout.tsx con sidebar variants: default/inset/floating). ¿Reutilización de hooks y tipos TS? ¿Flujos de navegación con Inertia Link/router?
// - Migraciones y Partes Primordiales: Lee database/migrations/ (índices, foreign keys, seeds para users/2FA). Revisa Models (relaciones, scopes, MustVerifyEmail), Routes (grupos con middleware auth/verified), Configs (app.php, database.php, inertia.php para SSR), y Tests (PHPUnit para backend, Vitest/Jest para React si existen).
// - Identifica patrones: ¿Service/Repository layer en backend? ¿API Resources para props en Inertia? ¿shadcn/ui headless con Tailwind estilizado? ¿Layouts auth variants (simple/card/split)?
// - Genera una "memoria" de esta fase: Diagrama textual simple (en Markdown) del flujo Inertia (Route -> Controller -> Inertia::render -> React Page/Layout/Component) + tabla de fortalezas/debilidades por componente (backend vs. frontend).

// FASE 4: EVALUACIÓN DE PERFORMANCE EN PRODUCCIÓN
// - Basado en el código leído: Analiza queries (N+1 en Eloquent? Eager loading en props para Inertia?), cachés (Redis en config/cache.php), optimizaciones (queues para jobs/notificaciones, rate limiting en routes).
// - Considera escalabilidad: ¿Manejo de concurrencia en controllers? ¿Assets optimizados (Vite minification/code splitting en React)? ¿SSR habilitado (npm run build:ssr) para SEO/performance inicial? ¿Logs/monitoring (Sentry en config/logging.php)?
// - Predice issues: ¿Buena performance? (Sí/No/Parcial, con score 1-10). Factores: CPU/memoria por request (Inertia props hydration), DB bottlenecks, bundle size en React/shadcn.
// - Genera una "memoria" de esta fase: Lista numerada de riesgos de performance + recomendaciones (e.g., "Agregar index en migración users para query auth; optimizar shadcn imports tree-shakable").

// FASE 5: ESTANDARIZACIÓN END-TO-END DE ARQUITECTURA Y CÓDIGO
// - Propón un estándar unificado: Basado en Laravel 12 best practices (PSR-12 para PHP, ESLint/Prettier + TypeScript strict para JS/TS). Sugiere refactor: Separar lógica de controllers a Services, usar Traits para reutilización en Models, estandarizar naming (CamelCase en métodos React, kebab-case en clases CSS Tailwind). Para shadcn: Asegurar headless + accesibilidad (ARIA en Radix).
// - End-to-end: Desde request (routes/middlewares) -> business logic (services/models) -> Inertia props -> response (React page con layouts/shadcn). Incluye tests coverage (PHPUnit + React Testing Library).
// - Genera diffs de código sugeridos para 3-5 archivos clave (e.g., un controller con Inertia::render refactorizado, un componente shadcn en TS con tipos mejorados).
// - Genera una "memoria" de esta fase: Tabla con columnas (Área, Estándar Actual, Estándar Propuesto, Impacto en Performance/Mantenibilidad), separando backend (Laravel) y frontend (React/Inertia).

// FASE 6: GENERACIÓN DE PREGUNTAS PARA PROFUNDIZAR
// - Basado en gaps encontrados (e.g., si no hay SSR: "¿Planeas habilitar SSR para mejor TTI?"), genera 5-10 preguntas específicas y accionables. Agrúpalas por tema (Arquitectura Inertia/React, Performance Vite/SSR, Dependencias shadcn/Fortify, Auth/WorkOS).
// - Ejemplo: "¿Usas variants de layouts auth (e.g., card/split) en shadcn? ¿Por qué no WorkOS para SSO si el tráfico es alto?"

// FASE 7: MEMORIAS CONSOLIDADAS Y MEJORAS ITERATIVAS
// - Consolida todas las memorias en un reporte final: Sección por fase, con score general del proyecto (1-10 en categorías: Performance, Arquitectura Híbrida, Mantenibilidad Frontend/Backend).
// - Sugiere plan de mejoras: Pasos priorizados (alta/media/baja), con estimaciones de esfuerzo (horas/días), e.g., "Alta: Actualizar shadcn components (2 horas)".
// - Para iterar: "En la próxima revisión, enfócate en [área basada en respuestas a preguntas, e.g., optimización SSR si se confirma uso de SEO]".

Ejecuta este plan ahora, empezando por Fase 1. Proporciona outputs fase por fase para que pueda revisar iterativamente. Si necesitas más contexto (e.g., sobre WorkOS o custom shadcn), pregunta primero.