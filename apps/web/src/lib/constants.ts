export const VISA_TYPES = {
  "h1b": { name: "H-1B", category: "Work", description: "Specialty Occupation Worker" },
  "h4": { name: "H-4", category: "Dependent", description: "Dependent of H-1B Holder" },
  "l1a": { name: "L-1A", category: "Work", description: "Intracompany Transferee (Manager/Executive)" },
  "l1b": { name: "L-1B", category: "Work", description: "Intracompany Transferee (Specialized Knowledge)" },
  "o1a": { name: "O-1A", category: "Work", description: "Extraordinary Ability (Sciences/Business/Education)" },
  "o1b": { name: "O-1B", category: "Work", description: "Extraordinary Ability (Arts)" },
  "eb1a": { name: "EB-1A", category: "Green Card", description: "Extraordinary Ability" },
  "eb1b": { name: "EB-1B", category: "Green Card", description: "Outstanding Professor/Researcher" },
  "eb1c": { name: "EB-1C", category: "Green Card", description: "Multinational Manager/Executive" },
  "eb2": { name: "EB-2", category: "Green Card", description: "Advanced Degree / Exceptional Ability" },
  "eb2niw": { name: "EB-2 NIW", category: "Green Card", description: "National Interest Waiver" },
  "eb3": { name: "EB-3", category: "Green Card", description: "Skilled Worker / Professional" },
  "perm": { name: "PERM", category: "Green Card", description: "Labor Certification" },
  "i140": { name: "I-140", category: "Green Card", description: "Immigrant Petition for Alien Workers" },
  "i485": { name: "I-485", category: "Green Card", description: "Adjustment of Status" },
  "f1": { name: "F-1", category: "Student", description: "Academic Student" },
  "opt": { name: "OPT", category: "Student", description: "Optional Practical Training" },
  "stem_opt": { name: "STEM OPT", category: "Student", description: "STEM OPT Extension" },
  "tn": { name: "TN", category: "Work", description: "NAFTA Professional" },
  "e2": { name: "E-2", category: "Work", description: "Treaty Investor" },
  "marriage_gc": { name: "Marriage-Based GC", category: "Family", description: "Marriage-Based Green Card" },
} as const;

export type VisaTypeKey = keyof typeof VISA_TYPES;

export const CASE_STATUSES = [
  "intake",
  "document_collection",
  "form_preparation",
  "review",
  "filed",
  "rfe_received",
  "rfe_responded",
  "approved",
  "denied",
  "withdrawn",
] as const;

export type CaseStatus = (typeof CASE_STATUSES)[number];

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  intake: "Intake",
  document_collection: "Collecting Documents",
  form_preparation: "Preparing Forms",
  review: "Under Review",
  filed: "Filed with USCIS",
  rfe_received: "RFE Received",
  rfe_responded: "RFE Responded",
  approved: "Approved",
  denied: "Denied",
  withdrawn: "Withdrawn",
};

export const CASE_STATUS_COLORS: Record<CaseStatus, string> = {
  intake: "bg-gray-100 text-gray-800",
  document_collection: "bg-blue-100 text-blue-800",
  form_preparation: "bg-indigo-100 text-indigo-800",
  review: "bg-yellow-100 text-yellow-800",
  filed: "bg-purple-100 text-purple-800",
  rfe_received: "bg-orange-100 text-orange-800",
  rfe_responded: "bg-cyan-100 text-cyan-800",
  approved: "bg-green-100 text-green-800",
  denied: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-500",
};

export const FORM_TYPES = [
  { id: "i-130", name: "I-130", title: "Petition for Alien Relative" },
  { id: "i-140", name: "I-140", title: "Immigrant Petition for Alien Workers" },
  { id: "i-485", name: "I-485", title: "Application to Register Permanent Residence (AOS)" },
  { id: "i-765", name: "I-765", title: "Application for Employment Authorization" },
  { id: "i-131", name: "I-131", title: "Application for Travel Document" },
  { id: "i-129", name: "I-129", title: "Petition for Nonimmigrant Worker" },
  { id: "i-539", name: "I-539", title: "Application to Extend/Change Nonimmigrant Status" },
  { id: "i-20", name: "I-20", title: "Certificate of Eligibility" },
  { id: "i-983", name: "I-983", title: "Training Plan for STEM OPT Students" },
  { id: "ds-160", name: "DS-160", title: "Online Nonimmigrant Visa Application" },
  { id: "g-28", name: "G-28", title: "Notice of Entry of Appearance as Attorney" },
] as const;

export const DISCLAIMER_TEXT =
  "VisaPath provides informational tools only and does not constitute legal advice. " +
  "Immigration law is complex and fact-specific. Always consult a licensed immigration " +
  "attorney before making decisions about your case. VisaPath is not a law firm and " +
  "does not provide legal representation. Use of this platform does not create an " +
  "attorney-client relationship.";
