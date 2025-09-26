import React from 'react';

export const AgeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-5.25-4.25-9.5-9.5-9.5S.5 6.75.5 12s4.25 9.5 9.5 9.5 9.5-4.25 9.5-9.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-19" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.5c-.2-.45-.4-.88-.6-1.3-2.13 1.6-3.3 3.9-3.3 6.3 0 2.4 1.17 4.7 3.3 6.3.2-.42.4-.85.6-1.3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 7.5c.2-.45.4-.88.6-1.3 2.13 1.6 3.3 3.9 3.3 6.3 0 2.4-1.17 4.7-3.3 6.3-.2-.42-.4-.85-.6-1.3" />
    </svg>
);
