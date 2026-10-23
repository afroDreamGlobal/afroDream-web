import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AfroDreamLogoProps {
  variant?: 'color' | 'white' | 'dark' | 'badge';
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
  const dimensions = {
    sm: { width: 72, height: 44 },
    md: { width: 98, height: 60 },
    lg: { width: 130, height: 80 },
    xl: { width: 160, height: 98 },
  };

  const { width, height } = dimensions[size] || dimensions.md;
  const logoSrc =
    variant === 'white'
      ? '/images/logo-white.png'
      : variant === 'badge'
      ? '/images/logo-badge.png'
      : '/images/logo.png';

  const logoElement = (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src={logoSrc}
        alt="Afro Dream Global Logo"
        width={width}
        height={height}
        priority={size === 'md' || size === 'lg'}
        className="object-contain transition-transform duration-200 hover:scale-[1.03] drop-shadow-sm w-auto"
        style={{ height: `${height}px`, width: 'auto' }}
      />
    </div>
  );

  if (withLink) {
    return (
      <Link
        href="/"
        className="flex items-center focus:outline-none transition-opacity hover:opacity-95"
        aria-label="Afro Dream Global Home"
      >
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}

