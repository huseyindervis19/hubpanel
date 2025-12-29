"use client";

import AddProductComponent from "@/components/products/add-product/AddProductComponent";
import { useSearchParams } from "next/navigation";

export default function AddProductPage() {
  const searchParams = useSearchParams();

  const categoryIdParam = searchParams?.get("categoryId");
  const categoryId = categoryIdParam
    ? Number(categoryIdParam)
    : undefined;

  return (
    <section className="space-y-6">
      <AddProductComponent preselectedCategoryId={categoryId} />
    </section>
  );
}
