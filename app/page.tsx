"use client";
import HeroCarousel from "@/components/hero-carousel";

import useServiceStore from "@/lib/serviceStore";
// import fetchBanners from "@/lib/serviceStore";
import { useEffect } from "react";
// import CategoryFilter from "../components/modals/categoryFilter";
// import ShowServices from "../components/showServices";
import ServiceMenuView from "@/components/serviceMenuView";

export default function Home() {
  const {
    // services = [],
    banners,
    fetchBanners,
    fetchServices,
    fetchServiceCategories,
  } = useServiceStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchServices(),
          fetchServiceCategories(),
          fetchBanners(),
        ]);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      }
    };

    loadData();
  }, [fetchServices, fetchServiceCategories, fetchBanners]);
  return (
    <div className="flex flex-col items-center  min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 md:px-20 py-10 text-center">
        <HeroCarousel banners={banners} />
        <ServiceMenuView />
      </main>
    </div>
  );
}
