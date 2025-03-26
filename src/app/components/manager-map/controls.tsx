// Controls.tsx
import { useCallback } from "react";
import { ShapeType } from "./enum";

interface ControlsProps {
  horizontalCount: number;
  verticalCount: number;
  selectedIds: string[];
  setHorizontalCount: (count: number) => void;
  setVerticalCount: (count: number) => void;
  onAddShapes: (type: ShapeType) => void;
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
  const handleHorizontalChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setHorizontalCount(Math.max(1, parseInt(e.target.value) || 1));
    },
    [setHorizontalCount]
  );

  const handleVerticalChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVerticalCount(Math.max(1, parseInt(e.target.value) || 1));
    },
    [setVerticalCount]
  );

  return (
    <div className="flex flex-col gap-4 ">
      <div className="gap-4 flex flex-col">
        <div className="flex flex-1 gap-2">
          <button
            onClick={() => onAddShapes("square")}
            className="p-1 w-[30px] bg-gray-300 text-white rounded hover:bg-gray-500 transition"
          >
            <img src="./icon/box.svg" alt="box" />
          </button>
          <button
            onClick={() => onAddShapes("circle")}
            className="p-1 w-[30px] bg-gray-300 text-white rounded hover:bg-gray-500 transition"
          >
            <img src="./icon/circle.svg" alt="box" />
          </button>
          <button
            onClick={() => onAddShapes("arrow")}
            className="p-1 w-[30px] bg-gray-300 text-white rounded hover:bg-gray-500 transition"
          >
            <img src="./arrow.svg" alt="box" />
          </button>
        </div>
        <div className="flex flex-col gap-2 w-[150px] ">
          <div className=" flex flex-row gap-1 items-end w-[150px] justify-between ">
            <label className="text-black">cols:</label>
            <input
              type="number"
              value={horizontalCount}
              onChange={handleHorizontalChange}
              className="border text-black w-[60px] text-center rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className=" flex flex-row gap-1 items-end  w-[150px] justify-between ">
            <label className="text-black">rows:</label>
            <input
              type="number"
              value={verticalCount}
              onChange={handleVerticalChange}
              className="border text-black w-[60px] text-center rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
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
};
