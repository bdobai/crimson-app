module.exports = {
  root: true,
  extends: ['universe/native', 'plugin:react-hooks/recommended', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        curly: 'error',
        'import/order': 'off',
        'react/jsx-curly-brace-presence': [1, 'never'],
      },
    },
  ],
  ignorePatterns: ['*typegen*', '*.json', 'node_modules/**'],
};
