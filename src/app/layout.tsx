import type React from "react";
import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "BuggedIRL - Turn Your Errors into Memes",
  description: "Paste a bug, get roasted, download the meme",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/svg+xml" />
      </head>
      <body
        className={`${inter.variable} ${firaCode.variable} font-sans antialiased`}>
            {children}
      </body>
    </html>
  );
}
