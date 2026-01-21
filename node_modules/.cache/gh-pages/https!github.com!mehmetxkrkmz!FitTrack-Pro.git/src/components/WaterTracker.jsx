import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Droplets, History, Trophy } from 'lucide-react';
import Swal from 'sweetalert2';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';

const WaterTracker = ({ user }) => {
    const [waterAmount, setWaterAmount] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(3500);
    const [logs, setLogs] = useState([]);
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!user) return;

        // Listen to today's water data
        const unsubscribe = onSnapshot(doc(db, "users", user.uid, "water", today), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setWaterAmount(data.total || 0);
                setLogs(data.logs || []);
                if (data.goal) setDailyGoal(data.goal);
            } else {
                setWaterAmount(0);
                setLogs([]);
                // Create initial doc for today
                setDoc(doc(db, "users", user.uid, "water", today), {
                    total: 0,
                    goal: 3500,
                    logs: [],
                    timestamp: serverTimestamp()
                });
            }
        });

        return () => unsubscribe();
    }, [user, today]);

    const addWater = async (amount) => {
        const newTotal = waterAmount + amount;
        const logEntry = {
            amount,
            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            id: Date.now()
        };

        try {
            await updateDoc(doc(db, "users", user.uid, "water", today), {
                total: newTotal,
                logs: arrayUnion(logEntry)
            });

            if (newTotal >= dailyGoal && waterAmount < dailyGoal) {
                Swal.fire({
                    title: 'Harika!',
                    text: 'Bugünkü su hedefine ulaştın!',
                    icon: 'success',
                    confirmButtonText: 'Devam Et',
                    confirmButtonColor: '#0ea5e9'
                });
            }
        } catch (error) {
            console.error("Error updating water:", error);
        }
    };

    const percentage = Math.min((waterAmount / dailyGoal) * 100, 100);

    const quickAddOptions = [
        { label: 'Bir Yudum', amount: 50, icon: '💧' },
        { label: 'Bir Bardak', amount: 200, icon: '🥛' },
        { label: 'Bir Şişe', amount: 500, icon: '🍾' },
    ];

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-3xl font-bold">Su Takibi</h2>
                    <p className="text-slate-500">vücudunu nemli tut, enerjini koru.</p>
                </div>
                <div className="hidden lg:flex items-center gap-2 text-primary-600 bg-primary-100 dark:bg-primary-900/40 px-4 py-2 rounded-full font-bold">
                    <Trophy size={18} />
                    <span>{dailyGoal}ml Hedef</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Tracker Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-8 flex flex-col items-center justify-center min-h-[400px]"
                >
                    <div className="water-container mb-8">
                        <div
                            className="water-wave"
                            style={{ top: `${100 - percentage}%` }}
                        ></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <span className="text-4xl font-bold text-slate-800 dark:text-white">{Math.round(waterAmount)}</span>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-300">/ {dailyGoal}ml</span>
                            <span className="text-xs font-bold text-primary-600 mt-1">%{Math.round(percentage)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                        {quickAddOptions.map((option) => (
                            <button
                                key={option.label}
                                onClick={() => addWater(option.amount)}
                                className="glass-button flex-col py-4 hover:border-primary-500/50 group"
                            >
                                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{option.icon}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{option.label}</span>
                                <span className="text-xs text-primary-600 font-bold">+{option.amount}ml</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* History & Stats Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 flex flex-col"
                >
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <History size={20} className="text-primary-500" />
                        <h3 className="font-bold text-lg">Bugünkü Kayıtlar</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[350px] pr-2 space-y-3">
                        <AnimatePresence initial={false}>
                            {logs.length > 0 ? (
                                logs.slice().reverse().map((log) => (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg">
                                                <Droplets size={16} />
                                            </div>
                                            <span className="font-bold">{log.amount}ml</span>
                                        </div>
                                        <span className="text-sm text-slate-500">{log.time}</span>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                                    <Droplets size={48} className="mb-4 opacity-20" />
                                    <p>Henüz kayıt yok. Su içmeyi unutma!</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default WaterTracker;
