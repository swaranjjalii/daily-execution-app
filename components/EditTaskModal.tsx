'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Task } from '@/lib/types';

interface EditTaskModalProps {
    task: Task;
    onUpdate: (taskId: string, updates: { title: string; description: string; scheduledTime: string }) => void;
    onClose: () => void;
}

export default function EditTaskModal({ task, onUpdate, onClose }: EditTaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [scheduledTime, setScheduledTime] = useState(task.scheduledTime);

    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description || '');
        setScheduledTime(task.scheduledTime);
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onUpdate(task.id, { title, description, scheduledTime });
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ marginBottom: 0 }}>Edit Task</h2>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: 'var(--spacing-xs)' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 'var(--spacing-sm)',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                        }}>
                            Task Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Morning workout"
                            required
                            autoFocus
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 'var(--spacing-sm)',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                        }}>
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details about this task..."
                            style={{ minHeight: '80px' }}
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 'var(--spacing-sm)',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                        }}>
                            Scheduled Time *
                        </label>
                        <input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex gap-md">
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            <Save size={20} />
                            Save Changes
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-ghost">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
