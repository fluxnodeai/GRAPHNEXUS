import styles from './Footer.module.css';
import Link from 'next/link';
import Logo from '@/components/Logo/Logo';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Background Effects */}
      <div className={styles.footerBackground}>
        <div className={styles.gridPattern}></div>
        <div className={styles.glowEffect}></div>
      </div>
      
      <div className={styles.footerContainer}>
        {/* Simplified Footer Content */}
        <div className={styles.footerContent}>
          {/* Company Section */}
          <div className={styles.footerSection}>
            <div className={styles.footerBrand}>
              <Logo size="medium" showText={true} />
            </div>
            
            <p className={styles.brandDescription}>
              Interactive knowledge graph visualization with AI-powered analytics 
              for exploring complex data relationships.
            </p>
          </div>

          {/* Navigation Section */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>EXPLORE</h4>
            <ul className={styles.linkList}>
              <li><Link href="/graph" className={styles.footerLink}>Knowledge Graph</Link></li>
              <li><Link href="/entities" className={styles.footerLink}>Entity Management</Link></li>
            </ul>
          </div>

          {/* GitHub Section */}
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>PROJECT</h4>
            <div className={styles.socialLinks}>
              <a href="https://github.com/graphnexus/graphnexus" className={styles.socialLink} title="GitHub Repository">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
            <ul className={styles.linkList}>
              <li><a href="https://github.com/graphnexus/graphnexus" className={styles.footerLink}>Source Code</a></li>
              <li><a href="https://github.com/graphnexus/graphnexus/issues" className={styles.footerLink}>Issues</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomLeft}>
            <div className={styles.copyright}>
              © 2024 GraphNexus. All rights reserved.
            </div>
            <div className={styles.version}>
              v2.1.0 • Powered by NVIDIA NIM, Neo4j, and Supabase
            </div>
          </div>
          
          <div className={styles.bottomRight}>
            <a href="#privacy" className={styles.legalLink}>Privacy Policy</a>
            <a href="#terms" className={styles.legalLink}>Terms of Service</a>
            <a href="#security" className={styles.legalLink}>Security</a>
            <a href="#compliance" className={styles.legalLink}>Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
