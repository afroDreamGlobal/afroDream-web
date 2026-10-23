import React from 'react';
import Link from 'next/link';

interface AfroDreamLogoProps {
  variant?: 'color' | 'white' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withLink?: boolean;
}

export default function AfroDreamLogo({
  variant = 'color',
  className = '',
  size = 'md',
  withLink = true,
}: AfroDreamLogoProps) {
  // Official Brand Colors:
  // Primary Blue: #2B7CC0
  // Primary Dark: #231F20
  const primaryColor =
    variant === 'white' ? '#FFFFFF' : variant === 'dark' ? '#231F20' : '#2B7CC0';
  const textColor =
    variant === 'white' ? '#FFFFFF' : variant === 'dark' ? '#231F20' : '#2B7CC0';

  const heights = {
    sm: 40,
    md: 54,
    lg: 68,
    xl: 84,
  };

  const height = heights[size];
  const width = Math.round(height * 2.35);

  const LogoSvg = (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 250 105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-200 hover:scale-[1.02] drop-shadow-sm"
        aria-label="Afro Dream Global Logo"
      >
        {/* Globe Group */}
        <g stroke={primaryColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {/* Main Outer Globe Circle with bold outline */}
          <circle cx="125" cy="52.5" r="44" strokeWidth="3.4" />

          {/* Latitude Lines */}
          <ellipse cx="125" cy="52.5" rx="44" ry="20" strokeWidth="2.2" strokeOpacity="0.8" />
          <line x1="82" y1="52.5" x2="168" y2="52.5" strokeWidth="2.4" strokeOpacity="0.8" />
          <line x1="91" y1="31" x2="159" y2="31" strokeWidth="2" strokeOpacity="0.5" />
          <line x1="91" y1="74" x2="159" y2="74" strokeWidth="2" strokeOpacity="0.5" />

          {/* Meridian Longitude Curve */}
          <ellipse cx="125" cy="52.5" rx="20" ry="44" strokeWidth="2.4" strokeOpacity="0.8" />
          <line x1="125" y1="8.5" x2="125" y2="96.5" strokeWidth="2" strokeOpacity="0.5" />

          {/* Symmetrical Bold Speed Wings (Left) */}
          {/* Top Bar */}
          <path d="M81 41.5 L16 41.5" strokeWidth="3.6" />
          <path d="M16 41.5 L24 46.5" strokeWidth="3.2" />
          {/* Middle Bar */}
          <path d="M80 52.5 L26 52.5" strokeWidth="3.6" />
          <path d="M26 52.5 L34 57.5" strokeWidth="3.2" />
          {/* Bottom Bar */}
          <path d="M81 63.5 L38 63.5" strokeWidth="3.6" />
          <path d="M38 63.5 L46 68.5" strokeWidth="3.2" />

          {/* Symmetrical Bold Speed Wings (Right) */}
          {/* Top Bar */}
          <path d="M169 41.5 L234 41.5" strokeWidth="3.6" />
          <path d="M234 41.5 L226 46.5" strokeWidth="3.2" />
          {/* Middle Bar */}
          <path d="M170 52.5 L224 52.5" strokeWidth="3.6" />
          <path d="M224 52.5 L216 57.5" strokeWidth="3.2" />
          {/* Bottom Bar */}
          <path d="M169 63.5 L212 63.5" strokeWidth="3.6" />
          <path d="M212 63.5 L204 68.5" strokeWidth="3.2" />

          {/* Bold Center Plaque Framing */}
          <rect
            x="48"
            y="32.5"
            width="154"
            height="40"
            fill={variant === 'white' ? 'rgba(35, 31, 32, 0.95)' : 'rgba(255, 255, 255, 0.98)'}
            stroke={primaryColor}
            strokeWidth="2.6"
            rx="3"
          />

          {/* Horizontal inner separator bars */}
          <line x1="52" y1="36" x2="200" y2="36" strokeWidth="1.2" strokeOpacity="0.4" />
          <line x1="52" y1="69" x2="200" y2="69" strokeWidth="1.2" strokeOpacity="0.4" />
        </g>

        {/* Text Line 1: AFRO DREAM (Ultra-Bold & Symmetrical) */}
        <text
          x="125"
          y="52"
          fill={textColor}
          fontSize="17"
          fontWeight="900"
          letterSpacing="2.2"
          textAnchor="middle"
          fontFamily="var(--font-poppins), sans-serif"
        >
          AFRO DREAM
        </text>

        {/* Text Line 2: GLOBAL */}
        <text
          x="125"
          y="65.5"
          fill={textColor}
          fontSize="9.5"
          fontWeight="800"
          letterSpacing="5.5"
          textAnchor="middle"
          fontFamily="var(--font-poppins), sans-serif"
        >
          GLOBAL
        </text>

        {/* Left & Right Accent Diamonds */}
        <polygon
          points="83,62.5 86,60 89,62.5 86,65"
          fill={primaryColor}
        />
        <polygon
          points="161,62.5 164,60 167,62.5 164,65"
          fill={primaryColor}
        />
      </svg>
    </div>
  );

  if (withLink) {
    return (
      <Link
        href="/"
        className="flex items-center focus:outline-none transition-opacity hover:opacity-95"
        aria-label="Afro Dream Global Home"
      >
        {LogoSvg}
      </Link>
    );
  }

  return LogoSvg;
}
