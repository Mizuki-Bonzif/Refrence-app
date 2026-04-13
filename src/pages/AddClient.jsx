import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientForm from "../components/clients/ClientForm";
import { toast } from "sonner";

export default function AddClient() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // Check if there's pre-filled data from card scan
  const urlParams = new URLSearchParams(window.location.search);
  const prefillData = urlParams.get("data") ? JSON.parse(decodeURIComponent(urlParams.get("data"))) : null;

  const handleSubmit = async (data) => {
    setSaving(true);
    const created = await base44.entities.Client.create(data);
    toast.success("Client added successfully");
    navigate(`/clients/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Add New Client</h1>
          <p className="text-sm text-muted-foreground">Fill in the client details below</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <ClientForm defaultValues={prefillData} onSubmit={handleSubmit} isLoading={saving} />
      </div>
    </div>
  );
}