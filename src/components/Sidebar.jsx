import React, { useState } from 'react';
import {
    LayoutGrid,
    Folder,
    CheckCheck,
    PieChart,
    Settings,
    Layers,
    X // For closing on mobile
} from 'lucide-react';

const Sidebar = ({ activeTab, onNavigate, onLogoClick, isOpen, onClose }) => {
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

    const menuItems = [
        { icon: LayoutGrid, label: 'Dashboard', id: 'dashboard' },
        { icon: Folder, label: 'Projects', id: 'projects' },
        { icon: CheckCheck, label: 'Tasks', id: 'tasks' },
        { icon: PieChart, label: 'Analytics', id: 'analytics' },
    ];

    return (
        <aside
            className={`sidebar-responsive ${isOpen ? 'open' : ''}`}
            style={{
                width: '260px',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                backgroundColor: 'var(--bg-sidebar)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 50,
                borderRight: '1px solid rgba(0,0,0,0.03)',
                // Transition handled by class
            }}
        >
            {/* Brand - Desktop Header / Mobile Drawer Header */}
            <div style={{
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '2rem',
                paddingRight: '1.5rem',
                marginBottom: '1rem',
            }}>
                <div
                    onClick={handleLogoClick}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: 'var(--primary-600)',
                        cursor: 'default',
                        userSelect: 'none'
                    }}
                >
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

                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="mobile-close-btn" // define in css if needed or inline media query logic 
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--gray-500)',
                        cursor: 'pointer',
                        display: 'none' // Hidden by default (desktop)
                        // logic to show this is complex inline without media query, 
                        // but since sidebar is transformed out on mobile, we can just leave it visible flex-wise
                        // and the whole sidebar hides. Wait, on desktop we don't want X.
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Style hack for mobile close button visibility */}
            <style>{`
                @media (max-width: 768px) {
                    .mobile-close-btn { display: block !important; }
                }
             `}</style>


            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 1rem' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none' }}>
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
