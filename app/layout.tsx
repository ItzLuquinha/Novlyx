import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/contexts/query-provider";
import { PerfilProvider } from "@/contexts/perfil-context";

export const metadata: Metadata = {
  title: "NOVLYX - Filmes, Series e Animes",
  description:
    "Filmes, series, animes e doramas em um so lugar. Assista quando e onde quiser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        <QueryProvider>
          <PerfilProvider>{children}</PerfilProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
