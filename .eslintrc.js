module.exports = {
  extends: [
    // 'eslint-config-secure',
    'eslint-config-standard',
    'plugin:eslint-plugin-sonarjs/recommended'
  ],
  env: {
    'browser': true,
    'mocha': true
  },
  'globals': {
    'after': true,
    'afterEach': true,
    'before': true,
    'beforeEach': true,
    'customElements': true,
    'CustomEvent': true,
    'describe': true,
    'Event': true,
    'expect': true,
    'FS': true,
    'it': true,
    'location': true,
    'sinon': true
  },
  'parser': 'babel-eslint',
  /**
   * @property plugins - Additional linter plugins.
   * @note - Code Climate does not support various plugins, yet (like sonarjs), and breaks if they are present.
   */
  'plugins': [
    'eslint-plugin-jsdoc',
    'eslint-plugin-json',
    // Enable plugins that are not natively supported by Code Climate. Otherwise results in build errors.
    'eslint-plugin-deprecate',
    'eslint-plugin-sonarjs'
  ],
  'rules': {
    'jsdoc/check-alignment': 'warn',
    'jsdoc/check-examples': 'warn',
    'jsdoc/check-indentation': 'off',
    'jsdoc/check-param-names': 'warn',
    'jsdoc/check-syntax': 'warn',
    'jsdoc/check-tag-names': 'warn',
    'jsdoc/check-types': 'warn',
    'jsdoc/implements-on-classes': 'warn',
    'jsdoc/match-description': 'warn',
    'jsdoc/newline-after-description': 'off',
    'jsdoc/no-types': 'off',
    'jsdoc/no-undefined-types': 'off', // This was broken in eslint-plugin-jsdoc#8 in 2019-06. Disabled, for now. Check back later.
    'jsdoc/require-description-complete-sentence': 'off',
    'jsdoc/require-description': 'warn',
    'jsdoc/require-example': 'off',
    'jsdoc/require-hyphen-before-param-description': 'warn',
    'jsdoc/require-jsdoc': 'warn',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-name': 'warn',
    'jsdoc/require-param-type': 'warn',
    'jsdoc/require-param': 'warn',
    'jsdoc/require-returns-check': 'warn',
    'jsdoc/require-returns-description': 'warn',
    'jsdoc/require-returns-type': 'warn',
    'jsdoc/require-returns': 'warn',
    'jsdoc/valid-types': 'warn',

    'jsx-quotes': 'off',

    'no-else-return': 'off',
    'no-extra-semi': 'error',
    'no-shadow': 'warn',
    'no-invalid-this': 'off',
    'no-warning-comments': ['warn', { 'terms': ['FIXME', 'TODO', 'TO-DO', 'HACK', 'HERE BE DRAGONS'], 'location': 'anywhere' }],
    'no-undefined': 'warn',
    'no-case-declarations': 'off',
    'object-curly-spacing': 'off',
    'semi': ['error', 'always'],
  }
}



