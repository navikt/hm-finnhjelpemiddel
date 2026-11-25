'use client'

import type { SVGProps } from 'react';
import { forwardRef } from 'react';

interface SVGRProps {
  active: boolean
}

export const Juletre = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement> & SVGRProps>(({ active, ...props }, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="2em"
    height="2em"
    role="img"
    aria-label="Juletre"
  >
    <rect x="27.5" y="50" width="9" height="9" rx="1.5" fill="#8b5a2b" stroke="#1f2937" stroke-width="2.5" />
    <path
      d="M32 9
           L43 23 L38 23
           L48 36 L42 36
           L53 50 L11 50
           L22 36 L16 36
           L26 23 L21 23 Z"
      fill="#2a9d55"
      stroke="#1f2937"
      stroke-width="2.5"
      stroke-linejoin="round"
    />
    <path d="M24 30 Q32 34 40 29" stroke="#f5c542" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <path d="M19 43 Q32 48 45 42" stroke="#f5c542" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <circle cx="29" cy="25" r="2.2" fill="#d62839" />
    <circle cx="37" cy="37" r="2.2" fill="#d62839" />
    <circle cx="24" cy="39" r="2.2" fill="#3b82f6" />
    <circle cx="41" cy="46" r="2.2" fill="#3b82f6" />
    <circle cx="28" cy="46.5" r="2.2" fill="#d62839" />
    <path
      d="M32 1.5 L34.2 6.3 L39.4 6.8 L35.5 10.2 L36.6 15.3 L32 12.7 L27.4 15.3 L28.5 10.2 L24.6 6.8 L29.8 6.3 Z"
      fill="#f5c542"
      stroke="#1f2937"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
  </svg>
))
