import Link from "next/link";
import {
  Scale,
  Clock,
  FileCheck,
  FileText,
  MessageSquare,
  BarChart3,
  Search,
  Shield,
  Home,
  Bot,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DISCLAIMER_TEXT } from "@/lib/constants";

const sidebarItems = [
  { href: "/assessment", icon: Scale, label: "Assessment" },
  { href: "/timeline", icon: Clock, label: "Timeline" },
  { href: "/documents", icon: FileCheck, label: "Documents" },
  { href: "/forms", icon: FileText, label: "Forms" },
  { href: "/rfe", icon: MessageSquare, label: "RFE Response" },
  { href: "/tracker", icon: Search, label: "Case Tracker" },
  { href: "/advisor", icon: Bot, label: "AI Advisor" },
  { href: "/processing-times", icon: BarChart3, label: "Processing Times" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Shield className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold">VisaPath</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link href="/">
            <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
              <Home className="h-4 w-4" />
              Home
            </div>
          </Link>
          <Separator className="my-2" />
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <div className="rounded-md bg-yellow-50 p-3">
            <p className="text-xs text-yellow-700 leading-relaxed">
              <strong>Disclaimer:</strong> This is not legal advice. Consult an
              immigration attorney.
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex md:hidden h-14 items-center gap-4 border-b px-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">VisaPath</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Bottom disclaimer on all dashboard pages */}
        <footer className="border-t px-6 py-3">
          <p className="text-xs text-muted-foreground text-center">
            {DISCLAIMER_TEXT}
          </p>
        </footer>
      </div>
    </div>
  );
}
