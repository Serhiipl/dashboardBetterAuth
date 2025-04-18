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
  FormLabel,
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
    form.reset(); // Очищаємо форму після сабміту
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa kategorii</FormLabel>
              <FormControl>
                <Input placeholder="Wprowadź nazwę kategorii" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Dodaj kategorię</Button>
      </form>
    </Form>
  );
};

export default ServiceCategoryForm;
