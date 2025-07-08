"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/image-upload";
import toast from "react-hot-toast";
import useServiceStore from "@/lib/serviceStore";
import { useIsAdmin } from "@/hooks/user-role";

export default function CreateBannerForm() {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { addBanner, fetchBanners } = useServiceStore();

  const isAdmin = useIsAdmin();
  if (!isAdmin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || images.length === 0) {
      alert("Title and at least one image are required.");
      return;
    }

    setLoading(true);
    try {
      await addBanner({
        title,
        description: description || undefined,
        ctaText: ctaText || undefined,
        ctaLink: ctaLink || undefined,
        imageUrl: images[0], // Assuming you want to use the first image as the main banner image
      });
      fetchBanners(); // Refresh banners after creation
      toast.success("Dodano nowy banner! 🎉", {
        duration: 3000,
        position: "top-center",
        icon: "👏",
      });
      setTitle("");
      setDescription("");
      setCtaText("");
      setCtaLink("");
      setImages([]);
    } catch (error) {
      console.error(error);
      toast.error("Wystąpił błąd podczas dodawania banera.", {
        position: "top-center",
        duration: 3000,
        icon: "❌",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen w-full">
      <Card className=" w-full mx-auto">
        <CardHeader>
          <CardTitle>Stwórz Nowy Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nazwa *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaText">CTA Text</Label>
              <Input
                id="ctaText"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaLink">CTA Link</Label>
              <Input
                id="ctaLink"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Obrazek *</Label>
              <ImageUpload
                value={images}
                onChange={(url) => setImages((prev) => [...prev, url])}
                onRemove={(url) =>
                  setImages((prev) => prev.filter((item) => item !== url))
                }
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Banner"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
