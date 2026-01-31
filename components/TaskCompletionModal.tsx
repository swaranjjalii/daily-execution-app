'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface TaskCompletionModalProps {
    taskTitle: string;
    onComplete: (proof: string) => void;
    onClose: () => void;
}

export default function TaskCompletionModal({ taskTitle, onComplete, onClose }: TaskCompletionModalProps) {
    const [proof, setProof] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (proof.trim()) {
            onComplete(proof);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ marginBottom: 0 }}>Complete Task</h2>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: 'var(--spacing-xs)' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{taskTitle}</h3>
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
                            What did you accomplish? *
                        </label>
                        <textarea
                            value={proof}
                            onChange={(e) => setProof(e.target.value)}
                            placeholder="Describe what you completed and how you did it..."
                            required
                            autoFocus
                            style={{ minHeight: '120px' }}
                        />
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-tertiary)',
                            marginTop: 'var(--spacing-xs)',
                            marginBottom: 0
                        }}>
                            Be honest with yourself. This proof helps you track real progress.
                        </p>
                    </div>

                    <div className="flex gap-md">
                        <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
                            Mark Complete
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
