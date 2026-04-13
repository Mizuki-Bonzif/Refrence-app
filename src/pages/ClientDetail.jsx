import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Mail, Phone, Globe, MapPin, Building2, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ClientForm from "../components/clients/ClientForm";
import { toast } from "sonner";

export default function ClientDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = window.location.pathname.split("/clients/")[1];
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!clientId || clientId === "new") return;
    const load = async () => {
      const data = await base44.entities.Client.filter({ id: clientId });
      if (data.length > 0) setClient(data[0]);
      setLoading(false);
    };
    load();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Client not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/clients")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Clients
        </Button>
      </div>
    );
  }

  const handleUpdate = async (data) => {
    setSaving(true);
    await base44.entities.Client.update(client.id, data);
    setClient({ ...client, ...data });
    setEditing(false);
    setSaving(false);
    toast.success("Client updated");
  };

  const handleDelete = async () => {
    await base44.entities.Client.delete(client.id);
    toast.success("Client deleted");
    navigate("/clients");
  };

  const initials = (client.full_name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setEditing(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Edit Client</h1>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <ClientForm defaultValues={client} onSubmit={handleUpdate} isLoading={saving} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4 mr-2" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete client?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently remove {client.full_name} from your database.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">{client.full_name}</h1>
              {client.designation && <p className="text-sm text-muted-foreground">{client.designation}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {client.industry && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/15 text-primary">{client.industry}</span>
                )}
                {client.profession && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">{client.profession}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.email && (
              <InfoRow icon={Mail} label="Email" value={client.email} href={`mailto:${client.email}`} />
            )}
            {client.phone && (
              <InfoRow icon={Phone} label="Phone" value={client.phone} href={`tel:${client.phone}`} />
            )}
            {client.company && (
              <InfoRow icon={Building2} label="Company" value={client.company} />
            )}
            {client.website && (
              <InfoRow icon={Globe} label="Website" value={client.website} href={client.website.startsWith("http") ? client.website : `https://${client.website}`} />
            )}
            {(client.city || client.state || client.country) && (
              <InfoRow icon={MapPin} label="Location" value={[client.city, client.state, client.country].filter(Boolean).join(", ")} />
            )}
            {client.address && (
              <InfoRow icon={MapPin} label="Address" value={client.address} />
            )}
          </div>

          {client.notes && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notes</p>
              <p className="text-sm text-foreground bg-muted/50 rounded-lg p-4">{client.notes}</p>
            </div>
          )}

          {client.card_image && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Business Card</p>
              <img src={client.card_image} alt="Business card" className="rounded-lg border border-border max-w-sm" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">{content}</a>;
  }
  return content;
}