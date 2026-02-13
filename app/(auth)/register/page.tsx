"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, UserPlus, User, AlertCircle } from "lucide-react";

import { registerSchema, RegisterFields } from "@/validations/auth";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFields) => {
    setServerError(null);
    try {
      const response = await authService.register(data);
      if (response.status === "success" && response.data) {
        setUser(response.data.user);
        router.push("/admin");
      } else {
        setServerError(response.message || "Registration failed");
      }
    } catch (error: any) {
      setServerError(
        error.response?.data?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-transparent">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl mb-6">
          <UserPlus className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
          Create account
        </h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Start your blogging journey today
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-2xl shadow-blue-500/5">
          {serverError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              placeholder="John Doe"
              autoComplete="name"
              {...register("name")}
              error={errors.name?.message}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("password")}
              error={errors.password?.message}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full py-4 text-base"
                isLoading={isSubmitting}
                rightIcon={<UserPlus className="w-4 h-4" />}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="font-bold text-gray-900 dark:text-white hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="font-bold text-gray-900 dark:text-white hover:underline">Privacy Policy</Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-black text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
