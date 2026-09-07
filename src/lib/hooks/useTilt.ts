'use client';

import React from 'react';
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';

interface Options {
  maxTilt?: number;
}

export function useTilt({ maxTilt = 18 }: Options = {}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const config = { stiffness: 180, damping: 20, mass: 0.6 };
  const springX = useSpring(pointerX, config);
  const springY = useSpring(pointerY, config);

  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced) return;

    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();

    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return {
    ref,
    prefersReduced,
    handlers: { onPointerMove, onPointerLeave },
    style: prefersReduced ? {} : { rotateX, rotateY },
    glare: { x: glareX, y: glareY },
  };
}
