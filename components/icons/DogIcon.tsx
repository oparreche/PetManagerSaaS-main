
import React from 'react';

const DogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8.25 4.5a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 6a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0V6zM3 9.75A.75.75 0 013.75 9h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 9.75zM12 12.75a1.5 1.5 0 00-1.5 1.5v2.25a1.5 1.5 0 003 0v-2.25a1.5 1.5 0 00-1.5-1.5z" clipRule="evenodd" />
    <path d="M5.25 12a.75.75 0 01.75-.75h12a.75.75 0 01.75.75v3.375c0 .621.504 1.125 1.125 1.125h.375a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75V15.75c0-.621-.504-1.125-1.125-1.125h-9c-.621 0-1.125.504-1.125 1.125v1.875a.75.75 0 01-.75.75H3.75a.75.75 0 010-1.5h.375c.621 0 1.125-.504 1.125-1.125V12z" />
  </svg>
);

export default DogIcon;
