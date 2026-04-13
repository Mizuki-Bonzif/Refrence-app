import { Users, Building2, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCards({ clients }) {
  const uniqueIndustries = new Set(clients.map(c => c.industry).filter(Boolean)).size;
  const uniqueCities = new Set(clients.map(c => c.city).filter(Boolean)).size;
  const uniqueProfessions = new Set(clients.map(c => c.profession).filter(Boolean)).size;

  const stats = [
    { label: "Total Clients", value: clients.length, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Industries", value: uniqueIndustries, icon: Building2, color: "bg-emerald-50 text-emerald-600" },
    { label: "Professions", value: uniqueProfessions, icon: Briefcase, color: "bg-amber-50 text-amber-600" },
    { label: "Locations", value: uniqueCities, icon: MapPin, color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-xl border border-border p-4 md:p-5"
        >
          <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-3`}>
            <stat.icon className="h-4 w-4" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}