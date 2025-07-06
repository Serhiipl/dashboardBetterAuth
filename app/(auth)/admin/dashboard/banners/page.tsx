"use client";

import BannerAssets from "./bannerAssets";
import CreateBannerForm from "./createBannerForm";

export default function Banners() {
  return (
    <div className=" flex flex-col gap-2 p-4 bg-gray-50 min-h-screen w-full">
      <h1 className="text-2xl font-bold mb-4">Banners</h1>
      <BannerAssets />
      <CreateBannerForm />
    </div>
  );
}
