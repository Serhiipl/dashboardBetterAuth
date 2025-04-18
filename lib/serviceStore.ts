import { create } from "zustand";

export interface ServiceProps {
  serviceId: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  active: boolean;
}

interface ServiceStore {
  services: ServiceProps[];
  serviceCategories: ServiceCategory[];
  fetchServices: () => Promise<void>;
  fetchServiceCategories: () => Promise<void>;
  addService: (newService: ServiceProps) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
  updateService: (updatedService: ServiceProps) => Promise<void>;
  addServiceCategory: (newCategory: ServiceCategory) => void;
  deleteServiceCategory: (categoryId: string) => void;
  updateServiceCategory: (updatedCategory: ServiceCategory) => void;
  reset: () => void;
}

export interface ServiceCategory {
  id: string;
  name: string;
}

const fetchServices = async (
  set: (partial: (state: ServiceStore) => Partial<ServiceStore>) => void
) => {
  try {
    const response = await fetch("/api/services");
    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }
    const data = await response.json();
    set((state) => ({ ...state, services: data }));
  } catch (error) {
    console.error("Error fetching services:", error);
  }
};
const fetchServiceCategories = async (
  set: (partial: (state: ServiceStore) => Partial<ServiceStore>) => void
) => {
  try {
    const response = await fetch("/api/service-categories");
    if (!response.ok) {
      throw new Error("Failed to fetch service categories");
    }
    const data = await response.json();
    set((state) => ({ ...state, serviceCategories: data }));
  } catch (error) {
    console.error("Error fetching service categories:", error);
  }
};

const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  serviceCategories: [],
  fetchServices: () => fetchServices(set),
  fetchServiceCategories: () => fetchServiceCategories(set),

  addService: async (newService) => {
    set((state) => ({
      ...state,
      services: [...state.services, newService],
    }));

    // Вызовем fetchServices для обновления списка
    await fetchServices(set);
  },
  // deleteService: async (serviceId) => {
  //   try {
  //     const response = await fetch(`/api/services/${serviceId}`, {
  //       method: "DELETE",
  //     });
  //     if (!response.ok) throw new Error("Failed to delete service");
  //     // Удаление услуги с API
  //     set((state) => ({
  //       services: state.services.filter(
  //         (service) => service.serviceId !== serviceId
  //       ), // Удаление услуги из состояния
  //     }));
  //   } catch (error) {
  //     console.error("Error deleting service:", error);
  //   }
  // },

  // У serviceStore.ts
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
      throw error; // Перекидаємо помилку для обробки у компоненті
    }
  },

  // updateService: async (updatedService) => {
  //   await fetch(`/api/services/${updatedService.serviceId}`, {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(updatedService),
  //   });

  //   // Обновление услуги с API
  //   set((state) => ({
  //     services: state.services.map((service) =>
  //       service.serviceId === updatedService.serviceId
  //         ? updatedService
  //         : service
  //     ),
  //   }));
  // },

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

      // Оновлення успішне, оновлюємо стан
      set((state) => ({
        services: state.services.map((service) =>
          service.serviceId === updatedService.serviceId
            ? updatedService
            : service
        ),
      }));
    } catch (error) {
      console.error("Error updating service:", error);
      throw error; // Перекидаємо помилку, щоб її можна було обробити в компоненті
    }
  },

  addServiceCategory: async (newCategory) => {
    set((state) => ({
      serviceCategories: [...state.serviceCategories, newCategory],
    }));
    await fetchServiceCategories(set);
  },
  deleteServiceCategory: async (categoryId) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      // Удаление категории с API
      set((state) => ({
        serviceCategories: state.serviceCategories.filter(
          (category) => category.id !== categoryId
        ),
      }));
    } catch (error) {
      console.error("Error deleting service category:", error);
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
    }
  },
  reset: () => set({ services: [], serviceCategories: [] }),
}));

export default useServiceStore;
export { fetchServices, fetchServiceCategories };
