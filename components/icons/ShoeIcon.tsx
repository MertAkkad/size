
import React from 'react';

export const ShoeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 17v-4h13v4H7z"></path>
    <path d="M4 17V5H2v12a2 2 0 0 0 2 2h12v-2H4z"></path>
    <path d="M14 13V5h2.5l3.5 3.5V13h-6z"></path>
  </svg>
);
