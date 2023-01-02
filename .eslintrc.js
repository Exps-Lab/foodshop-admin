module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-essential"
  ],
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "vue"
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'camelcase': 'off',
    // 子组件修改父组件props
    'vue/no-mutating-props': 'off',
    'no-case-declarations': 'off',
    'no-new': 'off',
    'vue/no-setup-props-destructure': 'off'
  }
}
