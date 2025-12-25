import React from 'react';

const StatsCard = ({ title, value, subtext, icon: Icon, trend }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {title}
                </span>
                {Icon && (
                    <div style={{
                        padding: '8px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary-50)',
                        color: 'var(--primary-600)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Icon size={18} />
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    marginBottom: '0.25rem'
                }}>
                    {value}
                </span>

                {(subtext || trend) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {trend && (
                            <span style={{
                                fontSize: '0.875rem',
                                color: trend > 0 ? 'var(--success)' : 'var(--danger)',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                {trend > 0 ? '+' : ''}{trend}%
                            </span>
                        )}
                        {subtext && (
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                {subtext}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
