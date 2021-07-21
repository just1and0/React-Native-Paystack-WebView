const IGNORE = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:import/errors',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  plugins: ['react', 'react-native', '@typescript-eslint', 'import'],
  rules: {
    // Allow imports from dev and peer dependencies
    'import/no-extraneous-dependencies': [ERROR, { devDependencies: true, peerDependencies: true }],
    'no-unused-vars': WARN,
    'no-shadow': IGNORE,
    'import/no-unresolved': IGNORE,
    'import/extensions': [
      ERROR,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/prop-types': IGNORE,
    'no-use-before-define': IGNORE,
    'react/jsx-filename-extension': IGNORE,
    'no-case-declarations': IGNORE,
    'no-unused-expressions': IGNORE,
    'object-curly-newline': IGNORE,
    'prefer-template': IGNORE,
  },
};
