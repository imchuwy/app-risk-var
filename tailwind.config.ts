import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-ui)'],
        headline: ['var(--font-display)'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(from var(--canvas) h s l / <alpha-value>)',
        foreground: 'hsl(from var(--text) h s l / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(from var(--surface) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--text) h s l / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(from var(--surface) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--text) h s l / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(from var(--action) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--on-action) h s l / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(from var(--surface-raised) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--text) h s l / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(from var(--surface-raised) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--text-muted) h s l / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(from var(--selected) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--on-selected) h s l / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(from var(--danger) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--surface) h s l / <alpha-value>)',
        },
        border: 'hsl(from var(--border) h s l / <alpha-value>)',
        input: 'hsl(from var(--control-border) h s l / <alpha-value>)',
        ring: 'hsl(from var(--focus) h s l / <alpha-value>)',
        chart: {
          '1': 'hsl(from var(--chart-1) h s l / <alpha-value>)',
          '2': 'hsl(from var(--chart-2) h s l / <alpha-value>)',
          '3': 'hsl(from var(--chart-3) h s l / <alpha-value>)',
          '4': 'hsl(from var(--chart-4) h s l / <alpha-value>)',
          '5': 'hsl(from var(--chart-5) h s l / <alpha-value>)',
        },
        sidebar: {
          DEFAULT: 'hsl(from var(--surface) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--text) h s l / <alpha-value>)',
          primary: 'hsl(from var(--action) h s l / <alpha-value>)',
          'primary-foreground': 'hsl(from var(--on-action) h s l / <alpha-value>)',
          accent: 'hsl(from var(--selected) h s l / <alpha-value>)',
          'accent-foreground': 'hsl(from var(--on-selected) h s l / <alpha-value>)',
          border: 'hsl(from var(--border) h s l / <alpha-value>)',
          ring: 'hsl(from var(--focus) h s l / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
