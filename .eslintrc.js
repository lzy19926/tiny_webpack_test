module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: [
    'react',
    'lzy-react'
  ],
  rules: {
    // varsIgnorePattern 选项指定了不需要检测的异常 (LzyReact不检测为unuse)
    'no-unused-vars': ['error', { varsIgnorePattern: 'LzyReact' }],

    // 使用自定义规则文件
    'lzy-react/lzyReact-in-jsx-scope': 'error',
    'lzy-react/lzyReact-hooks': 'error',
    // React魔改
    'react/react-in-jsx-scope': 'off'
  }
}
