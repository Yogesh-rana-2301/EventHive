import { redirect } from "next/navigation";

export default function LandingPage() {
  // Redirect to the static landing page in public folder
  redirect("/landing_page/index.html");
}
