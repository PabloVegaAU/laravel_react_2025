export type Level = {
  id: number
  name: string
  level: number
}

export type Background = {
  id: number
  name: string
  image: string
  level_required: number // In the component state, we'll always have a number
  activo: boolean
  points_store: string | number
  level_name: string // In the component state, this will always be defined
  updated_at?: string
}

export type ApiBackground = Omit<Background, 'level_required' | 'level_name'> & {
  level_required: number | Level | null
  level_name?: string
}

export type EditModalBackground = Omit<Background, 'level_required'> & {
  level_required: number | Level
  activo: boolean
}

// Type guards
export function isLevelObject(level: any): level is Level {
  return level && typeof level === 'object' && 'id' in level && 'name' in level && 'level' in level
}

// Normalize API background to component background
export function normalizeBackground(apiBackground: ApiBackground): Background {
  return {
    ...apiBackground,
    level_required: isLevelObject(apiBackground.level_required) ? apiBackground.level_required.level : apiBackground.level_required || 0,
    level_name:
      apiBackground.level_name ||
      (isLevelObject(apiBackground.level_required) ? apiBackground.level_required.name : `Nivel ${apiBackground.level_required || 1}`)
  }
}
