import * as z from 'zod'
export const User = z.object({
  name: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Password must contain at least one letter and one number"),
})
export const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);
export const passwordValidationSchema = z.string().regex(passwordValidation, "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");

export const vendorRegisterSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  store_owner_first_name: z.string().min(2, "Owner first name is required"),
  store_owner_last_name: z.string().min(2, "Owner last name is required"),
  country_code: z.string().min(1, "Country code is required"),
  phone_number: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9\-]+$/, "Please use format 123-456-7890"),
  category: z.string().min(1, "Category is required"),
  company_structure: z.string().min(1, "Company structure is required"),
  company_domain: z
    .string()
    .min(3, "Domain is too short")
    .regex(/^[a-z0-9-]+$/, "Domain can only contain lowercase letters, numbers, and hyphens"),
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});
export type VendorRegisterSchemaType = z.infer<typeof vendorRegisterSchema>;

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include an uppercase letter")
    .regex(/[a-z]/, "Must include a lowercase letter")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[^A-Za-z0-9]/, "Must include a special character"),
});

export type LoginFormData = z.infer<typeof loginSchema>;


export const customerRegisterSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50),
  email: z.email({ message: "Invalid email address" }).min(1, { message: "Email is required" }),
  phone_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Invalid phone number format (e.g., +1234567890)"
    })
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter" })
    .regex(/[0-9]/, { message: "Must include a number" })
    .regex(/[^A-Za-z0-9]/, { message: "Must include a special character" }),
  confirm_password: z.string().min(1, { message: "Please confirm your password" }),

  terms_accepted: z.literal(true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export type CustomerRegisterSchemaType = z.infer<typeof customerRegisterSchema>;