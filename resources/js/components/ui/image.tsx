import React from 'react';
import { ImgHTMLAttributes } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className = '',
  ...props
}) => {
  return (
    <img 
      src={src} 
      alt={alt}
      className={`object-cover ${className}`}
      {...props}
    />
  );
};

export default Image;
