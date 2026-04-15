import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const display = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display' });
const heading = Outfit({ subsets: ['latin'], variable: '--font-heading' });
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "HabitForge | Level up your life",
  description: "The premier gamified habit tracker and AI learning path platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${heading.variable} ${body.variable} ${mono.variable}`}>
      <body className="antialiased bg-[#0A0A0A] text-white">
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}
