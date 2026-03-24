import React from 'react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
}

export function CustomInput({ label, id, ...props }: CustomInputProps) {
    return (
        <div className="space-y-1 text-left">
            <label htmlFor={id} className="text-sm font-medium text-zinc-300 ml-1">
                {label}
            </label>
            <input
                id={id}
                className="w-full bg-transparent border border-[#3b2d59] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-colors"
                {...props}
            />
        </div>
    );
}