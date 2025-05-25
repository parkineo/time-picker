/**
 * TimePicker - A lightweight, framework-agnostic time picker component
 * @version 1.0.0
 * @author parkineo
 * @license MIT
 */

import {TimeUtils} from './utils';

export interface TimePickerOptions {
    format?: '12h' | '24h';
    defaultTime?: string;
    minTime?: string | null;
    maxTime?: string | null;
    step?: number;
    placeholder?: string;
    disabled?: boolean;
    onChange?: ((_time: string, _formattedTime: string) => void) | null;
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
    private dropdown!: HTMLDivElement;
    private timeList!: HTMLDivElement;
    private isOpen: boolean = false;
    private selectedTime: string = '';

    constructor(selector: string | HTMLInputElement, options: TimePickerOptions = {}) {
        const element = typeof selector === 'string'
            ? document.querySelector<HTMLInputElement>(selector)
            : selector;

        if (!element) {
            throw new Error('TimePicker: Element not found');
        }
        this.element = element;

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
            this.element.value = TimeUtils.formatTime(this.selectedTime, this.options.format);
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
        this.dropdown.setAttribute('role', 'listbox');
        this.dropdown.setAttribute('aria-expanded', 'false');

        this.timeList = document.createElement('div');
        this.timeList.className = 'time-picker-list';
        this.timeList.setAttribute('role', 'list');

        this.populateTimeList();
        this.dropdown.appendChild(this.timeList);

        const parent = this.element.parentNode;
        if (!parent) {
            throw new Error('TimePicker: Input element must have a parent node');
        }
        parent.insertBefore(this.dropdown, this.element.nextSibling);
    }

    private populateTimeList(): void {
        // Use TimeUtils to generate time options
        const range = (this.options.minTime && this.options.maxTime)
            ? {start: this.options.minTime, end: this.options.maxTime}
            : undefined;

        const times = TimeUtils.generateTimeOptions(this.options.step, range);

        times.forEach((time: string) => {
            const timeOption = document.createElement('div');
            timeOption.className = 'time-picker-option';
            timeOption.textContent = TimeUtils.formatTime(time, this.options.format);
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

    private isTimeInRange(time: string): boolean {
        if (!this.options.minTime && !this.options.maxTime) {
            return true;
        }

        const range = {
            start: this.options.minTime || '00:00',
            end: this.options.maxTime || '23:59'
        };

        return TimeUtils.isTimeInRange(time, range);
    }

    private selectTime(time: string): void {
        this.selectedTime = time;
        this.element.value = TimeUtils.formatTime(time, this.options.format);
        this.close();

        // Update selected option styling
        this.timeList.querySelectorAll('.time-picker-option').forEach((option: Element) => {
            option.classList.remove('selected');
            if ((option as HTMLElement).dataset.time === time) {
                option.classList.add('selected');
            }
        });

        if (this.options.onChange) {
            this.options.onChange(time, TimeUtils.formatTime(time, this.options.format));
        }

        // Trigger change event
        const event = new Event('change', {bubbles: true});
        this.element.dispatchEvent(event);
    }

    private bindEvents(): void {
        this.element.addEventListener('click', (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
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
            setTimeout(() => {
                if (!this.element.contains(target) && !this.dropdown.contains(target)) {
                    this.close();
                }
            }, 0);
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
            selectedOption.scrollIntoView({block: 'nearest'});
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
        return TimeUtils.formatTime(this.selectedTime, this.options.format);
    }

    public setValue(time: string): void {
        const parsedTime = TimeUtils.parseTime(time);
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
        this.options = {...this.options, ...newOptions};

        // Recreate dropdown with new options
        if (this.dropdown && this.dropdown.parentNode) {
            this.dropdown.remove();
        }
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
        return {...this.options};
    }

    public isDisabled(): boolean {
        return this.options.disabled;
    }

    public isOpened(): boolean {
        return this.isOpen;
    }

    public destroy(): void {
        if (this.dropdown && this.dropdown.parentNode) {
            this.dropdown.remove();
        }

        this.element.classList.remove('time-picker-input');
        this.element.removeAttribute('readonly');
        this.element.removeAttribute('aria-expanded');
    }

    // Static utility methods - now delegate to TimeUtils
    public static convertTo24Hour(time12h: string): string {
        return TimeUtils.convertTo24Hour(time12h);
    }

    public static convertTo12Hour(time24h: string): string {
        return TimeUtils.convertTo12Hour(time24h);
    }

    public static isValidTime(time: string, format: TimeFormat = '24h'): boolean {
        return TimeUtils.validateTime(time, format).isValid;
    }

    public static compareTime(time1: string, time2: string): number {
        return TimeUtils.compareTime(time1, time2);
    }
}

// Auto-initialize elements with data-time-picker attribute
document.addEventListener('DOMContentLoaded', function () {
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

export default TimePicker;
