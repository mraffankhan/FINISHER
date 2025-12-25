import React from 'react';

const StatsCard = ({ title, value, icon: Icon, subtext, trend }) => {
    return (
        <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'default'
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    letterSpacing: '0.02em'
                }}>
                    {title}
                </span>
                {Icon && <Icon size={20} color="var(--gray-400)" strokeWidth={1.5} />}
            </div>

            <div>
                <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1
                }}>
                    {value}
                </div>

                {subtext && (
                    <div style={{
                        marginTop: '0.75rem',
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        fontWeight: 500
                    }}>
                        {subtext}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
