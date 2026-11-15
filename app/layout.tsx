import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { FloatingSocials } from "@/components/layout/FloatingSocials";
import { DataPrefetcher } from "@/components/providers/DataPrefetcher";

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
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground transition-all duration-300 xl:pl-20`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                const attributesToRemove = ['bis_skin_checked', 'bis_register'];
                const cleanElements = () => {
                  attributesToRemove.forEach(attr => {
                    document.querySelectorAll('[' + attr + ']').forEach(el => el.removeAttribute(attr));
                  });
                };
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && attributesToRemove.includes(mutation.attributeName)) {
                      if (mutation.target && mutation.target.removeAttribute) {
                        mutation.target.removeAttribute(mutation.attributeName);
                      }
                    } else if (mutation.addedNodes) {
                      mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                          attributesToRemove.forEach(attr => {
                            if (node.hasAttribute && node.hasAttribute(attr)) node.removeAttribute(attr);
                            node.querySelectorAll('[' + attr + ']').forEach(el => el.removeAttribute(attr));
                          });
                        }
                      });
                    }
                  });
                });
                if (document.documentElement) {
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    childList: true
                  });
                }
                window.addEventListener('DOMContentLoaded', cleanElements);
                window.addEventListener('load', cleanElements);
              })();
            `
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <DataPrefetcher />
            <FloatingSocials />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
