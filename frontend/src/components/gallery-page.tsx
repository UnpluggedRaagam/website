import { ImageGallery } from '@/components/ui/carousel-circular-image-gallery';
import { galleryImages } from '@/data/gallery-images';

export function GalleryPage() {
  return (
    <section
      id="board"
      className="ur-gallery-page w-full bg-[#faf3ed] py-12 md:py-16"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto flex w-full flex-col items-stretch gap-10">
        <header className="mx-auto max-w-2xl px-4 text-center">
          <h1
            id="gallery-heading"
            className="text-2xl font-medium tracking-tight text-[#3d1414] md:text-3xl"
          >
            Moments from <span className="text-[#a35f4d]">Unplugged Raagam</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#5c2a2a]/85 md:text-base">
            Tap a circle below the frame, use the arrows, or wait for autoplay — snapshots from our
            singalongs and jam nights.
          </p>
        </header>
        <ImageGallery images={[...galleryImages]} className="w-full max-w-none" />
      </div>
    </section>
  );
}
