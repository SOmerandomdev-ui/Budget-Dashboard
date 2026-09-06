import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import Table from "./components/Data/Table";
import AddButton from "./components/Add-Button";
import DashBoard from "./components/DashBoard";
import ImportDialog from "./components/ImportDialog";
import Graph from "./components/Data/Graph"

function App() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [ledgerFile, setLedgerFile] = useState(null);
  const [ParsedData, setParsedData] = useState(null)

  const closeDialog = useCallback(() => setIsAddOpen(false), []);

  return (
    <div className="relative min-h-dvh bg-ink text-paper overflow-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-raised focus:px-3 focus:py-2"
      >
        Skip to ledger
      </a>

      <DashBoard />
      <Graph data={ParsedData}/>

      <main id="main" className="px-4 py-8 pb-24 sm:px-6 ">
        {ledgerFile ? (
          <section className="space-y-5 max-w-3xl">
            <div className="flex w-[100%] flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brass">
                  Ledger
                </p>
                <h1 className="mt-1 font-display text-4xl tracking-tight">
                  Account activity
                </h1>
                <p className="mt-2 text-sm text-mist">{ledgerFile.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setLedgerFile(null)}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-line px-4 text-sm text-mist transition-colors duration-200 hover:border-mist/50 hover:text-paper"
              >
                Clear statement
              </button>
              <div className="w-full"> 
                <Table file={ledgerFile} callback={setParsedData} />
              </div>
              
            </div>
          </section>
        ) : (
          <section className="flex min-h-[calc(100dvh-9rem)] flex-col items-center justify-center text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brass">
              Personal ledger
            </p>
            <h1 className="mt-3 max-w-xl font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Bring your statement aboard.
            </h1>
            <p className="mt-4 max-w-md text-base text-mist">
              Import a bank CSV to review debits, credits, and categories in one
              quiet table.
            </p>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="mt-8 inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg bg-brass px-5 text-sm font-medium text-ink transition-opacity duration-200 hover:opacity-90"
            >
              <Upload size={16} aria-hidden="true" />
              Import CSV
            </button>
          </section>
        )}
      </main>

      {ledgerFile ? (
        <AddButton
          size={22}
          onClick={() => setIsAddOpen(true)}
          className="fixed right-5 bottom-5 z-20 inline-flex size-12 cursor-pointer items-center justify-center rounded-full bg-paper text-ink shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-colors duration-200 hover:bg-brass"
        />
      ) : null}
      
      <ImportDialog
        open={isAddOpen}
        onClose={closeDialog}
        onConfirm={(file) => {
          setLedgerFile(file);
          setIsAddOpen(false);
        }}
      />
    </div>
  );
}

export default App
