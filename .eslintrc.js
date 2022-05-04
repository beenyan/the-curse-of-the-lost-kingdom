module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-strongly-recommended', 'eslint:recommended', 'prettier'],
  plugins: ['vue'],
  rules: {
    'no-undef': 'off',
    'vue/require-default-prop': 'off',
    'no-unused-vars': 'off',
    'no-shadow': 'off',
    'vue/no-template-shadow': 'off',
    'no-prototype-builtins': 'off',
  },
};
