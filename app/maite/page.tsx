import type { Metadata } from "next";
import { MaiteClient } from "@/components/features/maite-client";

export const metadata: Metadata = {
  title: "Maite",
  robots: { index: false, follow: false },
};

export default function PaginaMaite() {
  return <MaiteClient />;
}
