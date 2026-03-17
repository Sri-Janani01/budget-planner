import styles from './Sidebar.module.css'

export default function Sidebar({ view, setView, onAdd }) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <span className={styles.brandIcon}>◈</span>
                <span className={styles.brandName}>BudgetWise</span>
            </div>
            <nav className={styles.nav}>
                <button
                    className={`${styles.navItem} ${view === 'dashboard' ? styles.active : ''}`}
                    onClick={() => setView('dashboard')}
                >
                    <span className={styles.navIcon}>▦</span> Overview
                </button>
                <button
                    className={`${styles.navItem} ${view === 'transactions' ? styles.active : ''}`}
                    onClick={() => setView('transactions')}
                >
                    <span className={styles.navIcon}>≡</span> Transactions
                </button>
            </nav>
            <div className={styles.addWrap}>
                <button className={styles.addBtn} onClick={onAdd}>+ Add Transaction</button>
            </div>
            <div className={styles.footer}>
                <p className={styles.footerText}>Track every penny.<br />Own your finances.</p>
            </div>
        </aside>
    )
}