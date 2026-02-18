'use client';

import { useRef, PropsWithChildren } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';

gsap.registerPlugin(ScrollTrigger);

type Direction =
  | 'top-to-bottom'
  | 'bottom-to-top'
  | 'left-to-right'
  | 'right-to-left';

type Variant = 'slide' | 'wipe' | 'fade';

type Props = {
  /** Slide distance (slide) or hidden amount (wipe). Accepts px or % */
  distance?: string | number;         // default '100%'
  direction?: Direction;              // default 'top-to-bottom'
  variant?: Variant;                  // default 'slide'
  duration?: number;                  // default 1.0
  ease?: string;                      // default 'power3.out'
  start?: string;                     // default 'top 80%'
  end?: string;                       // default 'top 30%'
  scrub?: boolean;                    // default false
  once?: boolean;                     // default true
  className?: string;                 // classes on the wrapper
  /** If the wrapped thing is inline text, add display:inline-block to avoid layout jumps */
  inline?: boolean;                   // default false
};

export default function DirectionalReveal({
  children,
  distance = '100%',
  direction = 'top-to-bottom',
  variant = 'slide',
  duration = 1.0,
  ease = 'power3.out',
  start = 'top 80%',
  end = 'top 30%',
  scrub = false,
  once = true,
  className,
  inline = false,
}: PropsWithChildren<Props>) {
  const containerRef = useRef<HTMLDivElement>(null); // trigger
  const targetRef = useRef<HTMLDivElement>(null);    // animated element

  const toClip = 'inset(0% 0% 0% 0%)';

  const fromValuesFor = (
    v: Variant,
    dir: Direction,
    distIn: string | number
  ) => {
    if (v === 'fade') return { opacity: 0, y: 0, x: 0 };

    if (v === 'wipe') {
      switch (dir) {
        case 'top-to-bottom':    return { clipPath: 'inset(100% 0% 0% 0%)' };
        case 'bottom-to-top':    return { clipPath: 'inset(0% 0% 100% 0%)' };
        case 'left-to-right':    return { clipPath: 'inset(0% 100% 0% 0%)' };
        case 'right-to-left':    return { clipPath: 'inset(0% 0% 0% 100%)' };
      }
    }

    // slide
    const dist = typeof distIn === 'number' ? `${distIn}px` : distIn;
    switch (dir) {
      case 'top-to-bottom':   return { y: `-${dist}`, opacity: 0 };
      case 'bottom-to-top':   return { y: dist, opacity: 0 };
      case 'left-to-right':   return { x: `-${dist}`, opacity: 0 };
      case 'right-to-left':   return { x: dist, opacity: 0 };
    }
  };

  const toValuesFor = (v: Variant) => {
    if (v === 'wipe') return { clipPath: toClip };
    if (v === 'fade') return { opacity: 1 };
    return { x: 0, y: 0, opacity: 1 };
  };

  useGSAP(
    () => {
      if (!targetRef.current || !containerRef.current) return;

      if (variant === 'wipe') {
        targetRef.current.style.willChange = 'clip-path';
      } else if (variant === 'slide') {
        targetRef.current.style.willChange = 'transform, opacity';
      } else {
        targetRef.current.style.willChange = 'opacity';
      }

      const anim = gsap.fromTo(
        targetRef.current,
        fromValuesFor(variant, direction, distance)!,
        {
          ...toValuesFor(variant),
          duration,
          ease,
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            end,
            scrub,
            once,
          },
        }
      );

      return () => {
        anim?.scrollTrigger?.kill();
        anim?.kill();
      };
    },
    { scope: containerRef, dependencies: [direction, distance, variant, duration, ease, start, end, scrub, once] }
  );

  return (
    <div ref={containerRef} className={clsx('relative', className)}>
      <div
        ref={targetRef}
        className={clsx(inline ? 'inline-block' : undefined)}
        style={variant === 'wipe' ? { overflow: 'hidden' } : undefined}
      >
        {children}
      </div>
    </div>
  );
} 