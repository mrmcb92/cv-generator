"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ListDashes } from "@phosphor-icons/react";
import { Theme } from "@/types/theme";

// ─── Sortable wrapper item ────────────────────────────────────────
interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  theme: Theme;
}

function SortableItem({ id, children, theme }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: isDragging ? ("relative" as const) : ("relative" as const),
    zIndex: isDragging ? 50 : "auto" as const,
  };
  const isDark = theme.id === "dark";

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute left-0 top-0 bottom-0 flex items-center px-1 z-10 cursor-grab active:cursor-grabbing"
        {...attributes} {...listeners}
      >
        <div className={`w-5 h-full flex items-center justify-center rounded-l-sm ${
          isDark ? "hover:bg-white/[0.04] text-zinc-700" : "hover:bg-black/[0.02] text-zinc-300"
        } transition-colors`}>
          <ListDashes size={12} weight="bold" />
        </div>
      </div>
      <div className="pl-7">{children}</div>
    </div>
  );
}

// ─── Main DraggableList ───────────────────────────────────────────
interface Props<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  getId: (item: T) => string;
  theme: Theme;
  /** Optional key to prefix IDs for uniqueness when multiple lists exist */
  scope?: string;
  /** If true, the item is wrapped in a sortable container. Default true. */
  sortable?: boolean;
}

export default function DraggableList<T>({
  items,
  onChange,
  renderItem,
  getId,
  theme,
  scope,
  sortable = true,
}: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => getId(item) === active.id);
    const newIndex = items.findIndex((item) => getId(item) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...items];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    onChange(reordered);
  }, [items, onChange, getId]);

  if (!sortable) {
    return <>{items.map((item, i) => renderItem(item, i))}</>;
  }

  const sortableIds = items.map(getId);

  return (
    <DndContext
      id={scope}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        {items.map((item, i) => (
          <SortableItem key={getId(item)} id={getId(item)} theme={theme}>
            {renderItem(item, i)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
