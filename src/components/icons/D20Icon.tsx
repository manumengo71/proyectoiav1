import React from 'react';

export const D20Icon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M12 2 2.5 7 2.5 17 12 22 21.5 17 21.5 7 12 2z"></path>
        <path d="M2.5 7 12 12 21.5 7"></path>
        <path d="M12 22V12"></path>
        <path d="m16.5 4.5-8 4"></path>
        <path d="m7.5 4.5 8 4"></path>
    </svg>
);