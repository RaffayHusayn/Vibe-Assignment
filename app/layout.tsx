import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import {
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { theme } from "@/src/core/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GTM Board",
  description: "Turn event booth scans into a working sales pipeline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      {...mantineHtmlProps}
    >
      <body className="min-h-full flex flex-col">
        <MantineProvider theme={theme} defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
