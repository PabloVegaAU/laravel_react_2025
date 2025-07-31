// Función para generar clases dinámicas según color tailwind
export const getContainerColorVariant = (color: string): string => {
  // Paleta de colores predefinidos
  const predefinedVariants: Record<string, string> = {
    red: 'bg-red-200 dark:bg-red-900 hover:bg-red-300 hover:dark:bg-red-800 border-red-400 dark:border-red-800',
    orange: 'bg-orange-200 dark:bg-orange-900 hover:bg-orange-300 hover:dark:bg-orange-800 border-orange-400 dark:border-orange-800',
    amber: 'bg-amber-200 dark:bg-amber-900 hover:bg-amber-300 hover:dark:bg-amber-800 border-amber-400 dark:border-amber-800',
    yellow: 'bg-yellow-200 dark:bg-yellow-900 hover:bg-yellow-300 hover:dark:bg-yellow-800 border-yellow-400 dark:border-yellow-800',
    lime: 'bg-lime-200 dark:bg-lime-900 hover:bg-lime-300 hover:dark:bg-lime-800 border-lime-400 dark:border-lime-800',
    green: 'bg-green-200 dark:bg-green-900 hover:bg-green-300 hover:dark:bg-green-800 border-green-400 dark:border-green-800',
    emerald: 'bg-emerald-200 dark:bg-emerald-900 hover:bg-emerald-300 hover:dark:bg-emerald-800 border-emerald-400 dark:border-emerald-800',
    teal: 'bg-teal-200 dark:bg-teal-900 hover:bg-teal-300 hover:dark:bg-teal-800 border-teal-400 dark:border-teal-800',
    cyan: 'bg-cyan-200 dark:bg-cyan-900 hover:bg-cyan-300 hover:dark:bg-cyan-800 border-cyan-400 dark:border-cyan-800',
    sky: 'bg-sky-200 dark:bg-sky-900 hover:bg-sky-300 hover:dark:bg-sky-800 border-sky-400 dark:border-sky-800',
    blue: 'bg-blue-200 dark:bg-blue-900 hover:bg-blue-300 hover:dark:bg-blue-800 border-blue-400 dark:border-blue-800',
    indigo: 'bg-indigo-200 dark:bg-indigo-900 hover:bg-indigo-300 hover:dark:bg-indigo-800 border-indigo-400 dark:border-indigo-800',
    violet: 'bg-violet-200 dark:bg-violet-900 hover:bg-violet-300 hover:dark:bg-violet-800 border-violet-400 dark:border-violet-800',
    purple: 'bg-purple-200 dark:bg-purple-900 hover:bg-purple-300 hover:dark:bg-purple-800 border-purple-400 dark:border-purple-800',
    fuchsia: 'bg-fuchsia-200 dark:bg-fuchsia-900 hover:bg-fuchsia-300 hover:dark:bg-fuchsia-800 border-fuchsia-400 dark:border-fuchsia-800',
    pink: 'bg-pink-200 dark:bg-pink-900 hover:bg-pink-300 hover:dark:bg-pink-800 border-pink-400 dark:border-pink-800',
    rose: 'bg-rose-200 dark:bg-rose-900 hover:bg-rose-300 hover:dark:bg-rose-800 border-rose-400 dark:border-rose-800',
    slate: 'bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 hover:dark:bg-slate-800 border-slate-400 dark:border-slate-800',
    gray: 'bg-gray-200 dark:bg-gray-900 hover:bg-gray-300 hover:dark:bg-gray-800 border-gray-400 dark:border-gray-800',
    zinc: 'bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 hover:dark:bg-zinc-800 border-zinc-400 dark:border-zinc-800',
    neutral: 'bg-neutral-200 dark:bg-neutral-900 hover:bg-neutral-300 hover:dark:bg-neutral-800 border-neutral-400 dark:border-neutral-800',
    stone: 'bg-stone-200 dark:bg-stone-900 hover:bg-stone-300 hover:dark:bg-stone-800 border-stone-400 dark:border-stone-800'
  }

  if (color in predefinedVariants) {
    return predefinedVariants[color]
  }

  // Fallback: podrías retornar un color base o vacío
  return 'bg-gray-200 dark:bg-gray-900 hover:bg-gray-300 hover:dark:bg-gray-800 border-gray-400 dark:border-gray-800'
}
