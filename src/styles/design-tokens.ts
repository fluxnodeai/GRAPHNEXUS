// Design System Tokens
export const designTokens = {
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
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  typography: {
    fonts: {
      display: ['Orbitron', 'Arial Black', 'monospace'],
      body: ['Inter', 'Segoe UI', 'system-ui'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace']
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    }
  },
  effects: {
    shadows: {
      sm: '0 2px 8px rgba(0, 212, 255, 0.1)',
      md: '0 8px 24px rgba(0, 212, 255, 0.15)',
      lg: '0 16px 48px rgba(0, 212, 255, 0.2)',
      glow: '0 0 30px rgba(0, 212, 255, 0.3)'
    },
    transitions: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s'
    }
  },
  layout: {
    header: '80px',
    container: '1440px',
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '20px'
    }
  },
  zIndex: {
    background: -1,
    content: 1,
    header: 100,
    modal: 200,
    tooltip: 300
  }
} as const;

export type DesignTokens = typeof designTokens;
