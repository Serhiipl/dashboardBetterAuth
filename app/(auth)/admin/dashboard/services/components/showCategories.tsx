"use client";

import useServiceStore from "@/lib/serviceStore";
import React, { useEffect, useState } from "react";
import CellActionCategory from "./cellActionCategories";

export const ShowCategories: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false); // added last

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
    <div className=" bg-slate-100 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        Dostępne kategorie: {serviceCategories.length}
      </h2>
      {serviceCategories.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {serviceCategories.map((category) => (
            <li
              key={category.id}
              className="p-3 bg-white rounded-lg w-full sm:max-w-xs shadow-md relative"
            >
              <CellActionCategory
                className="absolute right-1 top-0"
                data={category}
              />
              <h3 className="sm:text-base text-sm text-gray-900 pr-5 pl-2 truncate">
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
