import { usePage } from '@inertiajs/react'

export function t(key: string, fallback = '', replacements?: Record<string, string>): string {
  const { translations } = usePage().props
  const segments = key.split('.')
  const group = segments.shift()!
  let node: any = (translations as Record<string, unknown>)[group] || {}

  for (const seg of segments) {
    if (node && typeof node === 'object' && seg in node) {
      node = node[seg]
    } else {
      return fallback
    }
  }

  if (typeof node === 'string' && replacements) {
    return Object.entries(replacements).reduce((str, [k, v]) => str.replace(new RegExp(`:${k}`, 'g'), v), node)
  }

  return typeof node === 'string' ? node : fallback
}
