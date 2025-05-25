// eslint.config.js (Modern flat config)
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
    js.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                project: './tsconfig.json'
            },
            globals: {
                console: 'readonly',
                document: 'readonly',
                window: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': tseslint
        },
        rules: {
            // Turn off base rule completely
            'no-unused-vars': 'off',

            // Use TypeScript version with underscore prefix support
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_'
            }],

            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-non-null-assertion': 'warn',

            // Modern JavaScript
            'prefer-const': 'error',
            'no-var': 'error',

            // Development
            'no-console': 'warn'
        }
    },
    {
        ignores: [
            'dist/**/*',
            'node_modules/**/*',
            'examples/**/*',
            'coverage/**/*',
            '*.js',
            '*.cjs',
            '*.mjs'
        ]
    }
];
