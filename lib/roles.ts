import { cookies } from "next/headers";

export const checkRole = async (requiredRole: "admin" | "user") => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return false;
    const payload = JSON.parse(Buffer.from(token.split(".")[1] || "", "base64").toString("utf8"));
    const role = (payload?.role || "USER").toString().toUpperCase();
    if (requiredRole === "admin") return role === "ADMIN";
    return true;
  } catch {
    return false;
  }
};
