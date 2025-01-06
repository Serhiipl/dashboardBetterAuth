import { object, string } from "zod";

const getPasswordSchema = (type: "password" | "confirmPassword") => {
  return string({ required_error: `${type}is required` })
    .min(1, `${type} is required`)
    .min(8, `${type}must be at least 8 characters long`)
    .max(32, `${type} can not be longer than 32 characters`);
};

const getEmailSchema = () => {
  return string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email");
};

const getNameSchema = () => {
  return string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(32, "Name can not be longer than 32 characters");
};

export const singUpSchema = object({
  name: getNameSchema(),
  email: getEmailSchema(),
  password: getPasswordSchema("password"),
  confirmPassword: getPasswordSchema("confirmPassword"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password do not match",
  path: ["confirmPassword"],
});
