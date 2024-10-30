import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  ...pluginQuery.configs['flat/recommended'],
  ...{
    extends: ['next/core-web-vitals', 'next/typescript'],
  },
]
