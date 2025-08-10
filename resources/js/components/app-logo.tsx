import { memo } from 'react'
import AppLogoIcon from './app-logo-icon'

const AppLogo = memo(function AppLogo() {
  return (
    <>
      <div className='flex aspect-square size-12 items-center justify-center rounded-md'>
        <AppLogoIcon className='object-contain' />
      </div>
      <div className='ml-1 grid flex-1 text-left text-sm'>
        <span className='mb-0.5 truncate leading-tight font-semibold'>JULIO C. TELLO</span>
      </div>
    </>
  )
})

export default AppLogo
