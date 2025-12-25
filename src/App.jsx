import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import Projects from './components/Projects'
import Analytics from './components/Analytics/Analytics'
import AdminModal from './components/AdminModal'

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isOwner, setIsOwner] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    // Still checking session solely for "write" capability if we decide to align Auth later, 
    // but for UI strictly using isOwner based on password.
    // We do NOT block rendering.

    const handleLogin = async () => {
        setIsOwner(true);
        // Optional: silently sign in to Supabase if you wanted real RLS security
        // await supabase.auth.signInWithPassword({ email: 'admin@builtly.com', password: '...' })
    };

    return (
        <>
            <Layout
                activeTab={activeTab}
                onNavigate={setActiveTab}
                onLogoClick={() => setModalOpen(true)}
                isOwner={isOwner}
            >
                {activeTab === 'dashboard' && <Dashboard isOwner={isOwner} />}
                {activeTab === 'projects' && <Projects isOwner={isOwner} />}
                {activeTab === 'tasks' && <Tasks isOwner={isOwner} />}
                {activeTab === 'analytics' && <Analytics isOwner={isOwner} />}
            </Layout>

            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onLogin={handleLogin}
            />
        </>
    )
}

export default App
