"use client";

import useServiceStore from "@/lib/serviceStore";
import React, { useEffect, useState, useMemo, useCallback } from "react";
// import CellAction from "./cellAction";
import { ServiceCategory, ServiceProps } from "@/lib/serviceStore";
import ServiceCard from "./serviceCard";

// Компонент для відображення статусу послуги
// const ServiceStatus: React.FC<{ active: boolean }> = ({ active }) => (
//   <span
//     className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//       active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//     }`}
//   >
//     <span
//       className={`w-2 h-2 rounded-full mr-1 ${
//         active ? "bg-green-400" : "bg-red-400"
//       }`}
//     />
//     {active ? "Aktywna" : "Nieaktywna"}
//   </span>
// );

// Компонент для картки послуги
// const ServiceCard: React.FC<{
//   service: ServiceProps;
//   categoryName?: string;
// }> = ({ service, categoryName }) => (
//   <li className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
//     <div className="p-4 relative">
//       <CellAction
//         className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//         data={service}
//       />

//       {/* Заголовок */}
//       <div className="mb-3">
//         <h3 className="text-lg font-semibold text-gray-900 truncate pr-8">
//           {service.name}
//         </h3>
//         <p className="bg-cyan-50 text-indigo-800 text-sm max-w-fit px-4 rounded-full mt-1">
//           {categoryName || (
//             <span className="italic text-gray-400">Brak kategorii</span>
//           )}
//         </p>
//       </div>

//       {/* Основна інформація */}
//       <div className="flex justify-between items-center mb-3">
//         <div className="flex items-center space-x-4">
//           <p className="text-sm font-normal text-slate-950">
//             Cena: <span className="font-bold">{service.price}</span> zł
//           </p>
//           <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
//             {service.duration} min
//           </span>
//         </div>
//         <ServiceStatus active={service.active} />
//       </div>

//       {/* Опис */}
//       {service.description && (
//         <p className="text-gray-600 text-sm line-clamp-4 leading-relaxed">
//           {service.description}
//         </p>
//       )}
//     </div>
//   </li>
// );

// Компонент для пустого стану
const EmptyState: React.FC = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
      <svg
        className="w-8 h-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Brak dostępnych usług
    </h3>
    <p className="text-gray-500">Dodaj swoją pierwszą usługę, aby rozpocząć</p>
  </div>
);

// Компонент завантаження
const LoadingState: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg shadow-md p-4 animate-pulse"
      >
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div className="flex justify-between mb-3">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    ))}
  </div>
);

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

  // Функція для завантаження даних
  const loadData = useCallback(async () => {
    try {
      await Promise.all([fetchServiceCategories(), fetchServices()]);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }, [fetchServiceCategories, fetchServices]);

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
    <div className="bg-slate-50 p-6 rounded-xl">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Usługi</h2>
          <p className="text-gray-600 mt-1">
            Znaleziono {servicesToDisplay.length}{" "}
            {servicesToDisplay.length === 1 ? "usługa" : "usług"}
          </p>
        </div>

        {/* Кнопка оновлення */}
        <button
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
        </button>
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
