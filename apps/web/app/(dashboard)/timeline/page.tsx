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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Calendar,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { VISA_TYPES, type VisaTypeKey } from "@/lib/constants";

interface Milestone {
  id: string;
  title: string;
  description: string;
  estimatedDate: string;
  status: "completed" | "current" | "upcoming" | "warning";
  durationWeeks: number;
  tips: string[];
}

const TIMELINE_DATA: Record<string, Milestone[]> = {
  h1b: [
    {
      id: "1",
      title: "USCIS Registration Period",
      description: "Employer registers for H-1B lottery during annual registration window.",
      estimatedDate: "March 1-18",
      status: "completed",
      durationWeeks: 3,
      tips: ["Employer must have active USCIS account", "Registration fee: $10 per registration"],
    },
    {
      id: "2",
      title: "Lottery Selection",
      description: "USCIS conducts random selection from registered applicants.",
      estimatedDate: "Late March",
      status: "completed",
      durationWeeks: 2,
      tips: ["Selection is random — no way to improve odds", "Master's cap offers second chance if not selected in regular cap"],
    },
    {
      id: "3",
      title: "Petition Filing",
      description: "File Form I-129 with supporting documents if selected in lottery.",
      estimatedDate: "April 1 - June 30",
      status: "current",
      durationWeeks: 12,
      tips: ["Gather LCA, degree evaluations, and specialty occupation evidence", "Premium processing available ($2,805)"],
    },
    {
      id: "4",
      title: "USCIS Review",
      description: "USCIS adjudicates the H-1B petition.",
      estimatedDate: "Varies (2-8 months)",
      status: "upcoming",
      durationWeeks: 20,
      tips: ["RFE possible — respond within 60-87 days", "Check processing times at USCIS website"],
    },
    {
      id: "5",
      title: "Approval & Start Date",
      description: "If approved, H-1B status begins October 1.",
      estimatedDate: "October 1",
      status: "upcoming",
      durationWeeks: 0,
      tips: ["Can begin work on October 1 (or approval date for cap-exempt)", "I-94 shows authorized status period"],
    },
  ],
  i485: [
    {
      id: "1",
      title: "Priority Date Current",
      description: "Wait for your priority date to become current in the Visa Bulletin.",
      estimatedDate: "Varies by country",
      status: "current",
      durationWeeks: 52,
      tips: ["Check monthly Visa Bulletin", "India/China EB-2/3 can have multi-year waits"],
    },
    {
      id: "2",
      title: "File I-485 Package",
      description: "Submit I-485 with I-765 (EAD), I-131 (AP), medical exam, and supporting docs.",
      estimatedDate: "When priority date is current",
      status: "upcoming",
      durationWeeks: 2,
      tips: ["Include civil surgeon medical exam (I-693)", "File I-765 and I-131 concurrently to get EAD/AP while waiting"],
    },
    {
      id: "3",
      title: "Biometrics Appointment",
      description: "USCIS schedules fingerprinting and photo appointment.",
      estimatedDate: "4-8 weeks after filing",
      status: "upcoming",
      durationWeeks: 6,
      tips: ["Bring I-797C notice and valid ID", "Cannot be rescheduled easily"],
    },
    {
      id: "4",
      title: "EAD / Advance Parole",
      description: "Receive Employment Authorization Document and travel document.",
      estimatedDate: "3-8 months after filing",
      status: "upcoming",
      durationWeeks: 24,
      tips: ["Combo card (EAD + AP) is common now", "Do not travel without AP if on AOS"],
    },
    {
      id: "5",
      title: "Interview (if required)",
      description: "USCIS may schedule an in-person interview at local field office.",
      estimatedDate: "Varies",
      status: "upcoming",
      durationWeeks: 12,
      tips: ["Bring all original documents", "Employer-sponsored cases may have interview waived"],
    },
    {
      id: "6",
      title: "Decision",
      description: "USCIS issues approval, denial, or RFE.",
      estimatedDate: "8-24 months total",
      status: "upcoming",
      durationWeeks: 0,
      tips: ["Green card mailed within 2-3 weeks of approval", "Conditional GC if married less than 2 years"],
    },
  ],
  marriage_gc: [
    {
      id: "1",
      title: "File I-130 + I-485",
      description: "File Petition for Alien Relative and Adjustment of Status concurrently (if in US).",
      estimatedDate: "ASAP",
      status: "current",
      durationWeeks: 2,
      tips: ["Include I-864 Affidavit of Support", "Bona fide marriage evidence is critical"],
    },
    {
      id: "2",
      title: "Biometrics",
      description: "USCIS schedules biometrics appointment.",
      estimatedDate: "4-8 weeks",
      status: "upcoming",
      durationWeeks: 6,
      tips: ["Both petitioner and beneficiary attend"],
    },
    {
      id: "3",
      title: "EAD / AP Issued",
      description: "Work permit and travel document while case is pending.",
      estimatedDate: "3-6 months",
      status: "upcoming",
      durationWeeks: 16,
      tips: ["Apply for combo card with I-485"],
    },
    {
      id: "4",
      title: "Interview",
      description: "In-person interview at USCIS field office.",
      estimatedDate: "8-18 months",
      status: "upcoming",
      durationWeeks: 40,
      tips: ["Both spouses must attend", "Bring comprehensive bona fide marriage evidence"],
    },
    {
      id: "5",
      title: "Decision",
      description: "Approval of green card (conditional if married < 2 years).",
      estimatedDate: "Same day or 1-2 weeks after interview",
      status: "upcoming",
      durationWeeks: 1,
      tips: ["File I-751 to remove conditions before expiry"],
    },
  ],
};

export default function TimelinePage() {
  const [selectedVisa, setSelectedVisa] = useState<string>("h1b");
  const [isEstimating, setIsEstimating] = useState(false);

  const milestones = TIMELINE_DATA[selectedVisa] || TIMELINE_DATA.h1b;
  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const overallProgress = Math.round((completedCount / milestones.length) * 100);

  async function handleEstimate() {
    setIsEstimating(true);
    // In production, this calls the AI timeline estimator
    await new Promise((r) => setTimeout(r, 1500));
    setIsEstimating(false);
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Clock className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Case Timeline</h1>
        </div>
        <p className="text-muted-foreground">
          Track milestones and estimated processing times for your immigration case.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Select value={selectedVisa} onValueChange={setSelectedVisa}>
            <SelectTrigger>
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
        <Button onClick={handleEstimate} disabled={isEstimating}>
          {isEstimating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Estimating...
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              AI Estimate
            </>
          )}
        </Button>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {completedCount} of {milestones.length} milestones completed for{" "}
            {VISA_TYPES[selectedVisa as VisaTypeKey]?.name || selectedVisa}
          </p>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {milestones.map((milestone, idx) => (
            <div key={milestone.id} className="relative flex gap-4">
              {/* Icon */}
              <div className="relative z-10 shrink-0">
                {milestone.status === "completed" ? (
                  <CheckCircle2 className="h-10 w-10 text-green-600 bg-white rounded-full" />
                ) : milestone.status === "current" ? (
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                ) : milestone.status === "warning" ? (
                  <AlertCircle className="h-10 w-10 text-yellow-500 bg-white rounded-full" />
                ) : (
                  <Circle className="h-10 w-10 text-muted-foreground bg-white rounded-full" />
                )}
              </div>

              {/* Content */}
              <Card className={`flex-1 ${milestone.status === "current" ? "border-primary shadow-md" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{milestone.title}</CardTitle>
                    <Badge
                      variant={
                        milestone.status === "completed"
                          ? "success"
                          : milestone.status === "current"
                            ? "default"
                            : milestone.status === "warning"
                              ? "warning"
                              : "secondary"
                      }
                    >
                      {milestone.status === "completed"
                        ? "Completed"
                        : milestone.status === "current"
                          ? "In Progress"
                          : milestone.status === "warning"
                            ? "Attention"
                            : "Upcoming"}
                    </Badge>
                  </div>
                  <CardDescription>{milestone.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {milestone.estimatedDate}
                      </span>
                    </div>
                    {milestone.durationWeeks > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          ~{milestone.durationWeeks} weeks
                        </span>
                      </div>
                    )}
                  </div>
                  {milestone.tips.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">
                          Tips
                        </h4>
                        <ul className="space-y-1">
                          {milestone.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary mt-1">&#8226;</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
