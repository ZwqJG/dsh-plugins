import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSH Plugins — DeepSeek Harness Plugin Directory",
  description:
    "Discover plugins for DeepSeek Harness (dsh), the open-source agent harness from DeepSeek AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
