import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceProps } from "@/lib/serviceStore";
import Image from "next/image";

interface ServiceModalPopupProps {
  service: ServiceProps;
  onClose: () => void;
}

const ServiceModalPopup: React.FC<ServiceModalPopupProps> = ({
  service,
  onClose,
}) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {service.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Зображення */}

          {service.images?.length > 0 && (
            <div className="flex overflow-x-auto gap-4 pb-2">
              {service.images.map((img, index) => (
                <div
                  key={img.id || index}
                  className="min-w-[300px] aspect-video overflow-hidden rounded-md flex-shrink-0"
                >
                  <Image
                    src={img.url}
                    alt={`${service.name} ${index + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Інформація */}
          <div className="text-gray-700 space-y-3">
            <p>
              <strong>Ціна:</strong> {service.price} zł
            </p>
            <p>
              <strong>Тривалість:</strong> {service.duration} хв
            </p>
            <p className="text-sm leading-relaxed">
              {service.description || "Опис послуги відсутній."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModalPopup;
