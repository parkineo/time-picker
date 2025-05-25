/**
 * Test setup configuration
 */

// Note: jest-dom/extend-expect is deprecated, use @testing-library/jest-dom instead
// import '@testing-library/jest-dom';

// Mock DOM methods that might not be available in test environment
Object.defineProperty(window, 'scrollY', {
    value: 0,
    writable: true
});

Object.defineProperty(window, 'scrollX', {
    value: 0,
    writable: true
});

Object.defineProperty(Element.prototype, 'scrollIntoView', {
    value: jest.fn(),
    writable: true
});

// Mock getBoundingClientRect for positioning tests
Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
    value: jest.fn(() => ({
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
        toJSON: jest.fn()
    })),
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
