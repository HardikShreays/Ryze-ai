import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deterministic UI Generator",
  description: "AI-powered UI generator with structured component library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
