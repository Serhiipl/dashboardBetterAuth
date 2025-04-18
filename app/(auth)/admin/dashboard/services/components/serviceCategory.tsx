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

type ServiceCategoryFormValues = z.infer<typeof serviceCategorySchema>;

interface ServiceCategoryFormProps {
  onSubmit: (data: ServiceCategoryFormValues) => void;
  defaultName?: string;
}

const ServiceCategoryForm: React.FC<ServiceCategoryFormProps> = ({
  onSubmit,
  defaultName = "",
}) => {
  const { addServiceCategory } = useServiceStore();

  const form = useForm<ServiceCategoryFormValues>({
    resolver: zodResolver(serviceCategorySchema),
    defaultValues: {
      name: defaultName,
    },
  });

  const handleSubmit = (data: ServiceCategoryFormValues) => {
    addServiceCategory({ id: crypto.randomUUID(), name: data.name }); // 👈 приклад генерації id
    onSubmit(data);
    form.reset(); // Очищаємо форму
  };

  return (
    <div className=" flex flex-col items-center sm:items-start justify-center  my-4 w-full bg-slate-100 sm:py-4 sm:px-3 text-zinc-600">
      <h2 className=" text-base sm:text-xl m-2 font-semibold">
        Dodaj kategorie usługi
      </h2>
      <p className="text-center text-sm text-muted-foreground m-2">
        Wypełnij poniższe dane i kliknij <b>Dodaj Kategorie!</b>, aby utworzyć
        nową usługę.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col sm:flex-row sm:justify-start sm:items-start items-center justify-center sm:gap-3 gap-4 relative w-full"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full sm:w-1/2">
                <FormControl>
                  <Input
                    type="text"
                    // value={field.value}
                    // onChange={field.onChange}
                    // onBlur={field.onBlur}
                    // name={field.name}
                    // id={field.name}
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
    </div>
  );
};

export default ServiceCategoryForm;
