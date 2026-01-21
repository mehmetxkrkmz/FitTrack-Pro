import { defineConfig } from 'vite'
import react from '@vitejs/react-config' // veya projenizdeki mevcut react importu

export default defineConfig({
    plugins: [react()],
    base: '/FitTrack-Pro/', // BU SATIRI EKLE (Baştaki ve sondaki slash önemli!)
})