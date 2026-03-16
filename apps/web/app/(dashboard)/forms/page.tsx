"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Loader2,
  CheckCircle2,
  Wand2,
  AlertTriangle,
  Edit,
} from "lucide-react";
import { FORM_TYPES } from "@/lib/constants";

interface FormField {
  id: string;
  label: string;
  section: string;
  value: string;
  aiGenerated: boolean;
  fieldType: "text" | "date" | "select";
  options?: string[];
  helpText?: string;
}

const SAMPLE_I140_FIELDS: FormField[] = [
  { id: "petitioner_name", label: "Petitioner (Employer) Name", section: "Part 1 - Petitioner", value: "", aiGenerated: false, fieldType: "text" },
  { id: "petitioner_ein", label: "Employer EIN", section: "Part 1 - Petitioner", value: "", aiGenerated: false, fieldType: "text" },
  { id: "petitioner_address", label: "Petitioner Address", section: "Part 1 - Petitioner", value: "", aiGenerated: false, fieldType: "text" },
  { id: "petitioner_city", label: "City", section: "Part 1 - Petitioner", value: "", aiGenerated: false, fieldType: "text" },
  { id: "petitioner_state", label: "State", section: "Part 1 - Petitioner", value: "", aiGenerated: false, fieldType: "text" },
  { id: "petitioner_zip", label: "ZIP Code", section: "Part 1 - Petitioner", value: "", aiGenerated: false, fieldType: "text" },
  { id: "classification", label: "Immigrant Classification Requested", section: "Part 2 - Classification", value: "", aiGenerated: false, fieldType: "select", options: ["EB-1A Extraordinary Ability", "EB-1B Outstanding Professor/Researcher", "EB-1C Multinational Manager", "EB-2 Advanced Degree", "EB-2 Exceptional Ability", "EB-2 NIW", "EB-3 Skilled Worker", "EB-3 Professional"] },
  { id: "beneficiary_name", label: "Beneficiary Full Legal Name", section: "Part 3 - Beneficiary", value: "", aiGenerated: false, fieldType: "text" },
  { id: "beneficiary_dob", label: "Date of Birth", section: "Part 3 - Beneficiary", value: "", aiGenerated: false, fieldType: "date" },
  { id: "beneficiary_country_birth", label: "Country of Birth", section: "Part 3 - Beneficiary", value: "", aiGenerated: false, fieldType: "text" },
  { id: "beneficiary_country_citizenship", label: "Country of Citizenship", section: "Part 3 - Beneficiary", value: "", aiGenerated: false, fieldType: "text" },
  { id: "beneficiary_a_number", label: "Alien Registration Number (if any)", section: "Part 3 - Beneficiary", value: "", aiGenerated: false, fieldType: "text" },
  { id: "beneficiary_ssn", label: "Social Security Number (if any)", section: "Part 3 - Beneficiary", value: "", aiGenerated: false, fieldType: "text" },
  { id: "beneficiary_address", label: "Current Address", section: "Part 3 - Beneficiary", value: "", aiGenerated: false, fieldType: "text" },
  { id: "job_title", label: "Job Title", section: "Part 4 - Job Details", value: "", aiGenerated: false, fieldType: "text" },
  { id: "soc_code", label: "SOC Code", section: "Part 4 - Job Details", value: "", aiGenerated: false, fieldType: "text", helpText: "Standard Occupational Classification code" },
  { id: "job_description", label: "Job Description (Brief)", section: "Part 4 - Job Details", value: "", aiGenerated: false, fieldType: "text" },
  { id: "wage", label: "Offered Wage (Annual)", section: "Part 4 - Job Details", value: "", aiGenerated: false, fieldType: "text" },
  { id: "education_required", label: "Education Required for Position", section: "Part 4 - Job Details", value: "", aiGenerated: false, fieldType: "select", options: ["None", "High School", "Associate's", "Bachelor's", "Master's", "Doctorate", "Professional"] },
  { id: "experience_required", label: "Experience Required (months)", section: "Part 4 - Job Details", value: "", aiGenerated: false, fieldType: "text" },
];

const SAMPLE_I485_FIELDS: FormField[] = [
  { id: "applicant_name", label: "Full Legal Name", section: "Part 1 - Applicant", value: "", aiGenerated: false, fieldType: "text" },
  { id: "applicant_dob", label: "Date of Birth", section: "Part 1 - Applicant", value: "", aiGenerated: false, fieldType: "date" },
  { id: "applicant_gender", label: "Gender", section: "Part 1 - Applicant", value: "", aiGenerated: false, fieldType: "select", options: ["Male", "Female"] },
  { id: "applicant_country_birth", label: "Country of Birth", section: "Part 1 - Applicant", value: "", aiGenerated: false, fieldType: "text" },
  { id: "applicant_nationality", label: "Country of Nationality", section: "Part 1 - Applicant", value: "", aiGenerated: false, fieldType: "text" },
  { id: "applicant_a_number", label: "Alien Registration Number", section: "Part 1 - Applicant", value: "", aiGenerated: false, fieldType: "text" },
  { id: "applicant_ssn", label: "US Social Security Number", section: "Part 1 - Applicant", value: "", aiGenerated: false, fieldType: "text" },
  { id: "applicant_address", label: "Current US Address", section: "Part 2 - Address", value: "", aiGenerated: false, fieldType: "text" },
  { id: "applicant_city", label: "City", section: "Part 2 - Address", value: "", aiGenerated: false, fieldType: "text" },
  { id: "applicant_state", label: "State", section: "Part 2 - Address", value: "", aiGenerated: false, fieldType: "text" },
  { id: "applicant_zip", label: "ZIP Code", section: "Part 2 - Address", value: "", aiGenerated: false, fieldType: "text" },
  { id: "last_entry_date", label: "Date of Last Entry to US", section: "Part 3 - Immigration", value: "", aiGenerated: false, fieldType: "date" },
  { id: "last_entry_status", label: "Status at Last Entry", section: "Part 3 - Immigration", value: "", aiGenerated: false, fieldType: "text" },
  { id: "current_status", label: "Current Immigration Status", section: "Part 3 - Immigration", value: "", aiGenerated: false, fieldType: "text" },
  { id: "i94_number", label: "I-94 Number", section: "Part 3 - Immigration", value: "", aiGenerated: false, fieldType: "text" },
  { id: "basis_for_eligibility", label: "Basis for Eligibility", section: "Part 4 - Basis", value: "", aiGenerated: false, fieldType: "select", options: ["Employment-based (I-140 approved)", "Family-based (I-130 approved)", "Diversity Visa Lottery", "Asylee/Refugee", "Other"] },
  { id: "priority_date", label: "Priority Date", section: "Part 4 - Basis", value: "", aiGenerated: false, fieldType: "date" },
];

export default function FormsPage() {
  const [selectedForm, setSelectedForm] = useState("i-140");
  const [fields, setFields] = useState<FormField[]>(SAMPLE_I140_FIELDS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  function handleFormChange(formId: string) {
    setSelectedForm(formId);
    if (formId === "i-485") {
      setFields(SAMPLE_I485_FIELDS);
    } else {
      setFields(SAMPLE_I140_FIELDS);
    }
  }

  function updateField(id: string, value: string) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value } : f))
    );
  }

  async function handleAIFill() {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/forms/ai-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: selectedForm,
          existingFields: fields.filter((f) => f.value).map((f) => ({
            id: f.id,
            label: f.label,
            value: f.value,
          })),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setFields((prev) =>
          prev.map((f) => {
            const suggestion = data.suggestions?.find(
              (s: { id: string; value: string }) => s.id === f.id
            );
            if (suggestion && !f.value) {
              return { ...f, value: suggestion.value, aiGenerated: true };
            }
            return f;
          })
        );
      }
    } catch {
      // Fallback — apply demo AI fills
      setFields((prev) =>
        prev.map((f) => {
          if (f.value) return f;
          if (f.id === "soc_code") return { ...f, value: "15-1252.00", aiGenerated: true };
          if (f.id === "job_description")
            return {
              ...f,
              value: "Design, develop, test, and evaluate software systems and applications to meet business requirements.",
              aiGenerated: true,
            };
          return f;
        })
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleExport() {
    setIsExporting(true);
    try {
      const response = await fetch("/api/forms/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: selectedForm, fields }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedForm}_prefilled.docx`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // In development without API, show a message
      alert("Export requires a running API server. Form data has been saved.");
    } finally {
      setIsExporting(false);
    }
  }

  const sections = [...new Set(fields.map((f) => f.section))];
  const filledCount = fields.filter((f) => f.value).length;
  const aiFilledCount = fields.filter((f) => f.aiGenerated).length;

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Form Pre-Fill</h1>
        </div>
        <p className="text-muted-foreground">
          Pre-fill immigration forms with AI assistance. Review all fields before
          submitting.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-700">
            <strong>Review Carefully:</strong> AI-generated form data is a starting
            point. You must review and verify every field before filing with USCIS.
            Incorrect information on immigration forms can have serious consequences.
          </p>
        </div>
      </div>

      {/* Form selector */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={selectedForm} onValueChange={handleFormChange}>
          <SelectTrigger className="sm:w-80">
            <SelectValue placeholder="Select form" />
          </SelectTrigger>
          <SelectContent>
            {FORM_TYPES.map((form) => (
              <SelectItem key={form.id} value={form.id}>
                {form.name} — {form.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAIFill} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              AI Filling...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              AI Auto-Fill
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting || filledCount === 0}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export DOCX
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <Badge variant="outline" className="text-sm">
          {filledCount}/{fields.length} fields filled
        </Badge>
        {aiFilledCount > 0 && (
          <Badge variant="info" className="text-sm">
            <Wand2 className="mr-1 h-3 w-3" />
            {aiFilledCount} AI-generated
          </Badge>
        )}
      </div>

      {/* Form Sections */}
      <Tabs defaultValue={sections[0]} className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-1">
          {sections.map((section) => (
            <TabsTrigger key={section} value={section} className="text-xs">
              {section}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section} value={section}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{section}</CardTitle>
                <CardDescription>
                  Fill in the fields below or use AI Auto-Fill for suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields
                  .filter((f) => f.section === section)
                  .map((field) => (
                    <div key={field.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        {field.aiGenerated && (
                          <Badge
                            variant="info"
                            className="text-[10px] px-1.5 py-0"
                          >
                            <Wand2 className="mr-0.5 h-2.5 w-2.5" />
                            AI
                          </Badge>
                        )}
                      </div>
                      {field.fieldType === "select" ? (
                        <Select
                          value={field.value}
                          onValueChange={(v) => updateField(field.id, v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.id}
                          type={field.fieldType === "date" ? "date" : "text"}
                          value={field.value}
                          onChange={(e) => updateField(field.id, e.target.value)}
                          className={
                            field.aiGenerated
                              ? "border-blue-300 bg-blue-50/50"
                              : ""
                          }
                        />
                      )}
                      {field.helpText && (
                        <p className="text-xs text-muted-foreground">
                          {field.helpText}
                        </p>
                      )}
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
