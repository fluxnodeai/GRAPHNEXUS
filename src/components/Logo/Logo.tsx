import React from 'react';
import styles from './Logo.module.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true, className = '' }) => {
  const sizeClass = size === 'small' ? styles.small : size === 'large' ? styles.large : styles.medium;

  return (
    <div className={`${styles.logoContainer} ${sizeClass} ${className}`}>
      <div className={styles.logoIcon}>
        <svg viewBox="0 0 100 100" className={styles.logoSvg}>
          <defs>
            {/* Enhanced Gradients */}
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="25%" stopColor="#0099cc" />
              <stop offset="50%" stopColor="#66e0ff" />
              <stop offset="75%" stopColor="#00b3e6" />
              <stop offset="100%" stopColor="#4dd9ff" />
            </linearGradient>
            
            <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#0066cc" />
            </radialGradient>
            
            <linearGradient id="nodeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#39ff14" />
              <stop offset="100%" stopColor="#00cc00" />
            </linearGradient>
            
            <linearGradient id="nodeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff0066" />
              <stop offset="100%" stopColor="#cc0044" />
            </linearGradient>
            
            <linearGradient id="nodeGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffaa00" />
              <stop offset="100%" stopColor="#cc8800" />
            </linearGradient>
            
            <linearGradient id="nodeGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8a2be2" />
              <stop offset="100%" stopColor="#6a1bb2" />
            </linearGradient>

            {/* Advanced Glow Effects */}
            <filter id="logoGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="coreGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feColorMatrix in="coloredBlur" values="0 0 0 0 0 0 0 0 0 0.8 0 0 0 0 1 0 0 0 1 0"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="pulseGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer Orbital Ring */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="url(#primaryGradient)" strokeWidth="1.5" opacity="0.4" filter="url(#logoGlow)">
            <animate attributeName="stroke-dasharray" values="0 283;70 213;141 142;283 0;0 283" dur="8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite"/>
          </circle>
          
          {/* Middle Connection Ring */}
          <circle cx="50" cy="50" r="35" fill="none" stroke="url(#primaryGradient)" strokeWidth="2" opacity="0.6" filter="url(#logoGlow)">
            <animate attributeName="stroke-dasharray" values="220 0;110 110;0 220;220 0" dur="6s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite"/>
          </circle>
          
          {/* Inner Network Ring */}
          <circle cx="50" cy="50" r="25" fill="none" stroke="url(#primaryGradient)" strokeWidth="2.5" opacity="0.8" filter="url(#logoGlow)">
            <animate attributeName="stroke-dasharray" values="157 0;78 79;0 157;157 0" dur="4s" repeatCount="indefinite"/>
          </circle>

          {/* Central Nexus Core */}
          <circle cx="50" cy="50" r="8" fill="url(#coreGradient)" filter="url(#coreGlow)">
            <animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
          </circle>
          
          {/* Inner Core Pulse */}
          <circle cx="50" cy="50" r="4" fill="#ffffff" opacity="0.8">
            <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
          </circle>

          {/* Strategic Data Nodes */}
          <circle cx="50" cy="25" r="4" fill="url(#nodeGradient1)" filter="url(#pulseGlow)">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2.1s" repeatCount="indefinite"/>
            <animate attributeName="r" values="4;5;4" dur="3s" repeatCount="indefinite"/>
          </circle>
          
          <circle cx="75" cy="50" r="4" fill="url(#nodeGradient2)" filter="url(#pulseGlow)">
            <animate attributeName="opacity" values="1;0.7;1" dur="2.3s" repeatCount="indefinite"/>
            <animate attributeName="r" values="4;5;4" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          
          <circle cx="50" cy="75" r="4" fill="url(#nodeGradient3)" filter="url(#pulseGlow)">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="1.9s" repeatCount="indefinite"/>
            <animate attributeName="r" values="4;5;4" dur="3.2s" repeatCount="indefinite"/>
          </circle>
          
          <circle cx="25" cy="50" r="4" fill="url(#nodeGradient4)" filter="url(#pulseGlow)">
            <animate attributeName="opacity" values="1;0.7;1" dur="2.7s" repeatCount="indefinite"/>
            <animate attributeName="r" values="4;5;4" dur="2.8s" repeatCount="indefinite"/>
          </circle>

          {/* Secondary Nodes */}
          <circle cx="68" cy="32" r="2.5" fill="url(#nodeGradient1)" opacity="0.8" filter="url(#pulseGlow)">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="3.1s" repeatCount="indefinite"/>
          </circle>
          
          <circle cx="68" cy="68" r="2.5" fill="url(#nodeGradient2)" opacity="0.8" filter="url(#pulseGlow)">
            <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2.4s" repeatCount="indefinite"/>
          </circle>
          
          <circle cx="32" cy="68" r="2.5" fill="url(#nodeGradient3)" opacity="0.8" filter="url(#pulseGlow)">
            <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2.8s" repeatCount="indefinite"/>
          </circle>
          
          <circle cx="32" cy="32" r="2.5" fill="url(#nodeGradient4)" opacity="0.8" filter="url(#pulseGlow)">
            <animate attributeName="opacity" values="0.9;0.6;0.9" dur="3.3s" repeatCount="indefinite"/>
          </circle>

          {/* Dynamic Connection Lines */}
          <line x1="50" y1="50" x2="50" y2="25" stroke="url(#primaryGradient)" strokeWidth="2" opacity="0.7" filter="url(#logoGlow)">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite"/>
          </line>
          
          <line x1="50" y1="50" x2="75" y2="50" stroke="url(#primaryGradient)" strokeWidth="2" opacity="0.7" filter="url(#logoGlow)">
            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="3s" repeatCount="indefinite"/>
          </line>
          
          <line x1="50" y1="50" x2="50" y2="75" stroke="url(#primaryGradient)" strokeWidth="2" opacity="0.7" filter="url(#logoGlow)">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.2s" repeatCount="indefinite"/>
          </line>
          
          <line x1="50" y1="50" x2="25" y2="50" stroke="url(#primaryGradient)" strokeWidth="2" opacity="0.7" filter="url(#logoGlow)">
            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2.8s" repeatCount="indefinite"/>
          </line>

          {/* Secondary Connections */}
          <line x1="50" y1="50" x2="68" y2="32" stroke="url(#primaryGradient)" strokeWidth="1" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite"/>
          </line>
          
          <line x1="50" y1="50" x2="68" y2="68" stroke="url(#primaryGradient)" strokeWidth="1" opacity="0.5">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.9s" repeatCount="indefinite"/>
          </line>
          
          <line x1="50" y1="50" x2="32" y2="68" stroke="url(#primaryGradient)" strokeWidth="1" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.2s" repeatCount="indefinite"/>
          </line>
          
          <line x1="50" y1="50" x2="32" y2="32" stroke="url(#primaryGradient)" strokeWidth="1" opacity="0.5">
            <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2.6s" repeatCount="indefinite"/>
          </line>

          {/* Data Flow Particles */}
          <circle r="1.5" fill="#ffffff" opacity="0.9">
            <animateMotion dur="4s" repeatCount="indefinite">
              <path d="M 50,50 Q 50,25 50,25 Q 75,25 75,50 Q 75,75 50,75 Q 25,75 25,50 Q 25,25 50,25"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite"/>
          </circle>
          
          <circle r="1.5" fill="#00d4ff" opacity="0.8">
            <animateMotion dur="6s" repeatCount="indefinite" begin="2s">
              <path d="M 25,50 Q 25,75 50,75 Q 75,75 75,50 Q 75,25 50,25 Q 25,25 25,50"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;1;0" dur="6s" repeatCount="indefinite" begin="2s"/>
          </circle>
        </svg>
      </div>
      
      {showText && (
        <div className={styles.logoText}>
          <div className={styles.logoBrand}>
            <span className={styles.brandPrimary}>GRAPH </span>
            <span className={styles.brandAccent}>NEXUS</span>
          </div>
          <div className={styles.logoTagline}>Open Source Knowledge Graph</div>
        </div>
      )}
    </div>
  );
};

export default Logo;
