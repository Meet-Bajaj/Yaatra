import { z } from "zod";

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?\d{10,13}$/, "Phone number must be valid (e.g. 9876543210 or +919876543210)"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?\d{10,13}$/, "Phone number must be valid (e.g. 9876543210 or +919876543210)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?\d{10,13}$/, "Phone number must be valid (e.g. 9876543210 or +919876543210)"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  role: z.enum(["RIDER", "DRIVER", "BOTH"]),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  city: z.string().min(2, "City is required"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const roleSchema = z.object({
  role: z.enum(["RIDER", "CARPOOL", "PROFESSIONAL", "BOTH"]),
});

export const vehicleSchema = z.object({
  make: z.string().min(1, "Vehicle make is required"),
  model: z.string().min(1, "Vehicle model is required"),
  color: z.string().min(1, "Color is required"),
  licensePlate: z.string().min(3, "License plate is required"),
  capacity: z.number().min(2).max(6),
  isCommercial: z.boolean().optional(),
});

export const offerSeatSchema = z.object({
  homeAddress: z.string().min(1, "Home address is required"),
  workAddress: z.string().min(1, "Work address is required"),
  homeLat: z.number(),
  homeLng: z.number(),
  workLat: z.number(),
  workLng: z.number(),
  departureTime: z.string().min(1, "Departure time is required"),
  returnTime: z.string().optional(),
  days: z.array(z.string()).min(1, "Select at least one day"),
  seats: z.number().min(1).max(3),
  pricePerSeat: z.number().min(1, "Price per seat is required"),
  womenOnly: z.boolean().optional(),
  vehicleId: z.string().min(1, "Select a vehicle"),
});

export const savedPlaceSchema = z.object({
  label: z.string().min(1, "Label is required"),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  lat: z.number(),
  lng: z.number(),
});

export const reportSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  rideInstanceId: z.string().optional(),
});

export const ratingSchema = z.object({
  score: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const emergencyContactSchema = z.object({
  contacts: z.array(
    z.object({
      phone: z.string().min(10),
      label: z.string().min(1),
    })
  ),
});

export const disputeSchema = z.object({
  resolution: z.enum(["REFUND_RIDER", "PAY_DRIVER", "SPLIT", "DISMISS"]),
  notes: z.string().optional(),
  refundAmount: z.number().optional(),
});
