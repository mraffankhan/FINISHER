import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import StatsCard from '../StatsCard';
import { Layers, CheckCircle2, TrendingUp, AlertOctagon, Clock, Calendar, Hash } from 'lucide-react';
import { supabase } from '../../supabaseClient';

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
                <p style={{ color: 'var(--primary-600)', margin: 0, fontWeight: 500 }}>{payload[0].value} {payload[0].dataKey === 'days' ? 'Days' : 'Projects'}</p>
            </div>
        );
    }
    return null;
};

const Analytics = ({ isOwner }) => {
    const [metrics, setMetrics] = useState({
        started: 0,
        completed: 0,
        completionRate: 0,
        dropRate: 0,
        avgBuildTime: 0,
        longestRunning: 0,
        avgTimePerTask: 0
    });
    const [completionTimeData, setCompletionTimeData] = useState([]);
    const [projectsTrendData, setProjectsTrendData] = useState([]);
    const [taskDifficultyData, setTaskDifficultyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);

            // Fetch all projects (Public)
            const { data: projects, error: pError } = await supabase
                .from('projects')
                .select('*');

            // Fetch all tasks (Public)
            const { data: tasks, error: tError } = await supabase
                .from('tasks')
                .select('*');

            if (pError || tError) console.error(pError || tError);

            if (projects && tasks) {
                // 1. Overview
                const started = projects.length;
                const completed = projects.filter(p => p.status === 'Completed').length;
                const dropped = projects.filter(p => p.status === 'Dropped').length;
                const completionRate = started > 0 ? Math.round((completed / started) * 100) : 0;
                const dropRate = started > 0 ? Math.round((dropped / started) * 100) : 0;

                // 2. Build Time
                const completedProjects = projects.filter(p => p.status === 'Completed' && p.actual_days);
                const avgBuildTime = completedProjects.length > 0
                    ? Math.round(completedProjects.reduce((acc, curr) => acc + curr.actual_days, 0) / completedProjects.length)
                    : 0;

                // Avg Time by Difficulty
                const diffs = ['Easy', 'Medium', 'Hard'];
                const timeByDiff = diffs.map(d => {
                    const projs = projects.filter(p => p.difficulty === d && p.status === 'Completed' && p.actual_days);
                    const avg = projs.length > 0
                        ? Math.round(projs.reduce((a, c) => a + c.actual_days, 0) / projs.length)
                        : 0;
                    return { name: d, days: avg };
                });

                // 3. Productivity Trends
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const trendBuckets = months.map(m => ({ name: m, count: 0 }));
                projects.filter(p => p.status === 'Completed' && p.due_date).forEach(p => {
                    const date = new Date(p.due_date);
                    const month = date.getMonth();
                    if (trendBuckets[month]) {
                        trendBuckets[month].count += 1;
                    }
                });

                const longest = projects.reduce((max, p) => (p.actual_days > max ? p.actual_days : max), 0);

                // 4. Task Level
                const taskEasy = tasks.filter(t => t.difficulty === 'Easy').length;
                const taskMed = tasks.filter(t => t.difficulty === 'Medium').length;
                const taskHard = tasks.filter(t => t.difficulty === 'Hard').length;

                const taskDiffs = [
                    { name: 'Low', value: taskEasy, color: '#10b981' },
                    { name: 'Med', value: taskMed, color: '#006989' },
                    { name: 'High', value: taskHard, color: '#ef4444' }
                ];

                const completedTasks = tasks.filter(t => t.status === 'Completed' && t.actual_hours);
                const avgTaskTime = completedTasks.length > 0
                    ? (completedTasks.reduce((a, c) => a + c.actual_hours, 0) / completedTasks.length).toFixed(1)
                    : 0;

                setMetrics({ started, completed, completionRate, dropRate, avgBuildTime, longestRunning: longest, avgTimePerTask: avgTaskTime });
                setCompletionTimeData(timeByDiff);
                setProjectsTrendData(trendBuckets.slice(0, 6));
                setTaskDifficultyData(taskDiffs);
            }
            setLoading(false);
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading analytics...</div>;

    return (
        <div>
            {/* Header */}
            <header style={{
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Analytics</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {isOwner ? 'Deep dive into your execution metrics.' : 'Public Execution Metrics'}
                    </p>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* 1. Performance Overview */}
                <section>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        <StatsCard title="Started" value={metrics.started} icon={Layers} />
                        <StatsCard title="Completed" value={metrics.completed} subtext="Projects shipped" icon={CheckCircle2} />
                        <StatsCard title="Completion Rate" value={`${metrics.completionRate}%`} icon={TrendingUp} />
                        <StatsCard title="Drop Rate" value={`${metrics.dropRate}%`} subtext="Projects abandoned" icon={AlertOctagon} />
                    </div>
                </section>

                {/* 2. Time Analysis */}
                <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                            Avg. Time by Difficulty
                        </h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={completionTimeData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--primary-50)', radius: 8 }} />
                                    <Bar dataKey="days" fill="var(--primary-500)" radius={[6, 6, 6, 6]} barSize={48} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <StatsCard title="Avg Build Time" value={`${metrics.avgBuildTime} Days`} subtext="Across all projects" icon={Clock} />
                        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.7 }}>
                            <Clock size={32} color="var(--primary-500)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Time efficiency is improving</span>
                        </div>
                    </div>
                </section>

                {/* 3. Productivity Trends */}
                <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                            Projects Completed (Trend)
                        </h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <LineChart data={projectsTrendData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="count" stroke="var(--primary-500)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary-500)', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <StatsCard title="Longest Running" value={`${metrics.longestRunning} Days`} subtext="Deep work" icon={Calendar} />
                </section>

                {/* 4. Task Level Insights */}
                <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                            Task Difficulty
                        </h3>
                        <div style={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={taskDifficultyData}
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {taskDifficultyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0rem' }}>
                            {taskDifficultyData.map((d) => (
                                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: d.color }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <StatsCard title="Avg Time / Task" value={`${metrics.avgTimePerTask} Hrs`} subtext="Based on completed tasks" icon={Hash} />
                </section>
            </div>
        </div>
    );
};

export default Analytics;
