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

  return (
    <div className='flex-1'>
      <div className='rounded-xl border border-green-300 bg-green-50 p-4 shadow-sm'>
        <div className='mb-1 text-sm font-medium text-gray-600'>Nivel actual</div>
        <div className='mb-2 flex items-center space-x-2'>
          <div className='text-3xl font-bold text-green-700'>{progress.nivel_actual}</div>
          <span className='rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-900'>{progress.progress_percent}% completado</span>
        </div>

        <div className='mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200'>
          <div
            className='h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-in-out'
            style={{ width: `${progress.progress_percent}%` }}
          ></div>
        </div>

        <div className='flex justify-between text-xs text-gray-600'>
          <span>XP: {Number(progress.experience_achieved).toFixed(0)}</span>
          <span>Objetivo: {Number(progress.experience_required).toFixed(0)}</span>
          <span>Máx: {Number(progress.experience_max).toFixed(0)}</span>
        </div>
      </div>
    </div>
  )
}
