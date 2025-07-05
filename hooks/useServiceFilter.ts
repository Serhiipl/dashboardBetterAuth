"use client";

import { useCallback, useMemo, useState } from "react";
import { ServiceProps, ServiceCategory } from "@/lib/serviceStore";

export interface ServiceFilterState {
  selectedCategories: string[];
  searchQueryByName: string;
  searchQueryDescription: string;
}

export interface UseServiceFilterResult {
  filteredServices: ServiceProps[];
  filterState: ServiceFilterState;
  setCategoryFilter: (id: string) => void;
  removeCategory: (id: string) => void;
  clearAll: () => void;
  setSearchByName: (value: string) => void;
  setSearchByDescription: (value: string) => void;
}

export function useServiceFilter(
  services: ServiceProps[]
): UseServiceFilterResult {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQueryByName, setSearchQueryByName] = useState("");
  const [searchQueryDescription, setSearchQueryDescription] = useState("");

  const setCategoryFilter = useCallback((id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  }, []);

  const removeCategory = useCallback((id: string) => {
    setSelectedCategories((prev) => prev.filter((catId) => catId !== id));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedCategories([]);
    setSearchQueryByName("");
    setSearchQueryDescription("");
  }, []);

  const filteredServices = useMemo(() => {
    let result = [...services];

    if (selectedCategories.length > 0) {
      result = result.filter((s) => selectedCategories.includes(s.categoryId));
    }

    if (searchQueryByName.trim()) {
      result = result.filter((s) =>
        s.name.toLowerCase().includes(searchQueryByName.trim().toLowerCase())
      );
    }

    if (searchQueryDescription.trim()) {
      result = result.filter((s) =>
        s.description
          ?.toLowerCase()
          .includes(searchQueryDescription.trim().toLowerCase())
      );
    }

    return result;
  }, [services, selectedCategories, searchQueryByName, searchQueryDescription]);

  return {
    filteredServices,
    filterState: {
      selectedCategories,
      searchQueryByName,
      searchQueryDescription,
    },
    setCategoryFilter,
    removeCategory,
    clearAll,
    setSearchByName: setSearchQueryByName,
    setSearchByDescription: setSearchQueryDescription,
  };
}
export function useServiceCategories(
  serviceCategories: ServiceCategory[]
): Record<string, string> {
  return useMemo(() => {
    return serviceCategories.reduce(
      (acc: Record<string, string>, category: ServiceCategory) => {
        acc[category.id] = category.name;
        return acc;
      },
      {}
    );
  }, [serviceCategories]);
}
