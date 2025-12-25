import React from 'react';
import { User } from 'lucide-react';

const Header = () => {
    return (
        <header style={{
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem'
        }}>
            <div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Welcome back, Builder.</p>
            </div>

            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-600)',
                border: '2px solid white',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <User size={20} strokeWidth={2.5} />
            </div>
        </header>
    );
};

export default Header;
