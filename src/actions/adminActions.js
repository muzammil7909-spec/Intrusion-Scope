"use server";

import dbConnect from "@/lib/mongodb/db";
import Admin from "@/models/Admin";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

// Helper to check authentication
async function checkAuth() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function getAdmins() {
  try {
    await dbConnect();
    const admins = await Admin.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(admins));
  } catch (error) {
    console.error("Get Admins Error:", error);
    return [];
  }
}

export async function getAdmin(id) {
  try {
    await dbConnect();
    const admin = await Admin.findById(id).lean();
    return JSON.parse(JSON.stringify(admin));
  } catch (error) {
    console.error("Get Admin Error:", error);
    return null;
  }
}

export async function createAdmin(formData) {
  try {
    await checkAuth();
    await dbConnect();
    
    const adminData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const admin = await Admin.create(adminData);
    revalidatePath("/dashboard/users");
    return { success: true, id: admin._id.toString() };
  } catch (error) {
    console.error("Create Admin Error:", error);
    return { error: error.message };
  }
}

export async function updateAdmin(id, formData) {
  try {
    await checkAuth();
    await dbConnect();

    const email = formData.get("email");
    const password = formData.get("password");

    const updateData = { email };
    
    // Only update password if provided
    if (password && password.trim() !== "") {
      // The Admin model's pre-save hook will hash this
      updateData.password = password;
    }

    // Find and update. We use 'save' indirectly or explicitly if we want the pre-save hook.
    // findByIdAndUpdate doesn't trigger 'save' hooks by default.
    const admin = await Admin.findById(id);
    if (!admin) throw new Error("Admin not found");

    admin.email = email;
    if (updateData.password) {
      admin.password = updateData.password;
    }

    await admin.save();
    
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Update Admin Error:", error);
    return { error: error.message };
  }
}

export async function deleteAdmin(id) {
  try {
    const session = await checkAuth();
    
    // Prevent deleting itself if possible or check if it's the last admin
    // For now, simple delete
    await dbConnect();
    
    // Prevent deleting the main env admin if it's in the DB
    const adminToDelete = await Admin.findById(id);
    if (adminToDelete && adminToDelete.email === process.env.ADMIN_EMAIL) {
        throw new Error("Cannot delete the primary system admin account.");
    }

    await Admin.findByIdAndDelete(id);
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Delete Admin Error:", error);
    return { error: error.message };
  }
}
