import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SWRProvider } from "@/components/providers/swr-provider";
import { ConnectionStatus } from "@/components/ui/connection-status";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/lib/auth/context";
import { PageTransition } from "@/components/transitions/page-transition";
import "./globals.css";
import "@/styles/editor.css";

// Optimiser le chargement de la police
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Hekolearn - Plateforme éducative",
  description: "Une plateforme éducative innovante qui s'adapte à vos besoins, de la 6ème à la Terminale.",
  metadataBase: new URL("https://hekolearn.fr"),
  openGraph: {
    title: "Hekolearn - Plateforme éducative",
    description: "Une plateforme éducative innovante qui s'adapte à vos besoins, de la 6ème à la Terminale.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} h-full`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <SWRProvider>
              <ConnectionStatus />
              <div className="pt-14 h-full">
                <PageTransition>
                  {children}
                </PageTransition>
              </div>
              <Toaster />
            </SWRProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}