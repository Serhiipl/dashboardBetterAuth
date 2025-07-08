import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { ServiceProps, ServiceCategory } from "@/lib/serviceStore";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useServiceStore from "@/lib/serviceStore";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceProps | undefined;
  categories: ServiceCategory[];
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  categories,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    duration: "",
    active: false,
    images: [] as string[],
  });

  const fetchServices = useServiceStore((state) => state.fetchServices);
  const fetchServiceCategories = useServiceStore(
    (state) => state.fetchServiceCategories
  );

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([fetchServices(), fetchServiceCategories()]);
        setFormData({
          name: service?.name || "",
          description: service?.description || "",
          categoryId: service?.categoryId || categories[0]?.id || "",
          price: service?.price?.toString() || "",
          duration: service?.duration?.toString() || "",
          active: service?.active || false,
          images: service?.images?.map((img) => img.url) || [],
        });
      } catch (error) {
        console.error("Failed to load services or categories:", error);
      }
    };
    loadInitialData();
  }, [fetchServices, fetchServiceCategories, service]);

  const { name, description, categoryId, price, active, images } = formData;

  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateService(formData);
      await fetchServices();
      onClose();
    } catch (error) {
      console.error("Failed to save service:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        {service && (
          <div>
            {images.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Images</label>
                <div className="flex space-x-2">
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Service Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <Input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <Textarea
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Price</label>
            <Input
              // type="number"
              className="w-full border rounded px-3 py-2"
              value={price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Price</label>
            <Input
              // type="number"
              className="w-full border rounded px-3 py-2"
              value={price}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Active</label>
            <input
              type="checkbox"
              checked={active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              className="mr-2"
            />
          </div>
        </div>
        <DialogFooter>
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

function updateService(formData: {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  duration: string;
  active: boolean;
  images: string[];
}) {
  throw new Error("Function not implemented.");
}
