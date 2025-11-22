"use client";
import { useParams, useSearchParams } from "next/navigation";
import CategoryProducts from "@/components/categories/category-products/CategoryProducts";

export default function CategoryProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryId = params?.id ? parseInt(params.id as string) : 0;
  const categoryName = searchParams?.get("name") || "";

  return (
    <div className="p-6">
      <CategoryProducts 
        categoryId={categoryId}
        categoryName={categoryName}
      />
    </div>
  );
}
