import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Web');
    const [difficulty, setDifficulty] = useState('Medium');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [expectedDays, setExpectedDays] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('projects')
            .insert([
                {
                    name,
                    category,
                    difficulty,
                    status: 'Not Started',
                    start_date: startDate || null,
                    due_date: dueDate || null,
                    expected_days: expectedDays || null,
                    user_id: (await supabase.auth.getUser()).data.user?.id
                    // Note: If no user is logged in (Anon Owner Mode), this might be undefined.
                    // The DB schema likely requires user_id. 
                    // Ideally, RLS policies should handle default user or allow anon if designed for this specific "Public+Owner" architecture.
                }
            ]);

        if (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Check console/RLS policies.');
        } else {
            onProjectCreated();
            onClose();
            // Reset form
            setName('');
            setCategory('Web');
            setDifficulty('Medium');
            setStartDate('');
            setDueDate('');
            setExpectedDays('');
        }
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white', padding: '2rem', borderRadius: '16px', width: '500px',
                boxShadow: 'var(--shadow-lg)'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Create New Project</h3>
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

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: '1rem', padding: '0.875rem', backgroundColor: 'var(--primary-500)', color: 'white',
                            border: 'none', borderRadius: '8px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer'
                        }}
                    >
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
