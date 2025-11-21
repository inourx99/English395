export enum GradeLevel {
  GRADE_4 = 'الرابع',
  GRADE_6 = 'السادس',
}

export enum ActivityType {
  PROJECT = 'PROJECT',
  WORKSHEET = 'WORKSHEET',
  LESSON_EXPLANATION = 'LESSON_EXPLANATION',
  STRATEGY = 'STRATEGY',
  RESEARCH = 'RESEARCH',
}

export interface PointLog {
  id: string;
  activityType: ActivityType;
  timestamp: number;
  points: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  timestamp: number;
}

export interface Student {
  id: string;
  name: string;
  grade: GradeLevel;
  totalPoints: number;
  logs: PointLog[];
  projects: Project[];
  hasWon: boolean;
}

export const ACTIVITY_POINTS: Record<ActivityType, number> = {
  [ActivityType.PROJECT]: 2,
  [ActivityType.WORKSHEET]: 1,
  [ActivityType.LESSON_EXPLANATION]: 1,
  [ActivityType.STRATEGY]: 1,
  [ActivityType.RESEARCH]: 1,
};

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  [ActivityType.PROJECT]: 'مشروع (نقطتان)',
  [ActivityType.WORKSHEET]: 'ورقة عمل (نقطة)',
  [ActivityType.LESSON_EXPLANATION]: 'شرح درس (نقطة)',
  [ActivityType.STRATEGY]: 'استراتيجية درس (نقطة)',
  [ActivityType.RESEARCH]: 'بحث (نقطة)',
};

export const WINNING_SCORE = 100;