import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiendas de Clubes Deportivos",
  description: "Plataforma de tiendas personalizadas para clubes deportivos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
