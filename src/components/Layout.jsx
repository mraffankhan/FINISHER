import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, onNavigate, onLogoClick }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar activeTab={activeTab} onNavigate={onNavigate} onLogoClick={onLogoClick} />
            <main style={{
                marginLeft: '260px',
                width: 'calc(100% - 260px)',
                padding: '2.5rem 3.5rem', // Generous spacing
                minHeight: '100vh',
                backgroundColor: 'var(--bg-app)'
            }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
