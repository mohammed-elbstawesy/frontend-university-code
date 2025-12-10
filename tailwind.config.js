/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  // 🔥 التعديل هنا: أضفنا ألوان الـ cyan عشان متختفيش
  safelist: [
    'bg-purple-500/10',
    'text-purple-500',
    'bg-violet-500/10',
    'text-violet-500',
    'bg-cyan-500/10',  // <-- جديد
    'text-cyan-500',    // <-- جديد
    'bg-pink-500/10',
    'text-pink-500',
    'bg-rose-500/10',
    'text-rose-500',
    'bg-blue-500/10',
    'text-blue-500',
    'bg-orange-500/10',
    'text-orange-500',
    'bg-green-500/10',
    'text-green-500',
    'text-indigo-500',
    'bg-indigo-500/10'
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0a0a0f',
          dark: '#13131f',
          card: '#1c1c2e',
          primary: '#00f0ff',
          secondary: '#7000ff',
          accent: '#ff003c',
          success: '#00ff9d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle at center, rgba(0, 240, 255, 0.03) 1px, transparent 1px)",
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}