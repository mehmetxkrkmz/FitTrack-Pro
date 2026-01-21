import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Components
import Layout from './components/Layout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import WaterTracker from './components/WaterTracker';
import WorkoutLogger from './components/WorkoutLogger';
import Stats from './components/Stats';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                    <div className="mt-4 text-center font-bold text-slate-400">Yükleniyor...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Auth />;
    }

    return (
        <Layout user={user}>
            <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/su" element={<WaterTracker user={user} />} />
                <Route path="/antrenman" element={<WorkoutLogger user={user} />} />
                <Route path="/istatistik" element={<Stats user={user} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Layout>
    );
}

export default App;
