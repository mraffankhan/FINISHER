import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

const FilterButton = ({ label, hasDropdown = true }) => (
    <button style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderRadius: '8px',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
    }}>
        {label}
        {hasDropdown && <ArrowUpDown size={14} style={{ opacity: 0.5 }} />}
    </button>
);

const ProjectFilters = () => {
    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <FilterButton label="Category: All" />
            <FilterButton label="Difficulty: Any" />
            <FilterButton label="Status: Active" />
            <div style={{ marginLeft: 'auto' }}>
                <FilterButton label="Sort by: Due Date" />
            </div>
        </div>
    );
};

export default ProjectFilters;
