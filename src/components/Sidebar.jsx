import React, { useState } from 'react';
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    BarChart2,
    LogOut,
    Layers,
    Settings
} from 'lucide-react';

const Sidebar = ({ activeTab, onNavigate, onLogoClick }) => {
    const [clickCount, setClickCount] = useState(0);

    const handleLogoClick = () => {
        setClickCount(prev => {
            const newCount = prev + 1;
            if (newCount === 3) {
                // Trigger modal and reset
                if (onLogoClick) onLogoClick();
                return 0;
            }
            // Reset after 1 second if not reached 3
            setTimeout(() => setClickCount(0), 1000);
            return newCount;
        });
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
        { icon: FolderKanban, label: 'Projects', id: 'projects' },
        { icon: CheckSquare, label: 'Tasks', id: 'tasks' },
        { icon: BarChart2, label: 'Analytics', id: 'analytics' },
    ];

    return (
        <aside style={{
            width: '280px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            borderRight: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-sidebar)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
            paddingTop: '1rem'
        }}>
            {/* App Logo with Hidden Click Trigger */}
            <div
                onClick={handleLogoClick}
                style={{
                    padding: '2rem 2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    marginBottom: '1rem',
                    cursor: 'default',
                    userSelect: 'none',
                    WebkitUserSelect: 'none'
                }}
            >
                <div style={{
                    width: '42px',
                    height: '42px',
                    background: 'linear-gradient(135deg, var(--primary-600), var(--primary-500))',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0, 105, 137, 0.3)'
                }}>
                    <Layers size={22} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>BUILTLY</span>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 1rem' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onNavigate(item.id)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.875rem',
                                        padding: '0.875rem 1.25rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: isActive ? '1px solid var(--border-light)' : '1px solid transparent',
                                        backgroundColor: isActive ? 'var(--bg-app)' : 'transparent',
                                        color: isActive ? 'var(--primary-600)' : 'var(--text-secondary)',
                                        fontWeight: isActive ? 600 : 500,
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'var(--bg-app)';
                                            e.currentTarget.style.color = 'var(--text-primary)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                        }
                                    }}
                                >
                                    <Icon size={20} style={{ opacity: isActive ? 1 : 0.7 }} />
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer / User Profile */}
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--bg-app)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Settings size={18} color="var(--text-muted)" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Preferences</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>v1.0.0 (Public)</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
