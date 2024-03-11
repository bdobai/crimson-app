module.exports = {
  singleQuote: true,
  arrowParens: 'avoid',
  printWidth: 100,
  tabWidth: 2,

  // Prettier sort plugin https://github.com/trivago/prettier-plugin-sort-imports
  importOrder: [
    '^(react|react-native|react-native(.*))$',
    '<THIRD_PARTY_MODULES>',
    '^@app/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
