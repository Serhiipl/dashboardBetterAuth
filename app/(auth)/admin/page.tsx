"use client";

import useServiceStore, { ServiceProps } from "@/lib/serviceStore";
import CategoryFilter from "@/components/modals/categoryFilter";
import ShowServices from "@/components/showServices";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const {
    services = [],
    serviceCategories = [],
    fetchServices,
    fetchServiceCategories,
    // isLoading,
  } = useServiceStore();

  const [filteredServices, setFilteredServices] = useState<ServiceProps[]>([]);

  const handleFilteredServicesChange = (filtered: ServiceProps[]) => {
    setFilteredServices(Array.isArray(filtered) ? filtered : []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchServices(), fetchServiceCategories()]);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      }
    };

    loadData();
  }, [fetchServices, fetchServiceCategories]);

  // Оновлюємо фільтровані послуги коли змінюються основні послуги
  useEffect(() => {
    setFilteredServices(Array.isArray(services) ? services : []);
  }, [services]);

  // Показуємо фільтр категорій та послуги
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Usługi</h1>
      {/* Фільтр категорій - показуємо тільки якщо є категорії */}
      {serviceCategories && serviceCategories.length > 0 && (
        <CategoryFilter
          categories={serviceCategories}
          services={services || []}
          onFilteredServicesChange={handleFilteredServicesChange}
          className="mb-6"
        />
      )}
      <ShowServices services={filteredServices} />
    </div>
  );
}
