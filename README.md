# ◈ BudgetWise — Personal Budget Planner

> A full-stack personal finance app to track income, expenses, and savings — with visual breakdowns and monthly insights.

[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/Sri-Janani01/budget-planner)
[![Node](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

**🔗 Live Demo:** [sri-janani01.github.io/budget-planner](https://sri-janani01.github.io/budget-planner/frontend/dist/index.html)  
**📁 Repository:** [github.com/Sri-Janani01/budget-planner](https://github.com/Sri-Janani01/budget-planner)

---

## 📸 Preview

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Transactions
![Transactions](screenshots/transactions.png)

---

## ✨ Features

- **Income & Expense Tracking** — Log transactions with title, amount, category, date and notes
- **Dashboard Analytics** — Balance, savings rate, income vs expense overview
- **Interactive Charts** — Monthly bar chart and expense pie chart (Recharts)
- **Category Breakdown** — See exactly where your money goes
- **Monthly Filter** — Filter all data by any month
- **Full CRUD** — Add, edit, and delete any transaction
- **REST API** — Clean Express.js backend with SQLite persistence

---

## 🛠 Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Node.js, Express.js, SQLite (better-sqlite3) |
| Frontend | React 18, Vite, CSS Modules         |
| Charts   | Recharts                            |
| API      | RESTful JSON (CORS enabled)         |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Sri-Janani01/budget-planner.git
cd budget-planner

# 2. Start the backend
cd backend
npm install
node server.js
# → Running on http://localhost:3001

# 3. Start the frontend (new terminal)
cd ../frontend
npm install
npm run dev
# → Running on http://localhost:5173
```

---

## 📡 API Endpoints

| Method   | Endpoint                  | Description                          |
|----------|---------------------------|--------------------------------------|
| `GET`    | `/api/transactions`       | List all — supports `?month=YYYY-MM` |
| `POST`   | `/api/transactions`       | Create a transaction                 |
| `PUT`    | `/api/transactions/:id`   | Update a transaction                 |
| `DELETE` | `/api/transactions/:id`   | Delete a transaction                 |
| `GET`    | `/api/stats`              | Dashboard stats — supports `?month=` |

---

## 📁 Project Structure

```
budget-planner/
├── backend/
│   ├── server.js        # Express REST API
│   ├── database.js      # SQLite setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Root component & state
│   │   ├── components/
│   │   │   ├── Sidebar.jsx       # Navigation
│   │   │   ├── Dashboard.jsx     # Charts & stats
│   │   │   ├── Transactions.jsx  # Transaction list
│   │   │   └── TransactionForm.jsx # Add/edit modal
│   │   └── utils/api.js          # API client
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🗺 Roadmap

- [ ] Budget goals per category
- [ ] Recurring transactions
- [ ] Export to CSV
- [ ] Dark mode
- [ ] User authentication

---

## 👩‍💻 Author

**Sri Janani** — [github.com/Sri-Janani01](https://github.com/Sri-Janani01)

---

## 📄 License

MIT — feel free to use and modify.