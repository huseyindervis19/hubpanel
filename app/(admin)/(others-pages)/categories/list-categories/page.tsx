import type { Metadata } from "next";
import CategoriesComponent from "@/components/categories/list-categories/CategoriesComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function ListCategoriesPage() {
  return (
    <section className="space-y-6">
      <CategoriesComponent />
    </section>
  );
}
