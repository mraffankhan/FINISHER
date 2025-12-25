import React, { useState } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { Layers, Plus } from 'lucide-react';

const Layout = ({ children, activeTab, onNavigate, onLogoClick, isOwner }) => {
    // Sidebar state only for desktop (if we ever want a toggle there, but user said fixed sidebar on desktop)
    // Actually, user said fixed left sidebar on desktop, NO sidebar on mobile.
    // So we don't need sidebar toggle logic for mobile anymore.

    const [clickCount, setClickCount] = useState(0);

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

    // Map tab ID to Title
    const titles = {
        'dashboard': 'Dashboard',
        'projects': 'Projects',
        'tasks': 'Tasks',
        'analytics': 'Analytics'
    };

    return (
        <div className="main-wrapper">
            {/* Mobile App Header (Sticky Top) */}
            <div className="mobile-app-header">
                <div style={{ width: 40 }}> {/* Spacer or Left Action */} </div>

                <h1
                    className="mobile-app-title"
                    onClick={() => setClickCount(prev => prev + 1)}
                    style={{ userSelect: 'none' }}
                >
                    {titles[activeTab] || 'BUILTLY'}
                </h1>

                <div style={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>
                    {/* Contextual Action (e.g. Add) - logic handled inside pages usually,
                         but generic placeholder/owner button could go here or we leave empty for page content to handle */}
                    {isOwner && (activeTab === 'projects' || activeTab === 'tasks') && (
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--primary-50)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)'
                        }}>
                            <Plus size={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar (Desktop Only) */}
            <div className="desktop-sidebar-wrapper">
                <Sidebar
                    activeTab={activeTab}
                    onNavigate={onNavigate}
                    onLogoClick={onLogoClick}
                />
            </div>

            {/* Main Content */}
            <main className="main-content">
                {children}
            </main>

            {/* Bottom Nav (Mobile Only) */}
            <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
        </div>
    );
};

export default Layout;
