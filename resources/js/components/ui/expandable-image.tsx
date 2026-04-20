import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import React, { ImgHTMLAttributes, useState } from 'react';

interface ExpandableImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  expandable?: boolean;
  showDialog?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
}

export const ExpandableImage: React.FC<ExpandableImageProps> = ({
  src,
  alt,
  className = '',
  expandable = true,
  showDialog: controlledShowDialog,
  onDialogOpenChange,
  ...props
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled showDialog if provided, otherwise use internal state
  const open = controlledShowDialog !== undefined ? controlledShowDialog : internalOpen;
  const setOpen = onDialogOpenChange || setInternalOpen;

  const imageContent = (
    <img
      src={src}
      alt={alt}
      className={cn(
        'w-full h-full object-cover transition-transform duration-300',
        expandable && 'hover:scale-105 cursor-pointer',
        !expandable && 'cursor-default',
        className
      )}
      {...props}
    />
  );

  const modalImageContent = (
    <img
      src={src}
      alt={alt}
      className="max-w-[88vw] max-h-[88vh] object-contain sm:max-w-[78vw] sm:max-h-[78vh]"
    />
  );

  if (!expandable) {
    return imageContent;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {imageContent}
      </DialogTrigger>
      <DialogContent className="!max-w-fit !max-h-fit p-0 overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center bg-black/50">
          {modalImageContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpandableImage;
