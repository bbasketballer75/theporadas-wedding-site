/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Wedding theme colors
        sage: '#7ca982',
        blush: '#d8a7b1',
        cream: '#fbeaea',
        mint: '#e9f5ec',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        body: ['var(--font-lora)', 'serif'],
      },
      backgroundImage: {
        'gradient-sage-blush': 'linear-gradient(135deg, #7ca982 0%, #d8a7b1 100%)',
        'gradient-blush-sage': 'linear-gradient(135deg, #d8a7b1 0%, #7ca982 100%)',
      },
    },
  },
  plugins: [],
};
