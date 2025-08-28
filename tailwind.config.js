/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4361EE',
          50: '#F0F5FF',
          100: '#E0EBFF',
          200: '#C7DBFF',
          300: '#93B5FF',
          400: '#5E8BFF',
          500: '#4361EE',
          600: '#3B50D0',
          700: '#2F3FAC',
          800: '#242F85',
          900: '#1C2460',
        },
        secondary: {
          DEFAULT: '#7209B7',
          50: '#F5F0FA',
          100: '#E8DCF7',
          200: '#D3B5F0',
          300: '#B88AE8',
          400: '#9C60E0',
          500: '#7209B7',
          600: '#63089C',
          700: '#4E0778',
          800: '#390554',
          900: '#260337',
        },
        accent: {
          DEFAULT: '#06D6A0',
          50: '#EBFFF9',
          100: '#D0FDF0',
          200: '#A3F9E0',
          300: '#67F4CD',
          400: '#2EEFB9',
          500: '#06D6A0',
          600: '#05B687',
          700: '#048C68',
          800: '#03634A',
          900: '#023A2C',
        },
        dark: {
          DEFAULT: '#0F172A',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 15px 50px rgba(0, 0, 0, 0.08)',
        'deep': '0 20px 40px rgba(0, 0, 0, 0.12)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography')
  ]
}
