// .eslintrc.cjs (CommonJS format)
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended'
    ],
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json'
    },
    env: {
        browser: true,
        es2020: true,
        node: true,
        jest: true
    },
    rules: {
        // Allow unused vars if they start with underscore
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
        }],
        'no-unused-vars': 'off', // Let TypeScript handle this

        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'warn',

        // Prefer const
        'prefer-const': 'error',
        'no-var': 'error',

        // Console warnings in development
        'no-console': 'warn'
    },
    ignorePatterns: [
        'dist/**/*',
        'node_modules/**/*',
        'examples/**/*',
        'coverage/**/*',
        '*.js',
        '*.cjs',
        '*.mjs'
    ]
};
