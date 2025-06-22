import { boolean, object, string, z } from "zod";

const getPasswordSchema = (type: "password" | "confirmPassword") =>
  string({ required_error: `${type} is required` })
    .min(8, `${type} must be at least 8 characters`)
    .max(32, `${type} can not exceed 32 characters`);

const getEmailSchema = () =>
  string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email");

const getNameSchema = () =>
  string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters");

export const signUpSchema = object({
  name: getNameSchema(),
  email: getEmailSchema(),
  password: getPasswordSchema("password"),
  confirmPassword: getPasswordSchema("confirmPassword"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema("password"),
});

export const forgotPasswordSchema = object({
  email: getEmailSchema(),
});

export const resetPasswordSchema = object({
  password: getPasswordSchema("password"),
  confirmPassword: getPasswordSchema("confirmPassword"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const serviceFormSchema = object({
  name: string().min(1, "Nazwa jest wymagana"),
  description: string().min(1, "Opis jest wymagany"),
  price: string()
    .min(1, "Cena jest wymagana")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, "Cena musi być większa niż 0"),
  duration: string()
    .min(1, "Czas jest wymagany")
    .transform((val) => parseInt(val))
    .refine(
      (val) => !isNaN(val) && val >= 5,
      "Czas realizacji musi być co najmniej 5 minut"
    ),
  // images: object({ url: string() }).array(),
  images: z
    .array(
      z.object({
        url: z.string().url("Невірний URL зображення"),
      })
    )
    .default([]),
  active: boolean().default(true),
  categoryId: string().min(1, "Kategoria jest wymagana"), // 🔥 Додано
});

export const serviceCategorySchema = object({
  name: string().min(1, "Name is required"),
});
