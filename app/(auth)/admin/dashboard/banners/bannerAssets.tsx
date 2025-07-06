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
  const [editDescription, setEditDescription] = useState("");

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

  const handleEdit = (
    bannerId: string,
    currentTitle: string,
    currentDescription: string
  ) => {
    setEditingId(bannerId);
    setEditTitle(currentTitle);
    setEditDescription(currentDescription);
  };
  const handleSave = async () => {
    if (!editingId || !editTitle.trim() || !editDescription.trim()) return;
    const originalBanner = banners.find((b) => b.id === editingId);
    if (!originalBanner) return;
    try {
      await updateBanner({
        ...originalBanner,
        title: editTitle,
        description: editDescription,
      });
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
    <div className="p-6 min-h-fit bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Manage Banners</h2>
      <ul className="space-y-4 min-h-fit flex flex-col gap-5 h-28 ">
        {banners.map((banner) => (
          <li key={banner.id} className="flex  items-center space-x-4">
            {banner.images?.[0]?.url ? (
              <div className="w-40 h-20 relative">
                <Image
                  src={banner.images[0].url}
                  alt={banner.title}
                  width={160}
                  height={80}
                  className="rounded object-cover "
                />

                <div className="absolute top-0 right-0 flex space-x-1 mr-3 ">
                  <Button
                    onClick={() =>
                      handleEdit(
                        banner.id,
                        banner.title,
                        banner.description || ""
                      )
                    }
                    className="bg-blue-500/50 text-white  rounded mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(banner.id)}
                    variant={"destructive"}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-40 h-20 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
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
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
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
                  onClick={() =>
                    handleEdit(
                      banner.id,
                      banner.title,
                      banner.description || ""
                    )
                  }
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
