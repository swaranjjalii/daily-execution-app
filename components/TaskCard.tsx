'use client';

import { Task } from '@/lib/types';
import { Clock, CheckCircle2, Trash2, Circle, Pencil } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
    task: Task;
    onComplete: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onComplete, onDelete, onEdit }: TaskCardProps) {
    return (
        <div className="glass-card" style={{ marginBottom: 'var(--spacing-md)' }}>
            <div className="flex justify-between items-center">
                <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-md" style={{ marginBottom: 'var(--spacing-xs)' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)',
                            color: 'var(--accent-primary)',
                            fontSize: '0.9rem'
                        }}>
                            <Clock size={16} />
                            <span>{task.scheduledTime}</span>
                        </div>
                        {task.completed && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)',
                                color: 'var(--accent-success)',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}>
                                <CheckCircle2 size={16} />
                                <span>Completed</span>
                            </div>
                        )}
                    </div>

                    <h3 style={{
                        fontSize: '1.1rem',
                        marginBottom: 'var(--spacing-xs)',
                        color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                        textDecoration: task.completed ? 'line-through' : 'none'
                    }}>
                        {task.title}
                    </h3>

                    {task.description && (
                        <p style={{
                            fontSize: '0.9rem',
                            marginBottom: task.completed && task.completionProof ? 'var(--spacing-sm)' : 0,
                            color: 'var(--text-secondary)'
                        }}>
                            {task.description}
                        </p>
                    )}

                    {task.completed && task.completionProof && (
                        <div style={{
                            marginTop: 'var(--spacing-sm)',
                            padding: 'var(--spacing-sm)',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            borderLeft: '3px solid var(--accent-success)'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
                                Completion Proof:
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                {task.completionProof}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-sm" style={{ marginLeft: 'var(--spacing-md)' }}>
                    {!task.completed && (
                        <button
                            onClick={() => onComplete(task)}
                            className="btn btn-success"
                            style={{ padding: 'var(--spacing-sm)' }}
                            title="Complete Task"
                        >
                            <Circle size={20} />
                        </button>
                    )}

                    <button
                        onClick={() => onEdit(task)}
                        className="btn btn-ghost"
                        style={{
                            padding: 'var(--spacing-sm)',
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid var(--accent-primary)',
                            color: 'var(--accent-primary)'
                        }}
                        title="Edit Task"
                    >
                        <Pencil size={20} />
                    </button>

                    <button
                        onClick={() => onDelete(task.id)}
                        className="btn btn-danger"
                        style={{ padding: 'var(--spacing-sm)' }}
                        title="Delete Task"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
