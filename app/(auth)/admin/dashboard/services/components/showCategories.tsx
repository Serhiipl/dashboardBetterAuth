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
    <div className=" bg-slate-100 p-4 w-full rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        Dostępne kategorie: {serviceCategories.length}
      </h2>
      {serviceCategories.length > 0 ? (
        <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
          {/* <ul className="w-full flex flex-row justify-around flex-wrap gap-4"> */}
          {serviceCategories.map((category) => (
            <li
              key={category.id}
              className="py-2 px-4 bg-cyan-50 rounded-full min-w-fit hover:bg-cyan-100 shadow-md relative transition-colors duration-200 ease-in-out"
            >
              <CellActionCategory
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
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
