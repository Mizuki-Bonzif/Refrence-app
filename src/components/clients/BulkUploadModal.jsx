import { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const SAMPLE_CSV = `full_name,email,phone,company,designation,industry,profession,city,state,country,website,notes
John Doe,john@example.com,+1 234 567 890,Acme Corp,CEO,Technology,CEO / Founder,New York,NY,USA,www.acme.com,Key client
Jane Smith,jane@example.com,+44 7911 123456,TechCo,Manager,Finance,Manager,London,,UK,,`;

function downloadSample() {
  const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "client_template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function BulkUploadModal({ open, onClose, onImported }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    // Upload file
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    // Extract data using AI
    const extracted = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url,
      json_schema: {
        type: "object",
        properties: {
          full_name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          company: { type: "string" },
          designation: { type: "string" },
          industry: { type: "string" },
          profession: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          country: { type: "string" },
          website: { type: "string" },
          address: { type: "string" },
          notes: { type: "string" },
        },
      },
    });

    if (extracted.status !== "success") {
      toast.error("Failed to parse file. Please check the format.");
      setLoading(false);
      return;
    }

    const contacts = Array.isArray(extracted.output) ? extracted.output : [];

    if (contacts.length === 0) {
      toast.error("No contacts found in the file.");
      setLoading(false);
      return;
    }

    // Clean empty values
    const cleaned = contacts
      .filter((c) => c.full_name)
      .map((c) => {
        const obj = {};
        Object.entries(c).forEach(([k, v]) => {
          if (v && v !== "" && v !== "N/A") obj[k] = String(v).trim();
        });
        return obj;
      });

    // Bulk create
    await base44.entities.Client.bulkCreate(cleaned);

    setResult({ total: contacts.length, saved: cleaned.length });
    setLoading(false);
    onImported();
    toast.success(`${cleaned.length} clients imported successfully!`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Import Clients</DialogTitle>
          <DialogDescription>Upload a CSV or Excel file to import multiple clients at once.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Sample Download */}
          <div className="bg-accent/50 rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Download Template</p>
              <p className="text-xs text-muted-foreground">Use this template to format your data correctly</p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadSample}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Template
            </Button>
          </div>

          {/* Upload Area */}
          {!result && (
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 hover:bg-accent/30 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              {file ? (
                <div>
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-foreground font-medium">Click to select file</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports .csv, .xls, .xlsx</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xls,.xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Import Complete!</p>
                <p className="text-xs text-green-700">{result.saved} clients imported successfully</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={handleClose}>
              {result ? "Close" : "Cancel"}
            </Button>
            {!result && (
              <Button onClick={handleUpload} disabled={!file || loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                {loading ? "Importing..." : "Import"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}