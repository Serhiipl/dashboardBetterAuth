"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, X, Filter } from "lucide-react";
import { ServiceCategory, ServiceProps } from "@/lib/serviceStore";

interface CategoryFilterProps {
  categories: ServiceCategory[];
  services: ServiceProps[];
  onFilteredServicesChange: (filteredServices: ServiceProps[]) => void;
  onFilteredServicesByName: (filteredServicesByName: ServiceProps[]) => void;
  onFilteredServicesByDescription: (
    filteredServicesByDescription: ServiceProps[]
  ) => void;
  className?: string;
}

// Компонент бейджа категорії
const CategoryBadge: React.FC<{
  category: ServiceCategory;
  isSelected: boolean;
  onClick: () => void;
  onRemove?: () => void;
  count?: number;
}> = ({ category, isSelected, onClick, onRemove, count }) => (
  <div
    className={`inline-flex max-w-fit items-center gap-2 px-3 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
      isSelected
        ? "bg-blue-600 text-white shadow-md"
        : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
    }`}
    onClick={onClick}
  >
    <span>{category.name}</span>
    {count !== undefined && (
      <span
        className={`px-2 py-0.5 rounded-full text-xs ${
          isSelected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
        }`}
      >
        {count}
      </span>
    )}
    {isSelected && onRemove && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-1 hover:bg-blue-500 rounded-full p-0.5 transition-colors"
      >
        <X size={14} />
      </button>
    )}
  </div>
);

// Компонент статистики
const FilterStats: React.FC<{
  totalServices: number;
  filteredServices: number;
  selectedCategories: number;
}> = ({ totalServices, filteredServices, selectedCategories }) => (
  <div className="flex items-center gap-4 text-sm text-gray-600">
    <span>
      Wyświetlono: <strong className="text-blue-600">{filteredServices}</strong>{" "}
      з {totalServices}
    </span>
    {selectedCategories > 0 && (
      <span>
        Фільтрів:{" "}
        <strong className="text-orange-600">{selectedCategories}</strong>
      </span>
    )}
  </div>
);

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  services,
  onFilteredServicesChange,
  onFilteredServicesByName,
  onFilteredServicesByDescription,
  className = "",
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDescription, setSearchQueryDescription] = useState("");
  const [searchQueryByName, setSearchQueryByName] = useState("");

  // Підрахунок кількості послуг по категоріях
  const categoryStats = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = services.filter(
        (service) => service.categoryId === category.id
      ).length;
      return acc;
    }, {} as Record<string, number>);
  }, [categories, services]);

  // Фільтровані категорії для пошуку
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Фільтровані послуги
  const filteredServices = useMemo(() => {
    if (selectedCategories.length === 0) return services;
    return services.filter((service) =>
      selectedCategories.includes(service.categoryId)
    );
  }, [services, selectedCategories]);

  const filteredServicesByDescription = useMemo(() => {
    if (!searchQueryDescription) return filteredServices;
    return filteredServices.filter((service) =>
      service.description
        .toLowerCase()
        .includes(searchQueryDescription.toLowerCase())
    );
  }, [filteredServices, searchQueryDescription]);

  const filteredServicesByName = useMemo(() => {
    if (!searchQueryByName) return filteredServices;
    return filteredServices.filter((service) =>
      service.name.toLowerCase().includes(searchQueryByName.toLowerCase())
    );
  }, [filteredServices, searchQueryByName]);

  // Оновлення фільтрованих послуг
  React.useEffect(() => {
    onFilteredServicesChange(filteredServices);
    onFilteredServicesByDescription(filteredServicesByDescription);
    onFilteredServicesByName(filteredServicesByName);
  }, [
    filteredServices,
    onFilteredServicesChange,
    filteredServicesByName,
    onFilteredServicesByName,
    filteredServicesByDescription,
    onFilteredServicesByDescription,
  ]);

  // Обробники подій
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleCategoryRemove = (categoryId: string) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
  };

  const clearAllFilters = () => {
    setSearchQueryDescription("");
    setSelectedCategories([]);
    setSearchQuery("");
  };

  const selectAllCategories = () => {
    setSelectedCategories(categories.map((cat) => cat.id));
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
    >
      {/* Заголовок та кнопки управління */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filtruj</h3>
        </div>

        <div className="flex items-center gap-2">
          {selectedCategories.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Очистити все
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {isExpanded ? "Zwiń" : "Rozwiń"}
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="mb-4">
        <FilterStats
          totalServices={services.length}
          filteredServices={filteredServices.length}
          selectedCategories={selectedCategories.length}
        />
      </div>

      {/* Вибрані категорії */}
      {selectedCategories.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Активні фільтри:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryId) => {
              const category = categories.find((cat) => cat.id === categoryId);
              if (!category) return null;
              return (
                <CategoryBadge
                  key={categoryId}
                  category={category}
                  isSelected={true}
                  onClick={() => {}}
                  onRemove={() => handleCategoryRemove(categoryId)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Розгорнутий режим */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Пошук */}
          <div className="relative">
            <input
              type="text"
              placeholder="Wyszukiwanie kategorii..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Wyszukiwanie po nazwie..."
              value={searchQueryByName}
              onChange={(e) => setSearchQueryByName(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Wyszukiwanie po opisu..."
              value={searchQueryDescription}
              onChange={(e) => setSearchQueryDescription(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Швидкі дії */}
          <div className="flex gap-2">
            <button
              onClick={selectAllCategories}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Вибрати все
            </button>
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Очистити
            </button>
          </div>

          {/* Список категорій */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredCategories.map((category) => (
                  <CategoryBadge
                    key={category.id}
                    category={category}
                    isSelected={selectedCategories.includes(category.id)}
                    onClick={() => handleCategoryToggle(category.id)}
                    count={categoryStats[category.id] || 0}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Категорії не знайдено
              </p>
            )}
          </div>
        </div>
      )}

      {/* Компактний режим - тільки вибрані + кілька популярних */}
      {!isExpanded && (
        <div className="flex flex-wrap gap-2">
          {/* Показуємо топ-5 категорій за кількістю послуг */}
          {categories
            .sort(
              (a, b) => (categoryStats[b.id] || 0) - (categoryStats[a.id] || 0)
            )
            .slice(0, 5)
            .map((category) => (
              <CategoryBadge
                key={category.id}
                category={category}
                isSelected={selectedCategories.includes(category.id)}
                onClick={() => handleCategoryToggle(category.id)}
                count={categoryStats[category.id] || 0}
              />
            ))}

          {categories.length > 5 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors"
            >
              +{categories.length - 5} більше
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
