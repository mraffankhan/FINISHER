import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import ProjectCard from './Projects/ProjectCard';
import ProjectFilters from './Projects/ProjectFilters';
import CreateProjectModal from './Projects/CreateProjectModal'; // Import Modal
import { supabase } from '../supabaseClient';

const Projects = ({ isOwner }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal State

    const fetchProjects = async () => {
        setLoading(true);
        // FETCH ALL PROJECTS (Public Read)
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching projects:', error);

        if (data) {
            const enhancedData = data.map(p => ({
                ...p,
                progress: p.status === 'Completed' ? 100 : (p.status === 'Not Started' ? 0 : 50),
                expectedDuration: p.expected_days || 0,
                actualDuration: p.actual_days || 0,
                dueDate: p.due_date || 'No Date'
            }));
            setProjects(enhancedData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleProjectCreated = () => {
        fetchProjects();
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
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Projects</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Track your builds from zero to one.</p>
                </div>
                {isOwner && (
                    <button
                        onClick={() => setIsModalOpen(true)} // Add Handler
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
                        Create Project
                    </button>
                )}
            </header>

            <ProjectFilters />

            {/* Projects Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem'
            }}>
                {loading ? (
                    <div style={{ color: 'var(--text-secondary)' }}>Loading projects...</div>
                ) : projects.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)' }}>No projects found. Create one to get started!</div>
                ) : (
                    projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                )}
            </div>

            {/* Modal */}
            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={handleProjectCreated}
            />
        </div>
    );
};

export default Projects;
