import type { Metadata } from "next";
import ProductsComponent from "@/components/products/list-products/ProductsComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function ListProductsPage() {
  return (
    <section className="space-y-6">
      <ProductsComponent />
    </section>
  );
}
