import type { Metadata } from "next";
import TranslationsComponent from "@/components/languages/translations/TranslationsComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function KeysPage() {
  return (
    <section className="space-y-6">
      <TranslationsComponent />
    </section>
  );
}
