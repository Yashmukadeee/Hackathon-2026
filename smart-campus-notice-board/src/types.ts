export type UserRole = "Student" | "Faculty" | "DeptAdmin" | "SuperAdmin" | "Publisher";
export type NoticeCategory = "Academic" | "Event" | "Administrative" | "General";
export type UrgencyLevel = "Critical" | "Important" | "Normal" | "Info";

export interface NoticeLink {
  label: string;
  url: string;
}

export interface NoticePoll {
  question: string;
  options: { id: string; text: string; votes: number }[];
}

export interface CampusNotice {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: NoticeCategory;
  urgency: UrgencyLevel;
  author_id: string;
  author_name: string;
  department?: string;
  links?: NoticeLink[];
  poll?: NoticePoll;
  is_survey?: boolean;
  created_at: string;
  updated_at?: string;
  expiry_date?: string;
}

export interface CampusUser {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  department?: string;
  year?: string;
}
