import { useState, useEffect, useMemo } from "react";
import BulkUploadModal from "../components/clients/BulkUploadModal";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Plus, ScanLine, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterBar from "../components/clients/FilterBar";
import ClientCard from "../components/clients/ClientCard";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    industry: "",
    profession: "",
    city: "",
    country: "",
  });
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await base44.entities.Client.list("-created_date", 500);
      setClients(data);
      setLoading(false);
    };
    load();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        (c.full_name || "").toLowerCase().includes(searchLower) ||
        (c.company || "").toLowerCase().includes(searchLower) ||
        (c.email || "").toLowerCase().includes(searchLower) ||
        (c.phone || "").includes(searchLower);
      const matchesIndustry = !filters.industry || c.industry === filters.industry;
      const matchesProfession = !filters.profession || c.profession === filters.profession;
      const matchesCity = !filters.city || c.city === filters.city;
      const matchesCountry = !filters.country || c.country === filters.country;
      return matchesSearch && matchesIndustry && matchesProfession && matchesCity && matchesCountry;
    });
  }, [clients, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">{clients.length} contacts in your database</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowBulkUpload(true)}>
            <Upload className="h-4 w-4 mr-2" /> Bulk Import
          </Button>
          <Link to="/scan">
            <Button variant="outline" size="sm">
              <ScanLine className="h-4 w-4 mr-2" /> Scan
            </Button>
          </Link>
          <Link to="/clients/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Client
            </Button>
          </Link>
        </div>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} clients={clients} />

      <BulkUploadModal
        open={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onImported={async () => {
          const data = await base44.entities.Client.list("-created_date", 500);
          setClients(data);
        }}
      />

      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredClients.map((client, i) => (
            <ClientCard key={client.id} client={client} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">No clients match your filters</p>
        </div>
      )}
    </div>
  );
}