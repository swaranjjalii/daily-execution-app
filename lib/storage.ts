import { format, parseISO, isToday, differenceInDays, startOfDay } from 'date-fns';
import { Task, UserData, DailyRecord, Achievement, ACHIEVEMENT_MILESTONES } from './types';

const STORAGE_KEY = 'daily-execution-data';

// Initialize default user data
const getDefaultUserData = (): UserData => ({
    currentStreak: 0,
    longestStreak: 0,
    lastVisitDate: format(new Date(), 'yyyy-MM-dd'),
    achievements: ACHIEVEMENT_MILESTONES.map(m => ({
        ...m,
        unlocked: false,
    })),
    dailyRecords: [],
    tasks: [],
});

// Get user data from localStorage
export const getUserData = (): UserData => {
    if (typeof window === 'undefined') return getDefaultUserData();

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        const defaultData = getDefaultUserData();
        saveUserData(defaultData);
        return defaultData;
    }

    return JSON.parse(stored);
};

// Save user data to localStorage
export const saveUserData = (data: UserData): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Get today's date in YYYY-MM-DD format
export const getTodayString = (): string => {
    return format(new Date(), 'yyyy-MM-dd');
};

// Check if user visited today and update streak
export const checkDailyVisit = (): UserData => {
    const data = getUserData();
    const today = getTodayString();

    if (data.lastVisitDate === today) {
        return data; // Already visited today
    }

    const lastVisit = parseISO(data.lastVisitDate);
    const todayDate = startOfDay(new Date());
    const daysDiff = differenceInDays(todayDate, startOfDay(lastVisit));

    // If more than 1 day has passed, check if yesterday's tasks were completed
    if (daysDiff > 1) {
        // Missed a day - reset streak
        data.currentStreak = 0;
    } else if (daysDiff === 1) {
        // Check if yesterday's tasks were all completed
        const yesterdayRecord = data.dailyRecords.find(r => r.date === data.lastVisitDate);
        if (yesterdayRecord && !yesterdayRecord.allTasksCompleted && yesterdayRecord.totalTasks > 0) {
            // Had tasks but didn't complete all - reset streak
            data.currentStreak = 0;
        }
    }

    data.lastVisitDate = today;
    saveUserData(data);
    return data;
};

// Get tasks for a specific date
export const getTasksForDate = (date: string): Task[] => {
    const data = getUserData();
    return data.tasks.filter(task => task.date === date).sort((a, b) =>
        a.scheduledTime.localeCompare(b.scheduledTime)
    );
};

// Get today's tasks
export const getTodayTasks = (): Task[] => {
    return getTasksForDate(getTodayString());
};

// Get all tasks (for sheet view)
export const getAllTasks = (): Task[] => {
    const data = getUserData();
    return data.tasks.sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return a.scheduledTime.localeCompare(b.scheduledTime);
    });
};

// Add a new task
export const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>): Task => {
    const data = getUserData();
    const newTask: Task = {
        ...task,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        completed: false,
    };

    data.tasks.push(newTask);
    saveUserData(data);
    return newTask;
};

// Update a task
export const updateTask = (taskId: string, updates: Partial<Task>): void => {
    const data = getUserData();
    const taskIndex = data.tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates };
        saveUserData(data);
    }
};

// Delete a task
export const deleteTask = (taskId: string): void => {
    const data = getUserData();
    data.tasks = data.tasks.filter(t => t.id !== taskId);
    saveUserData(data);
};

// Complete a task with proof
export const completeTask = (taskId: string, proof: string): void => {
    const data = getUserData();
    const task = data.tasks.find(t => t.id === taskId);

    if (task) {
        task.completed = true;
        task.completionProof = proof;
        task.completedAt = new Date().toISOString();

        // Check if all today's tasks are completed
        checkDailyCompletion();
        saveUserData(data);
    }
};

// Check if all today's tasks are completed and update streak
export const checkDailyCompletion = (): void => {
    const data = getUserData();
    const today = getTodayString();
    const todayTasks = getTasksForDate(today);

    if (todayTasks.length === 0) return;

    const allCompleted = todayTasks.every(task => task.completed);
    const completedCount = todayTasks.filter(task => task.completed).length;

    // Update or create today's record
    let todayRecord = data.dailyRecords.find(r => r.date === today);
    if (!todayRecord) {
        todayRecord = {
            date: today,
            tasksCompleted: completedCount,
            totalTasks: todayTasks.length,
            allTasksCompleted: allCompleted,
            visited: true,
        };
        data.dailyRecords.push(todayRecord);
    } else {
        todayRecord.tasksCompleted = completedCount;
        todayRecord.totalTasks = todayTasks.length;
        todayRecord.allTasksCompleted = allCompleted;
    }

    // If all tasks completed, increment streak
    if (allCompleted) {
        data.currentStreak += 1;
        if (data.currentStreak > data.longestStreak) {
            data.longestStreak = data.currentStreak;
        }

        // Check for achievement unlocks
        checkAchievements(data);
    }

    saveUserData(data);
};

// Check and unlock achievements
const checkAchievements = (data: UserData): void => {
    data.achievements.forEach(achievement => {
        if (!achievement.unlocked && data.currentStreak >= achievement.daysRequired) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
        }
    });
};

// Get current streak
export const getCurrentStreak = (): number => {
    const data = getUserData();
    return data.currentStreak;
};

// Get achievements
export const getAchievements = (): Achievement[] => {
    const data = getUserData();
    return data.achievements;
};

// Get daily records
export const getDailyRecords = (): DailyRecord[] => {
    const data = getUserData();
    return data.dailyRecords;
};
