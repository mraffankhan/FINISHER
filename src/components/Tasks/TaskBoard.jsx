import React from 'react';
import TaskCard from './TaskCard';

const columns = [
    { id: 'Not Started', title: 'Backlog', color: 'var(--gray-500)' },
    { id: 'In Progress', title: 'In Progress', color: 'var(--primary-600)' },
    { id: 'Review', title: 'Review', color: 'var(--warning)' },
    { id: 'Completed', title: 'Done', color: 'var(--success)' },
];

const TaskBoard = ({ tasks = [], isOwner, onComplete, onEdit, onDelete }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem', // Generous spacing between columns
            alignItems: 'start',
            paddingBottom: '2rem'
        }}>
            {columns.map(col => {
                const colTasks = tasks.filter(t => t.status === col.id);
                return (
                    <div key={col.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Minimal Column Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1.25rem',
                            paddingBottom: '0.5rem',
                            borderBottom: `2px solid ${col.id === 'Not Started' ? 'transparent' : 'var(--gray-100)'}`
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: col.color }} />
                                <h3 style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                }}>
                                    {col.title}
                                </h3>
                            </div>

                            <span style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                fontWeight: 500
                            }}>
                                {colTasks.length}
                            </span>
                        </div>

                        {/* Tasks Group */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            {colTasks.length === 0 && (
                                <div style={{
                                    padding: '2rem 1rem',
                                    textAlign: 'center',
                                    border: '1px dashed var(--gray-200)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--text-muted)',
                                    fontSize: '0.875rem'
                                }}>
                                    Empty
                                </div>
                            )}
                            {colTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    isOwner={isOwner}
                                    onComplete={onComplete}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TaskBoard;
