module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
    ],
    env: {
        'browser': true,
    },
    rules: {
        'max-len': [2, 120],
        'import/prefer-default-export': 0,
        'import/no-unresolved': 0,
        'import/extensions': [2, 'always'],
        'no-multi-spaces': 1,
        'no-plusplus': 0,
        'no-use-before-define': [2, 'nofunc'],
        '@typescript-eslint/no-use-before-define': [2, 'nofunc'],
        'object-curly-spacing': 0,
        'object-curly-newline': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        'lines-between-class-members': [1, 'always', {"exceptAfterSingleLine": true}],
        'no-underscore-dangle': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
    },
};
