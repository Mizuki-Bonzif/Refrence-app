import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const INDUSTRIES = [
  "Pharma",
  "Agrochemical",
  "Speciality Chemicals",
  "Cosmetics",
  "Consultant - Pharma",
  "Consultant - Agro/Chemical",
  "Academic",
  "Others"
];

const PROFESSIONS = [
  "CEO / Founder", "Director", "Manager", "Engineer", "Developer",
  "Designer", "Consultant", "Analyst", "Sales", "Marketing",
  "HR", "Accountant", "Lawyer", "Doctor", "Architect", "Freelancer", "Other"
];

export default function FilterBar({ filters, onFilterChange, clients }) {
  const [showFilters, setShowFilters] = useState(false);

  const uniqueCities = [...new Set(clients.map(c => c.city).filter(Boolean))].sort();
  const uniqueCountries = [...new Set(clients.map(c => c.country).filter(Boolean))].sort();

  const activeFilterCount = [filters.industry, filters.profession, filters.city, filters.country].filter(Boolean).length;

  const clearFilters = () => {
    onFilterChange({ search: filters.search, industry: "", profession: "", city: "", country: "" });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-card"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className="relative shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Filters</p>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                <X className="h-3 w-3 mr-1" /> Clear all
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Select value={filters.industry || "all"} onValueChange={(v) => onFilterChange({ ...filters, industry: v === "all" ? "" : v })}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="Industry" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.profession || "all"} onValueChange={(v) => onFilterChange({ ...filters, profession: v === "all" ? "" : v })}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="Profession" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Professions</SelectItem>
                {PROFESSIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.city || "all"} onValueChange={(v) => onFilterChange({ ...filters, city: v === "all" ? "" : v })}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="City" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.country || "all"} onValueChange={(v) => onFilterChange({ ...filters, country: v === "all" ? "" : v })}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="Country" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {uniqueCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}