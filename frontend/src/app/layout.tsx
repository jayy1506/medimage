import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medical Text and Image Processing | Adani University",
  description: "Academic Learning Platform for AIDS 12605.1 - Faculty of Engineering and Technology, Adani Institute of Higher Education and Research",
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
      <body className="min-h-screen antialiased flex flex-col">{children}</body>
    </html>
  );
}
