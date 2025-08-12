import FlashMessages from '@/components/organisms/flash-messages'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import { formatDate, formatDateTime, formatTimeDifference } from '@/lib/formats'
import { useTranslations } from '@/lib/translator'
import { BreadcrumbItem } from '@/types/core'
import { LearningSession } from '@/types/learning-session'
import { Head } from '@inertiajs/react'
import { AlertCircle, Award, CheckCircle, Clock, Medal, Trophy, XCircle } from 'lucide-react'
import { useMemo } from 'react'

type PageProps = {
  learning_session: LearningSession
}

export default function LearningSessionShow({ learning_session }: PageProps) {
  const { t } = useTranslations()

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Inicio',
      href: '/teacher/dashboard'
    },
    {
      title: t('Learning Sessions'),
      href: '/teacher/learning-sessions'
    },
    {
      title: learning_session.name,
      href: '/teacher/learning-sessions/' + learning_session.id
    }
  ]

  // Ordenar las respuestas por puntuación (descendente) y luego por fecha de envío (ascendente)
  const sortedResponses = useMemo(() => {
    if (!learning_session.application_form?.responses) return []

    return [...learning_session.application_form.responses].sort((a, b) => {
      const scoreA = parseFloat(String(a.score) || '0')
      const scoreB = parseFloat(String(b.score) || '0')

      // Primero ordenar por puntuación (descendente)
      if (scoreA !== scoreB) {
        return scoreB - scoreA
      }

      // Si las puntuaciones son iguales, ordenar por fecha de envío (ascendente)
      // Los que enviaron primero aparecen primero
      if (a.submitted_at && b.submitted_at) {
        return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
      }

      // Si uno tiene submitted_at y otro no, el que lo envió va primero
      if (a.submitted_at && !b.submitted_at) return -1
      if (!a.submitted_at && b.submitted_at) return 1

      // Si ninguno tiene submitted_at, mantener orden original
      return 0
    })
  }, [learning_session.application_form?.responses])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className='h-4 w-4 text-green-500' />
      case 'graded':
        return <Award className='h-4 w-4 text-blue-500' />
      case 'pending':
        return <AlertCircle className='h-4 w-4 text-yellow-500' />
      default:
        return <XCircle className='h-4 w-4 text-gray-400' />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      submitted: 'default',
      graded: 'secondary',
      pending: 'outline'
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{t(status)}</Badge>
  }

  const getRankingIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className='h-5 w-5 text-yellow-500' />
      case 1:
        return <Medal className='h-5 w-5 text-gray-400' />
      case 2:
        return <Award className='h-5 w-5 text-amber-600' />
      default:
        return <span className='text-sm font-semibold text-gray-500'>#{index + 1}</span>
    }
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return 'text-green-600 font-bold'
    if (percentage >= 70) return 'text-blue-600 font-semibold'
    if (percentage >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Verificar si la ficha está activa y tiene respuestas
  const hasApplicationForm = !!learning_session.application_form
  const hasResponses = hasApplicationForm && (learning_session.application_form?.responses?.length ?? 0) > 0
  const maxScore = hasApplicationForm ? parseFloat(String(learning_session?.application_form?.score_max || '20')) : 20

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('Learning Session')} />
      <FlashMessages />

      <div className='flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6'>
        {/* Información de la sesión */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Award className='h-5 w-5' />
              {learning_session.name}
            </CardTitle>
            <div className='text-sm text-gray-600'>
              <p>
                <strong>Área curricular:</strong>{' '}
                {learning_session.teacher_classroom_curricular_area_cycle?.curricular_area_cycle?.curricular_area?.name}
              </p>
              <p>
                <strong>Grado:</strong> {t(learning_session.teacher_classroom_curricular_area_cycle?.classroom?.grade)} Sección{' '}
                {learning_session.teacher_classroom_curricular_area_cycle?.classroom?.section} -{' '}
                {t(learning_session.teacher_classroom_curricular_area_cycle?.classroom?.level)}
              </p>
              <p>
                <strong>Fecha de aplicación:</strong> {formatDateTime(String(learning_session.application_date))}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Estado de la ficha de aplicación */}
        {hasApplicationForm ? (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <CheckCircle className='h-5 w-5 text-green-500' />
                Ficha de Evaluación: {learning_session.application_form?.name}
              </CardTitle>
              <div className='flex gap-4 text-sm'>
                <span>
                  Puntuación máxima: <strong>{learning_session.application_form?.score_max} pts</strong>
                </span>
                <span>
                  Estado: <Badge variant='default'>{learning_session.application_form?.status}</Badge>
                </span>
                <span>
                  Período: {formatDate(String(learning_session?.application_form?.start_date || ''))} -{' '}
                  {formatDate(String(learning_session?.application_form?.end_date || ''))}
                </span>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center text-gray-500'>
                <AlertCircle className='mx-auto mb-2 h-8 w-8' />
                <p>No hay ficha de evaluación asociada a esta sesión de aprendizaje.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabla de puntuaciones */}
        {hasResponses ? (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Trophy className='h-5 w-5' />
                Tabla de Puntuaciones
              </CardTitle>
              <p className='text-sm text-gray-600'>Ordenado por puntuación (mayor a menor) y fecha de envío (primero en enviar)</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-16'>Puesto</TableHead>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Puntuación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de inicio</TableHead>
                    <TableHead>Fecha de Envío</TableHead>
                    <TableHead>Fecha de Calificación</TableHead>
                    <TableHead className='w-24'>Tiempo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedResponses.map((response, index) => {
                    const score = Number(response.score)
                    const scorePercentage = ((score / maxScore) * 100).toFixed(1)

                    return (
                      <TableRow key={response.id} className={index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''}>
                        <TableCell>
                          <div className='flex items-center justify-center'>{getRankingIcon(index)}</div>
                        </TableCell>
                        <TableCell>
                          <div className='font-medium'>
                            {`${response.student.profile?.first_name} ${response.student.profile?.last_name} ${response.student.profile?.second_last_name}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex flex-col'>
                            <span className={`text-lg font-bold ${getScoreColor(score, maxScore)}`}>{score.toFixed(2)}</span>
                            <span className='text-xs text-gray-500'>
                              {scorePercentage}% de {maxScore}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            {getStatusIcon(response.status)}
                            {getStatusBadge(response.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            {response.started_at && <Clock className='h-4 w-4 text-gray-400' />}
                            <span className={response.started_at ? 'text-green-600' : 'text-gray-400'}>{formatDateTime(response.started_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            {response.submitted_at && <Clock className='h-4 w-4 text-gray-400' />}
                            <span className={response.submitted_at ? 'text-green-600' : 'text-gray-400'}>
                              {formatDateTime(response.submitted_at)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={response.graded_at ? 'text-blue-600' : 'text-gray-400'}>{formatDateTime(response.graded_at)}</span>
                        </TableCell>
                        <TableCell>
                          {response.submitted_at && response.started_at && (
                            <Badge variant='outline' className='text-xs'>
                              {formatTimeDifference(response.started_at, response.submitted_at)}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {/* Estadísticas resumen */}
              <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded-lg bg-blue-50 p-4 text-center'>
                  <div className='text-2xl font-bold text-blue-600'>{sortedResponses.length}</div>
                  <div className='text-sm text-gray-600'>Total de Respuestas</div>
                </div>
                <div className='rounded-lg bg-green-50 p-4 text-center'>
                  <div className='text-2xl font-bold text-green-600'>{sortedResponses.filter((r) => r.status === 'submitted').length}</div>
                  <div className='text-sm text-gray-600'>Enviadas</div>
                </div>
                <div className='rounded-lg bg-yellow-50 p-4 text-center'>
                  <div className='text-2xl font-bold text-yellow-600'>
                    {sortedResponses.length > 0
                      ? (sortedResponses.reduce((sum, r) => sum + parseFloat(String(r.score || '0')), 0) / sortedResponses.length).toFixed(2)
                      : '0'}
                  </div>
                  <div className='text-sm text-gray-600'>Promedio</div>
                </div>
                <div className='rounded-lg bg-purple-50 p-4 text-center'>
                  <div className='text-2xl font-bold text-purple-600'>
                    {sortedResponses.length > 0 ? Math.max(...sortedResponses.map((r) => parseFloat(String(r.score || '0')))).toFixed(2) : '0'}
                  </div>
                  <div className='text-sm text-gray-600'>Mejor Puntuación</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : hasApplicationForm ? (
          <Card>
            <CardContent className='pt-6'>
              <div className='text-center text-gray-500'>
                <Clock className='mx-auto mb-2 h-8 w-8' />
                <p>Aún no hay respuestas de estudiantes para esta ficha de evaluación.</p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AppLayout>
  )
}
