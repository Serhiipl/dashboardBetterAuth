"use client";

import useServiceStore from "@/lib/serviceStore";
import React, { useEffect, useState, useMemo, useCallback } from "react";
// import CellAction from "./cellAction";
import { ServiceCategory, ServiceProps } from "@/lib/serviceStore";
import ServiceCard from "@/components/serviceCard";
import EmptyState from "@/components/emptyItemState";
import LoadingState from "./loadingItemState";

interface ShowServicesProps {
  services: ServiceProps[];
}

const ShowServices: React.FC<ShowServicesProps> = ({
  services: filteredServices,
}) => {
  const {
    serviceCategories,
    fetchServiceCategories,
    fetchServices,
    isLoading,
    error,
  } = useServiceStore();

  const [isMounted, setIsMounted] = useState(false);

  // Функція для завантаження даних

  const loadData = useCallback(async () => {
    try {
      await Promise.all([fetchServiceCategories(), fetchServices()]);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }, [fetchServiceCategories, fetchServices]);

  // Мемоізована мапа категорій для швидкого пошуку
  const categoryMap = useMemo(() => {
    if (!serviceCategories || !Array.isArray(serviceCategories)) {
      return {};
    }
    return serviceCategories.reduce(
      (acc: Record<string, string>, category: ServiceCategory) => {
        acc[category.id] = category.name;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [serviceCategories]);

  useEffect(() => {
    if (!serviceCategories || serviceCategories.length === 0) {
      loadData();
    }
    setIsMounted(true);
  }, [loadData, serviceCategories]);

  // Показуємо null до монтування (для SSR)
  if (!isMounted) {
    return null;
  }

  // Використовуємо передані послуги замість тих, що зі store
  const servicesToDisplay = filteredServices || [];

  return (
    <div className="bg-slate-50 p-2 rounded-xl">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl font-bold text-gray-800">Usługi:</h2>
          <p className="text-gray-600 mt-1 text-sm">
            Znaleziono: {servicesToDisplay.length}...
          </p>
        </div>

        {/* Кнопка оновлення */}
        {/* <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Aktualizuj</span>
        </button> */}
      </div>

      {/* Обробка помилок */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Контент */}
      {isLoading ? (
        <LoadingState />
      ) : servicesToDisplay.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {servicesToDisplay.map((service: ServiceProps) => (
            <ServiceCard
              key={service.serviceId}
              service={service}
              categoryName={categoryMap[service.categoryId]}
            />
          ))}
        </ul>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default ShowServices;
