import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { EmptyState } from "@/components/ds/States";

export function NotFound() {
  const navigate = useNavigate();
  return <EmptyState icon={Compass} title="This page doesn't exist" body="Let's get you back to something useful." action={{ label: "Go to Home", onClick: () => navigate("/home"), variant: "primary" }} />;
}
