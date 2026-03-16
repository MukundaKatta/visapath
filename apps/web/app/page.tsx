import Link from "next/link";
import {
  FileCheck,
  Scale,
  Clock,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DISCLAIMER_TEXT } from "@/lib/constants";

const features = [
  {
    icon: Scale,
    title: "Visa Eligibility Assessment",
    description:
      "Answer guided questions and get an AI-powered assessment of which visa categories you may qualify for.",
    href: "/assessment",
  },
  {
    icon: Clock,
    title: "Case Timeline",
    description:
      "Track milestones, estimated processing times, and key dates for your immigration case.",
    href: "/timeline",
  },
  {
    icon: FileCheck,
    title: "Document Checklist",
    description:
      "AI-generated document checklists tailored to your visa type with upload tracking.",
    href: "/documents",
  },
  {
    icon: FileText,
    title: "AI Form Pre-Fill",
    description:
      "Automatically pre-fill immigration forms (I-140, I-485, I-130, etc.) with your case data.",
    href: "/forms",
  },
  {
    icon: MessageSquare,
    title: "RFE Response Generator",
    description:
      "Generate draft responses to Requests for Evidence using AI analysis of your case.",
    href: "/rfe",
  },
  {
    icon: BarChart3,
    title: "Processing Times",
    description:
      "Real-time processing time data from USCIS service centers across all form types.",
    href: "/processing-times",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">VisaPath</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/assessment" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Assessment
            </Link>
            <Link href="/advisor" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              AI Advisor
            </Link>
            <Link href="/processing-times" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Processing Times
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
            <Shield className="mr-2 h-4 w-4 text-primary" />
            AI-Powered Immigration Navigation
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Navigate Your Immigration
            <span className="text-primary"> Journey with Confidence</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            VisaPath uses AI to help you assess visa eligibility, prepare forms,
            track your case, and respond to RFEs. Built for applicants and
            immigration attorneys.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/assessment">
                Start Free Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/advisor">Talk to AI Advisor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything You Need for Your Immigration Case
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Comprehensive tools powered by AI and the latest USCIS regulations.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Supported Visa Types */}
      <section className="border-t bg-muted/50 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8 text-3xl font-bold tracking-tight">
            Supported Visa Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "H-1B",
              "H-4",
              "L-1",
              "O-1",
              "EB-1",
              "EB-2",
              "EB-2 NIW",
              "EB-3",
              "PERM",
              "I-140",
              "I-485 (AOS)",
              "F-1 / OPT",
              "STEM OPT",
              "TN",
              "E-2",
              "Marriage GC",
            ].map((visa) => (
              <span
                key={visa}
                className="inline-flex items-center rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm"
              >
                {visa}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 text-yellow-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Important Legal Disclaimer
                </p>
                <p className="mt-1 text-sm text-yellow-700">
                  {DISCLAIMER_TEXT}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold">VisaPath</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} VisaPath. Not a law firm. Not legal advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
