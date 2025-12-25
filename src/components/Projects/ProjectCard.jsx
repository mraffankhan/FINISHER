import React from 'react';
import { Calendar, Clock, BarChart } from 'lucide-react';

const ProjectCard = ({ project }) => {
    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Easy': return 'var(--success)';
            case 'Medium': return 'var(--primary-500)';
            case 'Hard': return 'var(--danger)';
            default: return 'var(--text-muted)';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'var(--success)';
            case 'In Progress': return 'var(--primary-500)';
            case 'Dropped': return 'var(--text-muted)';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div className="card" style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            cursor: 'pointer',
            height: '100%',
            justifyContent: 'space-between'
        }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)',
                        letterSpacing: '0.05em'
                    }}>
                        {project.category}
                    </span>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '99px',
                        color: getDifficultyColor(project.difficulty),
                        backgroundColor: `color-mix(in srgb, ${getDifficultyColor(project.difficulty)} 10%, transparent)`
                    }}>
                        {project.difficulty}
                    </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {project.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: getStatusColor(project.status), fontWeight: 500, marginBottom: '1rem' }}>
                    {project.status}
                </p>

                {/* Progress Bar */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                    </div>
                    <div style={{
                        height: '6px',
                        width: '100%',
                        backgroundColor: 'var(--bg-app)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${project.progress}%`,
                            backgroundColor: 'var(--primary-500)',
                            borderRadius: '3px',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-light)',
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={16} />
                    <span>{project.dueDate}</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                        <span title="Expected Duration">Exp: {project.expectedDuration}d</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500, color: 'var(--primary-600)' }}>
                        <span title="Actual Duration">Act: {project.actualDuration}d</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProjectCard;
