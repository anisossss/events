// tailwind.config.js
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'neon-yellow': '#CCFF00',
        dark: '#121212',
        'dark-gray': '#1E1E1E',
        'card-bg': '#1A1A1A'
      },
      boxShadow: {
        neon: '0 0 10px #CCFF00, 0 0 20px rgba(204, 255, 0, 0.5)',
        'neon-sm': '0 0 5px #CCFF00, 0 0 10px rgba(204, 255, 0, 0.5)'
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif']
      }
    }
  },
  plugins: []
};
