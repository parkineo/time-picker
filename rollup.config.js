import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [
    // ES Module build
    {
        input: 'src/time-picker.ts',
        output: {
            file: 'dist/time-picker.esm.js',
            format: 'es',
            sourcemap: true
        },
        plugins: [
            nodeResolve(),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: false, // We'll use tsc for declarations
            })
        ]
    },
    // IIFE build
    {
        input: 'src/time-picker.ts',
        output: {
            file: 'dist/time-picker.js',
            format: 'iife',
            name: 'TimePicker',
            sourcemap: true
        },
        plugins: [
            nodeResolve(),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: false,
            })
        ]
    },
    // Minified UMD build
    {
        input: 'src/time-picker.ts',
        output: {
            file: 'dist/time-picker.min.js',
            format: 'iife',
            name: 'TimePicker',
            sourcemap: true
        },
        plugins: [
            nodeResolve(),
            typescript({
                tsconfig: './tsconfig.json',
                declaration: false,
            }),
            terser()
        ]
    }
];
