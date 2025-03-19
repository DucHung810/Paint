"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import Selecto from "react-selecto";
import Moveable from "react-moveable";
import { OnSelectEnd } from "react-selecto";

// Constants
const SHAPES_STORAGE_KEY = "draw-tool-shapes";
const DEFAULT_SIZE = 50;
const SPACING = 15;

// Shape Interface
interface Shape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: "square" | "circle" | "arrow";
  rotation: number;
  text: string;
}

// Custom Hook for Shapes Management with Undo/Redo
const useShapes = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [history, setHistory] = useState<Shape[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Load initial shapes from localStorage
  useEffect(() => {
    const savedShapes = localStorage.getItem(SHAPES_STORAGE_KEY);
    if (savedShapes) {
      const initialShapes = JSON.parse(savedShapes);
      setShapes(initialShapes);
      setHistory([initialShapes]);
      setHistoryIndex(0);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(SHAPES_STORAGE_KEY, JSON.stringify(shapes));
  }, [shapes]);

  // Update shapes and history
  const updateShapes = (newShapes: Shape[], skipHistory = false) => {
    setShapes(newShapes);
    if (!skipHistory) {
      const newHistory = [...history.slice(0, historyIndex + 1), newShapes];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setShapes(history[prevIndex]);
      setHistoryIndex(prevIndex);
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setShapes(history[nextIndex]);
      setHistoryIndex(nextIndex);
    }
  };

  return {
    shapes,
    updateShapes,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
};

// Shape Component
const ShapeComponent = ({ shape }: { shape: Shape }) => {
  const style = {
    position: "absolute" as const,
    left: shape.x,
    top: shape.y,
    width: shape.width,
    height: shape.height,
    background: shape.type !== "arrow" ? shape.color : "transparent",
    border: shape.type !== "arrow" ? "1px solid blue" : "none",
    borderRadius: shape.type === "circle" ? "50%" : "0",
    transform: `rotate(${shape.rotation}deg)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    textAlign: "center" as const,
    padding: shape.type !== "arrow" ? "4px" : "0",
    overflow: "hidden" as const,
  };

  return (
    <div key={shape.id} data-id={shape.id} className="shape" style={style}>
      {shape.type === "arrow" ? (
        <svg
          width={shape.width}
          height={shape.height}
          viewBox={`0 0 ${shape.width} ${shape.height}`}
          fill="#FFF"
        >
          <path
            d={`M 0 ${shape.height / 2} H ${shape.width * 0.75} L ${
              shape.width * 0.5
            } ${shape.height * 0.25} M ${shape.width * 0.75} ${
              shape.height / 2
            } L ${shape.width * 0.5} ${shape.height * 0.75}`}
            stroke={shape.color}
            strokeWidth="2"
          />

          <text
            x={shape.width / 3}
            y={shape.height / 2.75}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#000"
            fontSize="12"
          >
            {shape.text}
          </text>
        </svg>
      ) : (
        shape.text
      )}
    </div>
  );
};

// Main Component
export default function DrawToolTest() {
  const { shapes, updateShapes, undo, redo, canUndo, canRedo } = useShapes();
  const [horizontalCount, setHorizontalCount] = useState(1);
  const [verticalCount, setVerticalCount] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isDraggingGroup, setIsDraggingGroup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);

  // Handle Delete Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedIds.length > 0) {
        deleteSelectedShapes();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds]);

  // Handle Drop from Toolbox
  const handleDrop = useCallback(
    (
      e: React.DragEvent<HTMLDivElement>,
      type: "square" | "circle" | "arrow"
    ) => {
      e.preventDefault();
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - DEFAULT_SIZE / 2;
      const y = e.clientY - rect.top - DEFAULT_SIZE / 2;

      const newShape: Shape = {
        id: uuidv4(),
        x,
        y,
        width: DEFAULT_SIZE,
        height: DEFAULT_SIZE,
        color: "#808080",
        type,
        rotation: 0,
        text: "Text ?",
      };
      updateShapes([...shapes, newShape]);
      setSelectedIds([newShape.id]);
    },
    [shapes, updateShapes]
  );

  // Add Multiple Shapes
  const addShapes = useCallback(
    (type: "square" | "circle" | "arrow") => {
      const startX =
        shapes.length > 0
          ? Math.max(...shapes.map((s) => s.x + DEFAULT_SIZE)) + SPACING
          : 0;

      const newShapes = Array.from(
        { length: verticalCount * horizontalCount },
        (_, index) => {
          const row = Math.floor(index / horizontalCount);
          const col = index % horizontalCount;
          return {
            id: uuidv4(),
            x: startX + col * (DEFAULT_SIZE + SPACING),
            y: row * (DEFAULT_SIZE + SPACING),
            width: DEFAULT_SIZE,
            height: DEFAULT_SIZE,
            color: "#808080",
            type,
            rotation: 0,
            text: "",
          };
        }
      );

      updateShapes([...shapes, ...newShapes]);
    },
    [shapes, horizontalCount, verticalCount, updateShapes]
  );

  // Delete All Shapes
  const deleteAllShapes = useCallback(() => {
    updateShapes([]);
    setSelectedIds([]);
    setTextInput("");
  }, [updateShapes]);

  // Delete Selected Shapes
  const deleteSelectedShapes = useCallback(() => {
    const newShapes = shapes.filter((shape) => !selectedIds.includes(shape.id));
    updateShapes(newShapes);
    setSelectedIds([]);
    setTextInput("");
  }, [shapes, selectedIds, updateShapes]);

  // Handle Selection
  const handleSelect = useCallback(
    (e: OnSelectEnd) => {
      if (isDraggingGroup) return;
      const selected = e.selected
        .filter((el) => el instanceof HTMLElement)
        .map((el) => el.dataset.id as string);
      setSelectedIds(selected);
      if (selected.length > 0) {
        const firstSelectedShape = shapes.find((s) => s.id === selected[0]);
        setTextInput(firstSelectedShape?.text || "");
      }
    },
    [isDraggingGroup, shapes]
  );

  // Update Color
  const updateColor = useCallback(
    (color: string) => {
      const newShapes = shapes.map((shape) =>
        selectedIds.includes(shape.id) ? { ...shape, color } : shape
      );
      updateShapes(newShapes);
    },
    [shapes, selectedIds, updateShapes]
  );

  // Update Text
  const updateText = useCallback(
    (text: string) => {
      setTextInput(text);
      const newShapes = shapes.map((shape) =>
        selectedIds.includes(shape.id) ? { ...shape, text } : shape
      );
      updateShapes(newShapes);
    },
    [shapes, selectedIds, updateShapes]
  );

  // Get Moveable Targets
  const getMoveableTargets = useCallback(() => {
    return selectedIds
      .map((id) => document.querySelector(`[data-id="${id}"]`))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);
  }, [selectedIds]);

  return (
    <div className="relative w-screen h-screen flex flex-col p-4 gap-4">
      {/* Toolbox */}
      <div className="flex flex-row gap-4">
        <div
          draggable
          onDragStart={(e) => e.dataTransfer.setData("type", "square")}
          className="w-12 h-12 bg-gray-500 cursor-move"
        />
        <div
          draggable
          onDragStart={(e) => e.dataTransfer.setData("type", "circle")}
          className="w-12 h-12 bg-gray-500 rounded-full cursor-move"
        />
        <div
          draggable
          onDragStart={(e) => e.dataTransfer.setData("type", "arrow")}
          className="w-12 h-12 flex items-center justify-center cursor-move bg-gray-500"
        >
          <svg width={24} height={24} fill="none">
            <path
              d="M0 12 H18 L12 6 M18 12 L12 18"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <label className="text-gray-700 font-bold">Choose Color:</label>
          <input
            type="color"
            onChange={(e) => updateColor(e.target.value)}
            className="w-12 h-12 cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={textInput}
          onChange={(e) => updateText(e.target.value)}
          placeholder="Enter text"
          className="border p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-row gap-4 items-center">
        <button
          onClick={() => addShapes("square")}
          className="px-4 py-2 w-[150px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add Boxes
        </button>
        <button
          onClick={() => addShapes("circle")}
          className="px-4 py-2 w-[150px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add Circles
        </button>
        <button
          onClick={() => addShapes("arrow")}
          className="px-4 py-2 w-[150px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add Arrows
        </button>

        <div className="flex flex-row gap-2 items-center">
          <label className="text-gray-700">Horizontal:</label>
          <input
            type="number"
            value={horizontalCount}
            onChange={(e) =>
              setHorizontalCount(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="border p-2 w-[60px] text-center rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label className="text-gray-700">Vertical:</label>
          <input
            type="number"
            value={verticalCount}
            onChange={(e) =>
              setVerticalCount(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="border p-2 w-[60px] text-center rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={deleteAllShapes}
          className="px-4 py-2 w-[100px] bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete All
        </button>
        <button
          onClick={deleteSelectedShapes}
          disabled={selectedIds.length === 0}
          className={`px-4 py-2 w-[150px] bg-red-500 text-white rounded hover:bg-red-600 transition ${
            selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Delete Selected
        </button>
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`px-4 py-2 w-[100px] bg-gray-500 text-white rounded hover:bg-gray-600 transition ${
            !canUndo ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`px-4 py-2 w-[100px] bg-gray-500 text-white rounded hover:bg-gray-600 transition ${
            !canRedo ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Redo
        </button>
      </div>

      {/* Canvas */}
      <div
        className="relative w-full h-[calc(100%-120px)] border border-gray-400 rounded-lg overflow-auto p-2"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) =>
          handleDrop(
            e,
            e.dataTransfer.getData("type") as "square" | "circle" | "arrow"
          )
        }
      >
        <div className="absolute" ref={containerRef}>
          {shapes.map((shape) => (
            <ShapeComponent key={shape.id} shape={shape} />
          ))}
        </div>

        <Selecto
          container={containerRef.current}
          selectableTargets={[".shape"]}
          hitRate={100}
          selectByClick={true}
          selectFromInside={false}
          dragCondition={() => !isDraggingGroup}
          onSelectEnd={handleSelect}
        />

        <Moveable
          ref={moveableRef}
          target={getMoveableTargets()}
          draggable={true}
          resizable={true}
          rotatable={true}
          keepRatio={false}
          throttleDrag={1}
          onDragGroupStart={() => setIsDraggingGroup(true)}
          onDragGroupEnd={() => setIsDraggingGroup(false)}
          onDragGroup={({ events }) => {
            const newShapes = shapes.map((shape) => {
              const event = events.find(
                (e) => e.target.dataset.id === shape.id
              );
              return event
                ? {
                    ...shape,
                    x: shape.x + event.delta[0],
                    y: shape.y + event.delta[1],
                  }
                : shape;
            });
            updateShapes(newShapes, true); // Skip history for drag
          }}
          onResizeGroup={({ events }) => {
            const newShapes = shapes.map((shape) => {
              const event = events.find(
                (e) => e.target.dataset.id === shape.id
              );
              if (event) {
                event.delta[0] &&
                  (event.target.style.width = `${event.width}px`);
                event.delta[1] &&
                  (event.target.style.height = `${event.height}px`);
                return { ...shape, width: event.width, height: event.height };
              }
              return shape;
            });
            updateShapes(newShapes, true); // Skip history for resize
          }}
          onRotateGroup={({ events }) => {
            const newShapes = shapes.map((shape) => {
              const event = events.find(
                (e) => e.target.dataset.id === shape.id
              );
              return event ? { ...shape, rotation: event.rotation } : shape;
            });
            updateShapes(newShapes, true); // Skip history for rotate
          }}
          onDrag={({ target, delta }) => {
            const newShapes = shapes.map((s) =>
              s.id === target.dataset.id
                ? { ...s, x: s.x + delta[0], y: s.y + delta[1] }
                : s
            );
            updateShapes(newShapes, true);
          }}
          onResize={({ target, width, height, delta }) => {
            delta[0] && (target.style.width = `${width}px`);
            delta[1] && (target.style.height = `${height}px`);
            const newShapes = shapes.map((s) =>
              s.id === target.dataset.id ? { ...s, width, height } : s
            );
            updateShapes(newShapes, true);
          }}
          onRotate={({ target, rotation }) => {
            const newShapes = shapes.map((s) =>
              s.id === target.dataset.id ? { ...s, rotation } : s
            );
            updateShapes(newShapes, true);
          }}
          onDragEnd={() => updateShapes(shapes)} // Save to history after drag
          onResizeEnd={() => updateShapes(shapes)} // Save to history after resize
          onRotateEnd={() => updateShapes(shapes)} // Save to history after rotate
        />
      </div>
    </div>
  );
}
