module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      "airbnb-typescript",
      "plugin:@typescript-eslint/recommended"
    ],
    plugins: ['@typescript-eslint'],
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      project: 'tsconfig.json',
    },
    env: {
      es6: true,
      node: true,
    },
    rules: {
      'no-var': 'error',
      semi: 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-multi-spaces': 'error',
      'space-in-parens': 'error',
      'no-multiple-empty-lines': 'error',
      'prefer-const': 'error',
      "import/extensions": 0,
      "import/no-extraneous-dependencies": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "react/jsx-filename-extension": 0,
      "@typescript-eslint/dot-notation": 0
    },
  };
  