/**
 * TimePicker - Strict TypeScript version with proper initialization
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

export type TimeFormat = '12h' | '24h';

export class TimePicker {
    private readonly element: HTMLInputElement;
    private readonly options: Required<TimePickerOptions>;
    private readonly dropdown: HTMLDivElement;
    private readonly timeList: HTMLDivElement;
    private isOpen: boolean = false;
    private selectedTime: string = '';

    constructor(selector: string | HTMLInputElement, options: TimePickerOptions = {}) {
        // Initialize element
        this.element = this.resolveElement(selector);
        this.validateElement();

        // Initialize options with defaults
        this.options = this.mergeOptions(options);
        this.selectedTime = this.options.defaultTime || '';

        // Initialize DOM elements
        this.dropdown = this.createDropdownElement();
        this.timeList = this.createTimeListElement();

        // Setup component
        this.initialize();
    }

    private resolveElement(selector: string | HTMLInputElement): HTMLInputElement {
        if (typeof selector === 'string') {
            const element = document.querySelector<HTMLInputElement>(selector);
            if (!element) {
                throw new Error(`TimePicker: Element not found: ${selector}`);
            }
            return element;
        }
        return selector;
    }

    private validateElement(): void {
        if (this.element.tagName !== 'INPUT') {
            throw new Error('TimePicker: Element must be an input element');
        }

        if (!this.element.parentNode) {
            throw new Error('TimePicker: Input element must have a parent node');
        }
    }

    private mergeOptions(options: TimePickerOptions): Required<TimePickerOptions> {
        return {
            format: options.format ?? '12h',
            defaultTime: options.defaultTime ?? '',
            minTime: options.minTime ?? null,
            maxTime: options.maxTime ?? null,
            step: options.step ?? 15,
            placeholder: options.placeholder ?? 'Select time',
            disabled: options.disabled ?? false,
            onChange: options.onChange ?? null,
        };
    }

    private createDropdownElement(): HTMLDivElement {
        const dropdown = document.createElement('div');
        dropdown.className = 'time-picker-dropdown';
        dropdown.style.display = 'none';
        dropdown.setAttribute('role', 'listbox');
        dropdown.setAttribute('aria-expanded', 'false');
        return dropdown;
    }

    private createTimeListElement(): HTMLDivElement {
        const timeList = document.createElement('div');
        timeList.className = 'time-picker-list';
        timeList.setAttribute('role', 'list');
        return timeList;
    }

    private initialize(): void {
        this.setupElement();
        this.populateTimeList();
        this.assembleDropdown();
        this.bindEvents();
        this.setInitialValue();
    }

    private setupElement(): void {
        this.element.setAttribute('readonly', 'true');
        this.element.setAttribute('placeholder', this.options.placeholder);
        this.element.classList.add('time-picker-input');

        if (this.options.disabled) {
            this.element.setAttribute('disabled', 'true');
        }
    }

    private assembleDropdown(): void {
        this.dropdown.appendChild(this.timeList);
        const parent = this.element.parentNode!; // We validated this exists
        parent.insertBefore(this.dropdown, this.element.nextSibling);
    }

    private setInitialValue(): void {
        if (this.selectedTime) {
            this.element.value = this.formatTime(this.selectedTime);
        }
    }

    private populateTimeList(): void {
        const times = this.generateTimeOptions();

        // Clear existing options
        this.timeList.innerHTML = '';

        times.forEach((time: string) => {
            const timeOption = this.createTimeOption(time);
            this.timeList.appendChild(timeOption);
        });
    }

    private createTimeOption(time: string): HTMLDivElement {
        const timeOption = document.createElement('div');
        timeOption.className = 'time-picker-option';
        timeOption.textContent = this.formatTime(time);
        timeOption.dataset.time = time;
        timeOption.setAttribute('role', 'option');
        timeOption.setAttribute('tabindex', '-1');

        // Add event listeners
        this.addTimeOptionEvents(timeOption, time);

        return timeOption;
    }

    private addTimeOptionEvents(element: HTMLDivElement, time: string): void {
        element.addEventListener('click', () => {
            this.selectTime(time);
        });

        element.addEventListener('keydown', (e: KeyboardEvent) => {
            this.handleOptionKeydown(e, time);
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
        const nextOption = currentOption.nextElementSibling as HTMLElement | null;
        if (nextOption) {
            nextOption.focus();
        }
    }

    private focusPreviousOption(currentOption: HTMLElement): void {
        const previousOption = currentOption.previousElementSibling as HTMLElement | null;
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
        if (isNaN(hours) || isNaN(minutes)) {
            throw new Error(`TimePicker: Invalid time format: ${time}`);
        }
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
            return this.convert12To24Hour(timeString);
        }

        return timeString;
    }

    private convert12To24Hour(time12h: string): string {
        const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) {
            throw new Error(`TimePicker: Invalid 12h time format: ${time12h}`);
        }

        const [, hoursStr, minutes, period] = match;
        let hours = parseInt(hoursStr, 10);

        if (period.toUpperCase() === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period.toUpperCase() === 'AM' && hours === 12) {
            hours = 0;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }

    private selectTime(time: string): void {
        this.selectedTime = time;
        this.element.value = this.formatTime(time);
        this.close();

        this.updateSelectedOption(time);
        this.triggerChange(time);
    }

    private updateSelectedOption(time: string): void {
        this.timeList.querySelectorAll('.time-picker-option').forEach((option: Element) => {
            option.classList.remove('selected');
            if ((option as HTMLElement).dataset.time === time) {
                option.classList.add('selected');
            }
        });
    }

    private triggerChange(time: string): void {
        if (this.options.onChange) {
            this.options.onChange(time, this.formatTime(time));
        }

        const event = new Event('change', { bubbles: true });
        this.element.dispatchEvent(event);
    }

    private bindEvents(): void {
        this.element.addEventListener('click', this.handleElementClick.bind(this));
        this.element.addEventListener('focus', this.handleElementFocus.bind(this));
        this.element.addEventListener('keydown', this.handleInputKeydown.bind(this));
        document.addEventListener('click', this.handleDocumentClick.bind(this));
    }

    private handleElementClick(e: Event): void {
        e.preventDefault();
        if (!this.options.disabled) {
            this.toggle();
        }
    }

    private handleElementFocus(): void {
        if (!this.options.disabled) {
            this.open();
        }
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
                this.handleArrowDown();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.handleArrowUp();
                break;
        }
    }

    private handleArrowDown(): void {
        if (!this.isOpen) {
            this.open();
        } else {
            const firstOption = this.timeList.querySelector('.time-picker-option') as HTMLElement | null;
            firstOption?.focus();
        }
    }

    private handleArrowUp(): void {
        if (!this.isOpen) {
            this.open();
        } else {
            const options = this.timeList.querySelectorAll('.time-picker-option');
            const lastOption = options[options.length - 1] as HTMLElement | null;
            lastOption?.focus();
        }
    }

    private handleDocumentClick(e: Event): void {
        const target = e.target as Element;
        if (!this.element.contains(target) && !this.dropdown.contains(target)) {
            this.close();
        }
    }

    private open(): void {
        if (this.isOpen || this.options.disabled) return;

        this.isOpen = true;
        this.dropdown.style.display = 'block';
        this.dropdown.setAttribute('aria-expanded', 'true');
        this.positionDropdown();
        this.scrollToSelected();
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

    private scrollToSelected(): void {
        const selectedOption = this.timeList.querySelector('.selected') as HTMLElement | null;
        selectedOption?.scrollIntoView({ block: 'nearest' });
    }

    private positionDropdown(): void {
        const rect = this.element.getBoundingClientRect();
        const dropdownHeight = this.dropdown.offsetHeight;
        const viewportHeight = window.innerHeight;

        let top = rect.bottom + window.scrollY;

        if (rect.bottom + dropdownHeight > viewportHeight) {
            top = rect.top + window.scrollY - dropdownHeight;
        }

        this.dropdown.style.position = 'absolute';
        this.dropdown.style.top = `${top}px`;
        this.dropdown.style.left = `${rect.left + window.scrollX}px`;
        this.dropdown.style.width = `${rect.width}px`;
        this.dropdown.style.zIndex = '1000';
    }

    // Public API
    public getValue(): string {
        return this.selectedTime;
    }

    public getFormattedValue(): string {
        return this.formatTime(this.selectedTime);
    }

    public setValue(time: string): void {
        const parsedTime = this.parseTime(time);
        if (!this.isTimeInRange(parsedTime)) {
            throw new Error(`TimePicker: Time "${time}" is outside the allowed range`);
        }
        this.selectTime(parsedTime);
    }

    public enable(): void {
        (this.options as any).disabled = false; // Cast to bypass readonly
        this.element.removeAttribute('disabled');
    }

    public disable(): void {
        (this.options as any).disabled = true; // Cast to bypass readonly
        this.element.setAttribute('disabled', 'true');
        this.close();
    }

    public isDisabled(): boolean {
        return this.options.disabled;
    }

    public isOpened(): boolean {
        return this.isOpen;
    }

    public getOptions(): TimePickerOptions {
        return { ...this.options };
    }

    public destroy(): void {
        this.dropdown.remove();
        this.element.classList.remove('time-picker-input');
        this.element.removeAttribute('readonly');
        this.element.removeAttribute('aria-expanded');
    }

    // Static utility methods
    public static convertTo24Hour(time12h: string): string {
        if (!time12h) return '';

        const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return time12h;

        const [, hoursStr, minutes, period] = match;
        let hours = parseInt(hoursStr, 10);

        if (period.toUpperCase() === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period.toUpperCase() === 'AM' && hours === 12) {
            hours = 0;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes}`;
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
}

// Auto-initialize
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

// Export
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
