import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [require('tailwindcss-logical'), require('./src/@core/tailwind/plugin')],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right bottom, #002982, #0052a6, #0076b9, #5daaf1, #99dfff)'
      },
      backgroundColor: {
        login: 'rgba(0, 0, 0, 0.24)'
      }
    }
  }
}

// background-image: linear-gradient(to right bottom, #002982, #0052a6, #0076b9, #a3b5e4, #d4dae7);

export default config
