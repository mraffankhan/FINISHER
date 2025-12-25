import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const TaskCard = ({ task }) => {
    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Easy': return 'var(--success)';
            case 'Medium': return 'var(--primary-500)';
            case 'Hard': return 'var(--danger)';
            default: return 'var(--text-secondary)';
        }
    };

    const getPriorityColor = (prio) => {
        switch (prio) {
            case 'Low': return 'var(--text-muted)';
            case 'Medium': return 'var(--warning)';
            case 'High': return 'var(--danger)';
            default: return 'var(--text-muted)';
        }
    };

    // Handling optional fields/joins
    // If project is joined, it might be an object 'projects: { name: ... }'
    const projectName = task.projects?.name || 'Unknown Project';

    // Progress logic proxy (no progress field in schema, status based)
    const progress = task.status === 'Completed' ? 100 : (task.status === 'Not Started' ? 0 : 50);

    return (
        <div style={{
            background: 'white',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)',
            cursor: 'move',
            marginBottom: '1rem',
            transition: 'all 0.2s ease'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                e.currentTarget.style.borderColor = 'var(--primary-100)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
            }}
        >
            {/* Tags Row */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: getDifficultyColor(task.difficulty),
                    background: `color-mix(in srgb, ${getDifficultyColor(task.difficulty)} 10%, transparent)`,
                    padding: '2px 8px',
                    borderRadius: '4px'
                }}>
                    {task.difficulty}
                </span>
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: getPriorityColor(task.priority),
                    background: `color-mix(in srgb, ${getPriorityColor(task.priority)} 10%, transparent)`,
                    padding: '2px 8px',
                    borderRadius: '4px'
                }}>
                    {task.priority || 'Normal'}
                </span>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1.4 }}>
                {task.title}
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {projectName}
            </p>

            {/* Footer info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        <span>{task.due_date || 'No Date'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={14} />
                        <span>{task.estimated_hours ? `${task.estimated_hours}h` : '-'}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar (Visual Only - proxy) */}
            <div style={{
                height: '4px',
                width: '100%',
                backgroundColor: 'var(--bg-app)',
                borderRadius: '2px',
                marginTop: '1rem',
                overflow: 'hidden'
            }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: 'var(--primary-500)',
                    borderRadius: '2px'
                }} />
            </div>

        </div>
    );
};

export default TaskCard;
