"use client";
import React, { useState } from "react";
import useServiceStore, { ServiceCategory } from "@/lib/serviceStore";
import { Button } from "@/components/ui/button";
import { LucideEdit3, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import toast from "react-hot-toast";
import { AlertModal } from "@/components/modals/alertModal";
import { ServiceCategoryChangeModal } from "@/components/modals/serviceCategoryModal";

interface CellActionProps {
  className?: string;
  data: ServiceCategory;
}

const CellActionCategory: React.FC<CellActionProps> = ({ className, data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const deleteServiceCategory = useServiceStore(
    (state) => state.deleteServiceCategory
  );

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteServiceCategory(data.id);
      toast.success("Kategoria usunięta.");
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error deleting service:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className={cn("text-gray-400", className)}>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={loading}
      />
      <ServiceCategoryChangeModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        categoryData={data}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Opcje</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <LucideEdit3 className="mr-2 h-4 w-4" />
            Edycja kategorii...
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Usunięcie kategorii...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellActionCategory;
