"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Modal } from "@/components/ui/Modal";
import { ServiceProps } from "@/lib/serviceStore";
import useServiceStore from "@/lib/serviceStore";

interface ServiceChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData: ServiceProps;
}

export const ServiceChangeModal: React.FC<ServiceChangeModalProps> = ({
  isOpen,
  onClose,
  serviceData,
}) => {
  const [formData, setFormData] = useState(serviceData);
  const updateService = useServiceStore((state) => state.updateService); // Добавьте updateService в store

  useEffect(() => {
    setFormData(serviceData); // Обновляем состояние при открытии модального окна
  }, [serviceData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateService(formData); // Вызов функции обновления услуги
      onClose();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <Modal
      title="Edycja usługi"
      description="Zmień dane usługi."
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 text-black bg-white"
      >
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Nazwa usługi
          </label>
          <input
            className="w-full rounded-sm px-2 py-1 shadow-md  shadow-red-100 border border-red-100 focus:outline-none focus:border-red-400"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Название услуги"
            required
          />
        </div>
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Cena usługi:
          </label>
          <input
            className="w-full rounded-sm px-2 py-1 shadow-md shadow-red-100 border border-red-100 focus:outline-none focus:border-red-400"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Cena usługi"
            required
          />
        </div>
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Czas na wykonanie:
          </label>
          <input
            className="w-full rounded-sm px-2 py-1 shadow-md shadow-red-100 border border-red-100 focus:outline-none focus:border-red-400"
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Время выполнения"
            required
          />
        </div>
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Opis usługi:
          </label>
          <textarea
            className="w-full rounded-sm px-2 py-1 shadow-md border border-red-100 focus:outline-none focus:border-red-400"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Opis usługi..."
            rows={4}
            required
          />
        </div>
        <label>
          Aktywna:
          <input
            className="checked:bg-red-300"
            name="active"
            type="checkbox"
            checked={formData.active}
            onChange={handleChange}
          />
        </label>
        <Button className="bg-red-300" type="submit">
          Zapisz zmiany
        </Button>
      </form>
    </Modal>
  );
};
