"use client";
import { Theme } from "@/types/theme";

interface Props {
  chips: string[];
  onSelect: (text: string) => void;
  theme: Theme;
}

export default function SuggestionChips({ chips, onSelect, theme }: Props) {
  const isDark = theme.id === "dark";
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onSelect(chip)}
          className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
            isDark
              ? "border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white"
              : "border-black/10 text-zinc-500 hover:bg-black/5 hover:text-zinc-800"
          }`}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}