import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export type ImageAutoSliderProps = {
  images: string[];
  /** Loop duration in seconds */
  durationSeconds?: number;
  className?: string;
  imageAltPrefix?: string;
};

/** Infinite horizontal auto-scroll gallery (21st.dev pattern, Tailwind). */
export function ImageAutoSlider({
  images,
  durationSeconds = 28,
  className,
  imageAltPrefix = 'Gallery image',
}: ImageAutoSliderProps) {
  if (images.length === 0) return null;

  const duplicatedImages = [...images, ...images];

  return (
    <div className={cn('w-full', className)}>
      <div
        className="ur-scroll-mask w-full max-w-6xl mx-auto"
        style={
          {
            ['--ur-scroll-duration' as string]: `${durationSeconds}s`,
          } as CSSProperties
        }
      >
        <div className="ur-infinite-scroll flex gap-5 md:gap-6 w-max">
          {duplicatedImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="ur-image-item shrink-0 w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-xl overflow-hidden shadow-lg ring-1 ring-[#3d1414]/10"
            >
              <img
                src={image}
                alt={`${imageAltPrefix} ${(index % images.length) + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Demo export name from 21st.dev scaffold */
export const Component = ImageAutoSlider;
