const BASE = 'http://localhost:3001/api';

export const api = {
    async getTransactions(month = '') {
        const url = month ? `${BASE}/transactions?month=${month}` : `${BASE}/transactions`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch transactions');
        return res.json();
    },

    async createTransaction(data) {
        const res = await fetch(`${BASE}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create transaction');
        return res.json();
    },

    async updateTransaction(id, data) {
        const res = await fetch(`${BASE}/transactions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update transaction');
        return res.json();
    },

    async deleteTransaction(id) {
        const res = await fetch(`${BASE}/transactions/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete transaction');
        return res.json();
    },

    async getStats(month = '') {
        const url = month ? `${BASE}/stats?month=${month}` : `${BASE}/stats`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    }
};