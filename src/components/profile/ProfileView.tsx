"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import {
  HiOutlineArrowUpTray,
  HiOutlineBookOpen,
  HiOutlineCalendarDays,
  HiOutlineEnvelope,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import FormField from "@/components/auth/FormField";
import Avatar from "@/components/ui/Avatar";
import { clearApiToken } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { myBooksQuery, myBorrowsQuery } from "@/lib/queries";
import { uploadImage, validateImageFile } from "@/lib/upload";
import { isHttpUrl } from "@/lib/validators";

type ProfileUser = {
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
};

type ProfileValues = {
  name: string;
  photoURL: string;
  photoFile: FileList | null;
};

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

function StatCard({ href, label, value, icon: Icon }: { href: string; label: string; value?: number; icon: typeof HiOutlineBookOpen }) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-box border border-base-300 bg-base-100 p-4 transition hover:border-primary/40 hover:shadow-md"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block text-2xl font-semibold leading-tight">
          {value ?? <span className="loading loading-dots loading-sm" />}
        </span>
        <span className="whitespace-nowrap text-sm text-base-content/70">{label}</span>
      </span>
    </Link>
  );
}

export default function ProfileView({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const myBooks = useQuery(myBooksQuery);
  const myBorrows = useQuery(myBorrowsQuery);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    defaultValues: { name: user.name, photoURL: user.image ?? "", photoFile: null },
  });

  const name = useWatch({ control, name: "name" });
  const photoURL = useWatch({ control, name: "photoURL" });
  const photoFiles = useWatch({ control, name: "photoFile" });
  const pickedFile = photoFiles?.[0] ?? null;

  const previewUrl = useMemo(() => (pickedFile ? URL.createObjectURL(pickedFile) : null), [pickedFile]);
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const typedUrl = photoURL.trim();
  const shownImage = previewUrl ?? (isHttpUrl(typedUrl) ? typedUrl : user.image);

  const onSubmit = async (values: ProfileValues) => {
    setSaving(true);
    try {
      let image = values.photoURL.trim() || null;
      if (pickedFile) {
        try {
          image = await uploadImage(pickedFile);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Photo upload failed. Please try again.");
          return;
        }
      }

      const { error } = await authClient.updateUser({ name: values.name.trim(), image });
      if (error) {
        toast.error(error.message || "Could not update your profile. Please try again.");
        return;
      }

      clearApiToken();
      reset({ name: values.name.trim(), photoURL: image ?? "", photoFile: null });
      toast.success("Your profile has been updated.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
      <aside className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-col items-center gap-4 rounded-box border border-base-300 bg-base-100 p-6 text-center shadow-sm">
          <Avatar name={name || user.name} src={shownImage} size={112} className="ring-4 ring-primary/15" />
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-semibold">{name.trim() || user.name}</h2>
            <p className="flex items-center justify-center gap-1.5 truncate text-sm text-base-content/70">
              <HiOutlineEnvelope className="size-4 shrink-0" />
              {user.email}
            </p>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-base-content/60">
            <HiOutlineCalendarDays className="size-4" />
            Member since {dateFormat.format(new Date(user.createdAt))}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard href="/my-books" label="Books shared" value={myBooks.data?.length} icon={HiOutlineSquares2X2} />
          <StatCard href="/my-borrows" label="Borrowing now" value={myBorrows.data?.length} icon={HiOutlineBookOpen} />
        </div>
      </aside>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-5 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8"
      >
        <div>
          <h2 className="text-2xl font-semibold">Edit your profile</h2>
          <p className="text-sm text-base-content/70">Change how your name and photo appear across BookNook.</p>
        </div>

        <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={`input w-full ${errors.name ? "input-error" : ""}`}
            {...register("name", {
              validate: (value) => {
                const length = value.trim().length;
                if (length < 2) return "Please enter your name (at least 2 characters)";
                return length <= 60 || "Name must be at most 60 characters";
              },
            })}
          />
        </FormField>

        <FormField label="Email" htmlFor="email">
          <input id="email" type="email" value={user.email} readOnly className="input w-full bg-base-200" />
          <span className="text-xs text-base-content/60">Your email is used to log in, so it can&apos;t be changed.</span>
        </FormField>

        <FormField label="Photo URL" htmlFor="photoURL" error={errors.photoURL?.message}>
          <input
            id="photoURL"
            type="url"
            placeholder="https://example.com/your-photo.jpg"
            disabled={Boolean(pickedFile)}
            className={`input w-full ${errors.photoURL ? "input-error" : ""}`}
            {...register("photoURL", {
              validate: (value) => !value.trim() || isHttpUrl(value.trim()) || "Please enter a valid image link",
            })}
          />
        </FormField>

        <FormField label="Or upload a new photo" htmlFor="photoFile" error={errors.photoFile?.message}>
          <label className="flex items-center gap-3">
            <input
              id="photoFile"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="file-input w-full"
              {...register("photoFile", {
                validate: (files) => {
                  const file = files?.[0];
                  return !file || (validateImageFile(file) ?? true);
                },
              })}
            />
            <HiOutlineArrowUpTray className="size-5 shrink-0 text-primary" />
          </label>
          <span className="text-xs text-base-content/60">JPG, PNG, WEBP or GIF, up to 4 MB. It replaces the photo URL.</span>
        </FormField>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={saving || !isDirty} className="btn btn-primary rounded-full px-8">
            {saving && <span className="loading loading-spinner loading-sm" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => reset()}
            disabled={saving || !isDirty}
            className="btn btn-ghost rounded-full"
          >
            Discard changes
          </button>
        </div>
      </form>
    </div>
  );
}
