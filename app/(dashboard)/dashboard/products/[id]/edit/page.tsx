import { notFound } from "next/navigation";
import { ProductUpdateForm } from "./product-update-form";

import { Suspense } from "react";
import EditProductLoading from "./edit-loading";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  try {
    // const product = await getProductById(id);

    if (!id) {
      notFound();
    }
    return (
      <Suspense fallback={<EditProductLoading />}>
        <ProductUpdateForm id={id} />
      </Suspense>
    );
  } catch (error) {
    notFound();
  }
}
