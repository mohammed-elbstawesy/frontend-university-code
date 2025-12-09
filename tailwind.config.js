/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  // الـ Safelist مهم جداً لأنك تستخدم الألوان داخل متغيرات في الـ TS
  safelist: [
    'bg-purple-500/10',
    'text-purple-500',
    'bg-violet-500/10',
    'text-violet-500'
  ],
  theme: {
    extend: {
      // قمت بإزالة استيراد الألوان لأنه غير ضروري، الألوان الافتراضية موجودة بالفعل
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