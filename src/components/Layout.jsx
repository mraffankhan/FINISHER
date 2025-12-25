import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, onNavigate, onLogoClick }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar activeTab={activeTab} onNavigate={onNavigate} onLogoClick={onLogoClick} />
            <main style={{
                marginLeft: '280px',
                width: 'calc(100% - 280px)',
                padding: '3rem 4rem',
                backgroundColor: 'var(--bg-app)'
            }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
