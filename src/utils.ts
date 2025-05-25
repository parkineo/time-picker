/**
 * Utility functions for time manipulation
 */
import {TimeFormat, TimeRange, TimeValidationResult} from "./types";

export class TimeUtils {
    /**
     * Convert time string to minutes since midnight
     */
    static timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    /**
     * Convert minutes since midnight to time string
     */
    static minutesToTime(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    /**
     * Validate time format
     */
    static validateTime(time: string, format: TimeFormat = '24h'): TimeValidationResult {
        if (!time) {
            return { isValid: false, error: 'Time is required' };
        }

        if (format === '12h') {
            const regex = /^(1[0-2]|[1-9]):([0-5][0-9])\s*(AM|PM)$/i;
            if (!regex.test(time)) {
                return { isValid: false, error: 'Invalid 12h time format (e.g., 2:30 PM)' };
            }
        } else {
            const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
            if (!regex.test(time)) {
                return { isValid: false, error: 'Invalid 24h time format (e.g., 14:30)' };
            }
        }

        return { isValid: true };
    }

    /**
     * Convert 12h format to 24h format
     */
    static convertTo24Hour(time12h: string): string {
        if (!time12h) return '';

        const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return time12h;

        let [, hours, minutes, period] = match;
        let hour = parseInt(hours, 10);

        if (period.toUpperCase() === 'PM' && hour !== 12) {
            hour += 12;
        } else if (period.toUpperCase() === 'AM' && hour === 12) {
            hour = 0;
        }

        return `${hour.toString().padStart(2, '0')}:${minutes}`;
    }

    /**
     * Convert 24h format to 12h format
     */
    static convertTo12Hour(time24h: string): string {
        if (!time24h) return '';

        const [hours, minutes] = time24h.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    /**
     * Compare two times and return difference in minutes
     */
    static compareTime(time1: string, time2: string): number {
        const minutes1 = this.timeToMinutes(time1);
        const minutes2 = this.timeToMinutes(time2);
        return minutes1 - minutes2;
    }

    /**
     * Check if time is within a range
     */
    static isTimeInRange(time: string, range: TimeRange): boolean {
        const timeMinutes = this.timeToMinutes(time);
        const startMinutes = this.timeToMinutes(range.start);
        const endMinutes = this.timeToMinutes(range.end);

        return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
    }

    /**
     * Generate array of time options based on step
     */
    static generateTimeOptions(step: number = 15, range?: TimeRange): string[] {
        const options: string[] = [];
        const start = range ? this.timeToMinutes(range.start) : 0;
        const end = range ? this.timeToMinutes(range.end) : 24 * 60;

        for (let minutes = start; minutes < end; minutes += step) {
            if (minutes < 24 * 60) { // Don't exceed 24 hours
                options.push(this.minutesToTime(minutes));
            }
        }

        return options;
    }

    /**
     * Format time for display based on format preference
     */
    static formatTime(time: string, format: TimeFormat): string {
        if (!time) return '';

        if (format === '12h') {
            return this.convertTo12Hour(time);
        }

        return time;
    }

    /**
     * Parse input time to standardized 24h format
     */
    static parseTime(input: string): string {
        if (!input) return '';

        // If it contains AM/PM, convert from 12h
        if (input.includes('AM') || input.includes('PM')) {
            return this.convertTo24Hour(input);
        }

        // Assume 24h format
        return input;
    }
}
