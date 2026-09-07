import { useState, useEffect } from "react";
import * as Papa from "papaparse";
import {
  useTable,
  tableFeatures,
  flexRender,
  createColumnHelper,
  metaHelper,
} from "@tanstack/react-table";

export type Transaction = {
  date: string;
  description: string;
  debit: number | null;
  credit: number | null;
  balance: number;
  type: string;
};

// Converts raw CSV rows into typed objects
function ListtoObject(rows: string[][] | null): Transaction[] {
  if (!rows) return [];
  return rows
    .filter((row) => row.length === 5 && row[0] !== "")
    .map((row) => ({
      date: row[0],
      description: row[1],
      debit: row[2] ? parseFloat(row[2]) : null,
      credit: row[3] ? parseFloat(row[3]) : null,
      balance: parseFloat(row[4]),
      type: (row[3] ? parseFloat(row[3]) : null) != null ? "Payment" : "Uncategorized",
    }));
}

// Typed meta so cells can call updateType without an `as any` cast
interface MyTableMeta {
  updateType: (rowIndex: number, value: string) => void;
}

const features = tableFeatures({
  tableMeta: metaHelper<MyTableMeta>(),
});

const columnHelper = createColumnHelper<typeof features, Transaction>();

const TYPE_OPTIONS = [
  "Uncategorized",
  "Groceries",
  "Gas",
  "Subscription",
  "Dining",
  "Payment",
];

//Creates columns 
const columns = columnHelper.columns([
  columnHelper.display({
    id: "n",
    header: "No.",
    cell: (info) => info.row.index + 1,
  }),
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
      const isCredit = info.row.original.credit != null;
      const Options = isCredit ? ["Payment"] : TYPE_OPTIONS
      return (
        <select
          aria-label="Transaction category"
          value={info.getValue()}
          onChange={(e) => {
            info.table.options.meta?.updateType(info.row.index, e.target.value);
          }}
          className="h-9 min-w-[9.5rem] cursor-pointer rounded-md border border-line bg-ink px-2 text-sm text-paper"
        >
          {Options.map((item) => (
            <option className="bg-ink" key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      );
    },
  }),
]);

export default function Table({file, callback}: {file: File; callback?: (item: Transaction[]) => void;
}) {
  const [rawData, setRawData] = useState<string[][] | null>(null);
  const [data, setData] = useState<Transaction[]>([]);

  // Parse the uploaded file into raw rows
  useEffect(() => {
    if (!file) return;
    let ignore = false;

    Papa.parse(file, {
      complete: (results: any) => {
        if (ignore) return;
        setRawData(results.data as string[][]);
      },
    });

    return () => {
      ignore = true;
    };
  }, [file]);

  // Reset `data` from the raw rows ONLY when a new file is parsed
  useEffect(() => {
    setData(ListtoObject(rawData));
  }, [rawData]);

  // Updates App only when a callback is passed (dashboard, not import preview)
  useEffect(() => {
    callback?.(data);
  }, [data, callback]);
  
  // Called from the `type` column's <select> to edit one row
  const updateType = (rowIndex: number, value: string) => {
    setData((old) =>
      old.map((row, index) =>
        index === rowIndex ? { ...row, type: value } : row
      )
    );
  };

  const table = useTable({
    features,
    data,
    columns,
    meta: {
      updateType,
    },
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="overflow-auto [scrollbar-width:none] rounded-xl border border-line bg-raised max-h-[min(62vh,40rem)]">
      <table className="w-full min-w-[36rem] border-collapse text-left font-sans text-sm text-paper">
        <caption className="sr-only">Account activity</caption>
        <thead className="sticky top-0 z-10 bg-raised">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-line">
              {headerGroup.headers.map((header) => {
                const isMoney =
                  header.id === "debit" ||
                  header.id === "credit" ||
                  header.id === "balance";
                const isIndex = header.id === "n";
                return (
                  <th
                    key={header.id}
                    scope="col"
                    className={`px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-mist ${
                      isMoney || isIndex ? "text-right" : "text-left"
                    }`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-sm text-mist">
                No transactions found in this file. Check that the CSV has five columns.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-line/70 last:border-b-0 odd:bg-raised even:bg-ink/40 hover:bg-line/35"
              >
                {row.getAllCells().map((cell) => {
                  const id = cell.column.id;
                  const value = cell.getValue();
                  const isEmpty = value == null || value === "";
                  const isMoney = id === "debit" || id === "credit" || id === "balance";
                  const isIndex = id === "n";
                  const tone =
                    isIndex
                      ? "text-mist"
                      : id === "debit" && !isEmpty
                        ? "text-rust"
                        : id === "credit" && !isEmpty
                          ? "text-sea"
                          : id === "balance" && typeof value === "number" && value < 0
                            ? "text-rust"
                            : "text-paper";
                  return (
                    <td
                      key={cell.id}
                      className={`px-4 py-3 align-middle ${
                        isMoney || isIndex
                          ? "text-right font-mono text-[13px] whitespace-nowrap"
                          : ""
                      } ${id === "date" ? "whitespace-nowrap font-mono text-[13px] text-mist" : ""} ${tone}`}
                    >
                      {isMoney && isEmpty
                        ? "—"
                        : id === "debit" && !isEmpty
                          ? <> − {flexRender(cell.column.columnDef.cell, cell.getContext())}</>
                          : id === "credit" && !isEmpty
                            ? <> + {flexRender(cell.column.columnDef.cell, cell.getContext())}</>
                            : flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
        {rows.length > 0 ? (
          <tfoot>
            <tr>
              <td
                colSpan={7}
                className="border-t border-line px-4 py-3 text-xs text-mist"
              >
                {rows.length} {rows.length === 1 ? "transaction" : "transactions"}
              </td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}