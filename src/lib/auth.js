import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb/db";
import Admin from "@/models/Admin";
import { authConfig } from "./auth.config";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Check against environment variables for the main admin
        if (
          credentials.email === process.env.ADMIN_EMAIL && 
          process.env.ADMIN_PASSWORD &&
          (credentials.password === process.env.ADMIN_PASSWORD || await bcrypt.compare(credentials.password, process.env.ADMIN_PASSWORD))
        ) {
          return { id: "admin", name: "Administrator", email: process.env.ADMIN_EMAIL };
        }

        await dbConnect();
        const admin = await Admin.findOne({ email: credentials.email });
        if (!admin) return null;
        
        const isMatch = await admin.comparePassword(credentials.password);
        if (isMatch) {
          return { id: admin._id.toString(), name: "Admin", email: admin.email };
        }
        return null;
      },
    }),
  ],
});
