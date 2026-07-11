import { z } from "zod";

export const profileSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(50, "Full name cannot exceed 50 characters."),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username cannot exceed 20 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username may only contain letters, numbers and underscores."
    ),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address."),

  bio: z
    .string()
    .trim()
    .max(200, "Bio cannot exceed 200 characters.")
    .optional()
    .or(z.literal("")),

  image: z
    .string("Image is Required!")
    .trim()
    .url("Invalid image URL.")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const profileDefaultValues: ProfileFormValues = {
  fullname: "",
  username: "",
  email: "",
  bio: "",
  image: "",
};