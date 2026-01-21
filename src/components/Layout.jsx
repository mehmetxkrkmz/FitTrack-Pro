import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Home,
    Droplets,
    Dumbbell,
    BarChart2,
    LogOut,
    Moon,
    Sun,
    User as UserIcon
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Layout = ({ children, user }) => {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    const navigate = useNavigate();

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navItems = [
        { path: '/', icon: <Home size={24} />, label: 'Özet' },
        { path: '/su', icon: <Droplets size={24} />, label: 'Su' },
        { path: '/antrenman', icon: <Dumbbell size={24} />, label: 'Antrenman' },
        { path: '/istatistik', icon: <BarChart2 size={24} />, label: 'Analiz' },
    ];

    return (
        <div className="min-h-screen pb-20 lg:pb-0 lg:pl-64 flex flex-col transition-colors duration-300">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 glass-card border-r flex-col p-6 z-50 rounded-none border-y-0 border-l-0">
                <div className="flex items-center gap-3 mb-10">
                    <div className="p-2 bg-primary-500 rounded-xl text-white">
                        <Dumbbell size={28} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">FitTrack <span className="text-primary-500">Pro</span></h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 p-4 rounded-xl transition-all ${isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`
                            }
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto space-y-4">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="flex items-center gap-3 p-4 w-full rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-500 dark:text-slate-400"
                    >
                        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                        <span className="font-medium">{isDarkMode ? 'Açık Mod' : 'Karanlık Mod'}</span>
                    </button>

                    <div className="p-4 glass-card flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={20} />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.displayName || 'Kullanıcı'}</p>
                            <button
                                onClick={handleLogout}
                                className="text-xs text-slate-500 hover:text-accent-500 flex items-center gap-1 transition-colors"
                            >
                                <LogOut size={12} /> Çıkış Yap
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Header - Mobile */}
            <header className="lg:hidden p-4 flex justify-between items-center glass-card m-4 rounded-2xl mb-2">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary-500 rounded-lg text-white">
                        <Dumbbell size={20} />
                    </div>
                    <span className="font-bold">FitTrack <span className="text-primary-500">Pro</span></span>
                </div>
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-10 max-w-7xl mx-auto w-full">
                {children}
            </main>

            {/* Bottom Nav - Mobile */}
            <nav className="lg:hidden fixed bottom-4 left-4 right-4 h-16 glass-card flex items-center justify-around px-2 z-50">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item flex-1 ${isActive ? 'text-primary-500' : 'text-slate-400'}`
                        }
                    >
                        {item.icon}
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Layout;
