import React, { useState } from 'react';
import {
    LayoutGrid, // Replaces LayoutDashboard for cleaner look
    Folder, // Clean folder icon
    CheckCheck, // Replaces CheckSquare
    PieChart, // Replaces BarChart2
    Settings,
    Layers
} from 'lucide-react';

const Sidebar = ({ activeTab, onNavigate, onLogoClick }) => {
    const [clickCount, setClickCount] = useState(0);

    const handleLogoClick = () => {
        setClickCount(prev => prev + 1);
    };

    React.useEffect(() => {
        if (clickCount === 3) {
            if (onLogoClick) onLogoClick();
            setClickCount(0);
        }

        let timer;
        if (clickCount > 0) {
            timer = setTimeout(() => setClickCount(0), 1000);
        }
        return () => clearTimeout(timer);
    }, [clickCount, onLogoClick]);

    // Using slightly more abstract icons for premium feel
    const menuItems = [
        { icon: LayoutGrid, label: 'Dashboard', id: 'dashboard' },
        { icon: Folder, label: 'Projects', id: 'projects' },
        { icon: CheckCheck, label: 'Tasks', id: 'tasks' },
        { icon: PieChart, label: 'Analytics', id: 'analytics' },
    ];

    return (
        <aside style={{
            width: '80px', // Slim sidebar by default (or user requested slim? "Slim, elegant, icon-first". Does that mean collapsed or just narrow? Let's go with narrow but labelled or just icons? "Icon-first". Let's stick to a clean vertical expanding sidebar or a fixed comfortable width. Prompt said "Sidebar: Slim, elegant". Let's try a compact 260px but with more padding.)
            // wait, "Slim, elegant, icon-first" might imply icon-only or very clean list. Let's stick to 240px-260px for readability but make it 'airy'.
            // actually, user said "Slim... icon-first". I will make it the standard sidebar width but with a cleaner icon-led design.
            width: '260px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            backgroundColor: 'var(--bg-sidebar)', // White
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50,
            // Removed border-right to depend on shadow or subtle BG difference. 
            // Prompt: "Minimal color palette... Background: #EAEBED". Sidebar is White?
            // "Sidebar: Slim, elegant".
            // Let's us a very subtle border.
            borderRight: '1px solid rgba(0,0,0,0.03)',
        }}>
            {/* Brand */}
            <div
                onClick={handleLogoClick}
                style={{
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '2rem',
                    marginBottom: '1rem',
                    cursor: 'default',
                    userSelect: 'none'
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--primary-600)'
                }}>
                    {/* Minimal Logo */}
                    <Layers size={24} strokeWidth={2.5} />
                    <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        letterSpacing: '-0.02em',
                        color: 'var(--gray-900)'
                    }}>
                        BUILTLY
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 1rem' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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
                                        gap: '1rem',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        // Active state: Minimal branding
                                        backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                                        color: isActive ? 'var(--primary-700)' : 'var(--gray-500)',
                                        fontWeight: isActive ? 600 : 500,
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        fontSize: '0.9375rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'var(--gray-50)';
                                            e.currentTarget.style.color = 'var(--gray-700)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = 'var(--gray-500)';
                                        }
                                    }}
                                >
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} style={{ opacity: isActive ? 1 : 0.8 }} />
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div style={{ padding: '2rem' }}>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--gray-400)',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    width: '100%',
                    opacity: 0.8,
                    transition: 'opacity 0.2s'
                }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
                >
                    <Settings size={18} />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
