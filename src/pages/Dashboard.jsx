import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Plus, ScanLine, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatsCards from "../components/clients/StatsCards";
import ClientCard from "../components/clients/ClientCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await base44.entities.Client.list("-created_date", 100);
      setClients(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Group by industry for breakdown
  const industryGroups = {};
  clients.forEach((c) => {
    const key = c.industry || "Uncategorized";
    if (!industryGroups[key]) industryGroups[key] = [];
    industryGroups[key].push(c);
  });

  const topIndustries = Object.entries(industryGroups)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6);

  const recentClients = clients.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Your client database at a glance</p>
        </div>
        <div className="flex gap-2">
          <Link to="/scan">
            <Button variant="outline" size="sm">
              <ScanLine className="h-4 w-4 mr-2" /> Scan Card
            </Button>
          </Link>
          <Link to="/clients/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Client
            </Button>
          </Link>
        </div>
      </div>

      <StatsCards clients={clients} />

      {/* Industry Breakdown */}
      {topIndustries.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">By Industry</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topIndustries.map(([industry, items], i) => (
              <motion.div
                key={industry}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border border-border p-4 hover:border-primary/20 transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{industry}</p>
                <p className="text-2xl font-bold text-primary mt-1">{items.length}</p>
                <p className="text-xs text-muted-foreground">clients</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Clients */}
      {recentClients.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Recent Clients</h2>
            <Link to="/clients" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentClients.map((client, i) => (
              <ClientCard key={client.id} client={client} index={i} />
            ))}
          </div>
        </div>
      )}

      {clients.length === 0 && (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No clients yet</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-4">Start by adding your first client or scanning a business card</p>
          <div className="flex gap-2 justify-center">
            <Link to="/scan"><Button variant="outline">Scan Card</Button></Link>
            <Link to="/clients/new"><Button>Add Client</Button></Link>
          </div>
        </div>
      )}
    </div>
  );
}