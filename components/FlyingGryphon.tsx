'use client';

import { useEffect, useState } from 'react';

/**
 * Flying Gryphon Component (Client Component)
 *
 * An animated gryphon that flies across the screen.
 * Educational: Demonstrates CSS animations and client-side interactivity.
 */

export function FlyingGryphon() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show gryphon after component mounts
    setIsVisible(true);

    // Restart animation every 15 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        @keyframes fly {
          0% {
            left: -200px;
            top: 20%;
          }
          25% {
            top: 15%;
          }
          50% {
            top: 25%;
          }
          75% {
            top: 18%;
          }
          100% {
            left: calc(100% + 200px);
            top: 22%;
          }
        }

        @keyframes flap {
          0%, 100% {
            transform: rotateX(0deg) scale(1);
          }
          50% {
            transform: rotateX(20deg) scale(1.05);
          }
        }

        .gryphon-container {
          position: fixed;
          animation: fly 12s linear infinite;
          z-index: 9999;
          pointer-events: none;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .gryphon {
          font-size: 80px;
          animation: flap 0.5s ease-in-out infinite;
          display: inline-block;
        }
      `}</style>

      <div className="gryphon-container">
        <div className="gryphon">
          <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Gryphon body (eagle front, lion back) */}
            {/* Lion body */}
            <ellipse cx="65" cy="55" rx="25" ry="20" fill="#D4A574" />

            {/* Eagle chest */}
            <ellipse cx="40" cy="50" rx="20" ry="18" fill="#8B7355" />

            {/* Lion legs */}
            <rect x="55" y="70" width="8" height="20" rx="4" fill="#D4A574" />
            <rect x="72" y="70" width="8" height="20" rx="4" fill="#D4A574" />

            {/* Eagle talons */}
            <rect x="30" y="65" width="6" height="18" rx="3" fill="#8B7355" />
            <rect x="42" y="65" width="6" height="18" rx="3" fill="#8B7355" />

            {/* Wings - animated */}
            <g className="wing-left">
              <path
                d="M 35 45 Q 15 30 5 35 Q 10 40 15 42 Q 20 44 25 46 Q 30 48 35 48 Z"
                fill="#6B5D4F"
                opacity="0.9"
              />
              <path
                d="M 30 47 Q 12 35 3 38 Q 8 42 13 44 Q 18 46 23 48 Q 28 49 30 49 Z"
                fill="#8B7355"
                opacity="0.7"
              />
            </g>
            <g className="wing-right">
              <path
                d="M 45 45 Q 65 30 75 35 Q 70 40 65 42 Q 60 44 55 46 Q 50 48 45 48 Z"
                fill="#6B5D4F"
                opacity="0.9"
              />
              <path
                d="M 50 47 Q 68 35 77 38 Q 72 42 67 44 Q 62 46 57 48 Q 52 49 50 49 Z"
                fill="#8B7355"
                opacity="0.7"
              />
            </g>

            {/* Eagle head */}
            <circle cx="30" cy="40" r="12" fill="#8B7355" />

            {/* Beak */}
            <path
              d="M 22 38 L 15 40 L 22 42 Z"
              fill="#FFA500"
            />

            {/* Eye */}
            <circle cx="28" cy="38" r="3" fill="#FFD700" />
            <circle cx="28" cy="38" r="1.5" fill="#000" />

            {/* Lion tail */}
            <path
              d="M 85 60 Q 95 55 98 58 Q 95 62 90 63"
              stroke="#D4A574"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="98" cy="58" r="6" fill="#8B6914" />

            {/* Ear tufts */}
            <path
              d="M 26 30 L 24 25 L 28 28 Z"
              fill="#6B5D4F"
            />
            <path
              d="M 34 30 L 36 25 L 32 28 Z"
              fill="#6B5D4F"
            />
          </svg>
        </div>
      </div>
    </>
  );
}

/**
 * Educational Notes:
 *
 * 1. CSS Animations:
 *    - @keyframes for defining animation sequences
 *    - fly animation: moves the gryphon across screen
 *    - flap animation: creates wing-flapping effect
 *
 * 2. SVG Graphics:
 *    - Vector-based scalable graphics
 *    - Paths, circles, ellipses for shapes
 *    - Layering for depth (wings behind body)
 *
 * 3. Client Component:
 *    - 'use client' directive needed for useEffect
 *    - State management for visibility
 *    - Interval for animation restart
 *
 * 4. Styling:
 *    - Fixed positioning for overlay
 *    - High z-index to appear above content
 *    - pointer-events: none so it doesn't interfere with clicks
 *    - Drop shadow for depth
 *
 * 5. Performance:
 *    - CSS animations are hardware-accelerated
 *    - No JavaScript for the actual animation
 *    - Clean up interval on component unmount
 */
