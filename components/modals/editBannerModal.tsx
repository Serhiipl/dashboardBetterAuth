"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Banner } from "@/lib/serviceStore";
import Image from "next/image";
import { useIsAdmin } from "@/hooks/user-role";

interface EditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: Banner | undefined;
  onSave: (updatedData: Partial<Banner>) => Promise<void>;
}

export const EditBannerModal: React.FC<EditBannerModalProps> = ({
  isOpen,
  onClose,
  banner,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [loading, setLoading] = useState(false);
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (banner) {
      setTitle(banner.title);
      setDescription(banner.description || "");
      setCtaText(banner.ctaText || "");
      setCtaLink(banner.ctaLink || "");
    }
  }, [banner]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onSave({ title, description, ctaText, ctaLink });
      onClose();
    } catch (error) {
      console.error("Error saving banner:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Banner</DialogTitle>
        </DialogHeader>

        {banner?.imageUrl && (
          <div className="mb-4 w-full h-40 relative">
            <Image
              src={banner.imageUrl}
              alt={banner.title}
              fill
              className="object-cover rounded"
            />
          </div>
        )}

        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <Input
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="CTA Text"
          />
          <Input
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            placeholder="CTA Link"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSave} disabled={loading}>
            Save
          </Button>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
