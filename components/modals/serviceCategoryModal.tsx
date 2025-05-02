// This file is part of the Service Category Management project.
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Modal } from "@/components/ui/Modal";
import { ServiceCategory } from "@/lib/serviceStore";
import useServiceStore from "@/lib/serviceStore";

export interface ServiceCategoryChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryData: ServiceCategory;
}

export const ServiceCategoryChangeModal: React.FC<
  ServiceCategoryChangeModalProps
> = ({ isOpen, onClose, categoryData }) => {
  const [formData, setFormData] = useState<ServiceCategory>({
    ...categoryData,
  });

  const updateServiceCategory = useServiceStore(
    (state) => state.updateServiceCategory
  );

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...categoryData });
    }
  }, [categoryData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Nazwa nie może być pusta.");
      return;
    }

    try {
      await updateServiceCategory(formData);
      onClose();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <Modal
      title="Edycja kategorii"
      description="Zmień dane."
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 text-black bg-white"
      >
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Nazwa kategorii
          </label>
          <input
            autoFocus
            name="name"
            type="text"
            value={formData.name ?? ""}
            onChange={handleChange}
            placeholder="Nazwa kategorii"
            required
            className="w-full rounded-sm px-2 py-1 shadow-md shadow-red-100 border border-red-100 focus:outline-none focus:border-red-400"
          />
        </div>
        <Button className="bg-red-300" type="submit">
          Zapisz zmiany
        </Button>
      </form>
    </Modal>
  );
};
