import type React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <path d="M50 85 C 20 85, 20 55, 50 40 C 80 55, 80 85, 50 85 Z" opacity="0.6"/>
    <path d="M50 65 C 30 65, 30 35, 50 25 C 70 35, 70 65, 50 65 Z" opacity="0.8"/>
    <path d="M50 45 C 40 45, 40 25, 50 15 C 60 25, 60 45, 50 45 Z" />
  </svg>
);
export default Logo;
