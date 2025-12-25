import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const CreateTaskModal = ({ isOpen, onClose, onTaskSaved, taskToEdit = null }) => {
    // Form State
    const [title, setTitle] = useState('');
    const [projectId, setProjectId] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');
    const [estimatedHours, setEstimatedHours] = useState('');
    const [status, setStatus] = useState('Not Started');
    const [completionType, setCompletionType] = useState('full'); // Default, only relevant if Completed
    const [actualHours, setActualHours] = useState(''); // New for editing

    // Data State
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingProjects, setFetchingProjects] = useState(true);

    // Fetch projects on open
    useEffect(() => {
        if (isOpen) {
            const fetchProjects = async () => {
                const { data } = await supabase.from('projects').select('id, name');
                if (data) {
                    setProjects(data);
                    // Only default project if creating new
                    if (!taskToEdit && data.length > 0 && !projectId) {
                        setProjectId(data[0].id);
                    }
                }
                setFetchingProjects(false);
            };
            fetchProjects();
        }
    }, [isOpen]);

    // Pre-fill logic when editing
    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title || '');
            setProjectId(taskToEdit.project_id || '');
            setDifficulty(taskToEdit.difficulty || 'Medium');
            setPriority(taskToEdit.priority || 'Medium');
            setDueDate(taskToEdit.due_date || '');
            setEstimatedHours(taskToEdit.estimated_hours || '');
            setStatus(taskToEdit.status || 'Not Started');
            setCompletionType(taskToEdit.completion_type || 'full');
            setActualHours(taskToEdit.actual_hours || '');
        } else {
            // Reset for create mode
            setTitle('');
            // Project ID resets to first option via the other effect or remains if user just closed
            setDifficulty('Medium');
            setPriority('Medium');
            setDueDate('');
            setEstimatedHours('');
            setStatus('Not Started');
            setCompletionType('full');
            setActualHours('');
        }
    }, [taskToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            title,
            project_id: projectId,
            difficulty,
            priority,
            due_date: dueDate || null,
            estimated_hours: estimatedHours || null,
            actual_hours: actualHours || null,
            status,
            completion_type: status === 'Completed' ? completionType : null,
            // Only update completed_at if strictly necessary (transitioning to Completed or Un-completing)
            // If already Completed and staying Completed, do NOT send completed_at (undefined) so DB keeps original value
            ...((status === 'Completed' && (!taskToEdit || taskToEdit.status !== 'Completed')) ? { completed_at: new Date().toISOString() } : {}),
            ...((status !== 'Completed') ? { completed_at: null } : {})
        };

        let result;
        if (taskToEdit) {
            // UDPATE
            result = await supabase
                .from('tasks')
                .update(payload)
                .eq('id', taskToEdit.id);
        } else {
            // INSERT
            result = await supabase
                .from('tasks')
                .insert([payload]);
        }

        const { error } = result;

        if (error) {
            console.error('Error saving task:', error);
            alert('Failed to save task.');
        } else {
            onTaskSaved(); // Renamed from onTaskCreated for clarity
            onClose();
        }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
        }} onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {taskToEdit ? 'Edit Task' : 'Create New Task'}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Task Title</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            placeholder="e.g. Fix Navigation Bug"
                        />
                    </div>

                    {/* Project */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Project</label>
                        <select
                            value={projectId}
                            onChange={e => setProjectId(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                        >
                            <option value="" disabled>Select a project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status & Priority (If Editing) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Status</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            >
                                <option>Not Started</option>
                                <option>In Progress</option>
                                <option>Review</option>
                                <option>Completed</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Priority</label>
                            <select
                                value={priority}
                                onChange={e => setPriority(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    {/* Completion Specifics (Only if status is 'Completed') */}
                    {status === 'Completed' && (
                        <div style={{ padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: '8px', border: '1px dashed var(--gray-300)' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Completion Details</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <input type="radio" name="completionType" value="full" checked={completionType === 'full'} onChange={e => setCompletionType(e.target.value)} />
                                    Fully Done
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <input type="radio" name="completionType" value="partial" checked={completionType === 'partial'} onChange={e => setCompletionType(e.target.value)} />
                                    Partially Done
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Difficulty & Est Hours */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={e => setDifficulty(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Est. Hours</label>
                            <input
                                type="number"
                                value={estimatedHours}
                                onChange={e => setEstimatedHours(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Dates & Actuals (Editing) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            />
                        </div>
                        {taskToEdit && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Actual Hours</label>
                                <input
                                    type="number"
                                    value={actualHours}
                                    onChange={e => setActualHours(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                                    placeholder="0"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (projects.length === 0 && !fetchingProjects)}
                        style={{
                            marginTop: '1rem', padding: '0.875rem', backgroundColor: 'var(--primary-500)', color: 'white',
                            border: 'none', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
                            opacity: (projects.length === 0 && !fetchingProjects) ? 0.5 : 1
                        }}
                    >
                        {loading ? 'Saving...' : (taskToEdit ? 'Update Task' : 'Create Task')}
                    </button>
                    {projects.length === 0 && !fetchingProjects && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--danger)', textAlign: 'center' }}>You need to create a project first</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
