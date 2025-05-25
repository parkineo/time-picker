// src/umd-wrapper.js
/**
 * UMD wrapper for TimePicker to ensure browser compatibility
 * This file can be used if you need the old-style module exports
 */

// Import the ES module
import TimePicker from './time-picker.js';

// UMD Pattern
(function (root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else {
        // Browser globals (root is window)
        root.TimePicker = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    return TimePicker;
}));
