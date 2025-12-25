import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const CompletionModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'white', padding: '2rem', borderRadius: '16px', width: '400px',
                boxShadow: 'var(--shadow-lg)', textAlign: 'center'
            }} onClick={e => e.stopPropagation()}>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Mark as Completed</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>How was this task completed?</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <button
                        onClick={() => onConfirm('full')}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                            padding: '1.5rem', borderRadius: '12px', border: '2px solid var(--success)',
                            backgroundColor: 'var(--bg-app)', cursor: 'pointer', color: 'var(--success)'
                        }}
                    >
                        <CheckCircle2 size={32} />
                        <span style={{ fontWeight: 700 }}>Fully Done</span>
                    </button>

                    <button
                        onClick={() => onConfirm('partial')}
                        style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                            padding: '1.5rem', borderRadius: '12px', border: '2px solid var(--text-secondary)',
                            backgroundColor: 'white', cursor: 'pointer', color: 'var(--text-secondary)'
                        }}
                    >
                        <Circle size={32} strokeStyle="dashed" />
                        <span style={{ fontWeight: 600 }}>Partially</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompletionModal;
