/**
 * Core type definitions for TimePicker
 */

export type TimeFormat = '12h' | '24h';
export type TimeString = string; // Format: "HH:mm" or "h:mm AM/PM"

export interface TimePickerOptions {
    /** Time format - 12 hour or 24 hour */
    format?: TimeFormat;
    /** Default time value in 24h format (HH:mm) */
    defaultTime?: string;
    /** Minimum selectable time in 24h format (HH:mm) */
    minTime?: string | null;
    /** Maximum selectable time in 24h format (HH:mm) */
    maxTime?: string | null;
    /** Time step in minutes */
    step?: number;
    /** Placeholder text for the input */
    placeholder?: string;
    /** Whether the picker is disabled */
    disabled?: boolean;
    /** Callback function when time changes */
    onChange?: TimeChangeCallback | null;
}

export interface TimePickerPosition {
    top: number;
    left: number;
    width: number;
}

export type TimeChangeCallback = (time: string, formattedTime: string) => void;

export interface TimeValidationResult {
    isValid: boolean;
    error?: string;
}

export interface TimeRange {
    start: string;
    end: string;
}
