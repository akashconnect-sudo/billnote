/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/.expo/**',
      '**/coverage/**',
      '**/node_modules/**',
    ],
  },
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "TSTypeReference[typeName.name='number'] ~ Identifier[name=/Paise$|Milli$/]",
          message:
            'Do not use number for Paise or Milli amounts. Use bigint via @billnote/shared/money.',
        },
      ],
    },
  },
]
