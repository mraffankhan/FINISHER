import React from 'react';
import { Calendar, Clock, Pencil, Trash2 } from 'lucide-react';

const TaskCard = ({ task, isOwner, onComplete, onEdit, onDelete }) => {

    // Minimal Difficulty Indicator (Dot)
    const getDiffColor = (d) => {
        if (d === 'Hard') return 'var(--danger)';
        if (d === 'Medium') return 'var(--warning)';
        return 'var(--success)';
    }

    const projectName = task.projects?.name;

    // Logic from previous step
    const progress = task.status === 'Completed'
        ? (task.completion_type === 'partial' ? 75 : 100)
        : (task.status === 'Not Started' ? 0 : 50);

    const isPartial = task.status === 'Completed' && task.completion_type === 'partial';
    const isCompleted = task.status === 'Completed';

    return (
        <div style={{
            background: 'white',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)',
            marginBottom: '0.75rem',
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            position: 'relative',
            opacity: isCompleted && !isPartial ? 0.7 : 1,
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--gray-300)';
                // Show actions on hover if owner
                const actions = e.currentTarget.querySelector('.task-actions');
                if (actions && isOwner) actions.style.opacity = 1;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
                const actions = e.currentTarget.querySelector('.task-actions');
                if (actions) actions.style.opacity = 0;
            }}
        >
            {/* Owner Actions (Absolute Top Right) */}
            {isOwner && (
                <div
                    className="task-actions"
                    style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        display: 'flex',
                        gap: '0.25rem',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        zIndex: 10,
                        background: 'rgba(255,255,255,0.9)', // Slight Backdrop
                        borderRadius: '4px'
                    }}
                >
                    {/* Only show Complete shortcut if NOT completed */}
                    {!isCompleted && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onComplete(task); }}
                            style={{ padding: '4px', border: '1px solid var(--gray-300)', borderRadius: '4px', cursor: 'pointer', color: 'var(--success)', background: 'white' }}
                            title="Mark Complete"
                        >
                            <div style={{ width: 10, height: 10, border: '1.5px solid currentColor', borderRadius: '50%' }} />
                        </button>
                    )}

                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                        style={{ padding: '4px', border: '1px solid var(--gray-300)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-secondary)', background: 'white' }}
                        title="Edit Task"
                    >
                        <Pencil size={12} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(task); }}
                        style={{ padding: '4px', border: '1px solid var(--gray-300)', borderRadius: '4px', cursor: 'pointer', color: 'var(--danger)', background: 'white' }}
                        title="Delete Task"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            )}


            {/* Top Row: Project & Priority */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    maxWidth: '120px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {projectName || 'No Project'}
                </span>

                {/* Difficulty Dot */}
                <div title={`Difficulty: ${task.difficulty}`} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: getDiffColor(task.difficulty) }} />
            </div>

            {/* Title */}
            <div style={{ marginTop: '0.25rem' }}>
                <h4 style={{
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.4,
                    textDecoration: isCompleted && !isPartial ? 'line-through' : 'none'
                }}>
                    {task.title}
                </h4>
            </div>

            {/* Metadata Footer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {task.due_date && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <Calendar size={12} strokeWidth={2} />
                        <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                )}

                {(task.estimated_hours) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <Clock size={12} strokeWidth={2} />
                        <span>{task.estimated_hours}h</span>
                    </div>
                )}

                {isPartial && (
                    <span style={{
                        marginLeft: 'auto',
                        fontSize: '0.65rem',
                        border: '1px solid var(--gray-300)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        color: 'var(--text-secondary)',
                        background: 'var(--gray-50)'
                    }}>
                        PARTIAL
                    </span>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
