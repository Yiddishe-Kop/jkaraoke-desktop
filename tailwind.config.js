const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    '**/*.html',
    '**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#D8DF25',
        gray: {
          50: '#fbfdfe',
          80: '#EFF4F8',
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        purple: {
          100: '#FAF5FF',
          200: '#E9D8FD',
          300: '#D6BCFA',
          400: '#B794F4',
          500: '#9F7AEA',
          600: '#805AD5',
          700: '#6B46C1',
          800: '#553C9A',
          900: '#44337A',
          1000: '#251558'
        }
      },
      fontFamily: {
        sans: ['Heebo var', ...defaultTheme.fontFamily.sans],
        siddur: ['siddur', 'Heebo var', ...defaultTheme.fontFamily.sans],
        sbl: ['SBLhebrew', 'Heebo var', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: '0.675rem',
        '7xl': '6rem',
        '8xl': '7rem',
      },
      borderRadius: {
        xl: '1rem'
      },
      animation: {
        ping: 'ping 3s ease infinite'
      }
    },
  },
  variants: {
    fill: ['responsive', 'hover', 'focus', 'group-hover'],
    opacity: ['hover', 'focus', 'group-hover'],
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
    zIndex: ['responsive', 'focus'],
    boxShadow: ['hover', 'focus', 'focus-within'],
    backgroundColor: ['hover', 'focus', 'focus-within'],
  },
  plugins: [
    require('@tailwindcss/ui'),
  ],
}
