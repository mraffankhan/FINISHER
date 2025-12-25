import React from 'react';
import { Calendar, ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ project }) => {
    // Map status/difficulty to aesthetic styles
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return { color: 'var(--success)', bg: 'var(--success-bg)' };
            case 'In Progress': return { color: 'var(--primary-600)', bg: 'var(--primary-50)' };
            case 'Not Started': return { color: 'var(--gray-500)', bg: 'var(--gray-100)' };
            case 'Dropped': return { color: 'var(--gray-400)', bg: 'var(--gray-50)' };
            default: return { color: 'var(--gray-500)', bg: 'var(--gray-100)' };
        }
    };

    const s = getStatusStyle(project.status);

    // Progress is based on status proxy as defined in Projects.jsx
    const progress = project.status === 'Completed' ? 100 : (project.status === 'Not Started' ? 0 : 50);

    return (
        <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            padding: '1.5rem',
            position: 'relative',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '220px', // Fixed height for grid uniformity
            boxShadow: 'var(--shadow-sm)'
        }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--gray-300)';
                const icon = e.currentTarget.querySelector('.arrow-icon');
                if (icon) icon.style.opacity = 1;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
                const icon = e.currentTarget.querySelector('.arrow-icon');
                if (icon) icon.style.opacity = 0;
            }}
        >
            {/* Hover Icon */}
            <ArrowUpRight
                className="arrow-icon"
                size={20}
                style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    color: 'var(--gray-400)',
                    opacity: 0,
                    transition: 'opacity 0.2s'
                }}
            />

            <div>
                {/* Header (Category & Difficulty) */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--gray-500)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {project.category}
                    </span>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'var(--gray-400)' // Muted difficulty
                    }}>
                        • &nbsp; {project.difficulty}
                    </span>
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    marginBottom: '0.5rem'
                }}>
                    {project.name}
                </h3>
            </div>

            {/* Footer */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: s.color,
                        background: s.bg,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)'
                    }}>
                        {project.status}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--gray-400)' }}>
                        <Calendar size={14} />
                        <span style={{ fontSize: '0.8125rem' }}>{project.due_date ? new Date(project.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No Due Date'}</span>
                    </div>
                </div>

                {/* Progress Bar Anchor */}
                <div style={{ width: '100%', height: '4px', background: 'var(--gray-100)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: project.status === 'Completed' ? 'var(--success)' : 'var(--primary-600)',
                        borderRadius: '2px'
                    }} />
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
