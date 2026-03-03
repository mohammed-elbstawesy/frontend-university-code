/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  safelist: [
    'md:w-64', 'md:flex-row', 'xl:grid-cols-4',
    'bg-[#13131f]', 'border-slate-700', 'text-slate-400', 'hover:border-slate-500', 'hover:text-white',
    'bg-[#00f0ff]/10', 'border-[#00f0ff]', 'text-[#00f0ff]'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
