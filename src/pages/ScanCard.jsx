import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { ScanLine, Upload, Camera, Loader2, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ScanCard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setUploading(false);

    // Extract data
    setExtracting(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: "Extract all contact information from this business card image. Be thorough and accurate. Extract the full name, email, phone number, company name, designation/title, website, address, city, state, and country. If you can determine the industry and profession category, include those as well.",
      file_urls: [file_url],
      response_json_schema: {
        type: "object",
        properties: {
          full_name: { type: "string", description: "Full name of the person" },
          email: { type: "string", description: "Email address" },
          phone: { type: "string", description: "Phone number" },
          company: { type: "string", description: "Company name" },
          designation: { type: "string", description: "Job title or designation" },
          website: { type: "string", description: "Website URL" },
          address: { type: "string", description: "Street address" },
          city: { type: "string", description: "City" },
          state: { type: "string", description: "State or province" },
          country: { type: "string", description: "Country" },
          industry: {
            type: "string",
            enum: ["Pharma", "Agrochemical", "Speciality Chemicals", "Cosmetics", "Consultant - Pharma", "Consultant - Agro/Chemical", "Academic", "Others"]
          },
          profession: {
            type: "string",
            enum: ["CEO / Founder", "Director", "Manager", "Engineer", "Developer", "Designer", "Consultant", "Analyst", "Sales", "Marketing", "HR", "Accountant", "Lawyer", "Doctor", "Architect", "Freelancer", "Other"]
          },
        },
      },
    });

    // Clean up empty strings
    const cleaned = {};
    Object.entries(result).forEach(([key, value]) => {
      if (value && value !== "" && value !== "N/A" && value !== "n/a") {
        cleaned[key] = value;
      }
    });
    cleaned.card_image = file_url;

    setExtractedData(cleaned);
    setExtracting(false);
  };

  const handleSaveClient = async () => {
    const created = await base44.entities.Client.create(extractedData);
    toast.success("Client saved successfully!");
    navigate(`/clients/${created.id}`);
  };

  const handleEditAndSave = () => {
    const encoded = encodeURIComponent(JSON.stringify(extractedData));
    navigate(`/clients/new?data=${encoded}`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Scan Business Card</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload or capture a business card to extract contact details</p>
      </div>

      {/* Upload Area */}
      {!preview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border-2 border-dashed border-border hover:border-primary/30 transition-colors p-8 md:p-12 text-center"
        >
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <ScanLine className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Upload a Business Card</h3>
          <p className="text-sm text-muted-foreground mb-6">Take a photo or upload an image of a business card</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => cameraInputRef.current?.click()} variant="outline" className="gap-2">
              <Camera className="h-4 w-4" /> Take Photo
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
              <Upload className="h-4 w-4" /> Upload Image
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </motion.div>
      )}

      {/* Preview & Status */}
      <AnimatePresence mode="wait">
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <img src={preview} alt="Business card" className="w-full max-h-64 object-contain bg-muted/30 p-4" />
            </div>

            {(uploading || extracting) && (
              <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {uploading ? "Uploading image..." : "Extracting contact details..."}
                  </p>
                  <p className="text-xs text-muted-foreground">This may take a few seconds</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extracted Data */}
      <AnimatePresence>
        {extractedData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </div>
                <p className="text-sm font-semibold text-foreground">Data Extracted Successfully</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(extractedData).filter(([key]) => key !== "card_image").map(([key, value]) => (
                  <div key={key} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-sm text-foreground mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSaveClient} className="flex-1 gap-2">
                <Check className="h-4 w-4" /> Save Client
              </Button>
              <Button variant="outline" onClick={handleEditAndSave} className="flex-1 gap-2">
                <ArrowRight className="h-4 w-4" /> Edit & Save
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setPreview(null); setExtractedData(null); }}
              >
                Scan Another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}