import { useState, useEffect, useCallback } from 'react'
import { api } from './utils/api'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import TransactionForm from './components/TransactionForm'
import styles from './App.module.css'

export default function App() {
    const [view, setView] = useState('dashboard')
    const [transactions, setTransactions] = useState([])
    const [stats, setStats] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState('')
    const [editingTx, setEditingTx] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [toast, setToast] = useState('')

    const load = useCallback(async () => {
        try {
            const [txs, st] = await Promise.all([
                api.getTransactions(selectedMonth),
                api.getStats(selectedMonth)
            ])
            setTransactions(txs)
            setStats(st)
        } catch {
            showToast('Could not connect — is the server running?')
        }
    }, [selectedMonth])

    useEffect(() => { load() }, [load])

    function showToast(msg) {
        setToast(msg)
        setTimeout(() => setToast(''), 3000)
    }

    async function handleSave(data) {
        try {
            if (editingTx) {
                await api.updateTransaction(editingTx.id, data)
                showToast('Transaction updated ✓')
            } else {
                await api.createTransaction(data)
                showToast('Transaction added ✓')
            }
            setShowForm(false)
            setEditingTx(null)
            load()
        } catch {
            showToast('Save failed — check server')
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this transaction?')) return
        try {
            await api.deleteTransaction(id)
            showToast('Deleted ✓')
            load()
        } catch {
            showToast('Delete failed')
        }
    }

    function handleEdit(tx) {
        setEditingTx(tx)
        setShowForm(true)
    }

    function handleAdd() {
        setEditingTx(null)
        setShowForm(true)
    }

    return (
        <div className={styles.layout}>
            <Sidebar view={view} setView={setView} onAdd={handleAdd} />
            <main className={styles.main}>
                {view === 'dashboard' && (
                    <Dashboard
                        stats={stats}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        onAdd={handleAdd}
                    />
                )}
                {view === 'transactions' && (
                    <Transactions
                        transactions={transactions}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAdd={handleAdd}
                    />
                )}
            </main>
            {showForm && (
                <TransactionForm
                    tx={editingTx}
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditingTx(null) }}
                />
            )}
            {toast && <div className={styles.toast}>{toast}</div>}
        </div>
    )
}