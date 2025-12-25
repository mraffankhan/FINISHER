import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import Charts from './Charts';
import { Layers, CheckCircle2, Calendar, TrendingUp, AlertOctagon, Activity, Clock } from 'lucide-react';
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
                    { name: 'Easy', value: easy, color: '#10b981' },
                    { name: 'Medium', value: medium, color: '#006989' },
                    { name: 'Hard', value: hard, color: '#ef4444' },
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
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading dashboard...</div>;
    }

    return (
        <div style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        {isOwner ? 'Welcome back, Owner.' : 'Public View - Read Only'}
                    </p>
                </div>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-600)',
                    fontWeight: 700
                }}>
                    {isOwner ? 'A' : 'G'}
                </div>
            </div>

            {/* Top Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2.5rem' }}>
                <StatsCard title="Total Projects" value={stats.total} icon={Layers} />
                <StatsCard title="Completed" value={stats.completed} icon={CheckCircle2} />
                <StatsCard title="Active Builds" value={stats.active} icon={Activity} />
                <StatsCard title="Dropped" value={stats.dropped} subtext="Learning experiences" icon={AlertOctagon} />
            </div>

            {/* Secondary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '2.5rem' }}>
                <StatsCard title="Avg Build Time" value={stats.avgTime} icon={Clock} />
                <StatsCard title="Completion Rate" value={`${stats.completionRate}%`} trend={0} icon={TrendingUp} />
                <StatsCard title="Work Streak" value={`${stats.streak} Days`} subtext={isOwner ? "Keep pushing!" : "Consistency"} icon={Calendar} />
            </div>

            {/* Charts Section */}
            <Charts activityData={activityData} difficultyData={difficultyData} />

        </div>
    );
};

export default Dashboard;
