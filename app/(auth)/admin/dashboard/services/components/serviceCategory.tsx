"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { serviceCategorySchema } from "@/lib/zod";
import useServiceStore from "@/lib/serviceStore";
import toast from "react-hot-toast";
import { ShowCategories } from "./showCategories";

type ServiceCategoryFormValues = z.infer<typeof serviceCategorySchema>;

const ServiceCategoryForm = () => {
  const form = useForm<ServiceCategoryFormValues>({
    resolver: zodResolver(serviceCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  // const { addServiceCategory } = useServiceStore();

  // const onSubmit = async (data: ServiceCategoryFormValues) => {
  //   try {
  //     const response = await fetch("/api/categories", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error("Error response:", errorText);

  //       if (response.status === 409) {
  //         toast.error("Taka kategoria już istnieje!", {
  //           duration: 3000,
  //           position: "top-center",
  //           icon: "⚠️",
  //           style: {
  //             border: "1px solid #713200",
  //             padding: "16px",
  //             color: "#713200",
  //             backgroundColor: "#f8d7da",
  //           },
  //         });
  //         return;
  //       }

  //       throw new Error(
  //         `Nie udało się dodać kategorii: ${response.statusText}`
  //       );
  //     }
  //     const newCategory = await response.json();
  //     addServiceCategory(newCategory);

  //     toast.success("Kategoria została dodana pomyślnie!", {
  //       duration: 3000,
  //       position: "top-center",
  //       icon: "✅",
  //     });
  //   } catch (error) {
  //     console.error("Error creating category:", error);
  //     toast.error("Nie udało się dodać kategorii!", {
  //       duration: 3000,
  //       position: "top-center",
  //       icon: "❌",
  //     });
  //   }

  //   form.reset();
  // };

  const { fetchServiceCategories } = useServiceStore(); // Тільки для оновлення списку

  const onSubmit = async (data: ServiceCategoryFormValues) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);

        if (response.status === 409) {
          toast.error("Taka kategoria już istnieje!", {
            duration: 3000,
            position: "top-center",
            icon: "⚠️",
            style: {
              border: "1px solid #713200",
              padding: "16px",
              color: "#713200",
              backgroundColor: "#f8d7da",
            },
          });
          return;
        }

        throw new Error(
          `Nie udało się dodać kategorii: ${response.statusText}`
        );
      }

      // Оновлюємо список категорій після успішного створення
      await fetchServiceCategories();

      toast.success("Kategoria została dodana pomyślnie!", {
        duration: 3000,
        position: "top-center",
        icon: "✅",
      });

      form.reset();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Nie udało się dodać kategorii!", {
        duration: 3000,
        position: "top-center",
        icon: "❌",
      });
    }
  };
  return (
    <div className=" flex flex-col items-center sm:items-start justify-center rounded-md my-3 w-full bg-slate-100 sm:py-4 sm:px-3 text-zinc-600">
      <h2 className=" text-base sm:text-xl m-2 font-semibold">
        Dodaj nową kategorie dla usług
      </h2>
      <p className="text-center text-sm text-muted-foreground mx-1 sm:my-5">
        Wypełnij poniższe dane i kliknij <b>Dodaj Kategorie!</b>, aby utworzyć
        nową usługę.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row sm:justify-start sm:items-start items-center justify-center sm:gap-3 gap-4 relative w-full"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full bg-white sm:w-1/2">
                <FormControl>
                  <Input
                    type="text"
                    id={field.name}
                    placeholder="Wprowadź nazwę kategorii"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Dodaj kategorię!</Button>
        </form>
      </Form>
      <ShowCategories />
    </div>
  );
};

export default ServiceCategoryForm;
