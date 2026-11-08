import { ImageAutoSlider } from '@/components/ui/image-auto-slider';
import { cn } from '@/lib/utils';

const CAFE_COUNT = 15;

function cafeImageUrls(basePath = 'assets/cafes'): string[] {
  return Array.from({ length: CAFE_COUNT }, (_, i) => {
    const name = `cafe ${i + 1}.jpg`.replace(/ /g, '%20');
    return `${basePath}/${name}`;
  });
}

export type CafesCollaboratedSliderProps = {
  /** Public URL prefix for cafe JPEGs (no trailing slash) */
  imageBasePath?: string;
  className?: string;
};

export function CafesCollaboratedSlider({
  imageBasePath = 'assets/cafes',
  className,
}: CafesCollaboratedSliderProps) {
  const images = cafeImageUrls(imageBasePath);

  return (
    <section
      id="cafes"
      className={cn(
        'ur-cafes-section w-full py-12 md:py-16 px-4 md:px-8',
        className
      )}
      aria-labelledby="cafes-title"
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <h2
            id="cafes-title"
            className="text-2xl md:text-3xl font-medium tracking-tight text-[#3d1414]"
          >
            Cafes collaborated <span className="text-[#a35f4d]">so far</span>
          </h2>
          <p className="text-sm text-[#5c2a2a]/80 max-w-xs sm:text-right">
            Venues that hosted our singalongs — auto-scrolling gallery
          </p>
        </header>
        <ImageAutoSlider
          images={images}
          durationSeconds={32}
          imageAltPrefix="Partner cafe"
        />
      </div>
    </section>
  );
}
