/** @type {import('tailwindcss').Config} */
export default {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sophisticated Wedding Color Palette (2025)
        // Primary Colors - Rich & Deep
        sage: {
          50: '#f0f7f2',
          100: '#d9ebe0',
          200: '#b3d7c1',
          300: '#8cc3a2',
          400: '#66af83',
          500: '#4a8c66', // Deep sage
          600: '#3d7355',
          700: '#305a44',
          800: '#234133',
          900: '#162822',
        },
        blush: {
          50: '#fdf4f5',
          100: '#fbe8eb',
          200: '#f5c1ca',
          300: '#ef9aa9',
          400: '#e97388',
          500: '#d4556d', // Deep rose
          600: '#b54558',
          700: '#963643',
          800: '#77272e',
          900: '#581819',
        },
        gold: {
          50: '#fefbf3',
          100: '#fcf5e1',
          200: '#f8e8b8',
          300: '#f4db8f',
          400: '#f0ce66',
          500: '#d4af37', // Classic gold
          600: '#b8932e',
          700: '#9c7725',
          800: '#805b1c',
          900: '#643f13',
        },
        // Neutrals - Warm & Elegant
        ivory: '#faf8f3',
        champagne: '#f7e7ce',
        dusty: '#c9ada7',
        charcoal: '#4a4e69',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-lora)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-elegant': 'linear-gradient(135deg, #4a8c66 0%, #d4556d 50%, #d4af37 100%)',
        'gradient-soft': 'linear-gradient(180deg, #faf8f3 0%, #f7e7ce 100%)',
        'gradient-overlay': 'linear-gradient(180deg, rgba(74, 140, 102, 0.05) 0%, rgba(212, 85, 109, 0.05) 100%)',
        'gradient-radial': 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
        'texture-paper': 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.03\' /%3E%3C/svg%3E")',
        'texture-linen': 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(74, 140, 102, 0.03) 2px, rgba(74, 140, 102, 0.03) 4px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-delay': 'fadeIn 0.8s ease-out 0.2s forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.3)' },
        },
      },
      boxShadow: {
        'elegant': '0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        'elegant-lg': '0 20px 60px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
        'glow-gold': '0 0 30px rgba(212, 175, 55, 0.3), 0 0 60px rgba(212, 175, 55, 0.1)',
        'glow-sage': '0 0 30px rgba(74, 140, 102, 0.3), 0 0 60px rgba(74, 140, 102, 0.1)',
        'inner-elegant': 'inset 0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};
