import { ImgHTMLAttributes } from 'react'
import Image from './ui/image'

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
  return <Image src='/logo.png' alt='Logo' {...props} />
}
