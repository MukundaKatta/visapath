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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Scale,
  Loader2,
  Shield,
  AlertTriangle,
} from "lucide-react";

interface AssessmentAnswers {
  purpose: string;
  currentStatus: string;
  nationality: string;
  educationLevel: string;
  yearsExperience: string;
  fieldOfWork: string;
  hasJobOffer: string;
  employerWillingSponsor: string;
  extraordinaryAbility: string;
  publications: string;
  awards: string;
  salary: string;
  usRelative: string;
  relativeRelationship: string;
  investmentAmount: string;
  additionalInfo: string;
}

const initialAnswers: AssessmentAnswers = {
  purpose: "",
  currentStatus: "",
  nationality: "",
  educationLevel: "",
  yearsExperience: "",
  fieldOfWork: "",
  hasJobOffer: "",
  employerWillingSponsor: "",
  extraordinaryAbility: "",
  publications: "",
  awards: "",
  salary: "",
  usRelative: "",
  relativeRelationship: "",
  investmentAmount: "",
  additionalInfo: "",
};

interface VisaRecommendation {
  visaType: string;
  confidence: "high" | "medium" | "low";
  reasoning: string;
  requirements: string[];
  estimatedTimeline: string;
  estimatedCost: string;
}

const STEPS = [
  { id: 1, title: "Basic Information", description: "Tell us about yourself" },
  { id: 2, title: "Education & Work", description: "Your qualifications" },
  { id: 3, title: "Employment", description: "Job offer & sponsorship" },
  { id: 4, title: "Special Qualifications", description: "Achievements & abilities" },
  { id: 5, title: "Family Ties", description: "US-based relatives" },
  { id: 6, title: "Additional Details", description: "Anything else relevant" },
];

export default function AssessmentPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<AssessmentAnswers>(initialAnswers);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<VisaRecommendation[] | null>(null);

  const totalSteps = STEPS.length;
  const progress = (step / totalSteps) * 100;

  function updateAnswer(key: keyof AssessmentAnswers, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data.recommendations);
      } else {
        // Fallback: generate local recommendations based on answers
        setResults(generateLocalRecommendations(answers));
      }
    } catch {
      setResults(generateLocalRecommendations(answers));
    } finally {
      setIsAnalyzing(false);
    }
  }

  function generateLocalRecommendations(
    a: AssessmentAnswers
  ): VisaRecommendation[] {
    const recs: VisaRecommendation[] = [];

    if (a.purpose === "work" && a.hasJobOffer === "yes") {
      if (a.educationLevel === "bachelors" || a.educationLevel === "masters" || a.educationLevel === "phd") {
        recs.push({
          visaType: "H-1B",
          confidence: "high",
          reasoning:
            "You have a qualifying degree and a US job offer in a specialty occupation. The H-1B is the most common work visa for professionals.",
          requirements: [
            "Bachelor's degree or higher in a specialty field",
            "Job offer from US employer for specialty occupation",
            "Employer files petition (Form I-129)",
            "Selected in H-1B lottery (if cap-subject)",
            "Labor Condition Application (LCA) approval",
          ],
          estimatedTimeline: "3-6 months (lottery in March, start Oct 1)",
          estimatedCost: "$3,000 - $8,000 (employer-paid)",
        });
      }
      if (a.educationLevel === "masters" || a.educationLevel === "phd") {
        recs.push({
          visaType: "EB-2",
          confidence: "medium",
          reasoning:
            "With an advanced degree and job offer, you may qualify for an EB-2 employment-based green card through PERM labor certification.",
          requirements: [
            "Advanced degree (Master's or PhD) or Bachelor's + 5 years experience",
            "PERM Labor Certification from employer",
            "Approved I-140 petition",
            "Priority date must be current",
          ],
          estimatedTimeline: "2-5 years (varies by country of birth)",
          estimatedCost: "$10,000 - $20,000",
        });
      }
    }

    if (a.purpose === "work" && a.extraordinaryAbility === "yes") {
      recs.push({
        visaType: "O-1A",
        confidence: "medium",
        reasoning:
          "Your reported extraordinary achievements may qualify you for O-1A status, which has no annual cap.",
        requirements: [
          "Evidence of extraordinary ability in sciences, education, business, or athletics",
          "Meet at least 3 of 8 evidentiary criteria",
          "US employer or agent sponsor",
          "Advisory opinion from peer group",
        ],
        estimatedTimeline: "2-4 months (premium processing available)",
        estimatedCost: "$4,000 - $10,000",
      });
      recs.push({
        visaType: "EB-1A",
        confidence: "medium",
        reasoning:
          "Extraordinary ability may also qualify you for the EB-1A green card, which requires no employer sponsorship.",
        requirements: [
          "Sustained national or international acclaim",
          "Meet at least 3 of 10 evidentiary criteria OR major international award",
          "Self-petition (no employer required)",
          "Coming to US to continue work in field",
        ],
        estimatedTimeline: "1-2 years",
        estimatedCost: "$5,000 - $15,000",
      });
    }

    if (a.purpose === "work" && (a.educationLevel === "masters" || a.educationLevel === "phd")) {
      recs.push({
        visaType: "EB-2 NIW",
        confidence: "medium",
        reasoning:
          "With an advanced degree, you may qualify for a National Interest Waiver, which does not require employer sponsorship or PERM.",
        requirements: [
          "Advanced degree or exceptional ability",
          "Proposed endeavor has substantial merit and national importance",
          "Well-positioned to advance the endeavor",
          "On balance, beneficial to waive job offer requirement",
        ],
        estimatedTimeline: "1-3 years",
        estimatedCost: "$5,000 - $12,000",
      });
    }

    if (a.usRelative === "yes" && a.relativeRelationship === "spouse") {
      recs.push({
        visaType: "Marriage-Based Green Card",
        confidence: "high",
        reasoning:
          "As the spouse of a US citizen or permanent resident, you have a direct path to a green card through family sponsorship.",
        requirements: [
          "Bona fide marriage to US citizen or permanent resident",
          "I-130 Petition for Alien Relative",
          "I-485 Adjustment of Status (if in US) or consular processing",
          "Affidavit of Support (I-864)",
          "Medical examination",
        ],
        estimatedTimeline: "10-24 months",
        estimatedCost: "$2,000 - $5,000",
      });
    }

    if (a.purpose === "study") {
      recs.push({
        visaType: "F-1",
        confidence: "high",
        reasoning:
          "For academic study in the US, the F-1 student visa is the standard path.",
        requirements: [
          "Acceptance at SEVP-certified school",
          "I-20 from school",
          "Proof of financial support",
          "Intent to return to home country",
          "English proficiency",
        ],
        estimatedTimeline: "2-4 months",
        estimatedCost: "$500 - $1,500",
      });
    }

    if (a.purpose === "invest" && parseInt(a.investmentAmount || "0") >= 100000) {
      recs.push({
        visaType: "E-2",
        confidence: "medium",
        reasoning:
          "With a substantial investment, you may qualify for the E-2 Treaty Investor visa if your country has a treaty with the US.",
        requirements: [
          "Citizen of treaty country",
          "Substantial investment in US enterprise",
          "Investment must be at risk",
          "Enterprise must be real and active",
          "Investor must direct and develop the enterprise",
        ],
        estimatedTimeline: "2-5 months",
        estimatedCost: "$5,000 - $15,000 (plus investment capital)",
      });
    }

    if (recs.length === 0) {
      recs.push({
        visaType: "Consultation Recommended",
        confidence: "low",
        reasoning:
          "Based on your answers, we recommend consulting with a licensed immigration attorney who can evaluate your specific situation in detail. There may be visa categories suitable for you that require more detailed analysis.",
        requirements: [
          "Schedule consultation with immigration attorney",
          "Gather all relevant documents",
          "Prepare detailed personal and professional history",
        ],
        estimatedTimeline: "Varies",
        estimatedCost: "Attorney consultation: $200-$500",
      });
    }

    return recs;
  }

  if (results) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold">Assessment Results</h1>
          </div>
          <p className="text-muted-foreground">
            Based on your responses, here are the visa categories you may qualify for.
          </p>
        </div>

        {/* Disclaimer banner */}
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600 shrink-0" />
            <p className="text-sm text-yellow-700">
              <strong>Not Legal Advice:</strong> This assessment is for informational
              purposes only. Immigration eligibility depends on many factors. Please
              consult a licensed immigration attorney before taking action.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {results.map((rec, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{rec.visaType}</CardTitle>
                  <Badge
                    variant={
                      rec.confidence === "high"
                        ? "success"
                        : rec.confidence === "medium"
                          ? "warning"
                          : "secondary"
                    }
                  >
                    {rec.confidence === "high"
                      ? "Strong Match"
                      : rec.confidence === "medium"
                        ? "Possible Match"
                        : "Needs Review"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Analysis</h4>
                  <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-2">Key Requirements</h4>
                  <ul className="space-y-1">
                    {rec.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold">Est. Timeline</h4>
                    <p className="text-sm text-muted-foreground">
                      {rec.estimatedTimeline}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Est. Cost</h4>
                    <p className="text-sm text-muted-foreground">
                      {rec.estimatedCost}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setResults(null);
              setStep(1);
              setAnswers(initialAnswers);
            }}
          >
            Start Over
          </Button>
          <Button asChild>
            <a href="/advisor">Discuss with AI Advisor</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Visa Eligibility Assessment</h1>
        </div>
        <p className="text-muted-foreground">
          Answer a few questions to discover which visa categories you may qualify for.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Step {step} of {totalSteps}: {STEPS[step - 1].title}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step - 1].title}</CardTitle>
          <CardDescription>{STEPS[step - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <div className="space-y-3">
                <Label>What is the primary purpose of your US immigration?</Label>
                <RadioGroup
                  value={answers.purpose}
                  onValueChange={(v) => updateAnswer("purpose", v)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="work" id="work" />
                    <Label htmlFor="work">Work / Employment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="study" id="study" />
                    <Label htmlFor="study">Study / Academic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="family" id="family" />
                    <Label htmlFor="family">Family Reunification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="invest" id="invest" />
                    <Label htmlFor="invest">Investment / Business</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentStatus">Current Immigration Status</Label>
                <Select
                  value={answers.currentStatus}
                  onValueChange={(v) => updateAnswer("currentStatus", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outside_us">Outside the US</SelectItem>
                    <SelectItem value="b1b2">B-1/B-2 (Visitor)</SelectItem>
                    <SelectItem value="f1">F-1 (Student)</SelectItem>
                    <SelectItem value="h1b">H-1B</SelectItem>
                    <SelectItem value="h4">H-4</SelectItem>
                    <SelectItem value="l1">L-1</SelectItem>
                    <SelectItem value="o1">O-1</SelectItem>
                    <SelectItem value="tn">TN</SelectItem>
                    <SelectItem value="ead">EAD Holder</SelectItem>
                    <SelectItem value="gc">Green Card Holder</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Country of Citizenship</Label>
                <Input
                  id="nationality"
                  placeholder="e.g., India, China, Brazil"
                  value={answers.nationality}
                  onChange={(e) => updateAnswer("nationality", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 2: Education & Work */}
          {step === 2 && (
            <>
              <div className="space-y-3">
                <Label>Highest Level of Education</Label>
                <RadioGroup
                  value={answers.educationLevel}
                  onValueChange={(v) => updateAnswer("educationLevel", v)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="highschool" id="hs" />
                    <Label htmlFor="hs">High School / GED</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="associates" id="assoc" />
                    <Label htmlFor="assoc">Associate&apos;s Degree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bachelors" id="bach" />
                    <Label htmlFor="bach">Bachelor&apos;s Degree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masters" id="mast" />
                    <Label htmlFor="mast">Master&apos;s Degree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phd" id="phd" />
                    <Label htmlFor="phd">PhD / Doctoral Degree</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="prof" />
                    <Label htmlFor="prof">Professional Degree (MD, JD, etc.)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsExp">Years of Professional Experience</Label>
                <Select
                  value={answers.yearsExperience}
                  onValueChange={(v) => updateAnswer("yearsExperience", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select years of experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="field">Field of Work / Study</Label>
                <Input
                  id="field"
                  placeholder="e.g., Software Engineering, Medicine, Finance"
                  value={answers.fieldOfWork}
                  onChange={(e) => updateAnswer("fieldOfWork", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 3: Employment */}
          {step === 3 && (
            <>
              <div className="space-y-3">
                <Label>Do you have a job offer from a US employer?</Label>
                <RadioGroup
                  value={answers.hasJobOffer}
                  onValueChange={(v) => updateAnswer("hasJobOffer", v)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="offer-yes" />
                    <Label htmlFor="offer-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="offer-no" />
                    <Label htmlFor="offer-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pending" id="offer-pending" />
                    <Label htmlFor="offer-pending">In process</Label>
                  </div>
                </RadioGroup>
              </div>

              {(answers.hasJobOffer === "yes" || answers.hasJobOffer === "pending") && (
                <div className="space-y-3">
                  <Label>Is the employer willing to sponsor your visa?</Label>
                  <RadioGroup
                    value={answers.employerWillingSponsor}
                    onValueChange={(v) => updateAnswer("employerWillingSponsor", v)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="sponsor-yes" />
                      <Label htmlFor="sponsor-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="sponsor-no" />
                      <Label htmlFor="sponsor-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unsure" id="sponsor-unsure" />
                      <Label htmlFor="sponsor-unsure">Not sure yet</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="salary">Expected Annual Salary (USD)</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="e.g., 120000"
                  value={answers.salary}
                  onChange={(e) => updateAnswer("salary", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 4: Special Qualifications */}
          {step === 4 && (
            <>
              <div className="space-y-3">
                <Label>
                  Do you have extraordinary ability or significant achievements in
                  your field?
                </Label>
                <RadioGroup
                  value={answers.extraordinaryAbility}
                  onValueChange={(v) => updateAnswer("extraordinaryAbility", v)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="extra-yes" />
                    <Label htmlFor="extra-yes">
                      Yes (awards, publications, high salary, etc.)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="some" id="extra-some" />
                    <Label htmlFor="extra-some">Some achievements</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="extra-no" />
                    <Label htmlFor="extra-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publications">
                  Number of Publications / Citations (if applicable)
                </Label>
                <Input
                  id="publications"
                  placeholder="e.g., 15 papers, 200 citations"
                  value={answers.publications}
                  onChange={(e) => updateAnswer("publications", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="awards">Notable Awards or Recognitions</Label>
                <Input
                  id="awards"
                  placeholder="e.g., Best Paper Award at ACM, Patent holder"
                  value={answers.awards}
                  onChange={(e) => updateAnswer("awards", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 5: Family Ties */}
          {step === 5 && (
            <>
              <div className="space-y-3">
                <Label>
                  Do you have an immediate relative who is a US citizen or permanent
                  resident?
                </Label>
                <RadioGroup
                  value={answers.usRelative}
                  onValueChange={(v) => updateAnswer("usRelative", v)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="rel-yes" />
                    <Label htmlFor="rel-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="rel-no" />
                    <Label htmlFor="rel-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {answers.usRelative === "yes" && (
                <div className="space-y-3">
                  <Label>Relationship to US Citizen/Resident</Label>
                  <RadioGroup
                    value={answers.relativeRelationship}
                    onValueChange={(v) =>
                      updateAnswer("relativeRelationship", v)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="spouse" id="rel-spouse" />
                      <Label htmlFor="rel-spouse">Spouse</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parent" id="rel-parent" />
                      <Label htmlFor="rel-parent">Parent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="child" id="rel-child" />
                      <Label htmlFor="rel-child">Child (over 21)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sibling" id="rel-sibling" />
                      <Label htmlFor="rel-sibling">Sibling</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {answers.purpose === "invest" && (
                <div className="space-y-2">
                  <Label htmlFor="investment">
                    Planned Investment Amount (USD)
                  </Label>
                  <Input
                    id="investment"
                    type="number"
                    placeholder="e.g., 200000"
                    value={answers.investmentAmount}
                    onChange={(e) =>
                      updateAnswer("investmentAmount", e.target.value)
                    }
                  />
                </div>
              )}
            </>
          )}

          {/* Step 6: Additional Info */}
          {step === 6 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="additional">
                  Additional Information
                </Label>
                <Textarea
                  id="additional"
                  rows={5}
                  placeholder="Provide any additional details that may be relevant to your immigration case (e.g., previous visa denials, pending petitions, special circumstances...)"
                  value={answers.additionalInfo}
                  onChange={(e) =>
                    updateAnswer("additionalInfo", e.target.value)
                  }
                />
              </div>

              {/* Summary */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="font-semibold mb-3">Quick Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Purpose:</span>{" "}
                    {answers.purpose || "Not specified"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    {answers.currentStatus || "Not specified"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Education:</span>{" "}
                    {answers.educationLevel || "Not specified"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Job Offer:</span>{" "}
                    {answers.hasJobOffer || "Not specified"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Experience:</span>{" "}
                    {answers.yearsExperience || "Not specified"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">US Relative:</span>{" "}
                    {answers.usRelative || "Not specified"}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          {step < totalSteps ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Scale className="mr-2 h-4 w-4" />
                  Get Assessment
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
