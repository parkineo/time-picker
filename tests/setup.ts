/**
 * Test setup configuration
 */

import 'jest-dom/extend-expect';

// Mock DOM methods that might not be available in test environment
Object.defineProperty(window, 'scrollY', {
    value: 0,
    writable: true
});

Object.defineProperty(Element.prototype, 'scrollIntoView', {
    value: jest.fn(),
    writable: true
});

// Setup console suppression for expected errors in tests
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: any[]) => {
        if (args[0]?.includes?.('TimePicker:')) {
            return; // Suppress expected TimePicker errors in tests
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});
