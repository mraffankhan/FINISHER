import React from 'react';
import { ChevronDown, ArrowUpDown } from 'lucide-react';

const FilterButton = ({ label, activeValue, options, onChange }) => (
    <div style={{ position: 'relative', display: 'inline-block', marginRight: '1rem' }}>
        <select
            value={activeValue}
            onChange={(e) => onChange(e.target.value)}
            style={{
                appearance: 'none',
                backgroundColor: 'white',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '0.5rem 2.5rem 0.5rem 1rem', // Space for chevron
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '150px'
            }}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{label}: {opt.label}</option>
            ))}
        </select>
        <ChevronDown
            size={14}
            style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--text-muted)'
            }}
        />
    </div>
);

const ProjectFilters = ({ filters, onFilterChange }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '0' }}>

            <FilterButton
                label="Category"
                activeValue={filters.category}
                options={[
                    { value: 'All', label: 'All' },
                    { value: 'Web', label: 'Web' },
                    { value: 'App', label: 'App' },
                    { value: 'AI', label: 'AI' }
                ]}
                onChange={(val) => onFilterChange('category', val)}
            />

            <FilterButton
                label="Difficulty"
                activeValue={filters.difficulty}
                options={[
                    { value: 'All', label: 'Any' },
                    { value: 'Easy', label: 'Easy' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Hard', label: 'Hard' }
                ]}
                onChange={(val) => onFilterChange('difficulty', val)}
            />

            <FilterButton
                label="Status"
                activeValue={filters.status}
                options={[
                    { value: 'All', label: 'All' },
                    { value: 'Not Started', label: 'Not Started' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Dropped', label: 'Dropped' }
                ]}
                onChange={(val) => onFilterChange('status', val)}
            />

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginRight: '0.5rem', fontWeight: 500 }}>Sort by:</span>
                <div style={{ position: 'relative' }}>
                    <select
                        value={filters.sort}
                        onChange={(e) => onFilterChange('sort', e.target.value)}
                        style={{
                            appearance: 'none',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            outline: 'none',
                            paddingRight: '1.25rem'
                        }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="due_date">Due Date</option>
                        <option value="difficulty_asc">Difficulty (Low-High)</option>
                        <option value="difficulty_desc">Difficulty (High-Low)</option>
                    </select>
                    <ArrowUpDown
                        size={14}
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectFilters;
