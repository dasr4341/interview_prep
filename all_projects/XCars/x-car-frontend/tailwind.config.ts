import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        theme: 'var(--theme)',
        overlay: 'rgba(0, 0, 0, 0.25)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        grayColor: 'var(--grayColor)',
      },
    },
  },
  plugins: [],
};
export default config;
