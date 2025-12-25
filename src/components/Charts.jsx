import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'white',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-glow)'
            }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 0 }}>{label || payload[0].name}</p>
                <p style={{ color: 'var(--primary-600)', margin: 0, fontWeight: 500 }}>{payload[0].value} Projects</p>
            </div>
        );
    }
    return null;
};

const Charts = ({ activityData, difficultyData }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1rem' }}>

            {/* Activity Chart */}
            <div className="card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '2rem', color: 'var(--text-primary)' }}>Projects Completed</h3>
                <div style={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer>
                        <BarChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--primary-50)', radius: 8 }} />
                            <Bar
                                dataKey="projects"
                                fill="var(--primary-500)"
                                radius={[6, 6, 6, 6]}
                                barSize={48}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Difficulty Chart */}
            <div className="card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '2rem', color: 'var(--text-primary)' }}>Difficulty Split</h3>
                <div style={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={difficultyData}
                                innerRadius={70}
                                outerRadius={90}
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
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                    {difficultyData.map((d) => (
                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: d.color }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{d.name}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Charts;
