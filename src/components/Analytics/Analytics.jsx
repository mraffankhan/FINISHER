import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import StatsCard from '../StatsCard';
import { Layers, CheckCheck, TrendingUp, AlertTriangle, Clock, Calendar, Hash } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Analytics = ({ isOwner }) => {
    // ... (State logic same as before, preserving data handling) ...
    const [metrics, setMetrics] = useState({
        started: 0, completed: 0, completionRate: 0, dropRate: 0,
        avgBuildTime: 0, longestRunning: 0, avgTimePerTask: 0
    });
    const [completionTimeData, setCompletionTimeData] = useState([]);
    const [projectsTrendData, setProjectsTrendData] = useState([]);
    const [taskDifficultyData, setTaskDifficultyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            // ... (Logic preserved for brevity, re-implementing exact fetching)
            // For this output, I am focusing on the JSX Structure redesign.
            // Assumption: Data structure remains identical.
            setLoading(true);
            const { data: projects } = await supabase.from('projects').select('*');
            const { data: tasks } = await supabase.from('tasks').select('*');

            if (projects && tasks) {
                const started = projects.length;
                const completed = projects.filter(p => p.status === 'Completed').length;
                const dropped = projects.filter(p => p.status === 'Dropped').length;
                const completionRate = started > 0 ? Math.round((completed / started) * 100) : 0;
                const dropRate = started > 0 ? Math.round((dropped / started) * 100) : 0;

                const completedProjects = projects.filter(p => p.status === 'Completed' && p.actual_days);
                const avgBuildTime = completedProjects.length > 0
                    ? Math.round(completedProjects.reduce((acc, curr) => acc + curr.actual_days, 0) / completedProjects.length)
                    : 0;

                // Diff Logic
                const diffs = ['Easy', 'Medium', 'Hard'];
                const timeByDiff = diffs.map(d => {
                    const projs = projects.filter(p => p.difficulty === d && p.status === 'Completed' && p.actual_days);
                    const avg = projs.length > 0 ? Math.round(projs.reduce((a, c) => a + c.actual_days, 0) / projs.length) : 0;
                    return { name: d, days: avg };
                });

                // Trend Logic
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const trendBuckets = months.map(m => ({ name: m, count: 0 }));
                projects.filter(p => p.status === 'Completed' && p.due_date).forEach(p => {
                    const month = new Date(p.due_date).getMonth();
                    if (trendBuckets[month]) trendBuckets[month].count++;
                });

                const longest = projects.reduce((max, p) => (p.actual_days > max ? p.actual_days : max), 0);

                // Task Logic
                const taskEasy = tasks.filter(t => t.difficulty === 'Easy').length;
                const taskMed = tasks.filter(t => t.difficulty === 'Medium').length;
                const taskHard = tasks.filter(t => t.difficulty === 'Hard').length;
                const taskDiffs = [
                    { name: 'Low', value: taskEasy, color: '#10b981' },
                    { name: 'Med', value: taskMed, color: '#006989' },
                    { name: 'High', value: taskHard, color: '#ef4444' }
                ];

                const completedTasks = tasks.filter(t => t.status === 'Completed' && t.actual_hours);
                const avgTaskTime = completedTasks.length > 0 ? (completedTasks.reduce((a, c) => a + c.actual_hours, 0) / completedTasks.length).toFixed(1) : 0;

                setMetrics({ started, completed, completionRate, dropRate, avgBuildTime, longestRunning: longest, avgTimePerTask: avgTaskTime });
                setCompletionTimeData(timeByDiff);
                setProjectsTrendData(trendBuckets.slice(0, 6)); // First 6 months for visual cleanliness
                setTaskDifficultyData(taskDiffs);
            }
            setLoading(false);
        };
        fetchAnalytics();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'white', padding: '0.75rem 1rem', border: '1px solid var(--border-light)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 0 }}>{label || payload[0].name}</p>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>{payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading Analytics...</div>;

    return (
        <div>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Analytics
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                    {isOwner ? 'Deep dive into your execution metrics.' : 'Public Execution Metrics'}
                </p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                {/* 1. Velocity Row */}
                <section>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Velocity</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        <StatsCard title="Started" value={metrics.started} icon={Layers} />
                        <StatsCard title="Shipped" value={metrics.completed} icon={CheckCheck} />
                        <StatsCard title="Success Rate" value={`${metrics.completionRate}%`} icon={TrendingUp} />
                        <StatsCard title="Avg Build Time" value={`${metrics.avgBuildTime}d`} icon={Clock} />
                    </div>
                </section>

                {/* 2. Deep Dive Row */}
                <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                    <div className="card">
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Efficiency by Difficulty</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Days to complete projects</p>
                        </div>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <BarChart data={completionTimeData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} dy={10} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--gray-50)', radius: 4 }} />
                                    <Bar dataKey="days" fill="var(--primary-600)" radius={[4, 4, 4, 4]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Task Load</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Complexity distribution</p>
                        </div>
                        <div style={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={taskDifficultyData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {taskDifficultyData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                            {taskDifficultyData.map(d => (
                                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: d.color }} />
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Analytics;
