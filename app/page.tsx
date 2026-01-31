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

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [completingTask, setCompletingTask] = useState<Task | null>(null);
  const [editingNotesTask, setEditingNotesTask] = useState<Task | null>(null);
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

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Navbar with Achievements */}
      <header style={{
        padding: 'var(--spacing-md) var(--spacing-lg)',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(10, 14, 23, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <Target size={28} color="var(--accent-primary)" />
            <h1 style={{ marginBottom: 0, fontSize: '1.5rem' }}>Daily Execution</h1>
          </div>

          {/* Achievement Badges in Navbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            flex: 1,
            justifyContent: 'center',
            maxWidth: '600px'
          }}>
            <Trophy size={20} color="var(--accent-warning)" />
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
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

          {/* Add Task Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div style={{
        display: 'flex',
        flex: 1,
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Sidebar with Streak */}
        <aside style={{
          width: '280px',
          minWidth: '280px',
          padding: 'var(--spacing-lg)',
          borderRight: '1px solid var(--border-color)',
          background: 'rgba(19, 24, 36, 0.5)',
          position: 'sticky',
          top: '70px',
          height: 'calc(100vh - 70px)',
          overflowY: 'auto'
        }}>
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
        <main style={{
          flex: 1,
          padding: 'var(--spacing-xl) var(--spacing-lg)',
          overflowY: 'auto'
        }}>
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
    </div>
  );
}
