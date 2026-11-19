import React from 'react';

/**
 * Invisible SVG gooey filter used across the application to fuse adjacent
 * blob elements into organic gelatinous fluid.
 */
export const GooeyFilter: React.FC = () => {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <defs>
        <filter id="jelly-gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 20 -9"
            result="gooey"
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>

        <filter id="soft-jelly">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 18 -7"
            result="soft-goo"
          />
          <feComposite in="SourceGraphic" in2="soft-goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};
