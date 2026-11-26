import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { GamificationProvider } from "@/context/GamificationContext";
import { LexiChatProvider } from "@/context/LexiChatContext";
import { AppShell } from "@/components/lexi/AppShell";

export const metadata: Metadata = {
  title: "GyaanLab | Adani University",
  description: "GyaanLab Academic Learning Platform - Faculty of Engineering and Technology, Adani Institute of Higher Education and Research",
  icons: {
    icon: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased flex flex-col">
        <AuthProvider>
          <ProgressProvider>
            <GamificationProvider>
              <LexiChatProvider>
                <AppShell>{children}</AppShell>
              </LexiChatProvider>
            </GamificationProvider>
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
