import React, { useState } from 'react';
import { Calendar, MoreHorizontal, Clock, CheckCircle2 } from 'lucide-react';

const ProjectCard = ({ project, isOwner, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);

    // Map status/difficulty to aesthetic styles
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return { color: 'var(--success)', bg: 'var(--success-bg)', label: 'Shipped' };
            case 'In Progress': return { color: 'var(--primary-600)', bg: 'var(--primary-50)', label: 'Building' };
            case 'Not Started': return { color: 'var(--gray-500)', bg: 'var(--gray-100)', label: 'Planned' };
            case 'Dropped': return { color: 'var(--gray-400)', bg: 'var(--gray-50)', label: 'Dropped' };
            default: return { color: 'var(--gray-500)', bg: 'var(--gray-100)', label: status };
        }
    };

    const s = getStatusStyle(project.status);

    // Progress calculation (prefer taskProgress if available, else status proxy)
    const percentage = project.taskProgress !== undefined
        ? project.taskProgress
        : (project.status === 'Completed' ? 100 : (project.status === 'Not Started' ? 0 : 50));

    return (
        <div style={{
            background: 'white',
            borderRadius: '24px', // Softer, bigger radius
            border: '1px solid var(--border-light)',
            padding: '2rem', // Spacious
            position: 'relative',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '280px', // Taller for strategic presence
            boxShadow: 'var(--shadow-sm)'
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                setShowMenu(false);
            }}
            onClick={() => isOwner ? onEdit(project) : null} // Clicking card acts as edit/view
        >
            {/* Top Row: Metadata + Menu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        background: 'var(--gray-100)',
                        padding: '4px 8px',
                        borderRadius: '6px'
                    }}>
                        {project.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {project.difficulty}
                    </span>
                </div>

                {/* Owner Menu */}
                {isOwner && (
                    <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            style={{ padding: '0.5rem', borderRadius: '50%', color: 'var(--gray-400)', cursor: 'pointer' }}
                        >
                            <MoreHorizontal size={20} />
                        </button>
                        {showMenu && (
                            <div style={{
                                position: 'absolute', top: '100%', right: 0,
                                background: 'white', border: '1px solid var(--border-light)',
                                borderRadius: '8px', boxShadow: 'var(--shadow-md)',
                                zIndex: 50, overflow: 'hidden', width: '120px'
                            }}>
                                <button onClick={() => { onEdit(project); setShowMenu(false); }} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-primary)' }}>Edit</button>
                                <button onClick={() => { onDelete(project); setShowMenu(false); }} style={{ display: 'block', width: '100%', padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--danger)' }}>Delete</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div style={{ flex: 1 }}>
                <h3 style={{
                    fontSize: '1.75rem', // Big Title
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                    marginBottom: '1rem'
                }}>
                    {project.name}
                </h3>

                {/* Status Badge (Pill) */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '6px 12px', borderRadius: '99px', background: s.bg, color: s.color }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{s.label}</span>
                </div>
            </div>

            {/* Footer: Progress & Date */}
            <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Progress</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{percentage}%</span>
                    </div>
                    {project.due_date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.875rem', background: 'var(--gray-50)', padding: '4px 8px', borderRadius: '6px' }}>
                            <Calendar size={14} />
                            <span>{new Date(project.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: 'var(--gray-100)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: project.status === 'Completed' ? 'var(--success)' : 'var(--primary-600)',
                        borderRadius: '3px',
                        transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                </div>

                {project.status === 'Completed' && project.actual_days && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} />
                        Shipped in {project.actual_days} days
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
