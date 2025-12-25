import React from 'react';
import { Calendar, Clock, Pencil, Trash2, Check, AlertCircle } from 'lucide-react';

const TaskCard = ({ task, isOwner, onComplete, onEdit, onDelete }) => {

    // Difficulty Color
    const getDiffColor = (d) => {
        if (d === 'Hard') return 'var(--danger)';
        if (d === 'Medium') return 'var(--warning)';
        return 'var(--success)';
    }

    const projectName = task.projects?.name;
    const isCompleted = task.status === 'Completed';
    const isPartial = isCompleted && task.completion_type === 'partial';

    // Check Overdue
    const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isCompleted;

    return (
        <div style={{
            background: 'white',
            borderRadius: '8px', // Sharper than projects
            padding: '12px', // Compact padding
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            border: '1px solid var(--border-light)',
            marginBottom: '0.75rem',
            borderLeft: `3px solid ${getDiffColor(task.difficulty)}`, // Visual difficulty cue
            opacity: isCompleted && !isPartial ? 0.6 : 1,
            position: 'relative'
        }}>

            {/* Context Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {projectName}
                </span>

                {/* Actions (Always Visible for speed) */}
                {isOwner && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {!isCompleted && (
                            <button onClick={() => onComplete(task)} title="Done" style={{ color: 'var(--success)', cursor: 'pointer', padding: '2px' }}>
                                <Check size={14} strokeWidth={3} />
                            </button>
                        )}
                        <button onClick={() => onEdit(task)} style={{ color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}>
                            <Pencil size={12} />
                        </button>
                        <button onClick={() => onDelete(task)} style={{ color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}>
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
            </div>

            {/* Task Title */}
            <div style={{ marginBottom: '8px' }}>
                <h4 style={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
                    lineHeight: 1.3,
                    textDecoration: isCompleted && !isPartial ? 'line-through' : 'none'
                }}>
                    {task.title}
                </h4>
            </div>

            {/* Footer Metadata */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem' }}>
                {isOverdue && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--danger)', fontWeight: 600 }}>
                        <AlertCircle size={12} />
                        <span>Overdue</span>
                    </div>
                )}

                {task.due_date && !isOverdue && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-secondary)' }}>
                        <Calendar size={12} />
                        <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                )}

                {task.estimated_hours && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--text-muted)' }}>
                        <Clock size={12} />
                        <span>{task.estimated_hours}h</span>
                    </div>
                )}

                {isPartial && (
                    <span style={{ marginLeft: 'auto', background: 'var(--gray-100)', color: 'var(--text-secondary)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>PARTIAL</span>
                )}
            </div>

        </div>
    );
};

export default TaskCard;
