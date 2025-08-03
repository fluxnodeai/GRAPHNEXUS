import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Import UI components
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

// Import configuration
import config from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "GraphNexus - Knowledge Graph Visualization",
  description: "Interactive knowledge graph visualization with NVIDIA NIM, Neo4j, and Supabase",
  keywords: "knowledge graph, visualization, Neo4j, Supabase, NVIDIA NIM, graph database",
  authors: [{ name: "GraphNexus Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ErrorBoundary>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-background-primary">
              <Header />
              
              <main className="app-main">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
              
              <Footer />
            </div>
          </ToastProvider>
        </ErrorBoundary>
        
      </body>
    </html>
  );
}
