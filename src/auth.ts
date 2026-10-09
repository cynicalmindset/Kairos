import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./lib/prisma";
import { bearer } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),

  baseURL: process.env.BETTER_AUTH_URL || "https://kairos-w84s.onrender.com",

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://kairos-w84s.onrender.com",
  ],

  advanced: {
    disableCSRFCheck: true,
  },

  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    bearer()
  ]
});