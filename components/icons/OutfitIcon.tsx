import React from 'react';

export const OutfitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 15.91a2.502 2.502 0 0 0-2.355-1.12c-.328.042-.653.125-.965.25-.3-.124-.627-.207-.955-.25a2.5 2.5 0 0 0-2.356 1.12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.28 12.37-3.56.89m3.56-.89.89 3.56m-4.45-4.45-.89 3.56m.89-3.56-3.56.89" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.09 15.91a2.5 2.5 0 0 1 0-5.82" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 15.91a2.5 2.5 0 0 0 0-5.82" />
    </svg>
);
