'use client';

import { useState } from 'react';
import { X, StickyNote } from 'lucide-react';

interface NotesModalProps {
    taskTitle: string;
    taskDate: string;
    currentNotes: string;
    onSave: (notes: string) => void;
    onClose: () => void;
}

export default function NotesModal({ taskTitle, taskDate, currentNotes, onSave, onClose }: NotesModalProps) {
    const [notes, setNotes] = useState(currentNotes);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(notes);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <StickyNote size={24} color="var(--accent-warning)" />
                        <h2 style={{ marginBottom: 0 }}>Task Notes</h2>
                    </div>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: 'var(--spacing-xs)' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                        {taskTitle}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 0 }}>
                        {new Date(taskDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: 'var(--spacing-sm)',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                        }}>
                            Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add your notes for this task on this day..."
                            autoFocus
                            style={{ minHeight: '150px' }}
                        />
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-tertiary)',
                            marginTop: 'var(--spacing-xs)',
                            marginBottom: 0
                        }}>
                            Record observations, progress, blockers, or anything relevant.
                        </p>
                    </div>

                    <div className="flex gap-md">
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            Save Notes
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
