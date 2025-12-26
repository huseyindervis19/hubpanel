"use client";

import { useParams, useSearchParams } from "next/navigation";
import ProductImages from "@/components/products/product-images/ProductImages";

export default function ProductImagesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params?.id ? parseInt(params.id as string) : 0;
  const productName = searchParams?.get("name") || "";

  return (
    <section className="space-y-6">
      <ProductImages 
        productId={productId}
        productName={productName}
      />
    </section>
  );
}
