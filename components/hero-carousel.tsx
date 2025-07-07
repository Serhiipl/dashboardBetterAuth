"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import useServiceStore, { Banner } from "@/lib/serviceStore";

interface HeroCarouselProps {
  banners: Banner[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = () => {
  const { fetchBanners, isLoading, banners } = useServiceStore();

  useEffect(() => {
    fetchBanners().catch((error) =>
      console.error("Error fetching banners:", error)
    );
  }, [fetchBanners]);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500">
        No banners available
      </div>
    );
  }
  return (
    <section className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        navigation
        modules={[Autoplay, Pagination, Navigation]}
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative">
            {banner.imageUrl ? (
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                width={1920}
                height={600}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center text-gray-500 text-xl">
                No image
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {banner.title}
              </h2>
              {banner.description && (
                <p className="mb-4 text-lg max-w-2xl">{banner.description}</p>
              )}
              {banner.ctaText && banner.ctaLink && (
                <a
                  href={banner.ctaLink}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
                >
                  {banner.ctaText}
                </a>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroCarousel;
