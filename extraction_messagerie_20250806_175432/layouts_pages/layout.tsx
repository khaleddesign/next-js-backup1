import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DocumentTitleBadge from "@/components/layout/DocumentTitleBadge";
import { ToastProvider } from "@/components/ui/Toast";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChantierPro - Gestion de chantiers",
  description: "Application de gestion de chantiers de construction professionnelle",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider>
            <DocumentTitleBadge />
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
