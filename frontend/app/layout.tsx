import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luminara AI",
  description:
    "Evidence-based knowledge assistant for transparent RAG workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
