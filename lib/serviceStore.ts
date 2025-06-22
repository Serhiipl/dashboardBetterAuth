import { create } from "zustand";

export interface ServiceProps {
  serviceId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  images: Image[];
  active: boolean;
  categoryId: string;
}

// Тип для створення нової послуги (без serviceId)
export interface CreateServiceData {
  name: string;
  description: string;
  price: number;
  duration: number;
  images: { url: string }[];
  active: boolean;
  categoryId: string;
}
export interface Image {
  id: string;
  serviceId: string;
  url: string;
  createdAt: string;
}
export interface ServiceCategory {
  id: string;
  name: string;
}

interface ServiceStore {
  services: ServiceProps[];
  serviceCategories: ServiceCategory[];
  fetchServices: () => Promise<void>;
  fetchServiceCategories: () => Promise<void>;
  // addService: (newService: ServiceProps) => Promise<void>;
  addService: (newService: CreateServiceData) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
  updateService: (updatedService: ServiceProps) => Promise<void>;
  addServiceCategory: (newCategory: ServiceCategory) => Promise<void>;
  deleteServiceCategory: (categoryId: string) => Promise<void>;
  updateServiceCategory: (updatedCategory: ServiceCategory) => Promise<void>;
  reset: () => void;
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const fetchServices = async (
  set: (partial: (state: ServiceStore) => Partial<ServiceStore>) => void
) => {
  try {
    set((state) => ({ ...state, isLoading: true, error: null }));
    const response = await fetch("/api/services");
    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }
    const data = await response.json();
    set((state) => ({
      ...state,
      services: Array.isArray(data) ? data : [],
      isLoading: false,
    }));
  } catch (error) {
    console.error("Error fetching services:", error);
    set((state) => ({
      ...state,
      services: [],
      error: "Не вдалося завантажити послуги",
      isLoading: false,
    }));
  }
};

const fetchServiceCategories = async (
  set: (partial: (state: ServiceStore) => Partial<ServiceStore>) => void
) => {
  try {
    set((state) => ({ ...state, isLoading: true, error: null }));
    const response = await fetch("/api/categories");
    if (!response.ok) {
      throw new Error("Failed to fetch service categories");
    }
    const data = await response.json();
    set((state) => ({
      ...state,
      serviceCategories: Array.isArray(data) ? data : [],
      isLoading: false,
    }));
  } catch (error) {
    console.error("Error fetching service categories:", error);
    set((state) => ({
      ...state,
      serviceCategories: [],
      error: "Не вдалося завантажити категорії",
      isLoading: false,
    }));
  }
};

const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  serviceCategories: [],
  isLoading: false,
  error: null,

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),

  fetchServices: () => fetchServices(set),
  fetchServiceCategories: () => fetchServiceCategories(set),

  // addService: async (newService) => {
  //   try {
  //     const response = await fetch("/api/services", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(newService),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to add service");
  //     }

  //     // Оновлюємо список послуг
  //     await fetchServices(set);
  //   } catch (error) {
  //     console.error("Error adding service:", error);
  //     throw error;
  //   }
  // },

  addService: async (newService) => {
    try {
      set((state) => ({ ...state, isLoading: true, error: null }));

      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });

      if (!response.ok) {
        throw new Error("Failed to add service");
      }

      // Після успішного створення - оновлюємо список послуг
      await fetchServices(set);

      set((state) => ({ ...state, isLoading: false }));
    } catch (error) {
      console.error("Error adding service:", error);
      set((state) => ({
        ...state,
        isLoading: false,
        error: "Не вдалося додати послугу",
      }));
      throw error;
    }
  },

  deleteService: async (serviceId) => {
    try {
      if (!serviceId) {
        throw new Error("Service ID is required");
      }

      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete service: ${errorText}`);
      }

      set((state) => ({
        services: state.services.filter(
          (service) => service.serviceId !== serviceId
        ),
      }));
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  },

  updateService: async (updatedService) => {
    try {
      const response = await fetch(
        `/api/services/${updatedService.serviceId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedService),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update service: ${errorText}`);
      }

      set((state) => ({
        services: state.services.map((service) =>
          service.serviceId === updatedService.serviceId
            ? updatedService
            : service
        ),
      }));
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  },

  addServiceCategory: async (newCategory) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add category: ${errorText}`);
      }

      await fetchServiceCategories(set);
    } catch (error) {
      console.error("Error adding service category:", error);
      throw error;
    }
  },

  deleteServiceCategory: async (categoryId) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      set((state) => ({
        serviceCategories: state.serviceCategories.filter(
          (category) => category.id !== categoryId
        ),
      }));
    } catch (error) {
      console.error("Error deleting service category:", error);
      throw error;
    }
  },

  updateServiceCategory: async (updatedCategory) => {
    try {
      const response = await fetch(`/api/categories/${updatedCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      set((state) => ({
        serviceCategories: state.serviceCategories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        ),
      }));
    } catch (error) {
      console.error("Error updating service category:", error);
      throw error;
    }
  },

  reset: () =>
    set({
      services: [],
      serviceCategories: [],
      isLoading: false,
      error: null,
    }),
}));

export default useServiceStore;
export { fetchServices, fetchServiceCategories };
