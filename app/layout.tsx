import '../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ClientRedirects from './client-redirects';
import HashRouter from '@/components/hash-router';

const inter = Inter({ subsets: ['latin'] });

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
        {/* Netlify Identity Widget - needed for CMS admin authentication */}
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Client-side redirects handler */}
          <ClientRedirects />
          
          {/* Hash-based router for SPA behavior */}
          <HashRouter />
          
          <Header />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
        <Script id="netlify-identity-redirect">
          {`
            if (window.netlifyIdentity) {
              window.netlifyIdentity.on("init", user => {
                if (!user) {
                  window.netlifyIdentity.on("login", () => {
                    document.location.href = "/admin/";
                  });
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
