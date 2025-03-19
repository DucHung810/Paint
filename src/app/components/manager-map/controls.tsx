// Controls.tsx
import { useCallback } from "react";

interface ControlsProps {
  horizontalCount: number;
  verticalCount: number;
  selectedIds: string[];
  setHorizontalCount: (count: number) => void;
  setVerticalCount: (count: number) => void;
  onAddShapes: (type: "square" | "circle" | "arrow" | "car" | "motor" | "bicycle" ) => void;
  onDeleteAll: () => void;
  onDeleteSelected: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Controls = ({
  horizontalCount,
  verticalCount,
  selectedIds,
  setHorizontalCount,
  setVerticalCount,
  onAddShapes,
  onDeleteAll,
  onDeleteSelected,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ControlsProps) => {
  const handleHorizontalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHorizontalCount(Math.max(1, parseInt(e.target.value) || 1));
  }, [setHorizontalCount]);

  const handleVerticalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVerticalCount(Math.max(1, parseInt(e.target.value) || 1));
  }, [setVerticalCount]);

  return (
    <div className="flex flex-row gap-4 items-center">
      <button
        onClick={() => onAddShapes("square")}
        className="px-4 py-2 w-[150px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add Boxes
      </button>
      {/* <button
        onClick={() => onAddShapes("car")}
        className="px-4 py-2 w-[150px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add cars
      </button> */}
      <button
        onClick={() => onAddShapes("circle")}
        className="px-4 py-2 w-[150px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add Circles
      </button>
      <button
        onClick={() => onAddShapes("arrow")}
        className="px-4 py-2 w-[150px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Add Arrows
      </button>
      <div className="flex flex-row gap-2 items-center">
        <label className="text-gray-700">Horizontal:</label>
        <input
          type="number"
          value={horizontalCount}
          onChange={handleHorizontalChange}
          className="border p-2 w-[60px] text-center rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label className="text-gray-700">Vertical:</label>
        <input
          type="number"
          value={verticalCount}
          onChange={handleVerticalChange}
          className="border p-2 w-[60px] text-center rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={onDeleteAll}
        className="px-4 py-2 w-[100px] bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Delete All
      </button>
      <button
        onClick={onDeleteSelected}
        disabled={selectedIds.length === 0}
        className={`px-4 py-2 w-[150px] bg-red-500 text-white rounded hover:bg-red-600 transition ${
          selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Delete Selected
      </button>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`px-4 py-2 w-[100px] bg-gray-500 text-white rounded hover:bg-gray-600 transition ${
          !canUndo ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Undo
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`px-4 py-2 w-[100px] bg-gray-500 text-white rounded hover:bg-gray-600 transition ${
          !canRedo ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Redo
      </button>
    </div>
  );
};