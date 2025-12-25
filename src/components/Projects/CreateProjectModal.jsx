import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const CreateProjectModal = ({ isOpen, onClose, onProjectSaved, projectToEdit = null }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Web');
    const [difficulty, setDifficulty] = useState('Medium');
    const [status, setStatus] = useState('Not Started');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [expectedDays, setExpectedDays] = useState('');
    const [actualDays, setActualDays] = useState(''); // New for analytics
    const [loading, setLoading] = useState(false);

    // Effect to populate form when editing
    useEffect(() => {
        if (projectToEdit) {
            setName(projectToEdit.name || '');
            setCategory(projectToEdit.category || 'Web');
            setDifficulty(projectToEdit.difficulty || 'Medium');
            setStatus(projectToEdit.status || 'Not Started');
            setStartDate(projectToEdit.start_date || '');
            setDueDate(projectToEdit.due_date || '');
            setExpectedDays(projectToEdit.expected_days || '');
            setActualDays(projectToEdit.actual_days || '');
        } else {
            // Reset for create mode
            setName('');
            setCategory('Web');
            setDifficulty('Medium');
            setStatus('Not Started');
            setStartDate('');
            setDueDate('');
            setExpectedDays('');
            setActualDays('');
        }
    }, [projectToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name,
            category,
            difficulty,
            status, // Included status for editing
            start_date: startDate || null,
            due_date: dueDate || null,
            expected_days: expectedDays || null,
            actual_days: actualDays || null,
        };

        let result;

        if (projectToEdit) {
            // UPDATE
            result = await supabase
                .from('projects')
                .update(payload)
                .eq('id', projectToEdit.id);
        } else {
            // INSERT
            // Only add user_id for new legacy creates (though schema might not require it if we relaxed it, handling it correctly here)
            // Using a safe approach for "Owner Mode" without Auth
            result = await supabase
                .from('projects')
                .insert([payload]);
        }

        const { error } = result;

        if (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project. Check permissions.');
        } else {
            onProjectSaved();
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
                        {projectToEdit ? 'Edit Project' : 'Create New Project'}
                    </h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Name */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Project Name</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            placeholder="e.g. Portfolio V2"
                        />
                    </div>

                    {/* Category & Difficulty */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            >
                                <option>Web</option>
                                <option>App</option>
                                <option>AI</option>
                                <option>College</option>
                                <option>Client</option>
                            </select>
                        </div>
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
                    </div>

                    {/* Status (Only show if Editing) */}
                    {projectToEdit && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Status</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            >
                                <option>Not Started</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                                <option>Dropped</option>
                            </select>
                        </div>
                    )}

                    {/* Dates */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            />
                        </div>
                    </div>

                    {/* Meta */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Est. Days</label>
                        <input
                            type="number"
                            value={expectedDays}
                            onChange={e => setExpectedDays(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                            placeholder="7"
                        />
                    </div>

                    {/* Actual Days (Only if Completed) */}
                    {status === 'Completed' && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Actual Days</label>
                            <input
                                type="number"
                                value={actualDays}
                                onChange={e => setActualDays(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                                placeholder="5"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '1rem', padding: '0.875rem', backgroundColor: 'var(--primary-500)', color: 'white',
                            border: 'none', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer'
                        }}
                    >
                        {loading ? 'Saving...' : (projectToEdit ? 'Update Project' : 'Create Project')}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
