import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Theme } from '../types';

interface CursorLightProps {
  theme: Theme;
}

export const CursorLight: React.FC<CursorLightProps> = ({ theme }) => {
  const [hasMouse, setHasMouse] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClicking, setIsClicking] = useState<boolean>(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Smooth springs for natural fluid motion behind cursor
  // Aura spring: soft and organic trailing
  const auraSpringX = useSpring(mouseX, { damping: 30, stiffness: 320, mass: 0.6 });
  const auraSpringY = useSpring(mouseY, { damping: 30, stiffness: 320, mass: 0.6 });

  // Core spring: agile and tightly coupled to the cursor tip
  const coreSpringX = useSpring(mouseX, { damping: 25, stiffness: 600, mass: 0.15 });
  const coreSpringY = useSpring(mouseY, { damping: 25, stiffness: 600, mass: 0.15 });

  useEffect(() => {
    // Only mount on devices with a mouse/trackpad cursor
    if (typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    setHasMouse(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!hasMouse) return null;

  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[2] overflow-hidden transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Outer Soft Diffuse Aura (Illuminates & glows broadly through frosted glass elements) */}
      <motion.div
        style={{
          x: auraSpringX,
          y: auraSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 1.25 : 1,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
        className={`absolute rounded-full pointer-events-none will-change-transform ${
          isDark
            ? 'w-[320px] h-[320px] blur-[35px]'
            : 'w-[300px] h-[300px] blur-[32px]'
        }`}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(53, 208, 127, 0.42) 0%, rgba(16, 185, 129, 0.22) 32%, rgba(0, 113, 227, 0.1) 60%, transparent 75%)'
              : 'radial-gradient(circle, rgba(53, 208, 127, 0.38) 0%, rgba(16, 185, 129, 0.22) 35%, rgba(14, 165, 233, 0.08) 60%, transparent 75%)',
          }}
        />
      </motion.div>

      {/* Small Luminous Core (Right behind the cursor tip) */}
      <motion.div
        style={{
          x: coreSpringX,
          y: coreSpringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        className={`absolute rounded-full pointer-events-none will-change-transform ${
          isDark
            ? 'w-[52px] h-[52px] blur-[7px]'
            : 'w-[46px] h-[46px] blur-[6px]'
        }`}
      >
        <div
          className="w-full h-full rounded-full shadow-[0_0_20px_rgba(53,208,127,0.8)]"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(53, 208, 127, 0.9) 35%, rgba(53, 208, 127, 0.4) 65%, transparent 100%)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(53, 208, 127, 0.85) 40%, rgba(16, 185, 129, 0.35) 70%, transparent 100%)',
          }}
        />
      </motion.div>
    </div>
  );
};
