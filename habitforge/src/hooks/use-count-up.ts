'use client';

import { useState, useEffect, useRef } from 'react';

export function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isActive = true;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = timestamp - startTime.current;
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === duration ? 1 : 1 - Math.pow(2, -10 * progress / duration);
      
      const currentCount = Math.min(Math.floor(easeProgress * end), end);
      
      if (isActive && countRef.current !== currentCount) {
        setCount(currentCount);
        countRef.current = currentCount;
      }

      if (progress < duration && isActive) {
        animationFrameId = requestAnimationFrame(animate);
      } else if (isActive) {
          setCount(end);
      }
    };

    if (end > 0) {
        startTime.current = null;
        animationFrameId = requestAnimationFrame(animate);
    } else {
        setCount(end);
    }

    return () => {
      isActive = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);

  return count;
}
