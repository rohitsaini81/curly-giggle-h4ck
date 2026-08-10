import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instagram • Direct",
  description: "A responsive Instagram-style messaging interface",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
