import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(50, {
    message: "Name must be less than 50 characters"
  }).optional(),
  bio: z.string().max(500, {
    message: "Bio must be less than 500 characters."
  }).optional(),
  image: z.string().url({
    message: "Image must be a valid URL."
  }).optional(),
  gender: z.string().max(50, {
    message: "Gender must be less than 50 characters."
  }).optional(),
  location: z.string().max(100, {
    message: "Location must be less than 100 characters."
  }).optional(),
  birthday: z.string().optional(),
  occupation: z.string().max(100, {
    message: "Occupation must be less than 100 characters."
  }).optional(),
  tradingExperience: z.string().max(100, {
    message: "Trading experience must be less than 100 characters."
  }).optional(),
  avatar: z.string().url({
    message: "Avatar must be a valid URL."
  }).optional(),
});

export const registerSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).optional(),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }).optional(),
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }).optional(),
});
