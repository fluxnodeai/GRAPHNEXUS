import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.enterpriseHomepage}>
      {/* Advanced Background Effects */}
      <div className={styles.homepageBackground}>
        <div className={styles.floatingElement} style={{top: '10%', left: '10%', animationDelay: '0s'}}></div>
        <div className={styles.floatingElement} style={{top: '30%', left: '80%', animationDelay: '5s'}}></div>
        <div className={styles.floatingElement} style={{top: '70%', left: '20%', animationDelay: '10s'}}></div>
        <div className={styles.floatingElement} style={{top: '50%', left: '60%', animationDelay: '15s'}}></div>
      </div>

      {/* Hero Section - What is GraphNexus */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            {/* Main Value Proposition */}
            <div className={styles.heroHeadline}>
              <h1 className={styles.heroTitle}>
                <span className={styles.titlePrimary}>Explore Complex Networks With</span>
                <span className={`${styles.titleAccent} ${styles.neonText}`}>Open Source Intelligence</span>
              </h1>
              
              <p className={styles.heroSubtitle}>
                GraphNexus is a free, open source knowledge graph platform that empowers developers and researchers to 
                <span className={styles.highlight}> visualize data relationships, analyze networks, and discover hidden connections</span> 
                in their projects. Built by the community, for the community.
              </p>
            </div>

            {/* Key Benefits */}
            <div className={styles.heroBenefits}>
              <div className={styles.benefitItem}>
                <svg className={styles.benefitIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>100% Free & Open Source</span>
              </div>
              <div className={styles.benefitItem}>
                <svg className={styles.benefitIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Community-Driven Development</span>
              </div>
              <div className={styles.benefitItem}>
                <svg className={styles.benefitIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m18 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>Developer-Friendly APIs</span>
              </div>
            </div>

            {/* Primary CTA */}
            <div className={styles.heroCta}>
              <Link href="/graph" className={styles.ctaPrimary}>
                <svg className={styles.ctaIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Start Building</span>
              </Link>
            </div>
          </div>

          {/* Revolutionary Knowledge Graph Showcase */}
          <div className={styles.heroDemo}>
            <div className={styles.demoContainer}>
              <div className={styles.demoHeader}>
                <div className={styles.demoIndicators}>
                  <div className={`${styles.indicatorDot} ${styles.active}`}></div>
                  <div className={`${styles.indicatorDot} ${styles.processing}`}></div>
                  <div className={`${styles.indicatorDot} ${styles.success}`}></div>
                </div>
                <div className={styles.demoTitle}>Community Knowledge Graph</div>
              </div>
              
              <div className={styles.graphVisualization}>
                <svg viewBox="0 0 520 380" className={styles.knowledgeGraph}>
                  <defs>
                    <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="40%" stopColor="#00d4ff" />
                      <stop offset="100%" stopColor="#003d66" />
                    </radialGradient>
                    
                    <radialGradient id="conceptGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#39ff14" />
                      <stop offset="100%" stopColor="#1a7300" />
                    </radialGradient>
                    
                    <radialGradient id="researchGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ff6b35" />
                      <stop offset="100%" stopColor="#cc3300" />
                    </radialGradient>
                    
                    <radialGradient id="toolGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffaa00" />
                      <stop offset="100%" stopColor="#cc7700" />
                    </radialGradient>
                    
                    <radialGradient id="communityGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#8a2be2" />
                      <stop offset="100%" stopColor="#4a1470" />
                    </radialGradient>
                    
                    <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    
                    <filter id="connectionGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Central Knowledge Hub */}
                  <circle cx="260" cy="190" r="18" fill="url(#hubGradient)" filter="url(#nodeGlow)" stroke="#00d4ff" strokeWidth="2">
                    <animate attributeName="r" values="18;24;18" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="strokeOpacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Concept Nodes */}
                  <circle cx="140" cy="120" r="14" fill="url(#conceptGradient)" filter="url(#nodeGlow)" stroke="#39ff14" strokeWidth="1.5">
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="3.2s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="14;16;14" dur="5s" repeatCount="indefinite"/>
                  </circle>
                  
                  <circle cx="380" cy="140" r="14" fill="url(#conceptGradient)" filter="url(#nodeGlow)" stroke="#39ff14" strokeWidth="1.5">
                    <animate attributeName="opacity" values="1;0.8;1" dur="2.8s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="14;16;14" dur="4.5s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Research Nodes */}
                  <circle cx="120" cy="300" r="13" fill="url(#researchGradient)" filter="url(#nodeGlow)" stroke="#ff6b35" strokeWidth="1.5">
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="13;15;13" dur="4.2s" repeatCount="indefinite"/>
                  </circle>
                  
                  <circle cx="400" cy="280" r="13" fill="url(#researchGradient)" filter="url(#nodeGlow)" stroke="#ff6b35" strokeWidth="1.5">
                    <animate attributeName="opacity" values="1;0.7;1" dur="3.1s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="13;15;13" dur="3.8s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Tool Nodes */}
                  <circle cx="200" cy="60" r="12" fill="url(#toolGradient)" filter="url(#nodeGlow)" stroke="#ffaa00" strokeWidth="1.5">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="12;14;12" dur="3.5s" repeatCount="indefinite"/>
                  </circle>
                  
                  <circle cx="460" cy="200" r="12" fill="url(#toolGradient)" filter="url(#nodeGlow)" stroke="#ffaa00" strokeWidth="1.5">
                    <animate attributeName="opacity" values="1;0.6;1" dur="2.7s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="12;14;12" dur="4.1s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Community Nodes */}
                  <circle cx="320" cy="340" r="11" fill="url(#communityGradient)" filter="url(#nodeGlow)" stroke="#8a2be2" strokeWidth="1.5">
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="3.5s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="11;13;11" dur="4.8s" repeatCount="indefinite"/>
                  </circle>
                  
                  <circle cx="60" cy="200" r="11" fill="url(#communityGradient)" filter="url(#nodeGlow)" stroke="#8a2be2" strokeWidth="1.5">
                    <animate attributeName="opacity" values="1;0.8;1" dur="2.9s" repeatCount="indefinite"/>
                    <animate attributeName="r" values="11;13;11" dur="3.3s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Primary Hub Connections */}
                  <line x1="260" y1="190" x2="140" y2="120" stroke="#39ff14" strokeWidth="4" opacity="0.9" filter="url(#connectionGlow)">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="strokeWidth" values="4;6;4" dur="4s" repeatCount="indefinite"/>
                  </line>
                  
                  <line x1="260" y1="190" x2="380" y2="140" stroke="#39ff14" strokeWidth="4" opacity="0.9" filter="url(#connectionGlow)">
                    <animate attributeName="opacity" values="1;0.6;1" dur="3.5s" repeatCount="indefinite"/>
                    <animate attributeName="strokeWidth" values="4;6;4" dur="3.2s" repeatCount="indefinite"/>
                  </line>
                  
                  <line x1="260" y1="190" x2="120" y2="300" stroke="#ff6b35" strokeWidth="3.5" opacity="0.8" filter="url(#connectionGlow)">
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.8s" repeatCount="indefinite"/>
                  </line>
                  
                  <line x1="260" y1="190" x2="400" y2="280" stroke="#ff6b35" strokeWidth="3.5" opacity="0.8" filter="url(#connectionGlow)">
                    <animate attributeName="opacity" values="0.9;0.5;0.9" dur="3.3s" repeatCount="indefinite"/>
                  </line>
                  
                  <line x1="260" y1="190" x2="200" y2="60" stroke="#ffaa00" strokeWidth="3" opacity="0.7" filter="url(#connectionGlow)">
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite"/>
                  </line>
                  
                  <line x1="260" y1="190" x2="460" y2="200" stroke="#ffaa00" strokeWidth="3" opacity="0.7" filter="url(#connectionGlow)">
                    <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2.6s" repeatCount="indefinite"/>
                  </line>
                  
                  {/* Text Labels with Background */}
                  <g>
                    <rect x="240" y="175" width="40" height="16" rx="8" fill="rgba(0,0,0,0.8)" stroke="#00d4ff" strokeWidth="1"/>
                    <text x="260" y="186" textAnchor="middle" className="graph-label-central" fill="#ffffff" fontSize="11" fontWeight="700">HUB</text>
                  </g>
                  
                  <g>
                    <rect x="105" y="105" width="70" height="14" rx="7" fill="rgba(0,0,0,0.8)" stroke="#39ff14" strokeWidth="1"/>
                    <text x="140" y="115" textAnchor="middle" className="graph-label-concept" fill="#ffffff" fontSize="10" fontWeight="600">Machine Learning</text>
                  </g>
                  
                  <g>
                    <rect x="345" y="125" width="70" height="14" rx="7" fill="rgba(0,0,0,0.8)" stroke="#39ff14" strokeWidth="1"/>
                    <text x="380" y="135" textAnchor="middle" className="graph-label-concept" fill="#ffffff" fontSize="10" fontWeight="600">Data Science</text>
                  </g>
                  
                  <g>
                    <rect x="70" y="285" width="100" height="14" rx="7" fill="rgba(0,0,0,0.8)" stroke="#ff6b35" strokeWidth="1"/>
                    <text x="120" y="295" textAnchor="middle" className="graph-label-research" fill="#ffffff" fontSize="10" fontWeight="600">Research Papers</text>
                  </g>
                  
                  <g>
                    <rect x="350" y="265" width="100" height="14" rx="7" fill="rgba(0,0,0,0.8)" stroke="#ff6b35" strokeWidth="1"/>
                    <text x="400" y="275" textAnchor="middle" className="graph-label-research" fill="#ffffff" fontSize="10" fontWeight="600">Academic Studies</text>
                  </g>
                  
                  <g>
                    <rect x="160" y="45" width="80" height="14" rx="7" fill="rgba(0,0,0,0.8)" stroke="#ffaa00" strokeWidth="1"/>
                    <text x="200" y="55" textAnchor="middle" className="graph-label-tool" fill="#ffffff" fontSize="10" fontWeight="600">Neo4j Queries</text>
                  </g>
                  
                  <g>
                    <rect x="420" y="185" width="80" height="14" rx="7" fill="rgba(0,0,0,0.8)" stroke="#ffaa00" strokeWidth="1"/>
                    <text x="460" y="195" textAnchor="middle" className="graph-label-tool" fill="#ffffff" fontSize="10" fontWeight="600">GraphQL API</text>
                  </g>
                  
                  <g>
                    <rect x="275" y="325" width="90" height="14" rx="7" fill="rgba(0,0,0,0.8)" stroke="#8a2be2" strokeWidth="1"/>
                    <text x="320" y="335" textAnchor="middle" className="graph-label-community" fill="#ffffff" fontSize="10" fontWeight="600">Contributors</text>
                  </g>
                  
                  <g>
                    <rect x="15" y="185" width="90" height="14" rx="7" fill="rgba(0,0,0,0.8)" stroke="#8a2be2" strokeWidth="1"/>
                    <text x="60" y="195" textAnchor="middle" className="graph-label-community" fill="#ffffff" fontSize="10" fontWeight="600">Open Source</text>
                  </g>
                  
                  {/* Data Flow Particles */}
                  <circle r="3" fill="#ffffff" opacity="0.9">
                    <animateMotion dur="6s" repeatCount="indefinite">
                      <path d="M 260,190 Q 200,120 140,120 Q 100,160 60,200 Q 100,240 140,280 Q 200,320 260,320 Q 320,280 380,240 Q 420,200 460,200 Q 420,160 380,140 Q 320,100 260,100 Q 200,140 140,180 Q 180,220 220,260 Q 260,240 260,190"/>
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;0" dur="6s" repeatCount="indefinite"/>
                  </circle>
                  
                  <circle r="2" fill="#00d4ff" opacity="0.8">
                    <animateMotion dur="8s" repeatCount="indefinite" begin="2s">
                      <path d="M 140,120 Q 180,80 200,60 Q 240,80 260,120 Q 300,160 340,200 Q 380,240 400,280 Q 360,320 320,340 Q 280,320 240,300 Q 200,280 160,260 Q 120,240 100,200 Q 120,160 140,120"/>
                    </animateMotion>
                    <animate attributeName="opacity" values="0;1;0" dur="8s" repeatCount="indefinite" begin="2s"/>
                  </circle>
                </svg>
                
                <div className={styles.graphMetrics}>
                  <div className={styles.metricGroup}>
                    <div className={styles.metricItem}>
                      <div className={styles.metricIcon}>🧠</div>
                      <div className={styles.metricInfo}>
                        <div className={styles.metricNumber}>2,847</div>
                        <div className={styles.metricLabel}>Concepts</div>
                      </div>
                    </div>
                    
                    <div className={styles.metricItem}>
                      <div className={styles.metricIcon}>🔗</div>
                      <div className={styles.metricInfo}>
                        <div className={styles.metricNumber}>12,423</div>
                        <div className={styles.metricLabel}>Relations</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.metricGroup}>
                    <div className={styles.metricItem}>
                      <div className={styles.metricIcon}>👥</div>
                      <div className={styles.metricInfo}>
                        <div className={styles.metricNumber}>347</div>
                        <div className={styles.metricLabel}>Contributors</div>
                      </div>
                    </div>
                    
                    <div className={styles.metricItem}>
                      <div className={styles.metricIcon}>⚡</div>
                      <div className={styles.metricInfo}>
                        <div className={styles.metricNumber}>Live</div>
                        <div className={styles.metricLabel}>Real-time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>
              <div className={`${styles.statusIndicator} ${styles.statusWarning}`}>
                <span>RESEARCH CHALLENGES</span>
              </div>
            </div>
            <h2 className={styles.sectionTitle}>
              <span className={`${styles.textWarning} ${styles.neonText}`}>KNOWLEDGE FRAGMENTATION</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Research and data analysis face significant challenges in connecting disparate information sources. 
              <span className={styles.textWarning}> Knowledge remains siloed and disconnected.</span>
            </p>
          </div>

          <div className={styles.dataGrid}>
            <div className={`${styles.card} ${styles.glass}`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconWarning}`}>
                  <svg width="32" height="32" fill="none" stroke="#ffaa00" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h3 className={`${styles.cardTitle} ${styles.textWarning}`}>DATA SILOS</h3>
                  <div className={`${styles.cardCode} ${styles.textWarning}`}>STATUS: FRAGMENTED</div>
                </div>
              </div>
              <p className={styles.cardContent}>
                Research data scattered across multiple platforms makes it 
                <span className={styles.textWarning}> difficult to discover connections</span> and 
                collaborate effectively on complex problems.
              </p>
            </div>

            <div className={`${styles.card} ${styles.glass}`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconInfo}`}>
                  <svg width="32" height="32" fill="none" stroke="#00d4ff" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`${styles.cardTitle} ${styles.textInfo}`}>DISCOVERY GAPS</h3>
                  <div className={`${styles.cardCode} ${styles.textInfo}`}>OPPORTUNITY: HIDDEN</div>
                </div>
              </div>
              <p className={styles.cardContent}>
                Breakthrough insights remain undiscovered because 
                <span className={styles.textInfo}> knowledge connections aren't visible</span> 
                across different research domains and datasets.
              </p>
            </div>

            <div className={`${styles.card} ${styles.glass}`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconError}`}>
                  <svg width="32" height="32" fill="none" stroke="#ff0066" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`${styles.cardTitle} ${styles.textError}`}>COLLABORATION BARRIERS</h3>
                  <div className={`${styles.cardCode} ${styles.textError}`}>RESULT: INEFFICIENCY</div>
                </div>
              </div>
              <p className={styles.cardContent}>
                Researchers spend <span className={styles.textError}>80% of their time</span> 
                searching for and preparing data instead of focusing on analysis and discovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>
              <div className={`${styles.statusIndicator} ${styles.statusOnline}`}>
                <span>COMMUNITY SOLUTION</span>
              </div>
            </div>
            <h2 className={styles.sectionTitle}>
              <span className={`${styles.textSuccess} ${styles.neonText}`}>OPEN KNOWLEDGE GRAPH</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Community-driven platform that connects knowledge across domains, enabling 
              <span className={styles.textSuccess}> collaborative discovery</span> and shared insights.
            </p>
          </div>

          <div className={styles.solutionGrid}>
            <div className={styles.solutionFeatures}>
              <div className={`${styles.featureCard} ${styles.hologram}`}>
                <div className={`${styles.featureIcon} ${styles.featureIconPrimary}`}>
                  <svg width="24" height="24" fill="none" stroke="#00d4ff" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles.featureTitle}>COLLABORATIVE RESEARCH</h3>
                  <p className={styles.featureDescription}>
                    Connect researchers, data, and insights across disciplines to accelerate 
                    discovery and enable breakthrough innovations
                  </p>
                </div>
              </div>

              <div className={`${styles.featureCard} ${styles.hologram}`}>
                <div className={`${styles.featureIcon} ${styles.featureIconSuccess}`}>
                  <svg width="24" height="24" fill="none" stroke="#39ff14" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles.featureTitle}>INSTANT INSIGHTS</h3>
                  <p className={styles.featureDescription}>
                    Visualize complex relationships and discover hidden patterns 
                    in real-time across massive knowledge networks
                  </p>
                </div>
              </div>

              <div className={`${styles.featureCard} ${styles.hologram}`}>
                <div className={`${styles.featureIcon} ${styles.featureIconPink}`}>
                  <svg width="24" height="24" fill="none" stroke="#ff0080" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className={styles.featureTitle}>OPEN KNOWLEDGE</h3>
                  <p className={styles.featureDescription}>
                    Build and share knowledge graphs freely, making research 
                    transparent and accessible to the global community
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Terminal */}
            <div className={styles.terminal}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalControls}>
                  <div className={`${styles.terminalDot} ${styles.terminalDotRed}`}></div>
                  <div className={`${styles.terminalDot} ${styles.terminalDotYellow}`}></div>
                  <div className={`${styles.terminalDot} ${styles.terminalDotGreen}`}></div>
                </div>
                <div className={styles.terminalTitle}>GraphNexus Community Terminal</div>
              </div>
              <div className={styles.terminalBody}>
                <div className={styles.terminalLine}>
                  <span className={styles.terminalPrompt}>researcher@graphnexus:~$ </span>
                  <span className={styles.terminalCommand}>contribute --add-knowledge</span>
                </div>
                <div className={`${styles.terminalLine} ${styles.terminalOutput}`}>
                  [INFO] Connecting to knowledge graph...<br />
                  [INFO] Validating research data...<br />
                  <span className={styles.textSuccess}>[SUCCESS]</span> Knowledge nodes created
                </div>
                <div className={styles.terminalLine}>
                  <span className={styles.terminalPrompt}>researcher@graphnexus:~$ </span>
                  <span className={styles.terminalCommand}>discover --find-patterns</span>
                </div>
                <div className={`${styles.terminalLine} ${styles.terminalOutput}`}>
                  <span className={styles.textInfo}>[ANALYZING]</span> Exploring 2,847 concepts...<br />
                  <span className={styles.textSuccess}>[FOUND]</span> 15 new research connections<br />
                  <span className={styles.textSuccess}>[SHARED]</span> Results available to community
                </div>
                <div className={styles.terminalLine}>
                  <span className={styles.terminalPrompt}>researcher@graphnexus:~$ </span>
                  <span className={`${styles.terminalCommand} ${styles.terminalCursor}`}>█</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <div className={styles.ctaWrapper}>
            <div className={styles.ctaGlow}></div>
            <div className={styles.ctaCard}>
              <h2 className={styles.ctaTitle}>
                <span className={styles.neonText}>READY TO CONTRIBUTE?</span>
              </h2>
              <p className={styles.ctaSubtitle}>
                Join the open source community building the future of knowledge graphs. 
                <span className={styles.textInfo}>Start exploring GraphNexus today.</span>
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/graph" className={`${styles.btn} ${styles.btnPrimary}`}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  BUILD GRAPH
                </Link>
                <a href="https://github.com/fluxnodeai/GRAPHNEXUS" className={`${styles.btn} ${styles.btnSecondary}`}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  CONTRIBUTE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
