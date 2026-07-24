import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { SidebarProvider, SidebarToggle } from "@/components/sidebar";
import { ThemeProvider, ThemeSwitcher } from "@/components/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rambling Notes",
  description: "數學、程式，與各種碎碎念的筆記。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="var(--foreground)"
            initialPosition={0.08}
            crawlSpeed={200}
            height={4}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #E5E7EB,0 0 5px #E5E7EB"
          />
          <SidebarProvider>
            <header className="sticky top-0 z-50 flex justify-between items-center bg-stone-200 dark:bg-slate-800 w-full min-w-full">
              <SidebarToggle />
              <ThemeSwitcher />
            </header>
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
