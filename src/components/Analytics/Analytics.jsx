import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import StatsCard from '../StatsCard';
import { Layers, CheckCheck, TrendingUp, AlertTriangle, Clock, Calendar, Hash, Target } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Analytics = ({ isOwner }) => {
    const [metrics, setMetrics] = useState({
        started: 0, completed: 0, completionRate: 0,
        avgBuildTime: 0, longestRunning: 0,
        avgTaskTime: 0, totalHoursLogged: 0, estAccuracy: 1 // 1 = 100% accurate
    });
    const [monthlyHoursData, setMonthlyHoursData] = useState([]);
    const [completionTimeData, setCompletionTimeData] = useState([]);
    const [taskDifficultyData, setTaskDifficultyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            const { data: projects } = await supabase.from('projects').select('*');
            const { data: tasks } = await supabase.from('tasks').select('*');

            if (projects && tasks) {
                // --- PROJECTS METRICS ---
                const started = projects.length;
                const completed = projects.filter(p => p.status === 'Completed').length;
                const completionRate = started > 0 ? Math.round((completed / started) * 100) : 0;

                const completedProjects = projects.filter(p => p.status === 'Completed' && p.actual_days);
                const avgBuildTime = completedProjects.length > 0
                    ? Math.round(completedProjects.reduce((acc, curr) => acc + curr.actual_days, 0) / completedProjects.length)
                    : 0;

                // --- TASKS METRICS ---
                const completedTasks = tasks.filter(t => t.status === 'Completed');

                // Avg Time Per Task
                const tasksWithActuals = completedTasks.filter(t => t.actual_hours);
                const totalHoursLogged = tasksWithActuals.reduce((sum, t) => sum + Number(t.actual_hours), 0);
                const avgTaskTime = tasksWithActuals.length > 0
                    ? (totalHoursLogged / tasksWithActuals.length).toFixed(1)
                    : 0;

                // Estimation Accuracy (Actual / Est)
                // Ideal is 1.0. > 1.0 means under-estimated. < 1.0 means over-estimated.
                const tasksWithBoth = completedTasks.filter(t => t.actual_hours && t.estimated_hours);
                let totalActual = 0;
                let totalEst = 0;
                tasksWithBoth.forEach(t => {
                    totalActual += Number(t.actual_hours);
                    totalEst += Number(t.estimated_hours);
                });
                const estAccuracy = totalEst > 0 ? ((totalActual / totalEst) * 100).toFixed(0) : 100; // Percentage of estimate

                setMetrics({
                    started, completed, completionRate, avgBuildTime,
                    avgTaskTime, totalHoursLogged, estAccuracy
                });

                // --- CHARTS ---

                // 1. Difficulty Efficiency (Existing)
                const diffs = ['Easy', 'Medium', 'Hard'];
                const timeByDiff = diffs.map(d => {
                    const projs = projects.filter(p => p.difficulty === d && p.status === 'Completed' && p.actual_days);
                    const avg = projs.length > 0 ? Math.round(projs.reduce((a, c) => a + c.actual_days, 0) / projs.length) : 0;
                    return { name: d, days: avg };
                });
                setCompletionTimeData(timeByDiff);

                // 2. Task Load (Existing)
                const taskEasy = tasks.filter(t => t.difficulty === 'Easy').length;
                const taskMed = tasks.filter(t => t.difficulty === 'Medium').length;
                const taskHard = tasks.filter(t => t.difficulty === 'Hard').length;
                setTaskDifficultyData([
                    { name: 'Low', value: taskEasy, color: '#10b981' },
                    { name: 'Med', value: taskMed, color: '#006989' },
                    { name: 'High', value: taskHard, color: '#ef4444' }
                ]);

                // 3. Monthly Hours (NEW)
                // Bucket tasks by Month of Completion (completed_at)
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const hoursMap = {}; // "Jan": 24, "Feb": 40...

                // Initialize last 6 months
                const today = new Date();
                for (let i = 5; i >= 0; i--) {
                    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                    const label = monthNames[d.getMonth()];
                    hoursMap[label] = 0;
                }

                // Fill buckets
                tasksWithActuals.forEach(t => {
                    // Use completed_at if available, else updated_at, else due_date. 
                    // Best effort for Manual time.
                    const dateStr = t.completed_at || t.updated_at || t.due_date;
                    if (dateStr) {
                        const date = new Date(dateStr);
                        const label = monthNames[date.getMonth()];
                        // Only add if it's in our window (simple check key existence)
                        if (hoursMap[label] !== undefined) {
                            hoursMap[label] += Number(t.actual_hours);
                        }
                    }
                });

                const hoursChartData = Object.keys(hoursMap).map(m => ({ name: m, hours: hoursMap[m] }));
                setMonthlyHoursData(hoursChartData);
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
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>{payload[0].value} {payload[0].name === 'hours' ? 'hrs' : ''}</p>
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
                        <StatsCard title="Completed Projects" value={metrics.completed} icon={CheckCheck} />
                        <StatsCard title="Avg Task Time" value={`${metrics.avgTaskTime}h`} icon={Clock} subtext="Actual hours" />
                        <StatsCard title="Total Hours" value={metrics.totalHoursLogged} icon={Layers} subtext="Lifetime logged" />
                        <StatsCard title="Est. Accuracy" value={`${metrics.estAccuracy}%`} icon={Target} subtext="Actual vs Est" />
                    </div>
                </section>

                {/* 2. Monthly Execution & Task Load */}
                <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

                    {/* Monthly Hours Chart (Line) */}
                    <div className="card">
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Execution Volume</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total hours logged per month</p>
                        </div>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <LineChart data={monthlyHoursData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="hours" stroke="var(--primary-600)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary-600)' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Task Difficulty */}
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

                {/* 3. Project Efficiency (Bar) */}
                <section className="card">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Project Efficiency</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Avg days to ship by difficulty</p>
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
                </section>

            </div>
        </div>
    );
};

export default Analytics;
