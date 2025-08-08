import { Badge } from '@/components/ui/badge'
import { Check, CheckSquare, HelpCircle, Link2, ListOrdered, X } from 'lucide-react'
import { Question } from '.'

/**
 * Constantes para los tipos de pregunta.
 * Deben coincidir con los valores en la tabla `question_types` de la base de datos.
 *
 * @see database/migrations/2025_06_22_100090_create_question_types_table.php
 */
export const QUESTION_TYPES = {
  /**
   * Pregunta de opción única.
   * El usuario debe seleccionar una respuesta correcta entre varias opciones.
   */
  SINGLE_CHOICE: 1,

  /**
   * Pregunta de ordenamiento.
   * El usuario debe ordenar las opciones en el orden correcto.
   */
  ORDERING: 2,

  /**
   * Pregunta de emparejamiento.
   * El usuario debe emparejar elementos de dos columnas.
   */
  MATCHING: 3,

  /**
   * Pregunta de verdadero/falso.
   * El usuario debe seleccionar entre verdadero o falso.
   */
  TRUE_FALSE: 4,

  /**
   * Pregunta de tipo no soportado.
   * El usuario debe seleccionar entre verdadero o falso.
   */
  OPEN_ANSWER: 5
}

// Función para obtener el ícono según el ID del tipo de pregunta
export const getQuestionTypeIcon = (typeId: number) => {
  switch (typeId) {
    case 1: // Respuesta única
      return <CheckSquare className='h-3.5 w-3.5' />
    case 2: // Ordenar
      return <ListOrdered className='h-3.5 w-3.5' />
    case 3: // Emparejar
      return <Link2 className='h-3.5 w-3.5' />
    case 4: // Verdadero o falso
      return (
        <div className='flex items-center'>
          <Check className='h-3.5 w-3.5' />/<X className='h-3.5 w-3.5' />
        </div>
      )
    default:
      return <HelpCircle className='h-3.5 w-3.5' />
  }
}
export const getQuestionTypeBadge = (question: Question | undefined) => {
  if (!question) return null
  return (
    <Badge variant='outline' className='gap-1 text-xs'>
      {getQuestionTypeIcon(question?.question_type?.id || 0)}
      {question?.question_type?.name}
    </Badge>
  )
}
