import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Droplets,
    Dumbbell,
    Calendar,
    Trophy,
    TrendingUp,
    Clock,
    ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Dashboard = ({ user }) => {
    const [waterData, setWaterData] = useState({ total: 0, goal: 3500 });
    const [workoutData, setWorkoutData] = useState({ exercises: {} });
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!user) return;

        const unsubWater = onSnapshot(doc(db, "users", user.uid, "water", today), (snap) => {
            if (snap.exists()) setWaterData(snap.data());
        });

        const unsubWorkout = onSnapshot(doc(db, "users", user.uid, "workouts", today), (snap) => {
            if (snap.exists()) setWorkoutData(snap.data());
        });

        return () => {
            unsubWater();
            unsubWorkout();
        };
    }, [user, today]);

    const completedWorkouts = Object.values(workoutData.exercises || {}).filter(ex => ex.completed).length;
    const totalWorkouts = Object.values(workoutData.exercises || {}).length;
    const waterProgress = Math.min((waterData.total / waterData.goal) * 100, 100);

    const stats = [
        {
            title: 'Su Tüketimi',
            value: `${waterData.total}ml`,
            sub: `Hedef: ${waterData.goal}ml`,
            progress: waterProgress,
            color: 'bg-primary-500',
            icon: <Droplets size={24} />,
            link: '/su'
        },
        {
            title: 'Antrenman',
            value: `${completedWorkouts} Hareket`,
            sub: `${totalWorkouts} Toplam Hedef`,
            progress: totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0,
            color: 'bg-accent-500',
            icon: <Dumbbell size={24} />,
            link: '/antrenman'
        }
    ];

    return (
        <div className="space-y-10">
            <header>
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-primary-500 font-bold uppercase tracking-widest text-sm mb-1"
                >
                    Hoş Geldin, {user?.displayName?.split(' ')[0]} 👋
                </motion.p>
                <h2 className="text-4xl font-bold tracking-tight">Bugün Neler Yaptık?</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-8 group overflow-hidden relative"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl text-white ${stat.color} shadow-lg shadow-${stat.color.split('-')[1]}-500/30`}>
                                {stat.icon}
                            </div>
                            <Link
                                to={stat.link}
                                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0"
                            >
                                <ChevronRight size={20} />
                            </Link>
                        </div>

                        <div className="space-y-1 mb-8">
                            <h3 className="text-slate-500 font-semibold">{stat.title}</h3>
                            <p className="text-3xl font-bold">{stat.value}</p>
                            <p className="text-sm text-slate-400 font-medium">{stat.sub}</p>
                        </div>

                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${stat.progress}%` }}
                                className={`h-full ${stat.color}`}
                            />
                        </div>

                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                            {React.cloneElement(stat.icon, { size: 140 })}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary-500" />
                            Motivasyon
                        </h3>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 text-white relative overflow-hidden">
                        <p className="text-lg font-medium italic relative z-10">
                            "Bugün attığın her adım, yarınki seni inşa ediyor. Durma!"
                        </p>
                        <Zap className="absolute -bottom-4 -right-4 text-white/10" size={100} />
                    </div>
                </div>

                <div className="glass-card p-8">
                    <h3 className="font-bold text-xl flex items-center gap-2 mb-6">
                        <Clock size={20} className="text-primary-500" />
                        Rutin
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                            <p className="text-sm">Sabah Mide Vakumu</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 shrink-0"></div>
                            <p className="text-sm">Öğlen 1L Su</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                            <p className="text-sm">Akşam Antrenmanı</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
