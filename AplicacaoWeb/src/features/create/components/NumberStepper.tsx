import React, { useRef, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

export const NumberStepper = ({ label, value, onChange, placeholder, isError, maxLimit }: any) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const valueRef = useRef(value);

    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    useEffect(() => {
        return () => stopHold();
    }, []);

    const stopHold = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handleIncrement = () => {
        const currentVal = valueRef.current === '' ? 0 : Number(valueRef.current);
        if (maxLimit !== undefined && currentVal >= maxLimit) return;

        const nextVal = String(currentVal + 1);
        valueRef.current = nextVal;
        onChange(nextVal);
    };

    const handleDecrement = () => {
        const currentVal = valueRef.current === '' ? 0 : Number(valueRef.current);
        if (currentVal > 1) {
            const nextVal = String(currentVal - 1);
            valueRef.current = nextVal;
            onChange(nextVal);
        }
    };

    const onMouseDownIncrement = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        handleIncrement();

        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                handleIncrement();
            }, 100);
        }, 500);
    };

    const onMouseDownDecrement = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        handleDecrement();

        timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => {
                handleDecrement();
            }, 100);
        }, 500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');

        if (maxLimit !== undefined && Number(val) > maxLimit) {
            onChange(String(maxLimit));
        } else {
            onChange(val);
        }
    };

    return (
        <div className="flex flex-col gap-1 w-full select-none">
            <label
                className={`text-sm font-semibold pl-1 mb-2 ${isError ? 'text-red-500' : 'text-sub-text'}`}
            >
                {label}
            </label>
            <div
                className={`flex items-center h-12 rounded-2xl border bg-transparent transition-all overflow-hidden ${
                    isError
                        ? 'border-red-500 focus-within:border-red-500'
                        : 'border-card-border focus-within:border-primary/50'
                }`}
            >
                <button
                    type="button"
                    onMouseDown={onMouseDownDecrement}
                    onMouseUp={stopHold}
                    onMouseLeave={stopHold}
                    onTouchStart={onMouseDownDecrement}
                    onTouchEnd={stopHold}
                    className={`flex items-center justify-center h-full w-12 transition-colors ${isError ? 'text-red-500 hover:bg-red-500/10' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
                >
                    <Minus size={16} />
                </button>

                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`flex-1 w-full text-center bg-transparent text-sm outline-none placeholder:text-muted-foreground ${isError ? 'text-red-500' : 'text-foreground'}`}
                />

                <button
                    type="button"
                    onMouseDown={onMouseDownIncrement}
                    onMouseUp={stopHold}
                    onMouseLeave={stopHold}
                    onTouchStart={onMouseDownIncrement}
                    onTouchEnd={stopHold}
                    className={`flex items-center justify-center h-full w-12 transition-colors ${isError ? 'text-red-500 hover:bg-red-500/10' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};
