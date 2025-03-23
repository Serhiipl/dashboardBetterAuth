"use client";

import { authClient } from "@/auth-client";
import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { resetPasswordSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function ResetPasswordContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsPending(true);

    try {
      const token = searchParams.get("token"); // Отримуємо токен із URL

      if (!data.password || !data.confirmPassword) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsPending(false);
        return;
      }

      if (!token) {
        toast({
          title: "Error",
          description: "Invalid or missing reset token.",
          variant: "destructive",
        });
        setIsPending(false);
        return;
      }

      const response = await authClient.resetPassword({
        newPassword: data.password,
        token, // Додаємо токен у запит
      });

      if (response?.error) {
        toast({
          title: "Error",
          description: response.error.message || "An unknown error occurred.",
          variant: "destructive",
        });

        form.setFocus("password");
      } else {
        toast({
          title: "Success",
          description: "Password reset successfully",
        });
        router.push("/sign-in");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  if (error === "invalid_token") {
    return (
      <div className="flex items-center justify-center p-4 grow">
        <Card className="w-full max-w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-800">
              Invalid Reset Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              The reset link is invalid or has expired. Please request a new
              one.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <LoadingButton pending={isPending}>Reset Password</LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
