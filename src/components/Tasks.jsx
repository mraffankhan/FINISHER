import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import FilterBar from './Tasks/FilterBar';
import TaskBoard from './Tasks/TaskBoard';
import CreateTaskModal from './Tasks/CreateTaskModal';
import { supabase } from '../supabaseClient';

const Tasks = ({ isOwner }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        // Public Read: Fetch all tasks
        const { data, error } = await supabase
            .from('tasks')
            .select('*, projects(name)');

        if (error) console.error('Error fetching tasks:', error);

        if (data) {
            setTasks(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskCreated = () => {
        fetchTasks();
    };

    return (
        <div>
            {/* Header */}
            <header style={{
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Tasks</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Manage your execution pipeline.</p>
                </div>
                {isOwner && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            backgroundColor: 'var(--primary-500)',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: 'var(--shadow-glow)',
                            cursor: 'pointer'
                        }}>
                        <Plus size={20} />
                        Create Task
                    </button>
                )}
            </header>

            <FilterBar />

            {loading ? (
                <div style={{ color: 'var(--text-secondary)' }}>Loading tasks...</div>
            ) : (
                <TaskBoard tasks={tasks} />
            )}

            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTaskCreated={handleTaskCreated}
            />
        </div>
    );
};

export default Tasks;
