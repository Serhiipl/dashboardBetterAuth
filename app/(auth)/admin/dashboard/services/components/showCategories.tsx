"use client";

import useServiceStore from "@/lib/serviceStore";
import React, { useEffect, useState } from "react";
import CellActionCategory from "./cellActionCategories";
// import CellAction from "./cellAction";

export const ShowCategories: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false); // added last
  // const [key] = useState(0);

  const { serviceCategories, fetchServiceCategories } = useServiceStore();
  useEffect(() => {
    fetchServiceCategories();
    setIsMounted(true); //added last
  }, [fetchServiceCategories]);

  if (!isMounted) {
    //added last
    return null;
  }
  return (
    <div className="service-list bg-slate-100 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        Dostępne {serviceCategories.length} Kategorie
      </h2>
      {serviceCategories.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {serviceCategories.map((category) => (
            <li
              key={category.id}
              className="p-4 bg-white rounded-lg shadow-md relative"
            >
              <CellActionCategory
                className="absolute right-3"
                data={category}
              />
              <h3 className="sm:text-lg text-base text-gray-900 font-semibold">
                {category.name}
              </h3>
            </li>
          ))}
        </ul>
      ) : (
        <p>No categories available.</p>
      )}
    </div>
  );
};
