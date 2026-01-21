import React from 'react';
import { motion } from 'framer-motion';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { Dumbbell, Chrome } from 'lucide-react';

const Auth = () => {
    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Login error:', error);
            alert('Giriş başarısız oldu. Lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-3xl animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 lg:p-12 w-full max-w-md text-center border-white/40 dark:border-white/10"
            >
                <div className="inline-flex p-4 bg-primary-500 text-white rounded-3xl shadow-xl shadow-primary-500/30 mb-8 rotate-3">
                    <Dumbbell size={48} />
                </div>

                <h1 className="text-4xl font-bold mb-3 tracking-tight">FitTrack <span className="text-primary-500">Pro</span></h1>
                <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">
                    Hedeflerine ulaşmak için yol arkadaşın. Su takibi ve antrenmanlarını tek platformda yönet.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
                    >
                        <Chrome className="text-primary-500" size={24} />
                        <span>Google ile Devam Et</span>
                    </button>

                    <p className="text-xs text-slate-400 mt-6 lg:mt-8">
                        Giriş yaparak kullanım koşullarını kabul etmiş olursunuz.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
