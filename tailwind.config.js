/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,tsx}'],
  theme: {
    extend: {
      colors: {
        button: 'hsla(54, 100%, 88%, 1)',
        tint: 'hsla(54, 65%, 90%, 1)',
        primary: 'hsla(54, 100%, 10%, 1)',
        white: 'hsla(55, 100%, 98%, 1)',
        black: 'hsla(54, 100%, 5%, 1)',
        secondary: 'hsla(54, 100%, 50%, 1)',
        tertiary: '#CDDC39',
        muted: 'hsla(54, 32%, 57%, 1)',
        'dark-muted': 'hsla(54, 32%, 44%, 1)',
      },

      width: { icon: '24px', 'large-icon': '36px' },
      fontFamily: {
        sans: ['GeneralSans-Variable'],
      },
      scale: {
        200: '2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
  daisyui: {
    themes: [{
      light: {
        button: 'hsla(54, 100%, 88%, 1)',
        tint: 'hsla(54, 65%, 90%, 1)',
        primary: 'hsla(54, 100%, 10%, 1)',
        neutral: 'hsla(54, 100%, 20%, 1)',
        white: 'hsla(55, 100%, 98%, 1)',
        'base-content': 'hsla(55, 100%, 5%, 1)',
        black: 'hsla(54, 100%, 5%, 1)',
        'base-100': 'hsla(54, 65%, 90%, 1)',
        secondary: 'hsla(54, 100%, 50%, 1)',
        tertiary: '#CDDC39',
        accent: '#CDDC39',
        muted: 'hsla(54, 32%, 57%, 1)',
        'dark-muted': 'hsla(54, 32%, 44%, 1)',
        'info': '#3abff8',
        'success': '#36d399',
        'warning': 'hsl(43, 100%, 45%)',
        'error': 'hsl(0, 100%, 50%)',
      },
    }],
    base: false,
  },
}
