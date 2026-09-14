import { Plus } from "lucide-react";

type AddButtonProps = {
  className?: string;
  size?: number;
  onClick?: () => void;
};

export default function AddButton({ className, size = 22, onClick }: AddButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      aria-label="Import CSV"
    >
      <Plus size={size} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
