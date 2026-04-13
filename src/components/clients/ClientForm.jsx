import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";

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

export default function ClientForm({ defaultValues, onSubmit, isLoading }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: defaultValues || {},
  });

  const industry = watch("industry");
  const profession = watch("profession");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Personal Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" {...register("first_name")} placeholder="John" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" {...register("last_name")} placeholder="Doe" className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input id="full_name" {...register("full_name", { required: true })} placeholder="John Doe" className="mt-1" />
            {errors.full_name && <p className="text-xs text-destructive mt-1">Name is required</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="john@example.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} placeholder="+1 234 567 890" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" {...register("website")} placeholder="www.example.com" className="mt-1" />
          </div>
        </div>
      </div>

      {/* Professional Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Professional Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company</Label>
            <Input id="company" {...register("company")} placeholder="Acme Corp" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="designation">Designation</Label>
            <Input id="designation" {...register("designation")} placeholder="Senior Manager" className="mt-1" />
          </div>
          <div>
            <Label>Industry</Label>
            <Select value={industry || ""} onValueChange={(v) => setValue("industry", v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select industry" /></SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Profession</Label>
            <Select value={profession || ""} onValueChange={(v) => setValue("profession", v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select profession" /></SelectTrigger>
              <SelectContent>
                {PROFESSIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} placeholder="New York" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register("state")} placeholder="NY" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country")} placeholder="USA" className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register("address")} placeholder="123 Main St" className="mt-1" />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Notes</h3>
        <Textarea {...register("notes")} placeholder="Any additional notes..." rows={3} />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        {defaultValues?.id ? "Update Client" : "Save Client"}
      </Button>
    </form>
  );
}