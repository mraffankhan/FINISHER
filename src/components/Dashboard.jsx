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
        streak: 0
    });
    const [activityData, setActivityData] = useState([]);
    const [difficultyData, setDifficultyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);

            // Fetch Projects (Public)
            const { data: projects, error: projectsError } = await supabase
                .from('projects')
                .select('*');

            if (projectsError) console.error('Error fetching projects:', projectsError);

            if (projects) {
                // Calculate Stats
                const total = projects.length;
                const completed = projects.filter(p => p.status === 'Completed').length;
                const active = projects.filter(p => p.status === 'In Progress').length;
                const dropped = projects.filter(p => p.status === 'Dropped').length;
                const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

                const completedProjects = projects.filter(p => p.status === 'Completed' && p.actual_days);
                const avgDays = completedProjects.length > 0
                    ? Math.round(completedProjects.reduce((acc, curr) => acc + curr.actual_days, 0) / completedProjects.length)
                    : 0;

                setStats({
                    total,
                    completed,
                    active,
                    dropped,
                    avgTime: `${avgDays}d`,
                    completionRate,
                    streak: 0
                });

                const easy = projects.filter(p => p.difficulty === 'Easy').length;
                const medium = projects.filter(p => p.difficulty === 'Medium').length;
                const hard = projects.filter(p => p.difficulty === 'Hard').length;

                setDifficultyData([
                    { name: 'Easy', value: easy, color: '#059669' },
                    { name: 'Medium', value: medium, color: '#006989' },
                    { name: 'Hard', value: hard, color: '#dc2626' },
                ]);

                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                // Initialize current year buckets
                const activityBuckets = months.map(m => ({ name: m, projects: 0 }));

                projects.filter(p => p.status === 'Completed' && p.due_date).forEach(p => {
                    const date = new Date(p.due_date);
                    const month = date.getMonth();
                    if (activityBuckets[month]) {
                        activityBuckets[month].projects += 1;
                    }
                });

                setActivityData(activityBuckets.slice(0, 6));
            }

            setLoading(false);
        };

        fetchDashboardData();
    }, []);

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
                <StatsCard title="Active Build" value={stats.active} icon={Zap} />
                <StatsCard title="Ship Rate" value={`${stats.completionRate}%`} icon={TrendingUp} subtext="Keep shipping." />
                <StatsCard title="Avg Time To Ship" value={stats.avgTime} icon={Clock} />
            </div>

            {/* Charts Section - Simple & Readable */}
            <Charts activityData={activityData} difficultyData={difficultyData} />

        </div>
    );
};

export default Dashboard;
