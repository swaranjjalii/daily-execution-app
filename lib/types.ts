export interface Task {
  id: string;
  title: string;
  description: string;
  scheduledTime: string; // HH:mm format
  completed: boolean;
  completionProof?: string;
  completedAt?: string; // ISO date string
  createdAt: string; // ISO date string
  date: string; // YYYY-MM-DD format
  notes?: string; // Daily notes for this task
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  daysRequired: number;
  unlocked: boolean;
  unlockedAt?: string; // ISO date string
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD format
  tasksCompleted: number;
  totalTasks: number;
  allTasksCompleted: boolean;
  visited: boolean;
}

export interface UserData {
  currentStreak: number;
  longestStreak: number;
  lastVisitDate: string; // YYYY-MM-DD format
  achievements: Achievement[];
  dailyRecords: DailyRecord[];
  tasks: Task[];
}

export const ACHIEVEMENT_MILESTONES = [
  { id: 'streak-7', name: '7-Day Warrior', description: 'Complete all tasks for 7 days straight', daysRequired: 7 },
  { id: 'streak-14', name: '2-Week Champion', description: 'Complete all tasks for 14 days straight', daysRequired: 14 },
  { id: 'streak-30', name: 'Monthly Master', description: 'Complete all tasks for 30 days straight', daysRequired: 30 },
  { id: 'streak-60', name: '60-Day Legend', description: 'Complete all tasks for 60 days straight', daysRequired: 60 },
  { id: 'streak-90', name: '90-Day Elite', description: 'Complete all tasks for 90 days straight', daysRequired: 90 },
];
