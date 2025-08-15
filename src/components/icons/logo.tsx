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
        <path d="M12 2L9.41 4.59L10.83 6H9C6.24 6 4 8.24 4 11V12C4 13.04 4.38 14.01 5 14.83V18C5 18.55 5.45 19 6 19H7V22H9V19H15V22H17V19H18C18.55 19 19 18.55 19 18V14.83C19.62 14.01 20 13.04 20 12V11C20 8.24 17.76 6 15 6H13.17L14.59 4.59L12 2ZM12 4.83L13.17 6H10.83L12 4.83ZM7 8H17C17.55 8 18 8.45 18 9V12H6V9C6 8.45 6.45 8 7 8ZM8 17V14H16V17H8Z" />
    </svg>
);
export default Logo;
