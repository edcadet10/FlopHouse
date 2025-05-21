import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ClientRedirects from './client-redirects';
import HashRouter from '@/components/hash-router';
import ClientOnly from '@/components/client-only';
import dynamic from 'next/dynamic';
import AuthProvider from '@/components/auth/auth0-provider';

const inter = Inter({ subsets: ['latin'] });

// We no longer need this as we're using Auth0
// const NetlifyIdentityLoader = dynamic(
//   () => import('@/components/auth/netlify-identity-init'),
//   { ssr: false }
// );

export const metadata: Metadata = {
  title: 'FlopHouse - Learn from Failed Startup Ideas',
  description: 'A platform to share and learn from failed startup post-mortems',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* We no longer need Netlify Identity Widget */}
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* Netlify Identity is no longer needed */}
            
            {/* Client-side redirects handler */}
            <ClientRedirects />
            
            {/* Hash-based router for SPA behavior */}
            <HashRouter />
            
            <Header />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
        {/* Remove Netlify Identity debug script */}
      </body>
    </html>
  );
}
