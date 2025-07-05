"use client";

import React, { useState, useEffect } from "react";
import AddService from "./components/addService";
import { ServiceProps } from "@/lib/serviceStore";
import ShowServices from "../../../../../components/showServices";
import CategoryFilter from "../../../../../components/modals/categoryFilter";
import useServiceStore from "@/lib/serviceStore";

// Компонент завантаження
const LoadingState = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Завантаження...</span>
  </div>
);

const AddServicePage = () => {
  // Отримуємо дані зі store
  const {
    services = [],
    serviceCategories = [],
    fetchServices,
    fetchServiceCategories,
    isLoading,
  } = useServiceStore();

  // Локальний стан для фільтрованих послуг
  const [filteredServices, setFilteredServices] = useState<ServiceProps[]>([]);

  // Завантажуємо дані при монтуванні компонента
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

  // Обробник зміни фільтрованих послуг
  const handleFilteredServicesChange = (filtered: ServiceProps[]) => {
    console.log("Фільтровані послуги:", filtered); // Для дебагу
    setFilteredServices(Array.isArray(filtered) ? filtered : []);
  };

  // Показуємо завантаження поки дані не загрузились
  if (isLoading && (!services || services.length === 0)) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold">Dodawanie usług</h1>
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-7xl mx-auto">
      {/* Заголовок */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dodawanie usług
        </h1>
        <p className="text-gray-600">
          Tutaj możesz dodać nową usługę do swojego pulpitu i zarządzać
          istniejącymi.
        </p>
      </div>

      {/* Форма додавання послуги */}
      <div className="mb-8">
        <AddService />
      </div>

      {/* Фільтр категорій - показуємо тільки якщо є категорії */}
      {serviceCategories && serviceCategories.length > 0 && (
        <CategoryFilter
          categories={serviceCategories}
          services={services || []}
          onFilteredServicesChange={handleFilteredServicesChange}
          className="mb-6"
        />
      )}

      {/* Список послуг - передаємо відфільтровані послуги */}
      <ShowServices services={filteredServices} />

      {/* Дебаг інформація (тільки в режимі розробки) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
          <p>Debug: Всього послуг: {services?.length || 0}</p>
          <p>Debug: Показано послуг: {filteredServices?.length || 0}</p>
          <p>Debug: Категорій: {serviceCategories?.length || 0}</p>
        </div>
      )}
    </div>
  );
};

export default AddServicePage;
