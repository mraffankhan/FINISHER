import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import ProjectCard from './Projects/ProjectCard';
import ProjectFilters from './Projects/ProjectFilters';
import CreateProjectModal from './Projects/CreateProjectModal';
import { supabase } from '../supabaseClient';

const Projects = ({ isOwner }) => {
    const [allProjects, setAllProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters State
    const [filters, setFilters] = useState({
        category: 'All',
        difficulty: 'All',
        status: 'All',
        sort: 'newest'
    });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);

    const fetchProjects = async () => {
        setLoading(true);
        // FETCH ALL PROJECTS & TASKS
        const { data: projectsData, error: projError } = await supabase.from('projects').select('*');
        const { data: tasksData, error: taskError } = await supabase.from('tasks').select('id, project_id, status');

        if (projError) console.error('Error fetching projects:', projError);

        if (projectsData) {
            const enhancedData = projectsData.map(p => {
                // Calculate Real Progress
                const pTasks = tasksData ? tasksData.filter(t => t.project_id === p.id) : [];
                const totalTasks = pTasks.length;
                const completedTasks = pTasks.filter(t => t.status === 'Completed').length;

                // If tasks exist, use real %, else fallback to status proxy
                let progress;
                if (totalTasks > 0) {
                    progress = Math.round((completedTasks / totalTasks) * 100);
                } else {
                    progress = p.status === 'Completed' ? 100 : (p.status === 'Not Started' ? 0 : 50);
                }

                return {
                    ...p,
                    taskProgress: progress,
                    // Ensure dates are parsed correctly for sorting
                    parsedDate: new Date(p.created_at),
                    parsedDueDate: p.due_date ? new Date(p.due_date) : null
                };
            });
            setAllProjects(enhancedData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = [...allProjects];

        // 1. Filter
        if (filters.category !== 'All') {
            result = result.filter(p => p.category === filters.category);
        }
        if (filters.difficulty !== 'All') {
            result = result.filter(p => p.difficulty === filters.difficulty);
        }
        if (filters.status !== 'All') {
            result = result.filter(p => p.status === filters.status);
        }

        // 2. Sort
        switch (filters.sort) {
            case 'newest':
                result.sort((a, b) => b.parsedDate - a.parsedDate);
                break;
            case 'due_date':
                // Projects with due dates come first, then valid ones sorted asc
                result.sort((a, b) => {
                    if (!a.parsedDueDate) return 1;
                    if (!b.parsedDueDate) return -1;
                    return a.parsedDueDate - b.parsedDueDate;
                });
                break;
            case 'difficulty_asc':
                const diffMap = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                result.sort((a, b) => diffMap[a.difficulty] - diffMap[b.difficulty]);
                break;
            case 'difficulty_desc':
                const diffMapDesc = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                result.sort((a, b) => diffMapDesc[b.difficulty] - diffMapDesc[a.difficulty]);
                break;
            default:
                break;
        }

        setFilteredProjects(result);

    }, [allProjects, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleProjectSaved = () => {
        fetchProjects();
        setIsModalOpen(false);
        setProjectToEdit(null);
    };

    const handleCreateClick = () => {
        setProjectToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (project) => {
        setProjectToEdit(project);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (project) => {
        if (window.confirm(`Are you sure you want to delete "${project.name}"? This will also delete all associated tasks.`)) {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', project.id);

            if (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project.');
            } else {
                fetchProjects();
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProjectToEdit(null);
    };

    return (
        <div>
            {/* Header */}
            <header className="desktop-header" style={{
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Projects</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Track your builds from zero to one.</p>
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
                        Create Project
                    </button>
                )}
            </header>

            <div className="mobile-header-spacer" />

            <ProjectFilters filters={filters} onFilterChange={handleFilterChange} />

            {/* Projects Grid */}
            <div className="grid-responsive-3" style={{ paddingBottom: '80px' }}> {/* Padding for FAB */}
                {loading ? (
                    <div style={{ color: 'var(--text-secondary)' }}>Loading projects...</div>
                ) : filteredProjects.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)' }}>No projects found matching your filters.</div>
                ) : (
                    filteredProjects.map(project => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            isOwner={isOwner}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    ))
                )}
            </div>

            {/* Mobile Floating Action Button */}
            {isOwner && (
                <button className="mobile-fab" onClick={handleCreateClick}>
                    <Plus size={24} />
                </button>
            )}

            {/* Universal Modal */}
            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onProjectSaved={handleProjectSaved}
                projectToEdit={projectToEdit}
            />
        </div>
    );
};

export default Projects;
