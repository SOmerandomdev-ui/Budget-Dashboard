# Budget Dashboard

Personal finance dashboard branded **Keel**. Import a bank CSV, review account activity in a ledger table, and see a chart summary of spending.

## Features

- CSV import via dialog (file picker or drag-and-drop; PapaParse)
- Ledger table of dates, descriptions, debits, credits, balances, and categories
- Chart summary of category totals (Plotly)
- Clear statement and re-import
- Ink / paper / brass visual treatment

## Tech stack

- React 19, Vite, TypeScript
- Tailwind CSS
- TanStack Table, PapaParse, Plotly, Lucide, MUI

## Getting started

```bash
cd Budget-Dashboard
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Import a `.csv` bank statement to populate the ledger.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
