"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Modal } from "@/components/ui/Modal";
import { ServiceProps } from "@/lib/serviceStore";
import useServiceStore from "@/lib/serviceStore";

interface ServiceChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData: ServiceProps;
}

export const ServiceChangeModal: React.FC<ServiceChangeModalProps> = ({
  isOpen,
  onClose,
  serviceData,
}) => {
  const [formData, setFormData] = useState(serviceData);
  const updateService = useServiceStore((state) => state.updateService); // Добавьте updateService в store

  useEffect(() => {
    setFormData(serviceData); // Обновляем состояние при открытии модального окна
  }, [serviceData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateService(formData);
      onClose();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  return (
    <Modal
      title="Edycja usługi"
      description="Zmień dane usługi."
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 text-black bg-white"
      >
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Nazwa usługi
          </label>
          <input
            className="w-full rounded-sm px-2 py-1 shadow-md  shadow-red-100 border border-red-100 focus:outline-none focus:border-red-400"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nazwa usługi"
            required
          />
        </div>
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Cena usługi:
          </label>
          <input
            className="w-full rounded-sm px-2 py-1 shadow-md shadow-red-100 border border-red-100 focus:outline-none focus:border-red-400"
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Cena usługi"
            required
          />
        </div>
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Czas na wykonanie:
          </label>
          <input
            className="w-full rounded-sm px-2 py-1 shadow-md shadow-red-100 border border-red-100 focus:outline-none focus:border-red-400"
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Czas na wykonanie"
            required
          />
        </div>
        <div className="relative p-2 border border-gray-300 rounded-sm">
          <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
            Opis usługi:
          </label>
          <textarea
            className="w-full rounded-sm px-2 py-1 shadow-md border border-red-100 focus:outline-none focus:border-red-400"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Opis usługi..."
            rows={4}
            required
          />
        </div>
        <label>
          Aktywna:
          <input
            className="checked:bg-red-300"
            name="active"
            type="checkbox"
            checked={formData.active}
            onChange={handleChange}
          />
        </label>
        <Button className="bg-red-300" type="submit">
          Zapisz zmiany
        </Button>
      </form>
    </Modal>
  );
};
// "use client";
// import React, { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { Modal } from "@/components/ui/Modal";
// import { ServiceProps, ServiceCategory } from "@/lib/serviceStore";
// import useServiceStore from "@/lib/serviceStore";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface ServiceChangeModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   serviceData: ServiceProps;
//   categories: ServiceCategory[];
// }

// export const ServiceChangeModal: React.FC<ServiceChangeModalProps> = ({
//   isOpen,
//   onClose,
//   serviceData,
//   categories,
// }) => {
//   const [formData, setFormData] = useState<ServiceProps>(serviceData);
//   const updateService = useServiceStore((state) => state.updateService);

//   useEffect(() => {
//     setFormData(serviceData);
//   }, [serviceData]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type, checked } = e.target as HTMLInputElement;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleCategoryChange = (value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       categoryId: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await updateService(formData);
//       onClose();
//     } catch (error) {
//       console.error("Error updating service:", error);
//     }
//   };

//   return (
//     <Modal
//       title="Edycja usługi"
//       description="Zmień dane usługi."
//       isOpen={isOpen}
//       onClose={onClose}
//     >
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-3 text-black bg-white"
//       >
//         {/* Назва */}
//         <div className="relative p-2 border border-gray-300 rounded-sm">
//           <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
//             Nazwa usługi
//           </label>
//           <input
//             name="name"
//             type="text"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full rounded-sm px-2 py-1 shadow-md shadow-red-100 border border-red-100 focus:outline-none focus:border-red-400"
//           />
//         </div>

//         {/* Категорія */}
//         <div className="relative p-2 border border-gray-300 rounded-sm">
//           <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
//             Kategoria usługi
//           </label>
//           <Select
//             value={formData.categoryId}
//             onValueChange={handleCategoryChange}
//           >
//             <SelectTrigger className="w-full mt-1">
//               <SelectValue placeholder="Wybierz kategorię" />
//             </SelectTrigger>
//             <SelectContent>
//               {categories.map((cat) => (
//                 <SelectItem key={cat.id} value={cat.id}>
//                   {cat.categoryName}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Ціна */}
//         <div className="relative p-2 border border-gray-300 rounded-sm">
//           <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
//             Cena usługi:
//           </label>
//           <input
//             type="number"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             required
//             className="w-full rounded-sm px-2 py-1 shadow-md shadow-red-100 border border-red-100 focus:outline-none focus:border-red-400"
//           />
//         </div>

//         {/* Тривалість */}
//         <div className="relative p-2 border border-gray-300 rounded-sm">
//           <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
//             Czas na wykonanie:
//           </label>
//           <input
//             type="number"
//             name="duration"
//             value={formData.duration}
//             onChange={handleChange}
//             required
//             className="w-full rounded-sm px-2 py-1 shadow-md shadow-red-100 border border-red-100 focus:outline-none focus:border-red-400"
//           />
//         </div>

//         {/* Опис */}
//         <div className="relative p-2 border border-gray-300 rounded-sm">
//           <label className="absolute -top-3 left-2 px-1 bg-white text-sm font-medium text-gray-600">
//             Opis usługi:
//           </label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows={4}
//             required
//             className="w-full rounded-sm px-2 py-1 shadow-md border border-red-100 focus:outline-none focus:border-red-400"
//           />
//         </div>

//         {/* Чекбокс активності */}
//         <label>
//           Aktywna:
//           <input
//             name="active"
//             type="checkbox"
//             checked={formData.active}
//             onChange={handleChange}
//             className="ml-2"
//           />
//         </label>

//         {/* Кнопка */}
//         <Button className="bg-red-300" type="submit">
//           Zapisz zmiany
//         </Button>
//       </form>
//     </Modal>
//   );
// };
