import type { Metadata } from "next";
import AddCategoryComponent from "@/components/categories/add-category/AddCategoryComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function AddCategoryPage() {
  return (
    <section className="space-y-6">
      <AddCategoryComponent />
    </section>
  );
}
