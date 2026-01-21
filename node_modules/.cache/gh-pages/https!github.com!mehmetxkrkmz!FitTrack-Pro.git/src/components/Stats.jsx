import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { Calendar as CalendarIcon, TrendingUp, Droplets } from 'lucide-react';

const Stats = ({ user }) => {
    const [weeklyWater, setWeeklyWater] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;

            try {
                const waterRef = collection(db, "users", user.uid, "water");
                const q = query(waterRef, orderBy("timestamp", "desc"), limit(7));
                const querySnapshot = await getDocs(q);

                const data = querySnapshot.docs.map(doc => ({
                    name: new Date(doc.id).toLocaleDateString('tr-TR', { weekday: 'short' }),
                    amount: doc.data().total || 0,
                    rawDate: doc.id
                })).reverse();

                setWeeklyWater(data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    // If no data, show placeholder
    const chartData = weeklyWater.length > 0 ? weeklyWater : [
        { name: 'Pzt', amount: 0 },
        { name: 'Sal', amount: 0 },
        { name: 'Çar', amount: 0 },
        { name: 'Per', amount: 0 },
        { name: 'Cum', amount: 0 },
        { name: 'Cmt', amount: 0 },
        { name: 'Paz', amount: 0 },
    ];

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold">İstatistikler</h2>
                <p className="text-slate-500">Gelişimini rakamlarla takip et.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Water Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/40 text-primary-600 rounded-lg">
                            <Droplets size={20} />
                        </div>
                        <h3 className="font-bold text-lg">Haftalık Su Tüketimi (ml)</h3>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                />
                                <Bar
                                    dataKey="amount"
                                    fill="#0ea5e9"
                                    radius={[6, 6, 0, 0]}
                                    barSize={32}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Workout Heatmap Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-2 bg-accent-100 dark:bg-accent-900/40 text-accent-500 rounded-lg">
                            <CalendarIcon size={20} />
                        </div>
                        <h3 className="font-bold text-lg">Aktivite Takvimi</h3>
                    </div>

                    <div className="flex flex-col items-center justify-center h-72 text-center py-10">
                        <div className="grid grid-cols-7 gap-2">
                            {[...Array(28)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-4 h-4 rounded-sm ${Math.random() > 0.7 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-800'
                                        }`}
                                ></div>
                            ))}
                        </div>
                        <p className="mt-6 text-sm text-slate-400">Yakında: Daha detaylı antrenman analizi ve ısı haritası burada yer alacak.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Stats;
