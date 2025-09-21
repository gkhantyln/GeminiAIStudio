
import React from 'react';
import { Spinner } from './Spinner';
import { SwapIcon } from './icons/SwapIcon';

interface SwapButtonProps {
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
}

export const SwapButton: React.FC<SwapButtonProps> = ({ onClick, disabled, loading }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center justify-center px-12 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
            {loading ? (
                <>
                    <Spinner className="w-6 h-6 mr-3" />
                    Swapping...
                </>
            ) : (
                <>
                    <SwapIcon className="w-6 h-6 mr-3" />
                    Swap Faces
                </>
            )}
        </button>
    )
}
