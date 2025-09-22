
import React from 'react';
import { Spinner } from './Spinner';

interface ActionButtonProps {
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
    text: string;
    loadingText: string;
    icon: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, loading, text, loadingText, icon }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center justify-center px-8 sm:px-12 py-3 sm:py-4 border border-transparent text-base sm:text-lg font-semibold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            aria-label={text}
        >
            {loading ? (
                <>
                    <Spinner className="w-6 h-6 mr-3" />
                    {loadingText}
                </>
            ) : (
                <>
                    {icon}
                    {text}
                </>
            )}
        </button>
    )
}