import React from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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
        transition: 'all 0.2s ease'
    }}>
        {label}
        {hasDropdown && <ArrowUpDown size={14} style={{ opacity: 0.5 }} />}
    </button>
);

const FilterBar = () => {
    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
                <FilterButton label="Project: All Projects" />
            </div>
            <FilterButton label="Difficulty: Any" />
            <FilterButton label="Status: Active" />
            <FilterButton label="Due Date" hasDropdown={false} />

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                <button style={{
                    padding: '0.5rem',
                    color: 'var(--text-secondary)',
                    borderRadius: '8px',
                    border: '1px solid transparent'
                }}>
                    <SlidersHorizontal size={20} />
                </button>
            </div>
        </div>
    );
};

export default FilterBar;
