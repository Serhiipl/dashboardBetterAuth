// import React from "react";
// import AddService from "./components/addService";

// // import { redirect } from "next/navigation";
// import ShowServices from "./components/showServices";

// const AddServicePage = async () => {
//   //   if (!session?.user) {
//   //     redirect("/sign-in");
//   //   }

//   return (
//     <div className="flex flex-col gap-4 p-4">
//       <h1 className="text-2xl font-bold">Dodawanie usług</h1>
//       <p className="text-muted-foreground">
//         Tutaj możesz dodać nową usługę do swojego pulpitu.
//       </p>
//       <AddService />

//       <ShowServices />
//     </div>
//   );
// };

// export default AddServicePage;
"use client";

import React, { useState, useEffect } from "react";
import AddService from "./components/addService";
import { ServiceProps } from "@/lib/serviceStore";
import ShowServices from "./components/showServices";
import CategoryFilter from "./components/categoryFilter";
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
    services,
    serviceCategories,
    fetchServices,
    fetchServiceCategories,
    isLoading,
  } = useServiceStore();

  // Локальний стан для фільтрованих послуг
  const [filteredServices, setFilteredServices] = useState<ServiceProps[]>([]);

  // Завантажуємо дані при монтуванні компонента
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchServices(), fetchServiceCategories()]);
    };

    loadData();
  }, [fetchServices, fetchServiceCategories]);

  // Оновлюємо фільтровані послуги коли змінюються основні послуги
  useEffect(() => {
    setFilteredServices(services);
  }, [services]);

  // Обробник зміни фільтрованих послуг
  const handleFilteredServicesChange = (filtered: ServiceProps[]) => {
    setFilteredServices(filtered);
  };
  const handleFilteredDescriptionServicesChange = (
    filtered: ServiceProps[]
  ) => {
    setFilteredServices(filtered);
  };

  // Показуємо завантаження поки дані не загрузились
  if (isLoading && services.length === 0) {
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
      {serviceCategories.length > 0 && (
        <CategoryFilter
          categories={serviceCategories}
          services={services}
          onFilteredServicesChange={handleFilteredServicesChange}
          onFilteredServicesByName={handleFilteredServicesChange}
          onFilteredServicesByDescription={
            handleFilteredDescriptionServicesChange
          }
          className="mb-6"
        />
      )}

      {/* Список послуг */}
      <ShowServices services={filteredServices} />
    </div>
  );
};

export default AddServicePage;
