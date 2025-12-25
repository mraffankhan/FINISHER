import React from 'react';
import TaskCard from './TaskCard';

const columns = [
    { id: 'Not Started', title: 'Not Started' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'Review', title: 'Review' },
    { id: 'Completed', title: 'Completed' },
];

const TaskBoard = ({ tasks = [] }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            height: 'calc(100vh - 200px)',
            overflowX: 'auto'
        }}>
            {columns.map(col => {
                const colTasks = tasks.filter(t => t.status === col.id);
                return (
                    <div key={col.id} style={{ display: 'flex', flexDirection: 'column', minWidth: '280px' }}>
                        {/* Column Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1rem',
                            padding: '0 0.5rem'
                        }}>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {col.title}
                            </h3>
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: 'var(--text-muted)',
                                background: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                border: '1px solid var(--border-light)'
                            }}>
                                {colTasks.length}
                            </span>
                        </div>

                        {/* Column Divider */}
                        <div style={{ marginBottom: '1rem', height: '2px', width: '100%', background: `var(--${col.id === 'Completed' ? 'success' : 'primary-500'})`, opacity: col.id === 'Not Started' ? 0.1 : 0.5, borderRadius: '2px' }} />

                        {/* Tasks Container */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            paddingRight: '0.5rem' // space for scrollbar 
                        }}>
                            {colTasks.length === 0 && (
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem', textAlign: 'center', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                                    No tasks
                                </div>
                            )}
                            {colTasks.map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TaskBoard;
