/**
 * TimePicker - A lightweight, framework-agnostic time picker component
 * @version 1.0.0
 * @author w6d-io
 * @license MIT
 */

export interface TimePickerOptions {
    format?: '12h' | '24h';
    defaultTime?: string;
    minTime?: string | null;
    maxTime?: string | null;
    step?: number;
    placeholder?: string;
    disabled?: boolean;
    onChange?: ((time: string, formattedTime: string) => void) | null;
}

export interface TimePickerPosition {
    top: number;
    left: number;
    width: number;
}

export type TimeFormat = '12h' | '24h';
export type TimeString = string; // Format: "HH:mm" or "h:mm AM/PM"

export class TimePicker {
    private element: HTMLInputElement;
    private options: Required<TimePickerOptions>;
    private dropdown: HTMLDivElement;
    private timeList: HTMLDivElement;
    private isOpen: boolean = false;
    private selectedTime: string = '';

    constructor(selector: string | HTMLInputElement, options: TimePickerOptions = {}) {
        this.element = typeof selector === 'string'
            ? document.querySelector<HTMLInputElement>(selector)!
            : selector;

        if (!this.element) {
            throw new Error('TimePicker: Element not found');
        }

        if (this.element.tagName !== 'INPUT') {
            throw new Error('TimePicker: Element must be an input element');
        }

        this.options = {
            format: '12h',
            defaultTime: '',
            minTime: null,
            maxTime: null,
            step: 15,
            placeholder: 'Select time',
            disabled: false,
            onChange: null,
            ...options
        };

        this.selectedTime = this.options.defaultTime || '';

        this.init();
    }

    private init(): void {
        this.setupElement();
        this.createDropdown();
        this.bindEvents();

        if (this.selectedTime) {
            this.element.value = this.formatTime(this.selectedTime);
        }
    }

    private setupElement(): void {
        this.element.setAttribute('readonly', 'true');
        this.element.setAttribute('placeholder', this.options.placeholder);
        this.element.classList.add('time-picker-input');

        if (this.options.disabled) {
            this.element.setAttribute('disabled', 'true');
        }
    }

    private createDropdown(): void {
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'time-picker-dropdown';
        this.dropdown.style.display = 'none';

        this.timeList = document.createElement('div');
        this.timeList.className = 'time-picker-list';

        this.populateTimeList();
        this.dropdown.appendChild(this.timeList);

        // Insert dropdown after the input element
        const parent = this.element.parentNode;
        if (parent) {
            parent.insertBefore(this.dropdown, this.element.nextSibling);
        }
    }

    private populateTimeList(): void {
        const times = this.generateTimeOptions();

        times.forEach((time: string) => {
            const timeOption = document.createElement('div');
            timeOption.className = 'time-picker-option';
            timeOption.textContent = this.formatTime(time);
            timeOption.dataset.time = time;
            timeOption.setAttribute('role', 'option');
            timeOption.setAttribute('tabindex', '-1');

            timeOption.addEventListener('click', () => {
                this.selectTime(time);
            });

            timeOption.addEventListener('keydown', (e: KeyboardEvent) => {
                this.handleOptionKeydown(e, time);
            });

            this.timeList.appendChild(timeOption);
        });
    }

    private handleOptionKeydown(e: KeyboardEvent, time: string): void {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.selectTime(time);
                break;
            case 'Escape':
                this.close();
                this.element.focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.focusNextOption(e.target as HTMLElement);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.focusPreviousOption(e.target as HTMLElement);
                break;
        }
    }

    private focusNextOption(currentOption: HTMLElement): void {
        const nextOption = currentOption.nextElementSibling as HTMLElement;
        if (nextOption) {
            nextOption.focus();
        }
    }

    private focusPreviousOption(currentOption: HTMLElement): void {
        const previousOption = currentOption.previousElementSibling as HTMLElement;
        if (previousOption) {
            previousOption.focus();
        }
    }

    private generateTimeOptions(): string[] {
        const times: string[] = [];
        const stepMinutes = this.options.step;

        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += stepMinutes) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

                if (this.isTimeInRange(timeString)) {
                    times.push(timeString);
                }
            }
        }

        return times;
    }

    private isTimeInRange(time: string): boolean {
        if (!this.options.minTime && !this.options.maxTime) {
            return true;
        }

        const timeMinutes = this.timeToMinutes(time);

        if (this.options.minTime) {
            const minMinutes = this.timeToMinutes(this.options.minTime);
            if (timeMinutes < minMinutes) return false;
        }

        if (this.options.maxTime) {
            const maxMinutes = this.timeToMinutes(this.options.maxTime);
            if (timeMinutes > maxMinutes) return false;
        }

        return true;
    }

    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    private formatTime(time: string): string {
        if (!time) return '';

        const [hours, minutes] = time.split(':').map(Number);

        if (this.options.format === '12h') {
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
            return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    private parseTime(timeString: string): string {
        if (!timeString) return '';

        // Handle 12h format
        if (timeString.includes('AM') || timeString.includes('PM')) {
            const [time, period] = timeString.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            let adjustedHours = hours;

            if (period === 'PM' && hours !== 12) {
                adjustedHours += 12;
            } else if (period === 'AM' && hours === 12) {
                adjustedHours = 0;
            }

            return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }

        return timeString;
    }

    private selectTime(time: string): void {
        this.selectedTime = time;
        this.element.value = this.formatTime(time);
        this.close();

        // Update selected option styling
        this.timeList.querySelectorAll('.time-picker-option').forEach((option: Element) => {
            option.classList.remove('selected');
            if ((option as HTMLElement).dataset.time === time) {
                option.classList.add('selected');
            }
        });

        if (this.options.onChange) {
            this.options.onChange(time, this.formatTime(time));
        }

        // Trigger change event
        const event = new Event('change', { bubbles: true });
        this.element.dispatchEvent(event);
    }

    private bindEvents(): void {
        this.element.addEventListener('click', (e: Event) => {
            e.preventDefault();
            if (!this.options.disabled) {
                this.toggle();
            }
        });

        this.element.addEventListener('focus', () => {
            if (!this.options.disabled) {
                this.open();
            }
        });

        this.element.addEventListener('keydown', (e: KeyboardEvent) => {
            this.handleInputKeydown(e);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e: Event) => {
            const target = e.target as Element;
            if (!this.element.contains(target) && !this.dropdown.contains(target)) {
                this.close();
            }
        });
    }

    private handleInputKeydown(e: KeyboardEvent): void {
        switch (e.key) {
            case 'Escape':
                this.close();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.toggle();
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!this.isOpen) {
                    this.open();
                } else {
                    const firstOption = this.timeList.querySelector('.time-picker-option') as HTMLElement;
                    if (firstOption) {
                        firstOption.focus();
                    }
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (!this.isOpen) {
                    this.open();
                } else {
                    const options = this.timeList.querySelectorAll('.time-picker-option');
                    const lastOption = options[options.length - 1] as HTMLElement;
                    if (lastOption) {
                        lastOption.focus();
                    }
                }
                break;
        }
    }

    private open(): void {
        if (this.isOpen || this.options.disabled) return;

        this.isOpen = true;
        this.dropdown.style.display = 'block';
        this.dropdown.setAttribute('aria-expanded', 'true');
        this.positionDropdown();

        // Scroll to selected time
        const selectedOption = this.timeList.querySelector('.selected') as HTMLElement;
        if (selectedOption) {
            selectedOption.scrollIntoView({ block: 'nearest' });
        }
    }

    private close(): void {
        if (!this.isOpen) return;

        this.isOpen = false;
        this.dropdown.style.display = 'none';
        this.dropdown.setAttribute('aria-expanded', 'false');
    }

    private toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    private positionDropdown(): void {
        const rect = this.element.getBoundingClientRect();
        const dropdownHeight = this.dropdown.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Position dropdown below input by default
        let top = rect.bottom + window.scrollY;

        // If dropdown would go off screen, position above input
        if (rect.bottom + dropdownHeight > viewportHeight) {
            top = rect.top + window.scrollY - dropdownHeight;
        }

        this.dropdown.style.position = 'absolute';
        this.dropdown.style.top = `${top}px`;
        this.dropdown.style.left = `${rect.left + window.scrollX}px`;
        this.dropdown.style.width = `${rect.width}px`;
        this.dropdown.style.zIndex = '1000';
    }

    // Public API methods
    public getValue(): string {
        return this.selectedTime;
    }

    public getFormattedValue(): string {
        return this.formatTime(this.selectedTime);
    }

    public setValue(time: string): void {
        const parsedTime = this.parseTime(time);
        if (this.isTimeInRange(parsedTime)) {
            this.selectTime(parsedTime);
        } else {
            throw new Error(`TimePicker: Time "${time}" is outside the allowed range`);
        }
    }

    public enable(): void {
        this.options.disabled = false;
        this.element.removeAttribute('disabled');
    }

    public disable(): void {
        this.options.disabled = true;
        this.element.setAttribute('disabled', 'true');
        this.close();
    }

    public updateOptions(newOptions: Partial<TimePickerOptions>): void {
        this.options = { ...this.options, ...newOptions };

        // Recreate dropdown with new options
        this.dropdown.remove();
        this.createDropdown();

        // Update element attributes
        this.element.setAttribute('placeholder', this.options.placeholder);

        if (this.options.disabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    public getOptions(): TimePickerOptions {
        return { ...this.options };
    }

    public isDisabled(): boolean {
        return this.options.disabled;
    }

    public isOpened(): boolean {
        return this.isOpen;
    }

    public destroy(): void {
        this.dropdown.remove();
        this.element.classList.remove('time-picker-input');
        this.element.removeAttribute('readonly');
        this.element.removeAttribute('aria-expanded');

        // Remove event listeners
        // Note: In a production environment, you'd want to store references to bound functions
        // to properly remove event listeners
    }

    // Static utility methods
    public static convertTo24Hour(time12h: string): string {
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

    public static convertTo12Hour(time24h: string): string {
        if (!time24h) return '';

        const [hours, minutes] = time24h.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    public static isValidTime(time: string, format: TimeFormat = '24h'): boolean {
        if (!time) return false;

        if (format === '12h') {
            return /^(1[0-2]|[1-9]):([0-5][0-9])\s*(AM|PM)$/i.test(time);
        } else {
            return /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(time);
        }
    }

    public static compareTime(time1: string, time2: string): number {
        const minutes1 = TimePicker.prototype.timeToMinutes.call({ timeToMinutes: TimePicker.prototype.timeToMinutes }, time1);
        const minutes2 = TimePicker.prototype.timeToMinutes.call({ timeToMinutes: TimePicker.prototype.timeToMinutes }, time2);

        return minutes1 - minutes2;
    }
}

// Auto-initialize elements with data-time-picker attribute
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll<HTMLInputElement>('[data-time-picker]');
    elements.forEach((element: HTMLInputElement) => {
        const format = (element.dataset.format as TimeFormat) || '12h';
        const defaultTime = element.dataset.defaultTime || '';
        const minTime = element.dataset.minTime || null;
        const maxTime = element.dataset.maxTime || null;
        const step = parseInt(element.dataset.step || '15', 10);

        new TimePicker(element, {
            format,
            defaultTime,
            minTime,
            maxTime,
            step
        });
    });
});

// Export for different module systems
declare global {
    interface Window {
        TimePicker: typeof TimePicker;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimePicker;
} else if (typeof define === 'function' && define.amd) {
    define(function() { return TimePicker; });
} else if (typeof window !== 'undefined') {
    window.TimePicker = TimePicker;
}

export default TimePicker;
