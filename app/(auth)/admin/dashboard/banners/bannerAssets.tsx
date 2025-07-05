"use client";

import useServiceStore from "@/lib/serviceStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BannerAssets() {
  // Fetch banners from API
  const {
    banners = [],
    fetchBanners,
    deleteBanner,
    updateBanner,
    isLoading,
  } = useServiceStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    const loadBanners = async () => {
      try {
        await fetchBanners();
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    loadBanners();
  }, [fetchBanners]);

  if (isLoading) return <div>Loading...</div>;

  const handleEdit = (bannerId: string, currentTitle: string) => {
    setEditingId(bannerId);
    setEditTitle(currentTitle);
  };
  const handleSave = async () => {
    if (!editingId || !editTitle.trim()) return;
    const originalBanner = banners.find((b) => b.id === editingId);
    if (!originalBanner) return;
    try {
      await updateBanner({ ...originalBanner, title: editTitle });
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update banner:", error);
    }
  };

  const handleDelete = async (bannerId: string) => {
    try {
      await deleteBanner(bannerId);
    } catch (error) {
      console.error("Failed to delete banner:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Banners</h2>
      <ul className="space-y-4">
        {banners.map((banner) => (
          <li key={banner.id} className="flex items-center space-x-4">
            {banner.images?.[0]?.url ? (
              <Image
                src={banner.images[0].url}
                alt={banner.title}
                width={96}
                height={48}
                className="rounded object-cover"
              />
            ) : (
              <div className="w-24 h-12 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
                No image
              </div>
            )}
            {editingId === banner.id ? (
              <>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-64"
                />
                <Button onClick={() => handleSave()} className="bg-green-600">
                  Save
                </Button>
                <Button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-300 px-2 py-1 rounded"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1">{banner.title}</span>
                <Button
                  onClick={() => handleEdit(banner.id, banner.title)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(banner.id)}
                  variant={"destructive"}
                >
                  Delete
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
