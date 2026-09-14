import Plot from "react-plotly.js";
import type { Transaction } from "./Table";

const RUST = "#d08a7c";
const SEA = "#7dbeb0";
const BRASS = "#c9a36a"
const SAGE = "#8aab8e"
const DUSK = "#8b7eab"
const FOG = "#6b8499"
const PAPER = "#e8eef4";
const MIST = "#8b9aab";
const LINE = "#2c3846";

const CATEGORY_COLORS: Record<string, string> = {
  Credit: SEA,
  Groceries: FOG,
  Gas: BRASS,
  Subscription: SAGE,
  Dining: DUSK,
  Uncategorized: RUST,
};


function ColorFor(label: string) {
  return CATEGORY_COLORS[label];
}

function money(n: number) {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}

export default function Graph({ data }: { data: Transaction[] | null }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-raised px-4 py-10 text-center text-sm text-mist">
        No totals yet.
      </div>
    );
  }

  const categoryTotals: Record<string, number> = {}
  let debit = 0;
  let credit = 0;

  for (const entry of data) {
    if (entry.debit) {
      debit += entry.debit
      const category = entry.type
      categoryTotals[category] = (categoryTotals[category] ?? 0) + entry.debit
    }
    else if (entry.credit) {credit += entry.credit}}

    console.log(categoryTotals)
  
    const Typelabels = Object.keys(categoryTotals) 
    const TypeValues = Object.values(categoryTotals)

  const total = debit + credit;
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <figure
      className="rounded-xl w-[100%] border border-line bg-raised p-4"
      aria-label={`Debits ${money(debit)}, credits ${money(credit)}`}
    >
      <figcaption className="mb-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-brass">
          Summary
        </p>
        <p className="mt-1 text-sm text-paper">Spent vs Earned</p>
      </figcaption>

      <div className="relative">
        <Plot
          data={[
            {
              values: [credit, ...TypeValues],
              labels: ["Credit", ...Typelabels],
              type: "pie",
              hole: 0.62,
              sort: false,
              direction: "clockwise",
              marker: {
                colors: ["Credit", ...Typelabels].map(ColorFor),
                line: { color: LINE, width: 2 },
              },
              textinfo: "none",
              hovertemplate: "%{label}<br>%{value:$,.2f}<br>%{percent}<extra></extra>",
              hoverlabel: {
                bgcolor: "#1a222c",
                bordercolor: LINE,
                font: { color: PAPER, family: "Figtree, sans-serif", size: 13 },
              },
            },
          ]}
          layout={{
            autosize: true,
            height: 220,
            margin: { t: 8, b: 8, l: 8, r: 8 },
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            showlegend: false,
            font: { color: PAPER, family: "Figtree, ui-sans-serif, sans-serif" },
            colorway: [RUST, SEA],
            transition: { duration: reduceMotion ? 0 : 200 },
          }}
          config={{
            displayModeBar: false,
            responsive: true,
          }}
          style={{ width: "100%", height: 220 }}
          useResizeHandler
        />

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-mist">
            Total
          </span>
          <span className="font-mono text-[13px] text-paper">{money(total)}</span>
        </div>
      </div>

      <ul className="mt-2 space-y-2 border-t border-line pt-3 text-sm">
        <li className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-mist">
            <span className="size-2.5 rounded-full bg-rust" aria-hidden="true" />
            Debit
          </span>
          <span className="font-mono text-[13px] text-rust">− {money(debit)}</span>
        </li>
        <li className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-mist">
            <span className="size-2.5 rounded-full bg-sea" aria-hidden="true" />
            Credit
          </span>
          <span className="font-mono text-[13px] text-sea">+ {money(credit)}</span>
        </li>
      </ul>
    </figure>
  );
}
