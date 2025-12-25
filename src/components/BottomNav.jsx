import React from 'react';
import { LayoutGrid, Folder, CheckCheck, PieChart } from 'lucide-react';

const BottomNav = ({ activeTab, onNavigate }) => {
    const tabs = [
        { id: 'dashboard', icon: LayoutGrid, label: 'Home' },
        { id: 'projects', icon: Folder, label: 'Projects' },
        { id: 'tasks', icon: CheckCheck, label: 'Tasks' },
        { id: 'analytics', icon: PieChart, label: 'Stats' },
    ];

    return (
        <div className="bottom-nav">
            {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onNavigate(tab.id)}
                        className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="bottom-nav-label">{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
