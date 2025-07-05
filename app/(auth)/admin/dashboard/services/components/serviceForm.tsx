"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import useServiceStore from "@/lib/serviceStore";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { serviceFormSchema } from "@/lib/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/image-upload";

type ServiceFormValues = z.infer<typeof serviceFormSchema>;
// type ServiceFormValues = z.infer<typeof serviceFormSchema> & {};

const ServiceForm = () => {
  const { fetchServiceCategories, serviceCategories, isLoading, addService } =
    useServiceStore();

  useEffect(() => {
    fetchServiceCategories();
  }, [fetchServiceCategories]);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      duration: 0,
      active: true,
      categoryId: "",
      images: [],
    },
  });

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      await addService(data);
      form.reset();

      toast.success("Dodano nową usługę! 🎉", {
        duration: 3000,
        position: "top-center",
        icon: "👏",
      });
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Wystąpił błąd podczas dodawania usługi.", {
        position: "top-center",
        duration: 3000,
        icon: "❌",
      });
    }
  };

  return (
    <div className="flex flex-col items-center sm:items-start justify-center my-3 rounded-md w-full bg-slate-100 sm:py-4 sm:px-3 text-zinc-600">
      <h2 className="text-base sm:text-xl m-2 font-semibold">Dodaj usługe</h2>
      <p className="text-center text-sm text-muted-foreground m-2">
        Wypełnij poniższe dane i kliknij <b>Dodaj Usługe!</b>, aby utworzyć nową
        usługę.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full border rounded-md p-4 flex flex-col gap-3 relative"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={isLoading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    // onChange={(url) =>
                    //   field.onChange((field.value = [...field.value, { url }]))
                    // }
                    onRemove={(url) =>
                      field.onChange(
                        field.value.filter((img) => img.url !== url)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col bg-gray-100 sm:flex-row gap-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full bg-white md:w-1/2">
                  {/* <FormLabel>Nazwa usługi</FormLabel> */}
                  <FormControl>
                    <Input placeholder="Nazwa usługi:" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full bg-white md:w-1/4">
                  {/* <FormLabel>Cena (zł)</FormLabel> */}
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="podaj cenę"
                      {...field}
                      value={field.value || ""} // показувати пустий string замість 0
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="duration"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full bg-white md:w-1/4">
                  {/* <FormLabel>Czas (min)</FormLabel> */}
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="czas realizacji"
                      {...field}
                      value={field.value || ""} // показувати пустий string замість 0
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <FormField
              name="active"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-4 h-4"
                    />
                  </FormControl>
                  <FormLabel className="!m-0">Aktywna</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="w-full  md:w-1/2">
                  {/* <FormLabel>Kategoria</FormLabel> */}
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opis usługi</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Opis usługi..."
                    rows={4}
                    className="w-full rounded-sm px-2 py-1 resize-none shadow-md focus:outline-none focus:border-black-400 border border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full sm:w-44 ml-auto"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Dodawanie..." : "Dodaj Usługe!"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ServiceForm;
