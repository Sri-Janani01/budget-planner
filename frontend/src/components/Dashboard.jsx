import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import styles from './Dashboard.module.css'

const COLORS = ['#2d6a4f', '#c1440e', '#b5632a', '#6b7c4a', '#c9956c', '#8c7b6e', '#4a7c8c', '#7c4a6b']
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function Dashboard({ stats, selectedMonth, setSelectedMonth, onAdd }) {
    if (!stats) return <div className={styles.loading}>Loading…</div>

    const balance = stats.balance
    const expenseCategories = stats.by_category.filter(c => c.type === 'expense')
    const incomeCategories = stats.by_category.filter(c => c.type === 'income')
    const pieData = expenseCategories.map(c => ({ name: c.category, value: c.total }))
    const barData = stats.by_month.map(m => ({
        month: m.month.slice(5),
        Income: m.income,
        Expense: m.expense
    }))

    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Overview</h1>
                    <p className={styles.sub}>Your financial snapshot</p>
                </div>
                <div className={styles.headerRight}>
                    <input type="month" className={styles.monthPicker} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
                    <button className={styles.addBtn} onClick={onAdd}>+ Add</button>
                </div>
            </header>

            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.income}`}>
                    <div className={styles.statLabel}>Total Income</div>
                    <div className={styles.statValue}>{fmt(stats.total_income)}</div>
                </div>
                <div className={`${styles.statCard} ${styles.expense}`}>
                    <div className={styles.statLabel}>Total Expenses</div>
                    <div className={styles.statValue}>{fmt(stats.total_expense)}</div>
                </div>
                <div className={`${styles.statCard} ${balance >= 0 ? styles.positive : styles.negative}`}>
                    <div className={styles.statLabel}>Net Balance</div>
                    <div className={styles.statValue}>{fmt(balance)}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Savings Rate</div>
                    <div className={styles.statValue}>
                        {stats.total_income > 0 ? Math.round((stats.balance / stats.total_income) * 100) + '%' : '—'}
                    </div>
                </div>
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Monthly Overview</h2>
                    {barData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={barData} barSize={18}>
                                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fontFamily: 'Syne' }} axisLine={false} tickLine={false} tickFormatter={v => '£' + Math.round(v / 1000) + 'k'} />
                                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#fff', border: '1px solid #e4ddd5', borderRadius: 8, fontSize: 12 }} />
                                <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Syne' }} />
                                <Bar dataKey="Income" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Expense" fill="#c1440e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <div className={styles.empty}>No data yet</div>}
                </div>

                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Expenses by Category</h2>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: '#fff', border: '1px solid #e4ddd5', borderRadius: 8, fontSize: 12 }} />
                                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Syne' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <div className={styles.empty}>No expense data yet</div>}
                </div>
            </div>

            <div className={styles.breakdownGrid}>
                <div className={styles.breakdownCard}>
                    <h2 className={styles.chartTitle}>Income Sources</h2>
                    {incomeCategories.length > 0 ? incomeCategories.map((c, i) => (
                        <div key={i} className={styles.breakdownRow}>
                            <span className={styles.breakdownDot} style={{ background: COLORS[i % COLORS.length] }} />
                            <span className={styles.breakdownLabel}>{c.category}</span>
                            <span className={styles.breakdownAmt} style={{ color: 'var(--income)' }}>{fmt(c.total)}</span>
                        </div>
                    )) : <p className={styles.empty}>No income data</p>}
                </div>
                <div className={styles.breakdownCard}>
                    <h2 className={styles.chartTitle}>Expense Categories</h2>
                    {expenseCategories.length > 0 ? expenseCategories.map((c, i) => (
                        <div key={i} className={styles.breakdownRow}>
                            <span className={styles.breakdownDot} style={{ background: COLORS[i % COLORS.length] }} />
                            <span className={styles.breakdownLabel}>{c.category}</span>
                            <span className={styles.breakdownAmt} style={{ color: 'var(--expense)' }}>{fmt(c.total)}</span>
                        </div>
                    )) : <p className={styles.empty}>No expense data</p>}
                </div>
            </div>
        </div>
    )
}