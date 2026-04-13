import { Link } from "react-router-dom";
import { Building2, MapPin, Mail, Phone, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function ClientCard({ client, index }) {
  const initials = (client.full_name || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link
        to={`/clients/${client.id}`}
        className="block bg-card rounded-xl border border-border p-4 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group"
      >
        <div className="flex items-start gap-3">
          <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate text-sm">
              {client.full_name}
            </h3>
            {client.designation && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {client.designation}
              </p>
            )}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {client.company && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{client.company}</span>
                </span>
              )}
              {client.city && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{client.city}</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {client.industry && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                  {client.industry}
                </span>
              )}
              {client.profession && (
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent text-accent-foreground">
                  {client.profession}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}