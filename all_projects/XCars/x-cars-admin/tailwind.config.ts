import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    {
      pattern:
        /from-(green|blue|red|yellow|purple|orange|gray|sky|pink)-(300|600)/,
    },
    {
      pattern:
        /to-(green|blue|red|yellow|purple|orange|gray|sky|pink)-(300|600)/,
    },
    {
      pattern:
        /text-(green|blue|red|yellow|purple|orange|gray|sky|pink)-(300|600)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          red: '#fad2d7',
          yellow: '#D6E5FC',
          green: '#EEF0B3',
          purple: '#e9cef5',
        },
        text: {
          red: '#f25567',
          yellow: '#94bdfa',
          green: '#e3e576',
          purple: '#c862f5',
        },
        icons: {
          pending: '',
          approved: '',
          sold: '',
          diabled: '',
          quotationExpired: '',
        },
        overlay: 'rgba(0, 0, 0, 0.25)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
    keyframes: {
      glow: {
        '0%, 100%': { boxShadow: '0 0 15px 5px rgba(34, 197, 94, 0.2)' }, // Soft green glow
        '50%': { boxShadow: '0 0 25px 10px rgba(34, 197, 94, 0.5)' }, // Intense green glow
      },
    },
    animation: {
      glow: 'glow 2s infinite',
    },
  },
  plugins: [nextui()],
};
export default config;
