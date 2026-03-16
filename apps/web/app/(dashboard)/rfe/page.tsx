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
import { Textarea } from "@/components/ui/textarea";
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
  MessageSquare,
  Upload,
  Wand2,
  Loader2,
  Download,
  Copy,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BookOpen,
} from "lucide-react";
import { VISA_TYPES } from "@/lib/constants";

interface RFESection {
  title: string;
  uscisIssue: string;
  suggestedResponse: string;
  supportingEvidence: string[];
  regulatoryReference: string;
}

export default function RFEPage() {
  const [visaType, setVisaType] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [rfeText, setRfeText] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<RFESection[] | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!rfeText.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/rfe/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visaType,
          receiptNumber,
          rfeText,
          additionalContext,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResponse(data.sections);
      } else {
        setResponse(generateFallbackResponse(rfeText, visaType));
      }
    } catch {
      setResponse(generateFallbackResponse(rfeText, visaType));
    } finally {
      setIsGenerating(false);
    }
  }

  function generateFallbackResponse(
    text: string,
    visa: string
  ): RFESection[] {
    const sections: RFESection[] = [];

    const lowerText = text.toLowerCase();

    if (
      lowerText.includes("specialty occupation") ||
      lowerText.includes("specialty") ||
      visa === "h1b"
    ) {
      sections.push({
        title: "Specialty Occupation Evidence",
        uscisIssue:
          "USCIS is requesting additional evidence that the proffered position qualifies as a specialty occupation under 8 CFR 214.2(h)(4)(ii).",
        suggestedResponse:
          "The proffered position of [JOB TITLE] is a specialty occupation under the statutory and regulatory framework. We submit the following evidence demonstrating that the position meets at least one of the four regulatory criteria:\n\n1. **Industry Standard (Criterion 1):** The Department of Labor's Occupational Outlook Handbook (OOH) confirms that positions in this field normally require at least a bachelor's degree in a specific specialty. [Include specific OOH excerpts.]\n\n2. **Employer Requirement (Criterion 2):** [EMPLOYER] has consistently required a bachelor's degree or higher in [FIELD] for this position. [Include past job postings and organizational charts.]\n\n3. **Complexity of Duties (Criterion 3):** The specific duties of this position are so specialized and complex that the knowledge required to perform them is usually associated with the attainment of a bachelor's or higher degree. [Detail the complex duties.]\n\n4. **Expert Opinions:** We submit an expert opinion letter from Professor [NAME] at [UNIVERSITY], who opines that the duties described require specialized knowledge at the bachelor's degree level or higher.",
        supportingEvidence: [
          "Updated detailed job description with specific duties",
          "Occupational Outlook Handbook (OOH) excerpts",
          "Past job postings for the same position showing degree requirement",
          "Organizational chart showing position hierarchy",
          "Expert opinion letter from academic in the field",
          "Comparisons with similar job postings from other employers",
        ],
        regulatoryReference:
          "INA Section 214(i)(1); 8 CFR 214.2(h)(4)(ii); Matter of Simeio Solutions, LLC",
      });
    }

    if (
      lowerText.includes("beneficiary qualifications") ||
      lowerText.includes("education") ||
      lowerText.includes("degree")
    ) {
      sections.push({
        title: "Beneficiary Qualifications",
        uscisIssue:
          "USCIS requests evidence that the beneficiary holds a degree in a field directly related to the specialty occupation.",
        suggestedResponse:
          "The beneficiary holds a [DEGREE] in [FIELD] from [UNIVERSITY], which is directly related to the proffered position. We submit the following evidence:\n\n1. **Academic Credentials:** The beneficiary's degree certificate and transcripts confirm the award of a [DEGREE] in [FIELD].\n\n2. **Credential Evaluation:** [If foreign degree] An evaluation by [EVALUATION SERVICE], a NACES-member organization, confirms the foreign degree is equivalent to a US [DEGREE] in [FIELD].\n\n3. **Coursework Relevance:** A detailed analysis of the beneficiary's coursework demonstrates direct relevance to the duties of the proffered position.\n\n4. **Professional Experience:** The beneficiary has [X] years of progressive experience in the field, further qualifying them for the role.",
        supportingEvidence: [
          "Degree certificate(s) with certified translation if needed",
          "Official transcripts",
          "Credential evaluation from NACES-member service",
          "Coursework-to-job-duties mapping",
          "Employment verification letters from prior employers",
          "Professional certifications or licenses",
        ],
        regulatoryReference:
          "8 CFR 214.2(h)(4)(iii)(C); 8 CFR 214.2(h)(4)(iii)(D)",
      });
    }

    if (
      lowerText.includes("extraordinary ability") ||
      lowerText.includes("o-1") ||
      lowerText.includes("eb-1") ||
      visa === "o1a" ||
      visa === "eb1a"
    ) {
      sections.push({
        title: "Extraordinary Ability Evidence",
        uscisIssue:
          "USCIS requests additional evidence of sustained national or international acclaim and extraordinary ability.",
        suggestedResponse:
          "The beneficiary meets the evidentiary criteria for extraordinary ability under the applicable standard. We submit additional evidence addressing the following criteria:\n\n1. **Awards/Prizes:** [Detail nationally/internationally recognized awards]\n\n2. **Published Material About the Beneficiary:** [List articles, interviews, media coverage]\n\n3. **Scholarly Articles:** The beneficiary has authored [X] articles in peer-reviewed journals with a total of [Y] citations.\n\n4. **Judging:** The beneficiary has served as a peer reviewer for [JOURNALS] and as a judge for [COMPETITIONS/GRANTS].\n\n5. **Original Contributions of Major Significance:** [Detail specific contributions and their impact on the field]\n\n6. **High Salary:** The beneficiary's compensation of [AMOUNT] places them in the top [X]% of earners in the field.",
        supportingEvidence: [
          "Updated citation report (Google Scholar / Scopus)",
          "Awards and honors with descriptions of selectivity",
          "Peer review invitations and completion certificates",
          "Reference letters from independent experts",
          "Evidence of media coverage and press mentions",
          "Salary comparison data",
        ],
        regulatoryReference:
          "INA Section 203(b)(1)(A); 8 CFR 204.5(h)(3); Kazarian v. USCIS, 596 F.3d 1115",
      });
    }

    if (
      lowerText.includes("maintenance of status") ||
      lowerText.includes("status violation") ||
      lowerText.includes("out of status")
    ) {
      sections.push({
        title: "Maintenance of Status",
        uscisIssue:
          "USCIS requests evidence that the beneficiary has maintained valid immigration status.",
        suggestedResponse:
          "The beneficiary has maintained lawful immigration status throughout their time in the United States. We submit the following chronological evidence:\n\n1. A complete immigration history showing all entries, status changes, and extensions.\n\n2. I-94 records from CBP confirming authorized periods of stay.\n\n3. All I-797 approval notices for prior petitions.\n\n4. Pay stubs and employment records confirming employment consistent with authorized status.\n\n[If there was a brief gap]: The beneficiary notes a [X]-day gap between [DATE] and [DATE], which falls within the regulatory grace period / was during a pending extension / was due to [REASON]. This does not constitute a violation of status for the following reasons: [LEGAL ARGUMENT].",
        supportingEvidence: [
          "Complete I-94 travel history from CBP website",
          "All I-797 approval notices",
          "Pay stubs covering entire US presence",
          "Employment verification letters",
          "Tax returns showing consistent employment",
        ],
        regulatoryReference: "INA Section 245(c); 8 CFR 245.1(d)(1)",
      });
    }

    if (sections.length === 0) {
      sections.push({
        title: "General RFE Response",
        uscisIssue:
          "USCIS has issued a Request for Evidence regarding your immigration petition.",
        suggestedResponse:
          "We respectfully submit the following evidence and arguments in response to the Request for Evidence dated [DATE] for receipt number [RECEIPT NUMBER].\n\n[Your AI advisor can help generate a more specific response. Please provide the full text of the RFE notice and describe the issues raised by USCIS in more detail.]\n\nWe respectfully request that the Service approve this petition based on the totality of the evidence submitted.",
        supportingEvidence: [
          "Upload the full RFE notice for detailed analysis",
          "Relevant supporting documents as requested by USCIS",
          "Updated evidence addressing each specific issue",
        ],
        regulatoryReference:
          "8 CFR 103.2(b)(8) — Standard for Requests for Evidence",
      });
    }

    return sections;
  }

  async function copyToClipboard() {
    if (!response) return;
    const fullText = response
      .map(
        (s) =>
          `## ${s.title}\n\n${s.suggestedResponse}\n\nRegulatory Reference: ${s.regulatoryReference}`
      )
      .join("\n\n---\n\n");
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">RFE Response Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Generate draft responses to USCIS Requests for Evidence using AI analysis.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600 shrink-0" />
          <p className="text-sm text-yellow-700">
            <strong>Important:</strong> AI-generated RFE responses are drafts only.
            They must be reviewed, edited, and finalized by a licensed immigration
            attorney before submission to USCIS.
          </p>
        </div>
      </div>

      {/* Input Form */}
      {!response && (
        <Card>
          <CardHeader>
            <CardTitle>RFE Details</CardTitle>
            <CardDescription>
              Provide details about the RFE you received. The more context you give,
              the better the AI-generated response.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Visa Type / Form</Label>
                <Select value={visaType} onValueChange={setVisaType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(VISA_TYPES).map(([key, visa]) => (
                      <SelectItem key={key} value={key}>
                        {visa.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receipt">Receipt Number</Label>
                <Input
                  id="receipt"
                  placeholder="e.g., EAC-XX-XXX-XXXXX"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rfe-text">
                RFE Text <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="rfe-text"
                rows={8}
                placeholder="Paste the text from your RFE notice here. Include the specific issues raised by USCIS, the evidence they are requesting, and any relevant details..."
                value={rfeText}
                onChange={(e) => setRfeText(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Paste the complete RFE text for the most accurate response generation.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Additional Context (optional)</Label>
              <Textarea
                id="context"
                rows={4}
                placeholder="Describe any additional context: evidence you already have, your specific situation, what arguments you think are strongest..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !rfeText.trim()}
              className="w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Response...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate RFE Response
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Generated Response */}
      {response && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Draft RFE Response</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <CheckCircle2 className="mr-1 h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="mr-1 h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy All"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" />
                Export DOCX
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResponse(null)}
              >
                New RFE
              </Button>
            </div>
          </div>

          {response.map((section, idx) => (
            <Card key={idx}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="default">Issue {idx + 1}</Badge>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">
                    USCIS Issue
                  </h4>
                  <p className="text-sm">{section.uscisIssue}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-1">
                    Suggested Response
                  </h4>
                  <div className="prose prose-sm max-w-none whitespace-pre-line text-sm">
                    {section.suggestedResponse}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Recommended Supporting Evidence
                  </h4>
                  <ul className="space-y-1">
                    {section.supportingEvidence.map((ev, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <FileText className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                        {ev}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="flex items-start gap-2">
                  <BookOpen className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground">
                      Regulatory Reference
                    </h4>
                    <p className="text-sm">{section.regulatoryReference}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
