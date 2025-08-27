import BannerSection from "@/components/shop-front/BannerSection";
import DepartmentWithCategories from "@/components/shop-front/DepartmentWithCategories";
import HotDeals from "@/components/shop-front/HotDeals";
import RecentlyViewedProducts from "@/components/shop-front/RecentlyViewedProducts";

export default function HeroProductShowcase() {
  return (
    <main>
      <BannerSection />
      <HotDeals />
      <DepartmentWithCategories />
      <RecentlyViewedProducts />
    </main>
  );
}
