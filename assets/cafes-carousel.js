/**
 * Cafes carousel — GSAP swipe + snap (home page only).
 */
(function initCafesCarousel() {
  const section = document.getElementById('cafes');
  if (!section) return;

  const ready = () => {
    if (!window.gsap || !window.Draggable) {
      requestAnimationFrame(ready);
      return;
    }
    run();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }

  function run() {
    const { gsap, Draggable } = window;
    gsap.registerPlugin(Draggable);

    const track = section.querySelector('.cafes-carousel__track');
    const viewport = section.querySelector('.cafes-carousel__viewport');
    const slides = gsap.utils.toArray('.cafes-carousel__slide', section);
    const btnPrev = section.querySelector('.cafes-carousel__btn--prev');
    const btnNext = section.querySelector('.cafes-carousel__btn--next');
    const currentEl = section.querySelector('.cafes-carousel__current');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!track || slides.length === 0) return;

    let index = 0;
    let step = 0;
    let draggable;

    function measure() {
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      step = slides[0].offsetWidth + gap;
    }

    function setX(x, animate) {
      return new Promise((resolve) => {
        if (!animate || reduced) {
          gsap.set(track, { x });
          resolve();
          return;
        }
        gsap.to(track, {
          x,
          duration: 0.78,
          ease: 'power3.inOut',
          overwrite: 'auto',
          onComplete: () => {
            draggable?.update();
            resolve();
          },
        });
      });
    }

    function updateFocus() {
      slides.forEach((slide, i) => {
        const active = i === index;
        if (reduced) {
          slide.style.opacity = active ? '1' : '0.5';
          slide.style.transform = '';
          return;
        }
        gsap.to(slide, {
          scale: active ? 1 : 0.94,
          opacity: active ? 1 : 0.62,
          duration: 0.55,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
      currentEl.textContent = String(index + 1);
    }

    function goTo(nextIndex, { animate = true } = {}) {
      index = gsap.utils.wrap(0, slides.length, nextIndex);
      const x = -index * step;
      if (draggable) draggable.disable();
      const done = () => {
        updateFocus();
        if (draggable) {
          gsap.set(track, { x });
          draggable.update();
          draggable.enable();
        }
      };
      if (animate && !reduced) {
        setX(x, true).then(done);
      } else {
        gsap.set(track, { x });
        done();
      }
    }

    function bindDraggable() {
      if (draggable) draggable.kill();
      measure();
      const maxX = 0;
      const minX = -(slides.length - 1) * step;

      if (reduced) {
        gsap.set(track, { x: 0 });
        updateFocus();
        return;
      }

      draggable = Draggable.create(track, {
        type: 'x',
        edgeResistance: 0.72,
        bounds: { minX, maxX },
        inertia: false,
        allowContextMenu: true,
        onPress() {
          viewport.classList.add('is-dragging');
        },
        onDrag() {
          const rough = Math.round(-this.x / step);
          const preview = gsap.utils.clamp(0, slides.length - 1, rough);
          if (preview !== index) {
            slides.forEach((slide, i) => {
              gsap.set(slide, {
                opacity: i === preview ? 0.85 : 0.55,
                scale: i === preview ? 0.98 : 0.92,
              });
            });
          }
        },
        onRelease() {
          viewport.classList.remove('is-dragging');
          const snapIndex = gsap.utils.clamp(
            0,
            slides.length - 1,
            Math.round(-this.x / step)
          );
          index = snapIndex;
          gsap.to(track, {
            x: -index * step,
            duration: 0.68,
            ease: 'power3.out',
            overwrite: 'auto',
            onComplete: () => {
              this.update();
              updateFocus();
            },
          });
        },
      })[0];
    }

    measure();
    gsap.set(track, { x: 0, transformOrigin: 'center center' });
    bindDraggable();
    updateFocus();

    btnPrev?.addEventListener('click', () => goTo(index - 1));
    btnNext?.addEventListener('click', () => goTo(index + 1));

    section.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(index - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(index + 1);
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        goTo(index, { animate: false });
        bindDraggable();
      }, 120);
    });
  }
})();
