"use client";

import useSWR from "swr";
import { AtSign, Camera, FileText, Loader2, Mail, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Heading from "@/components/elements/Heading";
import SubHeading from "@/components/elements/SubHeading";
import Paragraph from "@/components/elements/Paragraph";
import Button from "@/components/elements/Button";
import Icon from "@/components/elements/icon";
import ErrorLoading from "@/components/global/ErrorLoading";
import ProfileLoadingCard from "@/components/panel/skeletons/ProfilePageSkeleton"; // adjust path
import { fetcher } from "@/lib/fetcher";
import { profileDefaultValues, ProfileFormValues, profileSchema } from "@/validations/panel/ProfileValidations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fileToBase64 } from "@/lib/base64";
import { toast } from "sonner";
import Div from "@/components/elements/div";
type UserProfile = {
  success: boolean;
  data: ProfileFormValues;
}
export default function ProfileSettingsPage() {
  const {
    data,
    isLoading,
    error,
  } = useSWR<UserProfile>("/api/user/profile", fetcher);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema as any),
    defaultValues: profileDefaultValues,
  });
  const [pending, startTransition] = useTransition();
  const profile = data?.data ?? profileDefaultValues;
  useEffect(() => {
    if (!data?.data) return;

    form.reset({
      fullname: data.data.fullname,
      username: data.data.username,
      email: data.data.email,
      bio: data.data.bio,
      image: data.data.image,
    });
  }, [data, form]);

  const onSubmit = (values: ProfileFormValues) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/user/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to update profile.");
          return;
        }

        toast.success(data.message || "Profile updated successfully.");

      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.");
      }
    });
  };
  return (
    <div className="mx-auto max-w-4xl p-6 max-md:pb-20">
      <ErrorLoading
        loading={isLoading}
        error={error}
        loadingCard={ProfileLoadingCard}
      >
        <Div className="rounded-2xl shadow-md dark:border dark:bg-card p-6">
          <SubHeading className="mb-6">Personal Information</SubHeading>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-5"
            >
              <Div className="rounded-2xl shadow-md dark:border dark:bg-card p-6">
                <SubHeading className="mb-6">Profile Picture</SubHeading>

                <div className="flex flex-col items-center gap-5 sm:flex-row">
                  <Avatar className="h-28 w-28 border">
                    <AvatarImage
                      src={form.watch("image")}
                      alt={form.watch("username")}
                    />
                    <AvatarFallback className="bg-muted">
                      <User className="size-10 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid gap-3">
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];

                        if (!file) return;

                        if (file.size > 5 * 1024 * 1024) {
                          form.setError("image", {
                            message: "Image must be smaller than 5MB.",
                          });
                          return;
                        }

                        form.clearErrors("image");

                        const base64 = await fileToBase64(file);

                        form.setValue("image", base64, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />

                    <label htmlFor="profile-image">
                      <Button
                        type="button"
                        disabled={pending}
                        asChild
                      >
                        <span>
                          <Camera size={16} />
                          Change Photo
                        </span>
                      </Button>
                    </label>

                    <Paragraph className="text-sm">
                      JPG, PNG or WEBP. Maximum size 5MB.
                    </Paragraph>

                    {form.formState.errors.image && (
                      <Paragraph className="text-sm text-destructive">
                        {form.formState.errors.image.message}
                      </Paragraph>
                    )}
                  </div>
                </div>
              </Div>
              <FormField
                control={form.control}
                name="fullname"
                disabled={pending}
                render={({ field }) => (
                  <FormItem >
                    <FormLabel className="flex items-center gap-2">
                      <Icon icon={User} />
                      Full Name
                    </FormLabel>

                    <FormControl>
                      <Input
                      disabled={pending}
                        placeholder="Enter your full name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Icon icon={AtSign} />
                  Username
                </FormLabel>

                <FormControl>
                  <Input
                    value={profile.username}
                    disabled
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Icon icon={Mail} />
                  Email Address
                </FormLabel>

                <FormControl>
                  <Input
                    value={profile.email}
                    disabled
                  />
                </FormControl>
              </FormItem>

              <FormField
                control={form.control}
                name="bio"
                disabled={pending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Icon icon={FileText} />
                      Bio
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        rows={4}
                        className="resize-none"
                        placeholder="Tell people a little about yourself..."
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!form.formState.isDirty || form.formState.isSubmitting || pending}
                >
                 {pending && <Loader2 className="animate-spin"/>} Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </Div>
      </ErrorLoading>
    </div>
  );
}