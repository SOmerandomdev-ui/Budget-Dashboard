import {useState, useEffect } from "react"
import * as Papa from 'papaparse';
import { useTable, tableFeatures, flexRender } from '@tanstack/react-table';

export default function Table({file}: {file: File} ) {
  const [TableData, setTableData] = useState<string[][] | null>(null);
  
  const features = tableFeatures({})

  {/* Parse the data into a good format*/}
  useEffect(() => {
    if (!file) return 
     let ignore = false

     Papa.parse(file, {
        complete: (results: any) => {
          if (ignore) return
          setTableData(results.data)
          console.log(results.data)
      },
    })

    return () => {ignore = true}
  }, [file])

    const columns: any = [
    { id: 'date', header: 'Date', accessorFn: (row: any) => row[0] },
    { id: 'description', header: 'Description', accessorFn: (row: any) => row[1] },
    { id: 'withdrawal', header: 'Withdrawal', accessorFn: (row: any) => row[2] },
    { id: 'deposit', header: 'Deposit', accessorFn: (row: any) => row[3] },
    { id: 'balance', header: 'Balance', accessorFn: (row: any) => row[4] },
  ];

  const table = useTable({features, data: TableData ?? [], columns });

  return (
    <table></table>
  )
       
}