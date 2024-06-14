import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import withNuxt from './.nuxt/eslint.config.mjs'

// Define your custom configuration
const customConfig = {
  plugins: {
    ...eslintPluginPrettierRecommended,
  },
  rules: {
    'vue/html-self-closing': 'off',
    'no-tabs': 'off',
    'operator-linebreak': 'off',
    'stylistic/brace-style': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
}
export default withNuxt({
  ...eslintConfigPrettier,
  ...customConfig,
})
