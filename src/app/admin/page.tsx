import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  // Se o cara acessar apenas /admin, joga ele pro Dashboard
  redirect("/admin/dashboard");
}
