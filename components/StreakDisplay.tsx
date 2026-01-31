'use client';

import { Flame, TrendingUp } from 'lucide-react';

interface StreakDisplayProps {
    currentStreak: number;
    longestStreak: number;
}

export default function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
    return (
        <div className="glass-card" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'var(--gradient-fire)',
                    boxShadow: '0 0 30px rgba(245, 158, 11, 0.4)',
                    animation: currentStreak > 0 ? 'pulse 2s infinite' : 'none'
                }}>
                    <Flame size={50} color="white" />
                </div>
            </div>

            <h2 style={{
                fontSize: '3rem',
                marginBottom: 'var(--spacing-xs)',
                background: 'var(--gradient-fire)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                {currentStreak}
            </h2>

            <p style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-md)'
            }}>
                Day Streak
            </p>

            {currentStreak > 0 && (
                <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    {currentStreak === 1
                        ? "Great start! Keep it going!"
                        : currentStreak < 7
                            ? "You're building momentum!"
                            : currentStreak < 30
                                ? "Incredible consistency!"
                                : "You're unstoppable! 🔥"}
                </p>
            )}

            {currentStreak === 0 && (
                <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    Complete all your tasks today to start your streak!
                </p>
            )}

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm)',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)'
            }}>
                <TrendingUp size={18} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Longest Streak: <strong style={{ color: 'var(--text-primary)' }}>{longestStreak} days</strong>
                </span>
            </div>
        </div>
    );
}
