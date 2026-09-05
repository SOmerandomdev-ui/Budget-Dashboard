import ProcessData from "./Data.ts"
import {useState, useEffect } from "react"
import { useTable, flexRender } from '@tanstack/react-table';

export default function Table(data: String[][] ) {
    const columns: any = [
    { id: 'date', header: 'Date', accessorFn: (row: any) => row[0] },
    { id: 'description', header: 'Description', accessorFn: (row: any) => row[1] },
    { id: 'withdrawal', header: 'Withdrawal', accessorFn: (row: any) => row[2] },
    { id: 'deposit', header: 'Deposit', accessorFn: (row: any) => row[3] },
    { id: 'balance', header: 'Balance', accessorFn: (row: any) => row[4] },
  ];

    const table = useTable(data, columns )
       
}