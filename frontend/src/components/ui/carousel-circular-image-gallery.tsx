import { useCallback, useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(MotionPathPlugin);

export interface ImageData {
  title: string;
  url: string;
}

export type ImageGalleryProps = {
  images: ImageData[];
  className?: string;
};

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [opened, setOpened] = useState(0);
  const [inPlace, setInPlace] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const autoplayTimer = useRef<number | null>(null);

  const onClick = (index: number) => {
    if (!disabled) setOpened(index);
  };

  const onInPlace = (index: number) => setInPlace(index);

  const next = useCallback(() => {
    setOpened((currentOpened) => {
      let nextIndex = currentOpened + 1;
      if (nextIndex >= images.length) nextIndex = 0;
      return nextIndex;
    });
  }, [images.length]);

  const prev = useCallback(() => {
    setOpened((currentOpened) => {
      let prevIndex = currentOpened - 1;
      if (prevIndex < 0) prevIndex = images.length - 1;
      return prevIndex;
    });
  }, [images.length]);

  useEffect(() => setDisabled(true), [opened]);
  useEffect(() => setDisabled(false), [inPlace]);

  useEffect(() => {
    if (images.length === 0) return;
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    autoplayTimer.current = window.setInterval(next, 4500);
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [opened, images.length, next]);

  if (images.length === 0) {
    return <p className="text-center text-[#5c2a2a]">No gallery images yet.</p>;
  }

  const navBtnClass =
    'z-[101] flex h-14 w-14 sm:h-16 sm:w-16 cursor-pointer items-center justify-center rounded-full border-2 border-[#3d1414]/15 bg-[#faf3ed]/95 backdrop-blur-sm shadow-lg outline-none transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95 focus-visible:ring-4 focus-visible:ring-[#a35f4d]/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 text-[#3d1414]';

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center gap-6 px-3 sm:px-6',
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full min-h-[min(56vw,72vh)] max-h-[min(85vh,900px)] overflow-hidden rounded-none sm:rounded-[20px] shadow-[0_2.8px_2.2px_rgba(0,0,0,0.02),0_6.7px_5.3px_rgba(0,0,0,0.028),0_12.5px_10px_rgba(0,0,0,0.035),0_22.3px_17.9px_rgba(0,0,0,0.042),0_41.8px_33.4px_rgba(0,0,0,0.05),0_100px_80px_rgba(0,0,0,0.07)] ring-0 sm:ring-1 sm:ring-[#3d1414]/10">
        {images.map((image, i) => (
          <div
            key={`${image.url}-${i}`}
            className="absolute left-0 top-0 h-full w-full"
            style={{ zIndex: inPlace === i ? i : images.length + 1 }}
          >
            <GalleryImage
              total={images.length}
              id={i}
              url={image.url}
              title={image.title}
              open={opened === i}
              inPlace={inPlace === i}
              onInPlace={onInPlace}
            />
          </div>
        ))}
        <div className="pointer-events-none absolute left-0 top-0 z-[100] h-full w-full">
          <Tabs images={images} onSelect={onClick} />
        </div>
      </div>

      <div className="flex w-full max-w-[min(100vw,1200px)] items-center justify-between gap-4 px-2">
        <button type="button" className={navBtnClass} onClick={prev} disabled={disabled} aria-label="Previous image">
          <ChevronLeft className="h-7 w-7" strokeWidth={2} />
        </button>
        <p className="m-0 text-center text-sm text-[#5c2a2a]">
          <span className="font-medium text-[#3d1414]">{images[opened]?.title}</span>
          <span className="mx-2 opacity-40">·</span>
          {opened + 1} / {images.length}
        </p>
        <button type="button" className={navBtnClass} onClick={next} disabled={disabled} aria-label="Next image">
          <ChevronRight className="h-7 w-7" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

interface GalleryImageProps {
  url: string;
  title: string;
  open: boolean;
  inPlace: boolean;
  id: number;
  onInPlace: (id: number) => void;
  total: number;
}

function GalleryImage({ url, title, open, inPlace, id, onInPlace, total }: GalleryImageProps) {
  const firstLoad = useRef(true);
  const clip = useRef<SVGCircleElement>(null);
  const uid = useId().replace(/:/g, '');
  const circleClipId = `${uid}_circleClip_${id}`;
  const squareClipId = `${uid}_squareClip_${id}`;

  const gap = total > 12 ? 6 : 10;
  const circleRadius = total > 12 ? 5 : 7;
  const defaults = { transformOrigin: 'center center' };
  const duration = 0.4;
  const width = 400;
  const height = 400;
  const scale = 700;
  const bigSize = circleRadius * scale;
  const overlap = 0;

  const getPosSmall = () => ({
    cx: width / 2 - (total * (circleRadius * 2 + gap) - gap) / 2 + id * (circleRadius * 2 + gap),
    cy: height - 30,
    r: circleRadius,
  });
  const getPosSmallAbove = () => ({
    cx: width / 2 - (total * (circleRadius * 2 + gap) - gap) / 2 + id * (circleRadius * 2 + gap),
    cy: height / 2,
    r: circleRadius * 2,
  });
  const getPosCenter = () => ({ cx: width / 2, cy: height / 2, r: circleRadius * 7 });
  const getPosEnd = () => ({ cx: width / 2 - bigSize + overlap, cy: height / 2, r: bigSize });
  const getPosStart = () => ({ cx: width / 2 + bigSize - overlap, cy: height / 2, r: bigSize });

  useEffect(() => {
    if (!clip.current) return;

    const isFirst = firstLoad.current;
    const flipDuration = isFirst ? 0 : duration;
    const upDuration = isFirst ? 0 : 0.2;
    const bounceDuration = isFirst ? 0.01 : 1;
    const delay = isFirst ? 0 : flipDuration + upDuration;

    if (open) {
      gsap
        .timeline()
        .set(clip.current, { ...defaults, ...getPosSmall() })
        .to(clip.current, {
          ...defaults,
          ...getPosCenter(),
          duration: upDuration,
          ease: 'power3.inOut',
        })
        .to(clip.current, {
          ...defaults,
          ...getPosEnd(),
          duration: flipDuration,
          ease: 'power4.in',
          onComplete: () => onInPlace(id),
        });
    } else {
      gsap
        .timeline({ overwrite: true })
        .set(clip.current, { ...defaults, ...getPosStart() })
        .to(clip.current, {
          ...defaults,
          ...getPosCenter(),
          delay,
          duration: flipDuration,
          ease: 'power4.out',
        })
        .to(clip.current, {
          ...defaults,
          motionPath: {
            path: [getPosSmallAbove(), getPosSmall()],
            curviness: 1,
          },
          duration: bounceDuration,
          ease: 'bounce.out',
        });
    }

    if (isFirst) firstLoad.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animation keyed on open/id/total
  }, [open]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      role="img"
      aria-label={title}
    >
      <defs>
        <clipPath id={circleClipId}>
          <circle className="clip" cx="0" cy="0" r={circleRadius} ref={clip} />
        </clipPath>
        <clipPath id={squareClipId}>
          <rect className="clip" width={width} height={height} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${inPlace ? squareClipId : circleClipId})`}>
        <image width={width} height={height} href={url} className="pointer-events-none" preserveAspectRatio="xMidYMid slice" />
      </g>
    </svg>
  );
}

interface TabsProps {
  images: ImageData[];
  onSelect: (index: number) => void;
}

function Tabs({ images, onSelect }: TabsProps) {
  const gap = images.length > 12 ? 6 : 10;
  const circleRadius = images.length > 12 ? 5 : 7;
  const width = 400;
  const height = 400;

  const getPosX = (i: number) =>
    width / 2 - (images.length * (circleRadius * 2 + gap) - gap) / 2 + i * (circleRadius * 2 + gap);
  const getPosY = () => height - 30;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
    >
      {images.map((image, i) => (
        <g key={`${image.url}-tab-${i}`} className="pointer-events-auto">
          <defs>
            <clipPath id={`tab_${i}_clip`}>
              <circle cx={getPosX(i)} cy={getPosY()} r={circleRadius} />
            </clipPath>
          </defs>
          <image
            x={getPosX(i) - circleRadius}
            y={getPosY() - circleRadius}
            width={circleRadius * 2}
            height={circleRadius * 2}
            href={image.url}
            clipPath={`url(#tab_${i}_clip)`}
            className="pointer-events-none"
            preserveAspectRatio="xMidYMid slice"
          />
          <circle
            onClick={() => onSelect(i)}
            className="cursor-pointer fill-white/0 stroke-white/70 transition-all hover:stroke-white"
            strokeWidth="2"
            cx={getPosX(i)}
            cy={getPosY()}
            r={circleRadius + 2}
          />
        </g>
      ))}
    </svg>
  );
}
