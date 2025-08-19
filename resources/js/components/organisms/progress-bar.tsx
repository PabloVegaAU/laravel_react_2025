import { useUserStore } from '@/store/useUserStore'
import { SharedData } from '@/types/core'
import { usePage } from '@inertiajs/react'
import { useQuery } from '@tanstack/react-query'

export default function ProgressBar() {
  const { auth } = usePage<SharedData>().props
  const { progress, setProgress } = useUserStore() // Ensure setProgress is available in the store

  const progressQuery = useQuery({
    queryKey: ['progress', auth.user?.id],
    queryFn: () => progressRes(),
    enabled: !!auth.user?.id // Only run the query if user ID exists
  })

  const progressRes = async () => {
    const response = await fetch('/api/studentprogressbar', {
      method: 'POST',
      body: JSON.stringify({ p_user_id: Number(auth.user?.id) }),
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json()
    if (data.success && data.data?.length > 0) {
      setProgress(data.data[0]) // Update the store with the fetched data
      return data.data[0] // Return the data for useQuery
    }
    return null // Return null if no data is found
  }

  // Optional: Handle loading and error states
  if (progressQuery.isLoading) {
    return <div>Loading progress...</div>
  }

  if (progressQuery.isError) {
    return <div>Error loading progress.</div>
  }

  // Función para obtener las clases de color según el porcentaje
  const getProgressColorClass = (percent: number) => {
    if (percent < 20) return 'from-red-400 to-red-600';
    if (percent < 40) return 'from-orange-400 to-orange-600';
    if (percent < 60) return 'from-yellow-400 to-yellow-600';
    if (percent < 80) return 'from-blue-400 to-blue-600';
    return 'from-green-400 to-green-600';
  };

  const progressColorClass = getProgressColorClass(progress.progress_percent);
  const bgColorClass = progressColorClass.includes('red') ? 'bg-red-50 border-red-300' : 
                      progressColorClass.includes('orange') ? 'bg-orange-50 border-orange-300' :
                      progressColorClass.includes('yellow') ? 'bg-yellow-50 border-yellow-300' :
                      progressColorClass.includes('blue') ? 'bg-blue-50 border-blue-300' :
                      'bg-green-50 border-green-300';
  const textColorClass = progressColorClass.includes('red') ? 'text-red-700' :
                        progressColorClass.includes('orange') ? 'text-orange-700' :
                        progressColorClass.includes('yellow') ? 'text-yellow-700' :
                        progressColorClass.includes('blue') ? 'text-blue-700' :
                        'text-green-700';
  const badgeBgClass = progressColorClass.includes('red') ? 'bg-red-200 text-red-900' :
                      progressColorClass.includes('orange') ? 'bg-orange-200 text-orange-900' :
                      progressColorClass.includes('yellow') ? 'bg-yellow-200 text-yellow-900' :
                      progressColorClass.includes('blue') ? 'bg-blue-200 text-blue-900' :
                      'bg-green-200 text-green-900';

  return (
    <div className='flex-1'>
      <div className={`rounded-xl border p-4 shadow-sm ${bgColorClass}`}>
        <div className='mb-1 text-sm font-medium text-gray-600'>Nivel actual</div>
        <div className='mb-2 flex items-center space-x-2'>
          <div className={`text-3xl font-bold ${textColorClass}`}>{progress.nivel_actual}</div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeBgClass}`}>
            {progress.progress_percent}% completado
          </span>
        </div>

        <div className='mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200'>
          <div
            className={`h-full bg-gradient-to-r transition-all duration-700 ease-in-out ${progressColorClass}`}
            style={{ width: `${progress.progress_percent}%` }}
          ></div>
        </div>

        <div className='flex justify-between text-xs text-gray-600'>
          <span>XP: {Number(progress.experience_achieved).toFixed(0)}</span>
          <span>Máx: {Number(progress.experience_max).toFixed(0)}</span>
        </div>
      </div>
    </div>
  )
}
