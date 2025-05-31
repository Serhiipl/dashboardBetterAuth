"use client";
import React from "react";
import ServiceForm from "./serviceForm";

import ServiceCategoryForm from "./serviceCategory";

const AddService: React.FC = () => {
  return (
    <div className="w-full bg-white py-3 px-5 text-zinc-600 rounded-lg shadow-sm">
      <ServiceCategoryForm />
      <ServiceForm />
    </div>
  );
};

export default AddService;
