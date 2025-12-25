import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import Charts from './Charts';
import { Layers, CheckCheck, TrendingUp, Zap, Clock, Calendar } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Dashboard = ({ isOwner }) => {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        active: 0,
        dropped: 0,
        avgTime: '0d',
        completionRate: 0,
        // streak: 0 // Optional
    });
    const [activityData, setActivityData] = useState([]);
    const [difficultyData, setDifficultyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);

            // Fetch Projects (Public) - FRESH FETCH
            const { data: projects, error: projectsError } = await supabase
                .from('projects')
                .select('*');

            if (projectsError) console.error('Error fetching projects:', projectsError);

            if (projects) {
                // FORCE RE-CALCULATION based on fresh payload
                const total = projects.length;

                // Status Counts - Exact String Matches
                const completed = projects.filter(p => p.status === 'Completed').length;
                const active = projects.filter(p => p.status === 'In Progress').length;
                const dropped = projects.filter(p => p.status === 'Dropped').length;
                // 'Not Started' is implicit remainder or we can count it
                const notStarted = projects.filter(p => p.status === 'Not Started').length;

                const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

                const completedProjects = projects.filter(p => p.status === 'Completed' && p.actual_days);
                const avgDays = completedProjects.length > 0
                    ? Math.round(completedProjects.reduce((acc, curr) => acc + curr.actual_days, 0) / completedProjects.length)
                    : 0;

                setStats({
                    total,
                    completed,
                    active, // "Active Build" usually implies In Progress
                    dropped,
                    avgTime: `${avgDays}d`,
                    completionRate,
                });

                // Difficulty Split
                const easy = projects.filter(p => p.difficulty === 'Easy').length;
                const medium = projects.filter(p => p.difficulty === 'Medium').length;
                const hard = projects.filter(p => p.difficulty === 'Hard').length;

                setDifficultyData([
                    { name: 'Easy', value: easy, color: '#059669' },
                    { name: 'Medium', value: medium, color: '#006989' },
                    { name: 'Hard', value: hard, color: '#dc2626' },
                ]);

                // Activity (Shipping Cadence)
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const activityBuckets = months.map(m => ({ name: m, projects: 0 }));

                projects.filter(p => p.status === 'Completed' && p.due_date).forEach(p => {
                    const date = new Date(p.due_date);
                    const month = date.getMonth();
                    if (activityBuckets[month]) {
                        activityBuckets[month].projects += 1;
                    }
                });

                setActivityData(activityBuckets); // Show full year Jan-Dec
            }

            setLoading(false);
        };

        fetchDashboardData();
    }, []); // Runs on mount. If user navigates away and back, it runs again, refreshing data.

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;
    }

    return (
        <div>
            {/* Header: Clean & Welcoming */}
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Dashboard
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                    {isOwner ? 'Execution mode.' : 'Building in public.'}
                </p>
            </div>

            {/* Top Stats Grid - 4 Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatsCard title="Completed Projects" value={stats.completed} icon={CheckCheck} />
                <StatsCard title="Active Builds" value={stats.active} icon={Zap} subtext="In Progress" />
                <StatsCard title="Ship Rate" value={`${stats.completionRate}%`} icon={TrendingUp} subtext="Completion %" />
                <StatsCard title="Avg Time To Ship" value={stats.avgTime} icon={Clock} />
            </div>

            {/* Charts Section - Simple & Readable */}
            <Charts activityData={activityData} difficultyData={difficultyData} />

        </div>
    );
};

export default Dashboard;
