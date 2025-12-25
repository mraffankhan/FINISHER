import React, { useState } from 'react';
import { Lock } from 'lucide-react';

const AdminModal = ({ isOpen, onClose, onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hardcoded password as requested
        if (password === 'affan@2023') {
            onLogin();
            onClose();
            setPassword('');
            setError(false);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '16px',
                width: '320px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                textAlign: 'center'
            }} onClick={e => e.stopPropagation()}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'var(--primary-50)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'var(--primary-500)'
                }}>
                    <Lock size={24} />
                </div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Owner Access</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: error ? '1px solid var(--danger)' : '1px solid var(--border-light)',
                            marginBottom: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: 'var(--primary-500)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600
                        }}
                    >
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminModal;
