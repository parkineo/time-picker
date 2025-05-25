import React, { useEffect, useRef } from 'react';
import TimePicker, { TimePickerOptions } from '@parkineo/time-picker';

interface TimePickerWrapperProps {
    value?: string;
    onChange?: (time: string) => void;
    options?: TimePickerOptions;
}

const TimePickerWrapper: React.FC<TimePickerWrapperProps> = ({
                                                                 value,
                                                                 onChange,
                                                                 options = {}
                                                             }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const pickerRef = useRef<TimePicker | null>(null);

    useEffect(() => {
        if (inputRef.current) {
            pickerRef.current = new TimePicker(inputRef.current, {
                ...options,
                onChange: onChange ? (time: string) => onChange(time) : undefined
            });
        }

        return () => {
            pickerRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (value && pickerRef.current) {
            pickerRef.current.setValue(value);
        }
    }, [value]);

    return <input ref={inputRef} type="text" />;
};

export default TimePickerWrapper;
