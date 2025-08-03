/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          500: '#00d4ff',
          600: '#0099cc',
          700: '#0077a3',
          900: '#003d4d'
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#1e293b',
          900: '#0f172a'
        },
        success: '#39ff14',
        warning: '#ffaa00',
        error: '#ff0066',
        neon: {
          cyan: '#00ffff',
          pink: '#ff0080',
          green: '#39ff14',
          orange: '#ff6600'
        },
        background: {
          primary: '#0a0a0f',
          secondary: '#151520',
          tertiary: '#1a1a2e'
        },
        text: {
          primary: '#ffffff',
          secondary: '#b8c5d6',
          muted: '#6b7688'
        },
        border: {
          primary: '#2a3441',
          accent: '#00d4ff',
          muted: '#1a2332'
        }
      },
      fontFamily: {
        display: ['Orbitron', 'Arial Black', 'monospace'],
        body: ['Inter', 'Segoe UI', 'system-ui'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem'
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem'
      },
      boxShadow: {
        'glow-sm': '0 2px 8px rgba(0, 212, 255, 0.1)',
        'glow-md': '0 8px 24px rgba(0, 212, 255, 0.15)',
        'glow-lg': '0 16px 48px rgba(0, 212, 255, 0.2)',
        'glow': '0 0 30px rgba(0, 212, 255, 0.3)',
        'neon': '0 0 20px currentColor'
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px'
      },
      transitionDuration: {
        'fast': '0.15s',
        'normal': '0.3s',
        'slow': '0.5s'
      },
      zIndex: {
        'background': '-1',
        'content': '1',
        'header': '100',
        'modal': '200',
        'tooltip': '300'
      },
      animation: {
        'neon-pulse': 'neonPulse 2s ease-in-out infinite alternate',
        'hologram': 'hologramShift 3s ease-in-out infinite',
        'float': 'float 20s linear infinite',
        'status-pulse': 'statusPulse 2s ease-in-out infinite'
      },
      keyframes: {
        neonPulse: {
          '0%': { 
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor'
          },
          '100%': { 
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor'
          }
        },
        hologramShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        float: {
          '0%': {
            transform: 'translateY(100vh) translateX(0) rotate(0deg)',
            opacity: '0'
          },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': {
            transform: 'translateY(-100px) translateX(100px) rotate(360deg)',
            opacity: '0'
          }
        },
        statusPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'accent-gradient': 'linear-gradient(135deg, #00d4ff 0%, #0099cc 50%, #66e0ff 100%)',
        'hologram': 'linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, 0.1) 50%, transparent 70%)'
      }
    },
  },
  plugins: [],
};
