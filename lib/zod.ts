import { boolean, coerce, object, string } from "zod";

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
  price: coerce.number().positive("Cena musi być większa niż 0"),
  duration: coerce
    .number()
    .int("Czas musi być liczbą całkowitą")
    .min(5, "Czas realizacji musi być co najmniej 5 minut"),
  active: boolean().default(true),
});

export const serviceCategorySchema = object({
  name: string().min(1, "Name is required"),
});
