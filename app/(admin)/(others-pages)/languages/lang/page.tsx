import type { Metadata } from "next";
import LangComponent from "@/components/languages/lang/LangComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function LangPage() {
  return (
    <section className="space-y-6">
      <LangComponent />
    </section>
  );
}
