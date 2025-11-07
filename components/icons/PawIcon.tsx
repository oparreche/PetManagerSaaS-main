import React from 'react';

const PawIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    <path d="M11.5 13.5c-1.5-1.5-4.5-.5-4.5 2 0 2 2 3 4 3s3.5-1 3.5-3c0-2.5-3-3.5-5-2" />
    <path d="M7 9.5a1.8 1.8 0 1 1 3.6 0 1.8 1.8 0 0 1-3.6 0Z" />
    <path d="M13 9.5a1.8 1.8 0 1 1 3.6 0 1.8 1.8 0 0 1-3.6 0Z" />
    <path d="M5 12a1.8 1.8 0 1 1 3.6 0A1.8 1.8 0 0 1 5 12Z" />
    <path d="M15.4 12a1.8 1.8 0 1 1 3.6 0 1.8 1.8 0 0 1-3.6 0Z" />
  </svg>
);

export default PawIcon;
