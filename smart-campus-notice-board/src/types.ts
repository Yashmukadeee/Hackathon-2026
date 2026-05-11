export type UserRole = "Student" | "Faculty" | "DeptAdmin" | "SuperAdmin";
export type NoticeCategory = "Academic" | "Event" | "Administrative" | "General";
export type UrgencyLevel = "Critical" | "Important" | "Normal" | "Info";

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
