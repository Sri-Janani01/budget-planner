import styles from './Transactions.module.css'

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function Transactions({ transactions, selectedMonth, setSelectedMonth, onEdit, onDelete, onAdd }) {
    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Transactions</h1>
                    <p className={styles.sub}>{transactions.length} record{transactions.length !== 1 ? 's' : ''}</p>
                </div>
                <div className={styles.headerRight}>
                    <input type="month" className={styles.monthPicker} value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} />
                    <button className={styles.addBtn} onClick={onAdd}>+ Add</button>
                </div>
            </header>

            {transactions.length === 0 ? (
                <div className={styles.empty}>
                    <div className={styles.emptyIcon}>◎</div>
                    <p>No transactions yet.<br />Start by adding one!</p>
                    <button className={styles.addBtn} onClick={onAdd}>Add Transaction</button>
                </div>
            ) : (
                <div className={styles.list}>
                    {transactions.map(tx => (
                        <div key={tx.id} className={styles.row}>
                            <div className={`${styles.typeTag} ${tx.type === 'income' ? styles.income : styles.expense}`}>
                                {tx.type === 'income' ? '↑' : '↓'}
                            </div>
                            <div className={styles.info}>
                                <div className={styles.txTitle}>{tx.title}</div>
                                <div className={styles.txMeta}>
                                    <span className={styles.category}>{tx.category}</span>
                                    <span className={styles.date}>{tx.date}</span>
                                    {tx.notes && <span className={styles.notes}>{tx.notes}</span>}
                                </div>
                            </div>
                            <div className={`${styles.amount} ${tx.type === 'income' ? styles.incomeAmt : styles.expenseAmt}`}>
                                {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.btnEdit} onClick={() => onEdit(tx)}>Edit</button>
                                <button className={styles.btnDelete} onClick={() => onDelete(tx.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}