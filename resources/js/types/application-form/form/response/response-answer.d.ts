export interface ResponseAnswer {
  id: number // ID de la respuesta de la pregunta (ApplicationFormResponseQuestion)
  application_form_question_id: number
  question_id: number
  selected_options: number[]
  explanation: string | null
  pairs?: Record<number, number> // Pares para preguntas de coincidencia: { [leftOptionId]: rightOptionId }
  order?: number[] // Orden para preguntas de ordenación: array de IDs de opciones en el orden seleccionado
}
