"use client";

import { Pencil, Plus, X, type LucideIcon } from "lucide-react";

type Variant = "default" | "primary" | "danger";

const VARIANT_CLASS: Record<Variant, string> = {
  default: "liquid-glass text-gray-300 hover:text-white hover:bg-white/10",
  primary: "bg-white text-black hover:bg-gray-200",
  danger: "liquid-glass text-red-400 hover:text-red-300 hover:bg-red-500/10",
};

/**
 * Admin-wide icon action: pencil = edit, X = delete/remove, + = new/add.
 * `label` doubles as aria-label and tooltip, since there's no visible text.
 */
export function IconButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  size = "md",
  disabled,
  type = "button",
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: Variant;
  size?: "sm" | "md";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const box = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`${box} shrink-0 rounded-full inline-flex items-center justify-center transition-colors disabled:opacity-50 ${VARIANT_CLASS[variant]}`}
    >
      <Icon size={size === "sm" ? 14 : 16} />
    </button>
  );
}

export function EditButton({ onClick, label = "Editar" }: { onClick: () => void; label?: string }) {
  return <IconButton icon={Pencil} label={label} onClick={onClick} />;
}

export function AddButton({
  onClick,
  label = "Agregar",
  size,
  disabled,
}: {
  onClick: () => void;
  label?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  return <IconButton icon={Plus} label={label} onClick={onClick} variant="primary" size={size} disabled={disabled} />;
}

export function RemoveButton({
  onClick,
  label = "Quitar",
  size = "sm",
  disabled,
}: {
  onClick: () => void;
  label?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  return <IconButton icon={X} label={label} onClick={onClick} variant="danger" size={size} disabled={disabled} />;
}
