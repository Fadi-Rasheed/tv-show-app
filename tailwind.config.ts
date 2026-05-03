import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0618',
        foreground: '#f1f0ff',
        surface: '#170f2f',
        muted: '#a3a0bf',
        border: '#352a5c',
        accent: '#5f3dff',
        ring: '#855cff',
        brand: {
          DEFAULT: '#8247ff',
          soft: '#6554ad',
          strong: '#a977ff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Avenir Next', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'Avenir Next', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Avenir Next', 'system-ui', 'sans-serif'],
        header: ['Poppins', 'Inter', 'Avenir Next', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'header-xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'header-lg': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'header-md': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'header-sm': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      },
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      width: {
        'poster-tile-sm': '120px',
        'poster-tile-md': '160px',
        'poster-tile-lg': '176px',
        'poster-tile-xl': '200px',
      },
      flexBasis: {
        'poster-tile-sm': '120px',
        'poster-tile-md': '160px',
        'poster-tile-lg': '176px',
        'poster-tile-xl': '200px',
      },
      maxWidth: {
        'poster-tile-sm': '120px',
        'poster-tile-md': '160px',
        'poster-tile-lg': '176px',
        'poster-tile-xl': '200px',
      },
      height: {
        'poster-tile-sm': '224px',
        'poster-tile-md': '288px',
        'poster-tile-lg': '320px',
        'poster-tile-xl': '360px',
      },
    },
  },
  plugins: [],
} satisfies Config
