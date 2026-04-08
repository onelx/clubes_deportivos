import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IdeaForge - Tiendas para Clubes Deportivos",
  description:
    "Plataforma que permite a clubes deportivos tener su propia tienda online con productos fabricados bajo demanda.",
  keywords: [
    "clubes deportivos",
    "tienda online",
    "merchandising",
    "personalizado",
  ],
  authors: [{ name: "IdeaForge" }],
  openGraph: {
    title: "IdeaForge - Tiendas para Clubes Deportivos",
    description:
      "Crea tu tienda online de merchandising deportivo personalizado",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
