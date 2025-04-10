import * as React from "react";

export interface IToolbarProps {
  onDeleteAll: () => void;
  onDeleteSelected: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedIds: string[];
}

export function ToolbarDraw(props: IToolbarProps) {
  const {
    onDeleteAll,
    onDeleteSelected,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    selectedIds,
  } = props;
  return (
    <div>
      <div>
        <button
          onClick={onDeleteAll}
          className="p-1 w-[30px] text-white rounded hover:bg-red-600 transition"
        >
          <img src="./icon/trash.svg" alt="trash-select" />
        </button>
        <button
          onClick={onDeleteSelected}
          disabled={selectedIds.length === 0}
          className={`p-1 w-[30px] text-white rounded hover:bg-red-600   transition ${
            selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <img src="./icon/trash-select.svg" alt="trash-select" />
        </button>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-1 w-[30px] text-white rounded hover:bg-gray-200 transition ${
            !canUndo ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <img src="./icon/undo.svg" alt="undo" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-1 w-[30px]  text-white rounded hover:bg-gray-600 transition ${
            !canRedo ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <img src="./icon/redo.svg" alt="redo" />
        </button>
      </div>
    </div>
  );
}
