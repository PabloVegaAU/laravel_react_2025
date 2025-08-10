import { ImgHTMLAttributes, memo } from 'react'
import Image from './ui/image'

const AppLogoIcon = memo(function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
  return <Image src='/logo.png' alt='Logo' decoding='async' loading='eager' {...props} />
})

export default AppLogoIcon
