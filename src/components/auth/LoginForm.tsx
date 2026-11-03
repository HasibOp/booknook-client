"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineInformationCircle } from "react-icons/hi2";
import { signIn } from "@/lib/auth-client";
import { hardNavigate } from "@/lib/flash";
import { EMAIL_PATTERN } from "@/lib/validators";
import FormField from "./FormField";
import GoogleButton from "./GoogleButton";

type LoginValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  redirectTo: string;
  googleError?: string;
};

export default function LoginForm({ redirectTo, googleError }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(
    googleError ? "Google sign-in was cancelled or failed. Please try again." : "",
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ defaultValues: { email: "", password: "" } });

  useEffect(() => {
    if (googleError) toast.error("Google sign-in was cancelled or failed. Please try again.");
  }, [googleError]);

  const onSubmit = async (values: LoginValues) => {
    setFormError("");
    const { data, error } = await signIn.email({
      email: values.email.trim(),
      password: values.password,
    });

    if (error) {
      const message = error.message || "Login failed. Please try again.";
      setFormError(message);
      toast.error(message);
      return;
    }

    hardNavigate(redirectTo, { type: "success", message: `Welcome back, ${data?.user.name ?? "reader"}!` });
  };

  const handleForgotPassword = () => {
    toast("Password reset is not available yet. Please contact hello@booknook.app for help.", {
      icon: <HiOutlineInformationCircle className="size-5 shrink-0 text-info" />,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`input w-full ${errors.email ? "input-error" : ""}`}
            {...register("email", {
              required: "Please enter your email",
              pattern: { value: EMAIL_PATTERN, message: "Please enter a valid email address" },
            })}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <label className={`input w-full ${errors.password ? "input-error" : ""}`}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              className="grow"
              {...register("password", { required: "Please enter your password" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((show) => !show)}
              className="text-base-content/60 hover:text-base-content"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <HiOutlineEyeSlash className="size-5" /> : <HiOutlineEye className="size-5" />}
            </button>
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="self-end text-sm font-semibold text-primary hover:underline"
          >
            Forgot password?
          </button>
        </FormField>

        {formError && (
          <div role="alert" className="alert alert-error alert-soft text-sm">
            {formError}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-2 w-full rounded-full">
          {isSubmitting && <span className="loading loading-spinner loading-sm" />}
          Login
        </button>
      </form>

      <div className="divider my-0 text-sm text-base-content/50">or</div>

      <GoogleButton callbackURL={redirectTo} label="Continue with Google" />

      <p className="text-center text-sm text-base-content/70">
        New to BookNook?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
