// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017
  },
  env: {
    browser: true,
    mocha: true
  },
  extends: 'standard',
  
  // Custom Rules
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    
    
    /* Rob's tweaks */
    
    
    // Disallow trailing spaces, exept on blank lines
    'no-trailing-spaces': ["error", { "skipBlankLines": true }],
    
    // Allow empty lines at the start / end of a block
    'padded-blocks': 'off',
    
    // Make else & catch on line after '}'
    'brace-style': ["error", "stroustrup", { "allowSingleLine": true } ],
    
    // Allow arbitrary empty lines
    'no-multiple-empty-lines': 'off',
    
    // Only warn for unused variables
    'no-unused-vars': 'warn',
    
    // No space between function names and the args (exepct for async arrow functions)
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }],
  },
  
  // Custom globals ... don't use globals
  "globals": {
  }
}
