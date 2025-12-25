import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import TaskBoard from './Tasks/TaskBoard';
import CreateTaskModal from './Tasks/CreateTaskModal'; // Universal Task Modal
import CompletionModal from './Tasks/CompletionModal';
import { supabase } from '../supabaseClient';
import FilterBar from './Tasks/FilterBar';

const Tasks = ({ isOwner }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create/Edit Modal State
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    // Completion Modal State
    const [completionModalOpen, setCompletionModalOpen] = useState(false);
    const [selectedTaskForCompletion, setSelectedTaskForCompletion] = useState(null);

    const fetchTasks = async () => {
        setLoading(true);
        // Supabase join syntax: select(*, projects(name)) to get project name
        const { data, error } = await supabase
            .from('tasks')
            .select('*, projects(name)')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching tasks:', error);

        if (data) setTasks(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskSaved = () => {
        fetchTasks();
        setCreateModalOpen(false);
        setTaskToEdit(null);
    };

    // --- ACTIONS ---

    // 1. Create
    const handleCreateClick = () => {
        setTaskToEdit(null);
        setCreateModalOpen(true);
    };

    // 2. Edit
    const handleEditClick = (task) => {
        setTaskToEdit(task);
        setCreateModalOpen(true);
    };

    // 3. Delete
    const handleDeleteClick = async (task) => {
        if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', task.id);

            if (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task.');
            } else {
                fetchTasks(); // Refresh
            }
        }
    };

    // 4. Completion (Shortcut Logic)
    const handleCompleteRequest = (task) => {
        setSelectedTaskForCompletion(task);
        setCompletionModalOpen(true);
    };

    const handleConfirmCompletion = async (type) => {
        if (!selectedTaskForCompletion) return;

        const { error } = await supabase
            .from('tasks')
            .update({
                status: 'Completed',
                completion_type: type, // 'full' or 'partial'
                completed_at: new Date().toISOString()
            })
            .eq('id', selectedTaskForCompletion.id);

        if (error) {
            console.error('Error completing task:', error);
        } else {
            fetchTasks();
        }
        setCompletionModalOpen(false);
        setSelectedTaskForCompletion(null);
    };

    // Modal Close Handler
    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        setTaskToEdit(null);
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
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Execute your plan.</p>
                </div>
                {isOwner && (
                    <button
                        onClick={handleCreateClick}
                        style={{
                            backgroundColor: 'var(--primary-600)',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 600,
                            fontSize: '0.9375rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: 'var(--shadow-glow)',
                            cursor: 'pointer',
                            border: 'none'
                        }}>
                        <Plus size={20} />
                        Create Task
                    </button>
                )}
            </header>

            {/* <TaskFilters />  -- Placeholder if you have it */}

            {/* Board */}
            {loading ? (
                <div style={{ color: 'var(--text-secondary)' }}>Loading tasks...</div>
            ) : (
                <TaskBoard
                    tasks={tasks}
                    isOwner={isOwner}
                    onComplete={handleCompleteRequest}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />
            )}

            {/* Modals */}
            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                onTaskSaved={handleTaskSaved}
                taskToEdit={taskToEdit}
            />

            <CompletionModal
                isOpen={completionModalOpen}
                onClose={() => setCompletionModalOpen(false)}
                onConfirm={handleConfirmCompletion}
            />
        </div>
    );
};

export default Tasks;
