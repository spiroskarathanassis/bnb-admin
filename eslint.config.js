import prettier from 'eslint-plugin-prettier';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortKeys from 'eslint-plugin-sort-keys';

export default [
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
      },
    },
    plugins: {
      prettier,
      vue,
      'simple-import-sort': simpleImportSort,
      'sort-keys': sortKeys,
    },
    rules: {
      'vue/no-v-html': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/attributes-order': 'error',
      // 'vue/sort-keys': 'error',

      'prettier/prettier': ['error'],

      'simple-import-sort/imports': 'error',

      'sort-keys/sort-keys-fix': 1,

      'prefer-const': 'error',
      'sort-keys': 0,
    },
  },
];
