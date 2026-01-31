'use client';

import { Achievement } from '@/lib/types';
import { Award, Lock, Trophy } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface AchievementBadgesProps {
    achievements: Achievement[];
}

export default function AchievementBadges({ achievements }: AchievementBadgesProps) {
    return (
        <div className="glass-card">
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-xs)'
                }}>
                    <Trophy size={24} color="var(--accent-warning)" />
                    Achievements
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: 0 }}>
                    Unlock milestones by maintaining your streak
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 'var(--spacing-md)'
            }}>
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        style={{
                            padding: 'var(--spacing-md)',
                            background: achievement.unlocked
                                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                                : 'var(--bg-tertiary)',
                            border: `1px solid ${achievement.unlocked ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center',
                            transition: 'all var(--transition-normal)',
                            opacity: achievement.unlocked ? 1 : 0.5,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {achievement.unlocked && (
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                width: '40px',
                                height: '40px',
                                background: 'var(--gradient-primary)',
                                clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-end',
                                padding: '4px'
                            }}>
                                <Award size={14} color="white" />
                            </div>
                        )}

                        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                            {achievement.unlocked ? (
                                <Trophy size={32} color="var(--accent-warning)" />
                            ) : (
                                <Lock size={32} color="var(--text-tertiary)" />
                            )}
                        </div>

                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: achievement.unlocked ? 'var(--text-primary)' : 'var(--text-tertiary)',
                            marginBottom: 'var(--spacing-xs)'
                        }}>
                            {achievement.name}
                        </div>

                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-tertiary)',
                            marginBottom: 'var(--spacing-xs)'
                        }}>
                            {achievement.daysRequired} days
                        </div>

                        {achievement.unlocked && achievement.unlockedAt && (
                            <div style={{
                                fontSize: '0.7rem',
                                color: 'var(--accent-success)',
                                fontWeight: 600
                            }}>
                                Unlocked {format(parseISO(achievement.unlockedAt), 'MMM d, yyyy')}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
