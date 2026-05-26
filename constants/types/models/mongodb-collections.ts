import { Iso8601DateTimeFormat } from "../utilTypes";

export enum JobPostingTags {
  HYBRID = "hybrid",
  ONSITE = "onsite",
  REMOTE = "remote",
}

export enum EmploymentType {
  FULL_TIME = "Full Time",
  PART_TIME = "Part Time",
  CONTRACT = "Contract",
  FREELANCE = "Freelance",
  INTERNSHIP = "Internship",
}

export interface ADCampaign {
  start_date: Iso8601DateTimeFormat;
  end_date: Iso8601DateTimeFormat;
  banner_image: string;
  link: string;
  cta_or_caption: string;
}

export interface JobPosting {
  tags: JobPostingTags;
  job_title: string;
  employment_type: EmploymentType;
  location: string;
  date_listed: Iso8601DateTimeFormat;
  dead_line: Iso8601DateTimeFormat;
  closing_date: Iso8601DateTimeFormat;
  job_description: string;
  role_summary: string;
  qualifications: string[];
  skills: string[];
  responsibilities: string[];
  job_category: string;
}

export interface BlogPost {
  title: string;
  content: string; // Content stored as HTML from the RichTextEditor
}
