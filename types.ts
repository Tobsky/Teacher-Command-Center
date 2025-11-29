export interface ClassGroup {
  id: string;
  name: string;
  section: string;
  schedule: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  classId: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  maxPoints: number;
  date: string;
}

export interface Grade {
  studentId: string;
  assignmentId: string;
  score: number;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  date: string;
  classId: string;
  studentId: string;
  status: AttendanceStatus;
}

export interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  tags: string[];
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CLASSES = 'CLASSES',
  ATTENDANCE = 'ATTENDANCE',
  GRADEBOOK = 'GRADEBOOK',
  SNIPPETS = 'SNIPPETS',
  FEEDBACK = 'FEEDBACK'
}