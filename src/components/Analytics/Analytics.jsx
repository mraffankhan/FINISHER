import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CheckCheck, TrendingUp, AlertTriangle, Clock, Target, Calendar } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Analytics = ({ isOwner }) => {
    // Metrics State
    const [metrics, setMetrics] = useState({
        completionRate: 0,
        avgDaysToShip: 0,
        dropRate: 0,
        avgTaskTime: 0,
        estAccuracy: 100, // Percentage
        estGap: '0h' // Difference string
    });

    // Chart Data State
    const [efficiencyData, setEfficiencyData] = useState([]); // Bar: Difficulty vs Days
    const [cadenceData, setCadenceData] = useState([]); // Bar: Month vs Completed Projects

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            const { data: projects } = await supabase.from('projects').select('*');
            const { data: tasks } = await supabase.from('tasks').select('*');

            if (projects && tasks) {
                // 1. TOP SNAPSHOT METRICS
                const totalProjects = projects.length;
                const completedProjects = projects.filter(p => p.status === 'Completed');
                const droppedProjects = projects.filter(p => p.status === 'Dropped');

                const completionRate = totalProjects > 0 ? Math.round((completedProjects.length / totalProjects) * 100) : 0;
                const dropRate = totalProjects > 0 ? Math.round((droppedProjects.length / totalProjects) * 100) : 0;

                // Avg Days to Ship (Global)
                const statedDaysProjects = completedProjects.filter(p => p.actual_days);
                const avgDaysToShip = statedDaysProjects.length > 0
                    ? Math.round(statedDaysProjects.reduce((acc, curr) => acc + curr.actual_days, 0) / statedDaysProjects.length)
                    : 0;

                // 2. HERO: PROJECT EFFICIENCY (Difficulty vs Avg Days)
                const diffs = ['Easy', 'Medium', 'Hard'];
                const efficiencyChart = diffs.map(d => {
                    const projs = completedProjects.filter(p => p.difficulty === d && p.actual_days);
                    const avg = projs.length > 0 ? Math.round(projs.reduce((a, c) => a + c.actual_days, 0) / projs.length) : 0;
                    return { name: d, days: avg };
                });
                setEfficiencyData(efficiencyChart);

                // 3. SECONDARY: SHIPPING CADENCE (Projects per Month)
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const cadenceBuckets = months.map(m => ({ name: m, projects: 0 }));

                // Use completed_at logic. Since projects table doesn't have completed_at, use due_date or updated_at for now as proxy per previous logic
                // Or better, use due_date as the "Shipping Date" expectation for analytics consistency if actual completion timestamp missing on projects.
                // Re-using logic from Dashboard:
                completedProjects.filter(p => p.due_date).forEach(p => {
                    const date = new Date(p.due_date);
                    const month = date.getMonth();
                    if (cadenceBuckets[month]) {
                        cadenceBuckets[month].projects += 1;
                    }
                });
                setCadenceData(cadenceBuckets);

                // 4. BOTTOM: TIME & EFFORT (Task Insights)
                const completedTasks = tasks.filter(t => t.status === 'Completed');
                const tasksWithActuals = completedTasks.filter(t => t.actual_hours);

                const totalHours = tasksWithActuals.reduce((sum, t) => sum + Number(t.actual_hours), 0);
                const avgTaskTime = tasksWithActuals.length > 0
                    ? (totalHours / tasksWithActuals.length).toFixed(1)
                    : 0;

                // Est vs Actual Gap
                const tasksWithBoth = completedTasks.filter(t => t.actual_hours && t.estimated_hours);
                let totalActual = 0;
                let totalEst = 0;
                tasksWithBoth.forEach(t => {
                    totalActual += Number(t.actual_hours);
                    totalEst += Number(t.estimated_hours);
                });
                const estGapVal = totalActual - totalEst; // Positive = Underestimated (Took longer). Negative = Overestimated.
                const estGap = estGapVal > 0 ? `+${estGapVal}h (Over)` : `${estGapVal}h (Under)`;

                setMetrics({
                    completionRate,
                    avgDaysToShip,
                    dropRate,
                    avgTaskTime,
                    estGap // e.g. "+5h (Over)"
                });
            }
            setLoading(false);
        };
        fetchAnalytics();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'white', padding: '0.75rem 1rem', border: '1px solid var(--border-light)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 0 }}>{label}</p>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>{payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading Insights...</div>;

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="desktop-header" style={{ marginBottom: '3rem' }}>
                <div className="mobile-header-spacer" />
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Analytics
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                    How good are you at finishing projects?
                </p>
            </div>

            <div className="mobile-header-spacer" />

            {/* 1. PERFORMANCE SNAPSHOT (Large Cards) */}
            <section className="grid-responsive-3" style={{ marginBottom: '2.5rem' }}>
                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success)' }}>
                        <CheckCheck size={24} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Completion Rate</span>
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {metrics.completionRate}%
                    </div>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>Projects finished vs started</p>
                </div>

                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-600)' }}>
                        <TrendingUp size={24} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Speed</span>
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {metrics.avgDaysToShip}d
                    </div>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>Avg days to ship completed projects</p>
                </div>

                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--danger)' }}>
                        <AlertTriangle size={24} />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Drop Rate</span>
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                        {metrics.dropRate}%
                    </div>
                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>Projects you abandoned</p>
                </div>
            </section>

            {/* 2. CORE INSIGHT: PROJECT EFFICIENCY (Hero Chart) */}
            <section className="card" style={{ marginBottom: '2.5rem', padding: '2.5rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Project Efficiency</h2>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>How long you take to ship, by difficulty.</p>
                </div>

                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={efficiencyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}
                                dy={15}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--gray-50)', radius: 8 }} />
                            <Bar
                                dataKey="days"
                                fill="#006989"
                                radius={[6, 6, 6, 6]}
                                barSize={60}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </section>

            {/* 3. SHIPPING BEHAVIOR (Secondary Chart) + 4. TIME INSIGHTS (Cards) */}
            <section className="charts-grid"> {/* Uses 2fr 1fr grid logic */}

                {/* Shipping Cadence */}
                <div className="card">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Shipping Cadence</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Projects completed per month</p>
                    </div>
                    <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                            <BarChart data={cadenceData}>
                                <XAxis dataKey="name" hide /> {/* Cleaner look */}
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--gray-50)', radius: 4 }} />
                                <Bar dataKey="projects" fill="var(--primary-400)" radius={[4, 4, 4, 4]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Month Labels manually or via Legend? Let's keep XAxis but style it minimal */}
                </div>

                {/* Time & Effort Insights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Card 1 */}
                    <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                            <Clock size={20} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Avg Task Time</span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {metrics.avgTaskTime}h
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Per completed task</p>
                    </div>

                    {/* Card 2 */}
                    <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                            <Target size={20} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Est. Gap</span>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {metrics.estGap}
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total discrepancy</p>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default Analytics;

