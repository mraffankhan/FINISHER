import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Charts = ({ activityData, difficultyData }) => {

    // Custom Minimal Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'white',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-light)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 0 }}>{label}</p>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>{payload[0].value} Projects</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

            {/* Activity Chart */}
            <div className="card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Shipping Cadence</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Projects completed per month</p>
                </div>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <BarChart data={activityData}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}
                                dy={10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--gray-50)', radius: 4 }} />
                            <Bar
                                dataKey="projects"
                                fill="var(--primary-600)"
                                radius={[4, 4, 4, 4]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Difficulty Split (Donut) */}
            <div className="card">
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Difficulty Split</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Where you spend effort</p>
                </div>
                <div style={{ width: '100%', height: 200, position: 'relative' }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={difficultyData}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {difficultyData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center Text (Total Projects?) Optional */}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                    {difficultyData.map((d) => (
                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: d.color }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{d.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Charts;
