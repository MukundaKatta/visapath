"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileCheck,
  Upload,
  File,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  Info,
} from "lucide-react";
import { VISA_TYPES, type VisaTypeKey } from "@/lib/constants";

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: string;
  uploaded: boolean;
  uploadedAt?: string;
  fileName?: string;
  expiresAt?: string;
  tips: string;
}

const DOCUMENT_CHECKLISTS: Record<string, DocumentItem[]> = {
  h1b: [
    { id: "1", name: "Valid Passport", description: "Must be valid for at least 6 months beyond intended stay", required: true, category: "Identity", uploaded: false, tips: "Scan the bio page clearly. If passport expires within 1 year, consider renewal." },
    { id: "2", name: "Passport Photos (2x2)", description: "Recent US-style passport photographs", required: true, category: "Identity", uploaded: false, tips: "White background, taken within last 6 months." },
    { id: "3", name: "Degree Certificates", description: "Bachelor's degree or higher in specialty field", required: true, category: "Education", uploaded: false, tips: "Include all degree certificates. Foreign degrees need credential evaluation." },
    { id: "4", name: "Transcripts", description: "Official academic transcripts from all institutions", required: true, category: "Education", uploaded: true, uploadedAt: "2024-12-15", fileName: "transcripts.pdf", tips: "Must be official sealed transcripts or certified copies." },
    { id: "5", name: "Credential Evaluation", description: "Foreign degree equivalency evaluation (if applicable)", required: false, category: "Education", uploaded: false, tips: "Use NACES-member evaluation services (WES, ECE, etc.)." },
    { id: "6", name: "Resume / CV", description: "Detailed professional resume", required: true, category: "Employment", uploaded: true, uploadedAt: "2024-12-10", fileName: "resume_2024.pdf", tips: "Include all relevant experience, publications, and achievements." },
    { id: "7", name: "Employment Offer Letter", description: "Detailed offer letter from US employer", required: true, category: "Employment", uploaded: false, tips: "Must include job title, duties, salary, and start date." },
    { id: "8", name: "LCA (Labor Condition Application)", description: "Certified LCA from DOL", required: true, category: "Employment", uploaded: false, tips: "Employer must file LCA before H-1B petition. Must show prevailing wage compliance." },
    { id: "9", name: "Previous Approval Notices", description: "I-797 approval notices for prior petitions", required: false, category: "Immigration History", uploaded: false, tips: "Include all prior I-797 notices, I-94 records." },
    { id: "10", name: "Previous I-94 Records", description: "Entry/exit records", required: false, category: "Immigration History", uploaded: false, tips: "Download from CBP I-94 website." },
    { id: "11", name: "Specialty Occupation Evidence", description: "Evidence that the job qualifies as a specialty occupation", required: true, category: "Supporting", uploaded: false, tips: "Job postings for similar roles, OOH data, expert letters." },
    { id: "12", name: "Employer Support Letter", description: "Letter describing company, the role, and why the beneficiary is needed", required: true, category: "Supporting", uploaded: false, tips: "Should detail the specialty nature of the position." },
  ],
  marriage_gc: [
    { id: "1", name: "Marriage Certificate", description: "Official marriage certificate", required: true, category: "Relationship", uploaded: false, tips: "Must be officially issued. Foreign certificates need certified translation." },
    { id: "2", name: "Bona Fide Marriage Evidence", description: "Joint bank statements, lease, photos, affidavits", required: true, category: "Relationship", uploaded: false, tips: "The more evidence the better: joint accounts, insurance, property, photos together." },
    { id: "3", name: "Spouse's Passport/ID", description: "US citizen or LPR spouse's identity documents", required: true, category: "Identity", uploaded: false, tips: "Include birth certificate or naturalization certificate." },
    { id: "4", name: "Passport Photos (2x2)", description: "US-style passport photos for both spouses", required: true, category: "Identity", uploaded: false, tips: "White background, recent." },
    { id: "5", name: "Form I-864 Evidence", description: "Tax returns, W-2s, pay stubs for Affidavit of Support", required: true, category: "Financial", uploaded: false, tips: "Last 3 years of tax returns. Income must meet 125% of poverty guidelines." },
    { id: "6", name: "Medical Exam (I-693)", description: "Medical examination by USCIS-designated civil surgeon", required: true, category: "Medical", uploaded: false, tips: "Must be from USCIS-designated civil surgeon. Valid for 2 years." },
    { id: "7", name: "Birth Certificate", description: "Applicant's birth certificate", required: true, category: "Identity", uploaded: false, tips: "With certified English translation if not in English." },
    { id: "8", name: "Police Clearance", description: "Police clearance from countries lived in 6+ months", required: false, category: "Background", uploaded: false, tips: "May be needed for consular processing." },
    { id: "9", name: "Previous Marriage Termination", description: "Divorce decrees or death certificates from prior marriages", required: false, category: "Relationship", uploaded: false, tips: "Required if either spouse was previously married." },
    { id: "10", name: "Passport (Applicant)", description: "Valid passport of the applicant", required: true, category: "Identity", uploaded: false, tips: "Bio page scan." },
  ],
  eb2niw: [
    { id: "1", name: "Advanced Degree Evidence", description: "Master's degree or higher, or Bachelor's + 5 years progressive experience", required: true, category: "Education", uploaded: false, tips: "Foreign degrees need credential evaluation." },
    { id: "2", name: "Resume / CV", description: "Comprehensive CV with all publications, presentations, work history", required: true, category: "Professional", uploaded: false, tips: "Be thorough — include everything." },
    { id: "3", name: "Personal Statement / Plan", description: "Detailed description of proposed endeavor in the US", required: true, category: "NIW-Specific", uploaded: false, tips: "Must address Dhanasar framework: merit, national importance, well-positioned, on balance beneficial." },
    { id: "4", name: "Recommendation Letters", description: "6-10 letters from experts in the field (independent and dependent)", required: true, category: "NIW-Specific", uploaded: false, tips: "Mix of independent experts who know your work and collaborators. Independent letters carry more weight." },
    { id: "5", name: "Publications & Citations", description: "List of publications with citation evidence", required: true, category: "Evidence", uploaded: false, tips: "Google Scholar profile, citation reports from Web of Science or Scopus." },
    { id: "6", name: "Peer Review Evidence", description: "Evidence of serving as peer reviewer for journals", required: false, category: "Evidence", uploaded: false, tips: "Invitation letters from journal editors, review certificates." },
    { id: "7", name: "Awards & Honors", description: "Evidence of professional awards or honors", required: false, category: "Evidence", uploaded: false, tips: "Award letters, certificates, descriptions of selectivity." },
    { id: "8", name: "Media Coverage", description: "Published articles about your work", required: false, category: "Evidence", uploaded: false, tips: "Trade publications, news articles mentioning your work." },
    { id: "9", name: "Passport", description: "Valid passport bio page", required: true, category: "Identity", uploaded: false, tips: "Must be valid." },
    { id: "10", name: "Previous Immigration Documents", description: "Current visa, I-94, prior approval notices", required: true, category: "Immigration History", uploaded: false, tips: "Include all I-797 notices and current I-94." },
  ],
};

export default function DocumentsPage() {
  const [selectedVisa, setSelectedVisa] = useState<string>("h1b");
  const [documents, setDocuments] = useState<DocumentItem[]>(
    DOCUMENT_CHECKLISTS.h1b
  );
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const uploadedCount = documents.filter((d) => d.uploaded).length;
  const requiredCount = documents.filter((d) => d.required).length;
  const requiredUploadedCount = documents.filter(
    (d) => d.required && d.uploaded
  ).length;
  const progress = Math.round(
    (requiredUploadedCount / requiredCount) * 100
  );

  function handleVisaChange(visa: string) {
    setSelectedVisa(visa);
    setDocuments(
      DOCUMENT_CHECKLISTS[visa] || DOCUMENT_CHECKLISTS.h1b
    );
  }

  function toggleDocument(id: string) {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, uploaded: !d.uploaded, uploadedAt: !d.uploaded ? new Date().toISOString().split("T")[0] : undefined } : d
      )
    );
  }

  async function handleUpload(id: string) {
    setUploadingId(id);
    // Simulate upload delay
    await new Promise((r) => setTimeout(r, 1500));
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              uploaded: true,
              uploadedAt: new Date().toISOString().split("T")[0],
              fileName: "uploaded_document.pdf",
            }
          : d
      )
    );
    setUploadingId(null);
  }

  const categories = [...new Set(documents.map((d) => d.category))];

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Document Checklist</h1>
        </div>
        <p className="text-muted-foreground">
          AI-generated document checklists tailored to your visa type. Track uploads
          and stay organized.
        </p>
      </div>

      {/* Visa selector & progress */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={selectedVisa} onValueChange={handleVisaChange}>
          <SelectTrigger className="sm:w-80">
            <SelectValue placeholder="Select visa type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(VISA_TYPES).map(([key, visa]) => (
              <SelectItem key={key} value={key}>
                {visa.name} — {visa.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Progress Card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{requiredUploadedCount}/{requiredCount}</p>
              <p className="text-xs text-muted-foreground">Required Docs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{uploadedCount}/{documents.length}</p>
              <p className="text-xs text-muted-foreground">Total Uploaded</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{progress}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Document List by Category */}
      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold mb-3">{category}</h2>
          <div className="space-y-3">
            {documents
              .filter((d) => d.category === category)
              .map((doc) => (
                <Card
                  key={doc.id}
                  className={doc.uploaded ? "border-green-200 bg-green-50/50" : ""}
                >
                  <CardContent className="flex items-start gap-4 py-4">
                    <Checkbox
                      checked={doc.uploaded}
                      onCheckedChange={() => toggleDocument(doc.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm">{doc.name}</h3>
                        {doc.required && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            Required
                          </Badge>
                        )}
                        {doc.uploaded && (
                          <Badge variant="success" className="text-[10px] px-1.5 py-0">
                            Uploaded
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {doc.description}
                      </p>
                      {doc.uploaded && doc.fileName && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <File className="h-3 w-3" />
                          <span>{doc.fileName}</span>
                          {doc.uploadedAt && (
                            <>
                              <span>|</span>
                              <Clock className="h-3 w-3" />
                              <span>{doc.uploadedAt}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Info className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{doc.name}</DialogTitle>
                            <DialogDescription>{doc.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-semibold mb-1">Tips</h4>
                              <p className="text-sm text-muted-foreground">{doc.tips}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold mb-1">Status</h4>
                              <p className="text-sm text-muted-foreground">
                                {doc.uploaded ? "Uploaded" : "Not yet uploaded"}
                                {doc.required ? " (Required)" : " (Optional)"}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {!doc.uploaded && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpload(doc.id)}
                          disabled={uploadingId === doc.id}
                        >
                          {uploadingId === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
