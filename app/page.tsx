'use client';

import { useEffect, useState } from 'react';
import { Plus, Target, Trophy, Award } from 'lucide-react';
import { Task, Achievement } from '@/lib/types';
import {
  checkDailyVisit,
  getTodayTasks,
  getAllTasks,
  addTask,
  deleteTask,
  completeTask,
  updateTask,
  getCurrentStreak,
  getAchievements,
  getUserData,
} from '@/lib/storage';
import TaskCard from '@/components/TaskCard';
import TaskCompletionModal from '@/components/TaskCompletionModal';
import AddTaskModal from '@/components/AddTaskModal';
import StreakDisplay from '@/components/StreakDisplay';
import DailySchedule from '@/components/DailySchedule';
import TaskSheet from '@/components/TaskSheet';
import NotesModal from '@/components/NotesModal';
import EditTaskModal from '@/components/EditTaskModal';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [completingTask, setCompletingTask] = useState<Task | null>(null);
  const [editingNotesTask, setEditingNotesTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load data on mount
  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = () => {
    // Check daily visit and update streak
    checkDailyVisit();

    // Load all data
    const todayTasks = getTodayTasks();
    const userData = getUserData();

    setTasks(todayTasks);
    setAllTasks(getAllTasks());
    setCurrentStreak(userData.currentStreak);
    setLongestStreak(userData.longestStreak);
    setAchievements(userData.achievements);
  };

  const handleAddTask = (taskData: { title: string; description: string; scheduledTime: string }) => {
    const today = new Date().toISOString().split('T')[0];
    addTask({
      ...taskData,
      date: today,
    });
    loadData();
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      loadData();
    }
  };

  const handleCompleteTask = (task: Task) => {
    setCompletingTask(task);
  };

  const handleSubmitCompletion = (proof: string) => {
    if (completingTask) {
      completeTask(completingTask.id, proof);
      loadData();
      setCompletingTask(null);
    }
  };

  const handleAddNotes = (task: Task) => {
    setEditingNotesTask(task);
  };

  const handleSaveNotes = (notes: string) => {
    if (editingNotesTask) {
      updateTask(editingNotesTask.id, { notes });
      loadData();
      setEditingNotesTask(null);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (taskId: string, updates: { title: string; description: string; scheduledTime: string }) => {
    updateTask(taskId, updates);
    loadData();
    setEditingTask(null);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="app-wrapper">
      {/* Navbar with Achievements */}
      <header className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Target size={28} color="var(--accent-primary)" />
            <h1>Daily Execution</h1>
          </div>

          {/* Achievement Badges in Navbar (Desktop) */}
          <div className="achievement-bar">
            <Trophy size={20} color="var(--accent-warning)" />
            <div className="achievement-list">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  title={`${achievement.name} - ${achievement.daysRequired} days${achievement.unlocked ? ' ✓' : ''}`}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: achievement.unlocked
                      ? 'var(--gradient-primary)'
                      : 'var(--bg-tertiary)',
                    border: `2px solid ${achievement.unlocked ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    opacity: achievement.unlocked ? 1 : 0.5
                  }}
                >
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: achievement.unlocked ? 'white' : 'var(--text-tertiary)'
                  }}>
                    {achievement.daysRequired}
                  </span>
                </div>
              ))}
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {unlockedCount}/{achievements.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            {/* Mobile Streak Display */}
            <div className="mobile-streak" style={{
              display: 'none', // Hidden by default, shown via CSS
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '6px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <div className="fire-icon-small">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f59e0b' }}>
                {currentStreak}
              </span>
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <Plus size={20} />
              <span className="btn-text">Add Task</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="app-container">
        {/* Sidebar with Streak */}
        <aside className="sidebar">
          <StreakDisplay currentStreak={currentStreak} longestStreak={longestStreak} />

          {/* Quick Stats */}
          <div className="glass-card" style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
              Today's Progress
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-success)' }}>
                {tasks.filter(t => t.completed).length}
              </span>
              <span style={{ color: 'var(--text-tertiary)' }}>/</span>
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {tasks.length}
              </span>
            </div>
            <div style={{
              height: '6px',
              background: 'var(--bg-tertiary)',
              borderRadius: '3px',
              marginTop: 'var(--spacing-sm)',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%`,
                background: 'var(--gradient-success)',
                borderRadius: '3px',
                transition: 'width var(--transition-normal)'
              }} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Sheet at the Top */}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <TaskSheet allTasks={allTasks} onCompleteTask={handleCompleteTask} onAddNotes={handleAddNotes} />
          </div>

          {/* Daily Schedule */}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <DailySchedule tasks={tasks} currentTime={new Date().toTimeString().slice(0, 5)} />
          </div>

          {/* Task List */}
          <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--spacing-lg)',
              borderBottom: '1px solid var(--border-color)',
              paddingBottom: 'var(--spacing-md)'
            }}>
              <h2 style={{ marginBottom: 0 }}>Today's Tasks</h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                Tasks recur daily unless deleted
              </div>
            </div>
            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                <Target size={64} color="var(--text-tertiary)" style={{ margin: '0 auto var(--spacing-lg)' }} />
                <h3 style={{ color: 'var(--text-secondary)' }}>No tasks yet</h3>
                <p style={{ marginBottom: 'var(--spacing-lg)' }}>
                  Start planning your day by adding your first task!
                </p>
                <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                  <Plus size={20} />
                  Add Your First Task
                </button>
              </div>
            ) : (
              <div>
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddTaskModal
          onAdd={handleAddTask}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {completingTask && (
        <TaskCompletionModal
          taskTitle={completingTask.title}
          onComplete={handleSubmitCompletion}
          onClose={() => setCompletingTask(null)}
        />
      )}

      {editingNotesTask && (
        <NotesModal
          taskTitle={editingNotesTask.title}
          taskDate={editingNotesTask.date}
          currentNotes={editingNotesTask.notes || ''}
          onSave={handleSaveNotes}
          onClose={() => setEditingNotesTask(null)}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onUpdate={handleUpdateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
