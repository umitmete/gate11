import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { FloatingSocials } from "@/components/layout/FloatingSocials";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "GATE11 Fahrschule | Premium Driving Education",
  description: "Experience modern, luxury driving education with GATE11 Fahrschule. Your journey to mastery begins here.",
  keywords: ["Fahrschule", "Driving School", "Luxury", "Education", "License", "GATE11"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground transition-all duration-300 xl:pl-20`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <FloatingSocials />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
