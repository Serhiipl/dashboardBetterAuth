"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ChevronDown, X, Filter, Search } from "lucide-react";
import { ServiceCategory, ServiceProps } from "@/lib/serviceStore";

interface CategoryFilterProps {
  categories: ServiceCategory[];
  services: ServiceProps[];
  onFilteredServicesChange: (filteredServices: ServiceProps[]) => void;
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
  hasSearchFilters: boolean;
}> = ({
  totalServices,
  filteredServices,
  selectedCategories,
  hasSearchFilters,
}) => (
  <div className="flex items-center gap-4 text-sm text-gray-600">
    <span>
      Wyświetlono: <strong className="text-blue-600">{filteredServices}</strong>{" "}
      з {totalServices}
    </span>
    {(selectedCategories > 0 || hasSearchFilters) && (
      <span>
        Aktywnych filtrów:{" "}
        <strong className="text-orange-600">
          {selectedCategories + (hasSearchFilters ? 1 : 0)}
        </strong>
      </span>
    )}
  </div>
);

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  services,
  onFilteredServicesChange,
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
    if (!searchQuery.trim()) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [categories, searchQuery]);

  // Основна логіка фільтрації
  const filteredServices = useMemo(() => {
    let result = [...services]; // Створюємо копію масиву

    // 1. Фільтруємо по категоріях
    if (selectedCategories.length > 0) {
      result = result.filter((service) =>
        selectedCategories.includes(service.categoryId)
      );
    }

    // 2. Фільтруємо по назві
    if (searchQueryByName.trim()) {
      result = result.filter((service) =>
        service.name
          .toLowerCase()
          .includes(searchQueryByName.toLowerCase().trim())
      );
    }

    // 3. Фільтруємо по опису
    if (searchQueryDescription.trim()) {
      result = result.filter((service) =>
        service.description
          ?.toLowerCase()
          .includes(searchQueryDescription.toLowerCase().trim())
      );
    }

    return result;
  }, [services, selectedCategories, searchQueryByName, searchQueryDescription]);

  // Перевірка чи є активні текстові фільтри
  const hasSearchFilters = useMemo(() => {
    return !!(searchQueryByName.trim() || searchQueryDescription.trim());
  }, [searchQueryByName, searchQueryDescription]);

  // Оновлення фільтрованих послуг з оптимізацією
  React.useEffect(() => {
    onFilteredServicesChange(filteredServices);
  }, [filteredServices, onFilteredServicesChange]);

  // Обробники подій з оптимізацією
  const handleCategoryToggle = useCallback((categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  }, []);

  const handleCategoryRemove = useCallback((categoryId: string) => {
    setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQueryDescription("");
    setSearchQueryByName("");
    setSelectedCategories([]);
    setSearchQuery("");
  }, []);

  const selectAllCategories = useCallback(() => {
    setSelectedCategories(categories.map((cat) => cat.id));
  }, [categories]);

  const clearSearchInput = useCallback(
    (type: "category" | "name" | "description") => {
      switch (type) {
        case "category":
          setSearchQuery("");
          break;
        case "name":
          setSearchQueryByName("");
          break;
        case "description":
          setSearchQueryDescription("");
          break;
      }
    },
    []
  );

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
    >
      {/* Заголовок та кнопки управління */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filtruj</h3>
        </div>

        <div className="flex items-center gap-2">
          {(selectedCategories.length > 0 || hasSearchFilters) && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Wyczyść wszystko
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
          hasSearchFilters={hasSearchFilters}
        />
      </div>

      {/* Вибрані категорії */}
      {selectedCategories.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Aktywne filtry kategorii:
          </p>
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
          <div className="space-y-3">
            {/* Пошук по категоріях */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Wyszukiwanie kategorii..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => clearSearchInput("category")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Пошук по назві */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Wyszukiwanie po nazwie usługi..."
                value={searchQueryByName}
                onChange={(e) => setSearchQueryByName(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQueryByName && (
                <button
                  onClick={() => clearSearchInput("name")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Пошук по опису */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Wyszukiwanie po opisie usługi..."
                value={searchQueryDescription}
                onChange={(e) => setSearchQueryDescription(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQueryDescription && (
                <button
                  onClick={() => clearSearchInput("description")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Швидкі дії */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={selectAllCategories}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Wybierz wszystko
            </button>
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Wyczyść
            </button>
          </div>

          {/* Список категорій */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
                Nie znaleziono kategorii
              </p>
            )}
          </div>
        </div>
      )}

      {/* Компактний режим */}
      {!isExpanded && (
        <div className="flex flex-wrap gap-2">
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
              +{categories.length - 5} więcej
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
