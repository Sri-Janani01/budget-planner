import { useState, useEffect } from 'react'
import styles from './TransactionForm.module.css'

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income']
const EXPENSE_CATEGORIES = ['Food & Drink', 'Housing', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Education', 'Utilities', 'Travel', 'Other']

export default function TransactionForm({ tx, onSave, onClose }) {
    const [form, setForm] = useState({
        title: '', amount: '', type: 'expense',
        category: 'Food & Drink', date: new Date().toISOString().slice(0, 10), notes: ''
    })

    useEffect(() => {
        if (tx) setForm({ title: tx.title, amount: tx.amount, type: tx.type, category: tx.category, date: tx.date, notes: tx.notes || '' })
    }, [tx])

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
    const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

    function handleTypeChange(type) {
        set('type', type)
        set('category', type === 'income' ? 'Salary' : 'Food & Drink')
    }

    function handleSubmit() {
        if (!form.title || !form.amount || !form.date) return alert('Please fill in all required fields')
        onSave(form)
    }

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{tx ? 'Edit Transaction' : 'New Transaction'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.typeToggle}>
                    <button className={`${styles.typeBtn} ${form.type === 'expense' ? styles.expenseActive : ''}`} onClick={() => handleTypeChange('expense')}>↓ Expense</button>
                    <button className={`${styles.typeBtn} ${form.type === 'income' ? styles.incomeActive : ''}`} onClick={() => handleTypeChange('income')}>↑ Income</button>
                </div>

                <div className={styles.fields}>
                    <div className={styles.group}>
                        <label>Title *</label>
                        <input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Grocery run" />
                    </div>
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Amount (£) *</label>
                            <input type="number" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" min="0" step="0.01" />
                        </div>
                        <div className={styles.group}>
                            <label>Date *</label>
                            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.group}>
                        <label>Category</label>
                        <select value={form.category} onChange={e => set('category', e.target.value)}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className={styles.group}>
                        <label>Notes</label>
                        <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional note…" />
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button className={styles.saveBtn} onClick={handleSubmit}>{tx ? 'Save Changes' : 'Add Transaction'}</button>
                </div>
            </div>
        </div>
    )
}