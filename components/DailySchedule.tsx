'use client';

import { Task } from '@/lib/types';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';

interface DailyScheduleProps {
    tasks: Task[];
    currentTime: string;
}

export default function DailySchedule({ tasks, currentTime }: DailyScheduleProps) {
    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="glass-card">
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-xs)'
                }}>
                    <Calendar size={24} color="var(--accent-primary)" />
                    Today's Schedule
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-md)' }}>
                    {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-xs)'
                    }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Progress
                        </span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {completedCount} / {totalCount} tasks
                        </span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '8px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progressPercentage}%`,
                            height: '100%',
                            background: 'var(--gradient-success)',
                            transition: 'width var(--transition-normal)',
                            borderRadius: '4px'
                        }} />
                    </div>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: 'var(--spacing-xl)',
                    color: 'var(--text-tertiary)'
                }}>
                    <Circle size={48} style={{ margin: '0 auto var(--spacing-md)' }} />
                    <p style={{ marginBottom: 0 }}>No tasks scheduled for today.</p>
                    <p style={{ fontSize: '0.9rem', marginBottom: 0 }}>Click "Add Task" to get started!</p>
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    {/* Timeline */}
                    <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: '10px',
                        bottom: '10px',
                        width: '2px',
                        background: 'var(--border-color)'
                    }} />

                    {tasks.map((task, index) => {
                        const isCurrentTask = !task.completed &&
                            (index === 0 || tasks[index - 1].completed);

                        return (
                            <div
                                key={task.id}
                                style={{
                                    position: 'relative',
                                    paddingLeft: '50px',
                                    marginBottom: index < tasks.length - 1 ? 'var(--spacing-lg)' : 0
                                }}
                            >
                                {/* Timeline dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: '11px',
                                    top: '5px',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: task.completed
                                        ? 'var(--accent-success)'
                                        : isCurrentTask
                                            ? 'var(--accent-primary)'
                                            : 'var(--bg-tertiary)',
                                    border: `2px solid ${task.completed ? 'var(--accent-success)' : 'var(--border-color)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 1
                                }}>
                                    {task.completed && <CheckCircle2 size={12} color="white" />}
                                </div>

                                <div style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: task.completed ? 'var(--accent-success)' : 'var(--accent-primary)',
                                    marginBottom: 'var(--spacing-xs)'
                                }}>
                                    {task.scheduledTime}
                                </div>

                                <div style={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    marginBottom: task.description ? 'var(--spacing-xs)' : 0
                                }}>
                                    {task.title}
                                </div>

                                {task.description && (
                                    <div style={{
                                        fontSize: '0.85rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {task.description}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
