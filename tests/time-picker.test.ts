/**
 * Comprehensive test suite for TimePicker
 */

import TimePicker, { TimePickerOptions } from '../src/time-picker';

// Setup DOM environment
const setupDOM = () => {
    document.body.innerHTML = '';
    const input = document.createElement('input');
    input.id = 'test-input';
    input.type = 'text';
    document.body.appendChild(input);
    return input;
};

describe('TimePicker', () => {
    let input: HTMLInputElement;
    let picker: TimePicker;

    beforeEach(() => {
        input = setupDOM();
    });

    afterEach(() => {
        if (picker) {
            picker.destroy();
        }
        document.body.innerHTML = '';
    });

    describe('Initialization', () => {
        test('should initialize with default options', () => {
            picker = new TimePicker(input);

            expect(input.classList.contains('time-picker-input')).toBe(true);
            expect(input.getAttribute('readonly')).toBe('true');
            expect(input.getAttribute('placeholder')).toBe('--:--');
        });

        test('should initialize with custom options', () => {
            const options: TimePickerOptions = {
                format: '24h',
                placeholder: 'Custom placeholder',
                defaultTime: '14:30'
            };

            picker = new TimePicker(input, options);

            expect(input.getAttribute('placeholder')).toBe('Custom placeholder');
            expect(input.value).toBe('14:30');
        });

        test('should throw error for invalid selector', () => {
            expect(() => {
                new TimePicker('#non-existent');
            }).toThrow('TimePicker: Element not found');
        });

        test('should throw error for non-input element', () => {
            const div = document.createElement('div');
            document.body.appendChild(div);

            expect(() => {
                new TimePicker(div as any);
            }).toThrow('TimePicker: Element must be an input element');
        });
    });

    describe('Time formatting', () => {
        test('should format time in 12h format', () => {
            picker = new TimePicker(input, { format: '12h' });

            picker.setValue('14:30');
            expect(input.value).toBe('2:30 PM');

            picker.setValue('09:15');
            expect(input.value).toBe('9:15 AM');
        });

        test('should format time in 24h format', () => {
            picker = new TimePicker(input, { format: '24h' });

            picker.setValue('14:30');
            expect(input.value).toBe('14:30');

            picker.setValue('09:15');
            expect(input.value).toBe('09:15');
        });
    });

    describe('Value management', () => {
        beforeEach(() => {
            picker = new TimePicker(input);
        });

        test('should get and set values correctly', () => {
            picker.setValue('14:30');
            expect(picker.getValue()).toBe('14:30');
            expect(picker.getFormattedValue()).toBe('2:30 PM');
        });

        test('should handle empty values', () => {
            expect(picker.getValue()).toBe('');
            expect(picker.getFormattedValue()).toBe('');
        });

        test('should parse 12h format input', () => {
            picker.setValue('2:30 PM');
            expect(picker.getValue()).toBe('14:30');
        });
    });

    describe('Time range validation', () => {
        test('should respect min and max time', () => {
            picker = new TimePicker(input, {
                minTime: '09:00',
                maxTime: '17:00'
            });

            expect(() => picker.setValue('08:00')).toThrow();
            expect(() => picker.setValue('18:00')).toThrow();

            // Valid times should work
            picker.setValue('12:00');
            expect(picker.getValue()).toBe('12:00');
        });
    });

    describe('Options updates', () => {
        beforeEach(() => {
            picker = new TimePicker(input);
        });

        test('should update options dynamically', () => {
            picker.updateOptions({ format: '24h', placeholder: 'New placeholder' });

            const options = picker.getOptions();
            expect(options.format).toBe('24h');
            expect(options.placeholder).toBe('New placeholder');
            expect(input.getAttribute('placeholder')).toBe('New placeholder');
        });
    });

    describe('Enable/Disable functionality', () => {
        beforeEach(() => {
            picker = new TimePicker(input);
        });

        test('should enable and disable picker', () => {
            picker.disable();
            expect(picker.isDisabled()).toBe(true);
            expect(input.hasAttribute('disabled')).toBe(true);

            picker.enable();
            expect(picker.isDisabled()).toBe(false);
            expect(input.hasAttribute('disabled')).toBe(false);
        });
    });

    describe('Event handling', () => {
        beforeEach(() => {
            picker = new TimePicker(input);
        });

        test('should call onChange callback', (done) => {
            const onChange = jest.fn((_time: string, _formatted: string) => {
                expect(_time).toBe('14:30');
                expect(_formatted).toBe('2:30 PM');
                done();
            });

            picker.updateOptions({ onChange });
            picker.setValue('14:30');
        });

        test('should dispatch change event', () => {
            const changeHandler = jest.fn();
            input.addEventListener('change', changeHandler);

            picker.setValue('14:30');
            expect(changeHandler).toHaveBeenCalled();
        });
    });

    describe('Static utility methods', () => {
        test('should convert time formats', () => {
            expect(TimePicker.convertTo24Hour('2:30 PM')).toBe('14:30');
            expect(TimePicker.convertTo12Hour('14:30')).toBe('2:30 PM');
        });

        test('should validate time formats', () => {
            expect(TimePicker.isValidTime('14:30', '24h')).toBe(true);
            expect(TimePicker.isValidTime('2:30 PM', '12h')).toBe(true);
            expect(TimePicker.isValidTime('25:00', '24h')).toBe(false);
            expect(TimePicker.isValidTime('13:30 PM', '12h')).toBe(false);
        });

        test('should compare times', () => {
            expect(TimePicker.compareTime('14:30', '15:00')).toBeLessThan(0);
            expect(TimePicker.compareTime('15:00', '14:30')).toBeGreaterThan(0);
            expect(TimePicker.compareTime('14:30', '14:30')).toBe(0);
        });

        test( 'should not be opened', () => {
            expect(picker.isOpened()).toBe(false);
        })
    });
});
