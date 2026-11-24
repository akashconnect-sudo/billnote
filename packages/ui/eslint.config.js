import tseslint from 'typescript-eslint'
import base from '@billnote/config/eslint/base'

export default tseslint.config(...base, ...tseslint.configs.recommended, {
  files: ['src/**/*.{ts,tsx}'],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
