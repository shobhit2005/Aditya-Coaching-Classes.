
export type UserRole = 'student' | 'ops';

export interface ScoreEntry {
  subject: string;
  marks: number;
}

export interface ScoreCard {
  studentId: string;
  scores: ScoreEntry[];
  uploadedAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  subjects: string[];
  months: string[];
  totalAmount: number;
  transactionId: string;
  status: 'pending' | 'acknowledged';
  submittedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'student';
  registeredAt: string;
  feedback?: string;
  parentsName?: string;
  address?: string;
  schoolName?: string;
  altPhone?: string;
  profilePhoto?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  degree: string;
  experience: string;
  image: string;
}

export interface Performer {
  id: string;
  name: string;
  achievement: string;
  photo: string;
}

export interface Advertisement {
  id: string;
  title: string;
  image: string;
  description: string;
  active: boolean;
}

export interface Notice {
  id: string;
  content: string;
  date: string;
}

export interface SkipRecord {
  date: string;
  reason: 'General Leave' | 'Sick Leave' | 'Bunk' | 'Other';
  comment?: string;
}

export interface AttendanceRecord {
  studentId: string;
  month: string;
  totalWorkingDays: number;
  attendedDays: number;
  skips: SkipRecord[];
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  dates: string[];
  reason: string;
  parentTalked: boolean;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface CallbackRequest {
  id: string;
  name: string;
  phone: string;
  status: string;
  submittedAt: string;
}

export interface FreeTrialLead {
  id: string;
  name: string;
  phone: string;
  trialDate: string;
  status: string;
  submittedAt: string;
}

export interface WebsiteFeedback {
  id: string;
  name: string;
  phone: string;
  feedback: string;
  status: string;
  called: boolean;
  submittedAt: string;
}

export interface AppState {
  students: Student[];
  faculty: FacultyMember[];
  payments: Payment[];
  scoreCards: ScoreCard[];
  notices: Notice[];
  bestPerformers: Performer[];
  advertisements: Advertisement[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  callbackRequests: CallbackRequest[];
  freeTrialLeads: FreeTrialLead[];
  websiteFeedbacks: WebsiteFeedback[];
  currentUser: Student | null;
  isOpsLoggedIn: boolean;
}
