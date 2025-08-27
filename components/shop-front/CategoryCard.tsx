import { Category } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <div className="relative bg-white rounded-lg border border-[#e0e6ed] hover:border-[#204462]/30 transition-all duration-300 overflow-hidden">
        {/* Product Image */}
        <div className="relative h-24 bg-[#f5f7fa] overflow-hidden">
          <Image
            src={category.image || "/amazon/img-1.avif"}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 rounded-t-lg group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="p-3 space-y-2">
          <h4 className="text-xs font-medium text-[#204462] line-clamp-1 group-hover:text-[#f5c704] transition-colors">
            {category.name}
          </h4>
        </div>
      </div>
    </Link>
  );
}
