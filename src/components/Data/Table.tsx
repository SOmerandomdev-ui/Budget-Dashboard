import {useState, useEffect, useMemo } from "react"
import * as Papa from 'papaparse';
import { useTable, tableFeatures, flexRender,  createColumnHelper } from '@tanstack/react-table';
import { NotebookPen } from "lucide-react";

type Transaction = {
  date: string;
  description: string;
  debit: number | null;
  credit: number | null;
  balance: number;
  type: string | null;
};

//Converts lists to objects
function toTransactions(rows: string[][] | null): Transaction[] {
   if (!rows) return [];
  return rows
    .filter((row) => row.length === 5 && row[0] !== "") 
    .map((row) => ({
      date: row[0],
      description: row[1],
      debit: row[2] ? parseFloat(row[2]) : null,
      credit: row[3] ? parseFloat(row[3]) : null,
      balance: parseFloat(row[4]),
      type: "Uncategorized"
    }));
}
const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, Transaction>();

const columns = columnHelper.columns([
  columnHelper.accessor("date", { header: "Date" }),
  columnHelper.accessor("description", { header: "Description" }),
  columnHelper.accessor("debit", {
    header: "Debit",
    cell: (info) =>
      info.getValue() != null ? `$${info.getValue()!.toFixed(2)}` : "",
  }),
  columnHelper.accessor("credit", {
    header: "Credit",
    cell: (info) =>
      info.getValue() != null ? `$${info.getValue()!.toFixed(2)}` : "",
  }),
  columnHelper.accessor("balance", {
    header: "Balance",
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("type", {
    header: "Type",
      cell: (info) => {
      const options = ["Uncategorized", "Groceries", "Gas", "Subscription", "Dining", "Payment"];

    return (
      <select>
        {options.map((item) => (
          <option className="bg-zinc-900" key={item} value={item}> {item} </option>
        ))}
      </select>
    );
  }
  })
]);

export default function Table({file}: {file: File} ) {
  const [TableData, setTableData] = useState<string[][] | null>(null);

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

  const data = useMemo(() => toTransactions(TableData), [TableData]);

 const table = useTable({features, data, columns});


  console.log(data)

  
  return (
  <div className="h-full overflow-auto max-h-[500px] [scrollbar-width:none] rounded-lg border border-zinc-700 bg-zinc-900">
    <table className="w-full min-w-[36rem] border-collapse text-left text-sm text-zinc-100">
      <caption className="sr-only">Account activity</caption>
      <thead className="sticky top-0 z-10 bg-zinc-900">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b border-zinc-700">
            {headerGroup.headers.map((header) => {
              const isMoney = header.id === "debit" || header.id === "credit" || header.id === "balance"
              return (
              <th
                key={header.id}
                scope="col"
                className={`px-3 py-2.5 text-xs font-medium tracking-wide text-zinc-400 uppercase ${isMoney ? "text-right" : "text-left"}`}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="border-b border-zinc-800 last:border-b-0 odd:bg-zinc-900 even:bg-zinc-950/70 hover:bg-zinc-800/80">
            {row.getAllCells().map((cell) => {
              const id = cell.column.id
              const value = cell.getValue()
              const isEmpty = value == null || value === ""
              const isMoney = id === "debit" || id === "credit" || id === "balance"
              const tone =
                id === "debit" && !isEmpty ? "text-rose-300" :
                id === "credit" && !isEmpty ? "text-emerald-300" :
                id === "balance" && typeof value === "number" && value < 0 ? "text-rose-300" :
                "text-zinc-100"
              return (
              <td
                key={cell.id}
                className={`px-3 py-2.5 align-middle ${isMoney ? "text-right tabular-nums" : ""} ${id === "date" ? "whitespace-nowrap text-zinc-300 tabular-nums" : ""} ${tone}`}
              >
                {isMoney && isEmpty
                  ? "—"
                  : id === "debit" && !isEmpty
                    ? <>− {flexRender(cell.column.columnDef.cell, cell.getContext())}</>
                    : id === "credit" && !isEmpty
                      ? <>+ {flexRender(cell.column.columnDef.cell, cell.getContext())}</>
                      : flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
       
}