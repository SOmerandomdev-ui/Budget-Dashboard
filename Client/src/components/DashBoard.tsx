import { CircleUser } from "lucide-react";

const Navigation = [
  { id: "home", label: "Home" },
  { id: "overview", label: "Overview" },
  { id: "statistics", label: "Statistics" },
] as const;

export default function DashBoard() {
  return (
    <header className="sticky flex top-0 z-30 border-b border-line/80 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto gap-190 flex h-16 max-w-10xl items-center gap-8 px-4 sm:px-6">
        <span className="font-display text-[1.85rem] tracking-tight"> Keel </span>

        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex ">
          {Navigation.map((item) =>(
              <span
                key={item.id}
                aria-current="page"
                className="px-3 py-2 text-sm font-medium text-paper">
                {item.label}
              </span>
            ))}
        </nav>

        <button
          type="button"
          aria-label="Account"
          className="ml-auto inline-flex size-11 cursor-pointer rounded-full items-center justify-center text-mist transition-colors duration-200 hover:bg-raised hover:text-paper"
        >
          <CircleUser size={22} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
