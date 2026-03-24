import React from 'react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    error?: boolean;
}

export function CustomInput({ label, id, error, ...props }: CustomInputProps) {
    return (
        <div className="text-left">
            <label
                className={`mb-2 block text-sm font-medium ml-1 ${error ? 'text-red-500' : 'text-text-muted'}`}
            >
                {label}
            </label>
            <input
                id={id}
                className={`w-full bg-transparent border rounded-xl px-4 py-3 text-text focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-surface-border focus:border-primary focus:ring-1 focus:ring-primary'
                }`}
                {...props}
            />
        </div>
    );
}
