import type React from 'react';

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M13.5 2.5V8H19.5V10H13.5V16H19.5V18H13.5V23.5H11.5V18H4.5V16H11.5V10H4.5V8H11.5V2.5H13.5Z" />
    </svg>
);
export default Logo;
