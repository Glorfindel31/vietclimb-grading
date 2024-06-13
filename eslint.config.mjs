import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import withNuxt from './.nuxt/eslint.config.mjs'

// Define your custom configuration
const customConfig = {
  rules: {
    'vue/html-self-closing': ['off'],
    'no-tabs': 'off',
    'operator-linebreak': 0,
    'stylistic/brace-style': 0,
  },
  ...eslintPluginPrettierRecommended,
  ...eslintConfigPrettier,
}

export default withNuxt({
  ...customConfig,
})
