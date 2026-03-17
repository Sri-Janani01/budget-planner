import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/budget-planner/frontend/dist/',
    server: { port: 5173 }
})