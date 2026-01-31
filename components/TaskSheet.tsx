'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { CheckCircle2, Circle, Calendar, StickyNote } from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';

interface TaskSheetProps {
    allTasks: Task[];
    onCompleteTask: (task: Task) => void;
    onAddNotes: (task: Task) => void;
}

export default function TaskSheet({ allTasks, onCompleteTask, onAddNotes }: TaskSheetProps) {
    // Get unique task titles (the "rows" of our sheet)
    const uniqueTitles = [...new Set(allTasks.map(t => t.title))];

    // Get the last 7 days including today (the "columns")
    const today = new Date();
    const dates: string[] = [];
    for (let i = 6; i >= 0; i--) {
        dates.push(format(subDays(today, i), 'yyyy-MM-dd'));
    }

    // Helper to find a task by title and date
    const getTask = (title: string, date: string): Task | undefined => {
        return allTasks.find(t => t.title === title && t.date === date);
    };

    // Helper to format date for display
    const formatDateHeader = (dateStr: string) => {
        const date = parseISO(dateStr);
        const isToday = format(today, 'yyyy-MM-dd') === dateStr;
        return {
            day: format(date, 'EEE'),
            date: format(date, 'd'),
            month: format(date, 'MMM'),
            isToday
        };
    };

    if (uniqueTitles.length === 0) {
        return (
            <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                <Calendar size={48} color="var(--text-tertiary)" style={{ margin: '0 auto var(--spacing-md)' }} />
                <h3 style={{ color: 'var(--text-secondary)' }}>No tasks in your sheet yet</h3>
                <p style={{ color: 'var(--text-tertiary)', marginBottom: 0 }}>
                    Add tasks to see them appear here across all days
                </p>
            </div>
        );
    }

    return (
        <div className="glass-card" style={{ padding: 'var(--spacing-lg)', overflow: 'auto' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-lg)',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: 'var(--spacing-md)'
            }}>
                <Calendar size={24} color="var(--accent-primary)" />
                <h3 style={{ marginBottom: 0 }}>Weekly Execution Sheet</h3>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                    <StickyNote size={14} />
                    <span>Click cell to add notes</span>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '800px'
                }}>
                    <thead>
                        <tr>
                            <th style={{
                                textAlign: 'left',
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                borderBottom: '2px solid var(--border-color)',
                                color: 'var(--text-secondary)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                minWidth: '180px'
                            }}>
                                Task
                            </th>
                            {dates.map(date => {
                                const { day, date: dateNum, month, isToday } = formatDateHeader(date);
                                return (
                                    <th
                                        key={date}
                                        style={{
                                            textAlign: 'center',
                                            padding: 'var(--spacing-sm)',
                                            borderBottom: '2px solid var(--border-color)',
                                            background: isToday ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                            borderRadius: isToday ? 'var(--radius-sm) var(--radius-sm) 0 0' : 0,
                                            minWidth: '90px'
                                        }}
                                    >
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: isToday ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                                            fontWeight: 500
                                        }}>
                                            {day}
                                        </div>
                                        <div style={{
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            color: isToday ? 'var(--accent-primary)' : 'var(--text-primary)'
                                        }}>
                                            {dateNum}
                                        </div>
                                        <div style={{
                                            fontSize: '0.7rem',
                                            color: 'var(--text-tertiary)'
                                        }}>
                                            {month}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {uniqueTitles.map((title) => (
                            <tr key={title}>
                                <td style={{
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    borderBottom: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    fontWeight: 500,
                                    fontSize: '0.9rem'
                                }}>
                                    {title}
                                </td>
                                {dates.map(date => {
                                    const task = getTask(title, date);
                                    const isToday = format(today, 'yyyy-MM-dd') === date;
                                    const hasNotes = task?.notes && task.notes.trim().length > 0;

                                    return (
                                        <td
                                            key={date}
                                            style={{
                                                textAlign: 'center',
                                                padding: 'var(--spacing-xs)',
                                                borderBottom: '1px solid var(--border-color)',
                                                background: isToday ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                                                position: 'relative'
                                            }}
                                        >
                                            {task ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                                    {/* Completion Button */}
                                                    <button
                                                        onClick={() => !task.completed && isToday && onCompleteTask(task)}
                                                        disabled={task.completed || !isToday}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: task.completed || !isToday ? 'default' : 'pointer',
                                                            padding: '4px',
                                                            borderRadius: '50%',
                                                            transition: 'all var(--transition-fast)',
                                                            opacity: task.completed ? 1 : (isToday ? 1 : 0.5)
                                                        }}
                                                        title={task.completed ? `Completed: ${task.completionProof}` : (isToday ? 'Click to complete' : 'Past date')}
                                                    >
                                                        {task.completed ? (
                                                            <CheckCircle2 size={22} color="var(--accent-success)" />
                                                        ) : (
                                                            <Circle size={22} color={isToday ? 'var(--accent-primary)' : 'var(--text-tertiary)'} />
                                                        )}
                                                    </button>

                                                    {/* Notes Button */}
                                                    <button
                                                        onClick={() => onAddNotes(task)}
                                                        style={{
                                                            background: hasNotes ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                                                            border: `1px solid ${hasNotes ? 'var(--accent-warning)' : 'var(--border-color)'}`,
                                                            borderRadius: 'var(--radius-sm)',
                                                            padding: '2px 6px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '2px',
                                                            transition: 'all var(--transition-fast)'
                                                        }}
                                                        title={hasNotes ? task.notes : 'Add notes'}
                                                    >
                                                        <StickyNote size={12} color={hasNotes ? 'var(--accent-warning)' : 'var(--text-tertiary)'} />
                                                        {hasNotes && (
                                                            <span style={{ fontSize: '0.65rem', color: 'var(--accent-warning)' }}>✓</span>
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>—</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{
                marginTop: 'var(--spacing-lg)',
                display: 'flex',
                gap: 'var(--spacing-lg)',
                fontSize: '0.85rem',
                color: 'var(--text-tertiary)',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <CheckCircle2 size={16} color="var(--accent-success)" />
                    <span>Completed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <Circle size={16} color="var(--accent-primary)" />
                    <span>Pending (Today)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <Circle size={16} color="var(--text-tertiary)" />
                    <span>Missed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <StickyNote size={16} color="var(--accent-warning)" />
                    <span>Has Notes</span>
                </div>
            </div>
        </div>
    );
}
