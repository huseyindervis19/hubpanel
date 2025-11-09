import type { Metadata } from "next";
import AddProductComponent from "@/components/products/add-product/AddProductComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function AddProductPage() {
  return (
    <section className="space-y-6">
      <AddProductComponent />
    </section>
  );
}
