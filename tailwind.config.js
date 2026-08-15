/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        accent: ['var(--font-accent)', 'sans-serif'],
      },
      colors: {
        // Brand palette: dark "ink" for backgrounds, warm "paper" for
        // typography/titles/light surfaces. Overriding Tailwind's core
        // black/white means every existing bg-black, text-white,
        // border-white/10, fill-white, etc. across the whole site picks
        // these up automatically — no need to touch each usage.
        black: '#0C0C0C',
        white: '#F5F3EE',
      },
    },
  },
  plugins: [],
}
