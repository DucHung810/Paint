"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { OnSelectEnd } from "react-selecto";
import { useShapes } from "./shapes";
import { Canvas } from "./canvas";
import { Controls } from "./controls";
import { Toolbox } from "./toolbox";
import { ShapeType } from "./enum";

const DEFAULT_SIZE = 50;
const SPACING = 15;

export default function DrawToolTest() {
  const { shapes, updateShapes, undo, redo, canUndo, canRedo } = useShapes();
  const [horizontalCount, setHorizontalCount] = useState(1);
  const [verticalCount, setVerticalCount] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isDraggingGroup, setIsDraggingGroup] = useState(false);
  const [isRotatingGroup, setIsRotatingGroup] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, type: ShapeType) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - DEFAULT_SIZE / 2;
      const y = e.clientY - rect.top - DEFAULT_SIZE / 2;

      const newShape = {
        id: uuidv4(),
        x,
        y,
        width: DEFAULT_SIZE,
        height: DEFAULT_SIZE,
        color:
          type === "arrow" || type === "square" || type === "circle"
            ? "#AFAFAF"
            : "none",
        type,
        rotation: 0,
        text: "Text ?",
        border: "none",
      };
      updateShapes([...shapes, newShape]);
      setSelectedIds([newShape.id]);
    },
    [shapes, updateShapes]
  );

  const addShapes = useCallback(
    (type: ShapeType) => {
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
            color:
              type === "arrow" || type === "square" || type === "circle"
                ? "#AFAFAF"
                : "none",
            type,
            rotation: 0,
            text: "",
            border: " 2px solid #FFFFFF",
          };
        }
      );
      updateShapes([...shapes, ...newShapes]);
    },
    [shapes, horizontalCount, verticalCount, updateShapes]
  );

  const deleteAllShapes = useCallback(() => {
    updateShapes([]);
    setSelectedIds([]);
    setTextInput("");
  }, [updateShapes]);

  const deleteSelectedShapes = useCallback(() => {
    const newShapes = shapes.filter((shape) => !selectedIds.includes(shape.id));
    updateShapes(newShapes);
    setSelectedIds([]);
    setTextInput("");
  }, [shapes, selectedIds, updateShapes]);

  const handleSelect = useCallback(
    (e: OnSelectEnd) => {
      if (isDraggingGroup || isRotatingGroup) return; // Cập nhật để bỏ qua nếu đang kéo hoặc xoay nhóm
      const selected = e.selected
        .filter((el) => el instanceof HTMLElement)
        .map((el) => el.dataset.id as string);

      setSelectedIds(selected);
      if (selected.length > 0) {
        const firstSelectedShape = shapes.find((s) => s.id === selected[0]);
        setTextInput(firstSelectedShape?.text || "");
      }
    },
    [isDraggingGroup, isRotatingGroup, shapes]
  );

  const updateColor = useCallback(
    (color: string) => {
      const newShapes = shapes.map((shape) =>
        selectedIds.includes(shape.id) ? { ...shape, color } : shape
      );
      updateShapes(newShapes);
    },
    [shapes, selectedIds, updateShapes]
  );

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

  const handleDragGroupStart = useCallback(() => {
    setIsDraggingGroup(true);
  }, []);

  const handleDragGroupEnd = useCallback(() => {
    setIsDraggingGroup(false);
  }, []);

  const handleRotateGroupStart = useCallback(() => {
    setIsRotatingGroup(true);
  }, []);

  const handleRotateGroupEnd = useCallback(() => {
    setIsRotatingGroup(false);
  }, []);

  return (
    <div className="relative w-screen h-screen flex flex-row p-4 gap-4">
      <div className="flex flex-col gap-4">
        <Toolbox
          onUpdateColor={updateColor}
          onUpdateText={updateText}
          textInput={textInput}
        />
        <Controls
          horizontalCount={horizontalCount}
          verticalCount={verticalCount}
          selectedIds={selectedIds}
          setHorizontalCount={setHorizontalCount}
          setVerticalCount={setVerticalCount}
          onAddShapes={addShapes}
          onDeleteAll={deleteAllShapes}
          onDeleteSelected={deleteSelectedShapes}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      </div>

      <Canvas
        shapes={shapes}
        selectedIds={selectedIds}
        isDraggingGroup={isDraggingGroup}
        isRotatingGroup={isRotatingGroup}
        updateShapes={updateShapes}
        onSelect={handleSelect}
        onDrop={handleDrop}
        onDragGroupStart={handleDragGroupStart}
        onDragGroupEnd={handleDragGroupEnd}
        onRotateGroupStart={handleRotateGroupStart}
        onRotateGroupEnd={handleRotateGroupEnd}
      />
    </div>
  );
}
