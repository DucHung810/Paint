"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Selecto from "react-selecto";
import Moveable, { Rotatable } from "react-moveable";
import { OnSelectEnd } from "react-selecto";

const SHAPES_STORAGE_KEY = "draw-tool-shapes";

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

export default function DrawTool() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [horizontalCount, setHorizontalCount] = useState(1);
  const [verticalCount, setVerticalCount] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isDraggingGroup, setIsDraggingGroup] = useState(false); // Trạng thái để kiểm soát khi kéo nhóm
  const containerRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);

  // Load dữ liệu từ localStorage
  useEffect(() => {
    const savedShapes = localStorage.getItem(SHAPES_STORAGE_KEY);
    if (savedShapes) {
      console.log("Loaded shapes from localStorage:", JSON.parse(savedShapes));
      setShapes(JSON.parse(savedShapes));
    }
  }, []);

  // Lưu dữ liệu vào localStorage
  useEffect(() => {
    localStorage.setItem(SHAPES_STORAGE_KEY, JSON.stringify(shapes));
  }, [shapes]);

  // Xử lý phím Delete để xóa hình được chọn
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedIds.length > 0) {
        deleteSelectedShapes();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds]);

  // Xử lý kéo và thả từ toolbox
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    type: "square" | "circle" | "arrow"
  ) => {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - 25;
    const y = e.clientY - rect.top - 25;

    const newShape: Shape = {
      id: uuidv4(),
      x,
      y,
      width: 50,
      height: 50,
      color: "#808080", // Màu xám mặc định
      type,
      rotation: 0,
      text: type === "arrow" ? "" : "Text",
    };
    setShapes((prev) => [...prev, newShape]);
    setSelectedIds([newShape.id]);
  };

  // Thêm nhiều hình từ nút
  const addShapes = (type: "square" | "circle" | "arrow") => {
    const spacing = 15;
    const width = 50;
    const height = 50;
    const startX =
      shapes.length > 0 ? Math.max(...shapes.map((s) => s.x + width)) : 0;

    const newShapes: Shape[] = [];

    for (let row = 0; row < verticalCount; row++) {
      for (let col = 0; col < horizontalCount; col++) {
        const x = startX + col * (width + spacing) + 15;
        const y = row * (height + spacing);

        if (type === "arrow") {
          newShapes.push({
            id: uuidv4(),
            x,
            y,
            width,
            height,
            color: "#808080",
            type,
            rotation: 0,
            text: "Text",
          });
        } else {
          newShapes.push({
            id: uuidv4(),
            x,
            y,
            width,
            height,
            color: "#808080",
            type,
            rotation: 0,
            text: "Text",
          });
        }
      }
    }
    console.log("New shape added:", newShapes);
    setShapes((prev) => [...prev, ...newShapes]);
    
  };

  // Xóa tất cả hình
  const deleteAllShapes = () => {
    setShapes([]);
    setSelectedIds([]);
    localStorage.setItem(SHAPES_STORAGE_KEY, JSON.stringify([]));
  };

  // Xóa các hình được chọn
  const deleteSelectedShapes = () => {
    setShapes((prev) =>
      prev.filter((shape) => !selectedIds.includes(shape.id))
    );
    setSelectedIds([]);
  };

  // Xử lý chọn bằng Selecto
  const handleSelect = (e: OnSelectEnd) => {
    if (isDraggingGroup) return; // Không cho phép chọn khi đang kéo nhóm
    const selected = e.selected
      .filter((el) => el instanceof HTMLElement)
      .map((el) => el.dataset.id as string);
    setSelectedIds(selected);
    if (selected.length > 0) {
      const firstSelectedShape = shapes.find((s) => s.id === selected[0]);
      setTextInput(firstSelectedShape?.text || "");
    }
    console.log("Selected shapes:", selected);
  };

  // Cập nhật màu
  const updateColor = (color: string) => {
    setShapes((prev) =>
      prev.map((shape) =>
        selectedIds.includes(shape.id) ? { ...shape, color } : shape
      )
    );
  };

  // Cập nhật text
  const updateText = (text: string) => {
    setTextInput(text);
    setShapes((prev) =>
      prev.map((shape) =>
        selectedIds.includes(shape.id) ? { ...shape, text } : shape
      )
    );
  };

  // Lấy target cho Moveable
  const getMoveableTargets = (): HTMLElement[] => {
    return selectedIds
      .map((id) => document.querySelector(`[data-id="${id}"]`))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);
  };

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
          className="w-12 h-12  flex items-center justify-center cursor-move"
        >
          <img src="/arrow.svg" alt="Arrow" />
        </div>
        <div className="flex flex-row gap-4 items-center">
          <label className="text-gray-700 font-bold">Chose Color:</label>
          <input
            type="color"
            onChange={(e) => updateColor(e.target.value)}
            className="w-12 h-12  cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={textInput}
          onChange={(e) => updateText(e.target.value)}
          placeholder="Nhập text"
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
      </div>

      {/* Canvas */}
      <div
        className="relative w-full h-[calc(100%-120px)] border border-gray-400 rounded-lg overflow-auto pt-2"
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
            <div
              key={shape.id}
              data-id={shape.id}
              className="shape"
              style={{
                position: "absolute",
                left: shape.x,
                top: shape.y,
                width: shape.width,
                height: shape.height,
                background:
                  shape.type !== "arrow" ? shape.color : "transparent",
                border: shape.type !== "arrow" ? "1px solid blue" : "none",
                borderRadius: shape.type === "circle" ? "50%" : "0",
                transform: `rotate(${shape.rotation}deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                textAlign: "center",
                padding: shape.type !== "arrow" ? "4px" : "0",
                overflow: "hidden",
              }}
            >
              {shape.type === "arrow" ? (
                <svg
                  width={shape.width}
                  height={shape.height}
                  viewBox={`0 0 ${shape.width} ${shape.height}`}
                  fill="none"
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
                </svg>
              ) : (
                shape.text
              )}
            </div>
          ))}
        </div>

        {/* Selecto */}
        <Selecto
          container={containerRef.current}
          selectableTargets={[".shape"]}
          hitRate={100}
          selectByClick={true}
          selectFromInside={false}
          dragCondition={() => !isDraggingGroup} // Tắt kéo chuột chọn vùng khi đang di chuyển nhóm
          onSelectEnd={handleSelect}
        />

        {/* Moveable */}
        <Moveable
          ref={moveableRef}
          target={getMoveableTargets()}
          draggable={true}
          resizable={true}
          rotatable={true}
          keepRatio={false}
          throttleDrag={0}
          onDragGroupStart={() => setIsDraggingGroup(true)} // Bắt đầu kéo nhóm
          onDragGroupEnd={() => setIsDraggingGroup(false)} // Kết thúc kéo nhóm
          onDragGroup={({ events }) => {
            setShapes((prev) =>
              prev.map((shape) => {
                const event = events.find(
                  (e) => e.target.dataset.id === shape.id
                );
                if (event) {
                  return {
                    ...shape,
                    x: shape.x + event.delta[0],
                    y: shape.y + event.delta[1],
                  };
                }
                return shape;
              })
            );
          }}
          onResizeGroup={({ events }) => {
            setShapes((prev) =>
              prev.map((shape) => {
                const event = events.find(
                  (e) => e.target.dataset.id === shape.id
                );
                if (event) {
                  event.delta[0] &&
                    (event.target.style.width = `${event.width}px`);
                  event.delta[1] &&
                    (event.target.style.height = `${event.height}px`);
                  return {
                    ...shape,
                    width: event.width,
                    height: event.height,
                  };
                }
                return shape;
              })
            );
          }}
          onRotateGroup={({ events }) => {
            setShapes((prev) =>
              prev.map((shape) => {
                const event = events.find(
                  (e) => e.target.dataset.id === shape.id
                );
                if (event) {
                  return {
                    ...shape,
                    rotation: event.rotation,
                  };
                }
                return shape;
              })
            );
          }}
          onDrag={({ target, delta }) => {
            setShapes((prev) =>
              prev.map((s) =>
                s.id === target.dataset.id
                  ? { ...s, x: s.x + delta[0], y: s.y + delta[1] }
                  : s
              )
            );
          }}
          onResize={({ target, width, height, delta }) => {
            delta[0] && (target.style.width = `${width}px`);
            delta[1] && (target.style.height = `${height}px`);
            setShapes((prev) =>
              prev.map((s) =>
                s.id === target.dataset.id ? { ...s, width, height } : s
              )
            );
          }}
          onRotate={({ target, rotation }) => {
            setShapes((prev) =>
              prev.map((s) =>
                s.id === target.dataset.id ? { ...s, rotation } : s
              )
            );
          }}
        />
      </div>
    </div>
  );
}
