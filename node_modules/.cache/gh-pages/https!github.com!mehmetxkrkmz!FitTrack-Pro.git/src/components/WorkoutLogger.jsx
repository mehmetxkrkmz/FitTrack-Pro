import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Circle,
    Dumbbell,
    ChevronRight,
    ChevronLeft,
    Info,
    Flame,
    Zap,
    History
} from 'lucide-react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

const exercises = {
    upperBody: [
        { id: 'u1', name: "Dumbbell Chest Press", desc: "Yerde dambılları düz yukarı itme", target: "Göğüs" },
        { id: 'u2', name: "Dumbbell Fly", desc: "Kolları kanat gibi yana açma", target: "Göğüs" },
        { id: 'u3', name: "Ayaklar Yüksekte Şınav", desc: "Üst göğüs için ayaklar koltukta, eller yerde", target: "Üst Göğüs" },
        { id: 'u4', name: "Dumbbell Close Grip Press", desc: "İki dambılı birbirine yapıştırıp yukarı itme", target: "İç Göğüs" },
        { id: 'u5', name: "Dumbbell Curl", desc: "Avuç içleri yukarı bakacak şekilde dambıl kaldırma", target: "Biceps" },
        { id: 'u6', name: "Hammer Curl", desc: "Dambılları çekiç gibi dik tutarak kaldırma", target: "Biceps" },
        { id: 'u7', name: "Reverse Curl", desc: "Avuç içleri yere bakacak şekilde dambıl kaldırma", target: "Ön Kol" },
        { id: 'u8', name: "Dumbbell Overhead Extension", desc: "Dambılı iki elinle başının arkasına indirip kaldırma", target: "Triceps" },
        { id: 'u9', name: "Dumbbell Kickback", desc: "Hafif öne eğilip dirseğini sabitleyerek kolunu arkaya düz uzatma", target: "Triceps" },
        { id: 'u10', name: "Dips", desc: "Ellerini koltuk kenarına koyup gövdeni aşağı indirip kaldırma", target: "Triceps" },
        { id: 'u11', name: "Dumbbell Wrist Curl", desc: "Bilek bükme", target: "Ön Kol" },
        { id: 'u12', name: "Farmer’s Walk", desc: "Ağır dambıllarla evin içinde 1 dakika yürüme", target: "Tüm Vücut" }
    ],
    absCardio: [
        { id: 'a1', name: "Mide Vakumu", desc: "Sabah aç karnına, nefesi boşaltıp karnı içeri çekme (5-10 tekrar)", target: "Core" },
        { id: 'a2', name: "Standing Knee-to-Elbow", desc: "Ayakta, çapraz diz ve dirseği birleştirme", target: "Karın" },
        { id: 'a3', name: "Eğimli Plank", desc: "Eller koltuk kenarında veya masada düz durma", target: "Core" },
        { id: 'a4', name: "Bird-Dog", desc: "Diz ve el üstündeyken zıt kol ve bacağı uzatma", target: "Core" },
        { id: 'a5', name: "Standing Side Crunch", desc: "Ayakta, aynı taraf diz ve dirseği yanda birleştirme", target: "Yan Karın" },
        { id: 'a6', name: "Dumbbell Shadow Boxing", desc: "Dambıllarla gölge boksu (3 dk raunt)", target: "Kardiyo" },
        { id: 'a7', name: "High Knees", desc: "Olduğun yerde dizleri kalça hizasına çekerek koşma", target: "Kardiyo" },
        { id: 'a8', name: "Dumbbell Swing", desc: "Dambılı bacak arasından göğüs hizasına savurma", target: "Kardiyo" },
        { id: 'a9', name: "Mountain Climbers (Eğimli)", desc: "Eller yüksek bir yerdeyken sırayla dizleri karna çekme", target: "Kardiyo" }
    ]
};

const WorkoutLogger = ({ user }) => {
    const [activeTab, setActiveTab] = useState('upperBody');
    const [workoutData, setWorkoutData] = useState({});
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!user) return;

        const unsubscribe = onSnapshot(doc(db, "users", user.uid, "workouts", today), (docSnap) => {
            if (docSnap.exists()) {
                setWorkoutData(docSnap.data().exercises || {});
            } else {
                setWorkoutData({});
                setDoc(doc(db, "users", user.uid, "workouts", today), {
                    exercises: {},
                    date: today,
                    completed: false
                });
            }
        });

        return () => unsubscribe();
    }, [user, today]);

    const updateExercise = async (exerciseId, field, value) => {
        const newData = {
            ...workoutData,
            [exerciseId]: {
                ...(workoutData[exerciseId] || {}),
                [field]: value
            }
        };

        try {
            await updateDoc(doc(db, "users", user.uid, "workouts", today), {
                exercises: newData
            });
        } catch (error) {
            console.error("Error updating exercise:", error);
        }
    };

    const currentExercises = exercises[activeTab];

    return (
        <div className="space-y-6 pb-10">
            <header>
                <h2 className="text-3xl font-bold">Antrenman Programı</h2>
                <p className="text-slate-500">Bugün kendini aşma sırası sende.</p>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full max-w-md">
                <button
                    onClick={() => setActiveTab('upperBody')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${activeTab === 'upperBody'
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-500'
                        : 'text-slate-500'
                        }`}
                >
                    Üst Vücut (A)
                </button>
                <button
                    onClick={() => setActiveTab('absCardio')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${activeTab === 'absCardio'
                        ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-500'
                        : 'text-slate-500'
                        }`}
                >
                    Karın & Kardiyo (B)
                </button>
            </div>

            {/* Exercise List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentExercises.map((ex) => {
                    const stats = workoutData[ex.id] || {};
                    return (
                        <div
                            key={ex.id}
                            className={`glass-card p-5 border-2 transition-all ${stats.completed ? 'border-primary-500/50 bg-primary-50/5' : 'border-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-200">
                                    <Dumbbell size={20} />
                                </div>
                                <button
                                    onClick={() => updateExercise(ex.id, 'completed', !stats.completed)}
                                    className={`p-1 transition-colors ${stats.completed ? 'text-primary-500' : 'text-slate-300 dark:text-slate-700'}`}
                                >
                                    {stats.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                                </button>
                            </div>

                            <h3 className="font-bold text-lg mb-1 leading-tight">{ex.name}</h3>
                            <p className="text-xs text-primary-600 font-bold mb-3 uppercase tracking-wider">{ex.target}</p>

                            <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl mb-5">
                                <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                <p className="text-xs text-slate-500 leading-relaxed italic">{ex.desc}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Set</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={stats.sets || ''}
                                        onChange={(e) => updateExercise(ex.id, 'sets', e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-sm font-bold focus:ring-2 ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Tekrar</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={stats.reps || ''}
                                        onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-sm font-bold focus:ring-2 ring-primary-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Kilo</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={stats.weight || ''}
                                        onChange={(e) => updateExercise(ex.id, 'weight', e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-sm font-bold focus:ring-2 ring-primary-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorkoutLogger;
