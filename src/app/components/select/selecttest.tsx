"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Selecto from "react-selecto";
import ItemBox from "./itembox";
import { OnSelectEnd } from "react-selecto";
const BOXES_STORAGE_KEY = "draggable-boxes";

interface Box {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  rotation: number;
}

export default function InsertBoxTest() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [horizontalCount, setHorizontalCount] = useState(1);
  const [verticalCount, setVerticalCount] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [dragStartMousePosition, setDragStartMousePosition] = useState({ x: 0, y: 0 });
  const [initialPositions, setInitialPositions] = useState<Record<string, { x: number; y: number }>>({});

  
  const handleSelect = (e: OnSelectEnd) => {
    const selected = e.selected
      .filter((el) => el instanceof HTMLElement)
      .map((el) => el.dataset.id as string);
    setSelectedIds(selected);
    console.log(selected,"selected");
  };

  const handleStartDrag = (e: React.MouseEvent) => {
    
    if (selectedIds.length > 0) {
      setDragging(true);
      setDragStartMousePosition({ x: e.clientX, y: e.clientY });
      const initialPos: Record<string, { x: number; y: number }> = {};
      console.log(initialPos,"initialPos");
      
      selectedIds.forEach((id) => {
        const box = boxes.find((box) => box.id === id);
        
        if (box) {
          initialPos[id] = { x: box.x, y: box.y };
         
        }
        if (!id) {
          console.warn("No box ID found for dragging");
          return;
        }
      });
      setInitialPositions(initialPos);
    } else {
      // Nếu không có box nào được chọn, chọn box hiện tại và bắt đầu kéo
      const id = (e.currentTarget as HTMLElement).dataset.id;
      
      if (id) {
        setSelectedIds([id]);
        setDragging(true);
        setDragStartMousePosition({ x: e.clientX, y: e.clientY });
        const box = boxes.find((box) => box.id === id);
        if (box) {
          initialPositions[id] = { x: box.x, y: box.y };
        }
        
      }
    }
  };
  
  useEffect(() => {
    if (dragging) {
      let rafId: number = 0;
      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - dragStartMousePosition.x;
        const deltaY = e.clientY - dragStartMousePosition.y;

        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setBoxes((prevBoxes) =>
            prevBoxes.map((box) =>
              selectedIds.includes(box.id) && initialPositions[box.id]
                ? {
                    ...box,
                    x: initialPositions[box.id].x + deltaX,
                    y: initialPositions[box.id].y + deltaY,
                  }
                : box
            )
          );
        });
      };

      const handleMouseUp = () => {
        setDragging(false);
        setInitialPositions({});
        cancelAnimationFrame(rafId);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }
  }, [dragging, dragStartMousePosition, initialPositions,selectedIds]);

  const updateBoxSize = (id: string, width: number, height: number) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => (box.id === id ? { ...box, width, height } : box))
    );
  };

  const updateBoxRotation = (id: string, rotation: number) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => (box.id === id ? { ...box, rotation } : box))
    );
  };

  const updateBoxText = (id: string, text: string) => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => (box.id === id ? { ...box, text } : box))
    );
  };

  useEffect(() => {
    const savedBoxes = localStorage.getItem(BOXES_STORAGE_KEY);
    if (savedBoxes) {
      setBoxes(JSON.parse(savedBoxes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(BOXES_STORAGE_KEY, JSON.stringify(boxes));
  }, [boxes]);

  const addBoxes = () => {
    const spacing = 15;
    const boxWidth = 50;
    const boxHeight = 50;
    let startX = 0;

    if (boxes.length > 0) {
      const lastBox = boxes.reduce(
        (prev, curr) => ({
          x: Math.max(prev.x, curr.x + boxWidth),
        }),
        { x: 0 }
      );
      startX = lastBox.x;
    }

    const newBoxes = [];
    for (let row = 0; row < verticalCount; row++) {
      for (let col = 0; col < horizontalCount; col++) {
        const x = startX + col * (boxWidth + spacing) + 15;
        const y = row * (boxHeight + spacing);
        newBoxes.push({
          id: uuidv4(),
          x,
          y,
          width: 50,
          height: 50,
          text: "Text",
          rotation: 0,
        });
      }
    }
    setBoxes([...boxes, ...newBoxes]);
  };

  const deleteBox = (id: string) => {
    const newBoxes = boxes.filter((box) => box.id !== id);
    setBoxes(newBoxes);
    localStorage.setItem(BOXES_STORAGE_KEY, JSON.stringify(newBoxes));
  };

  const deleteAllBoxes = () => {
    setBoxes([]);
    localStorage.setItem(BOXES_STORAGE_KEY, JSON.stringify([]));
  };

  return (
    <div className="relative w-screen h-screen flex flex-col p-4 gap-4">
      <div className="flex flex-row gap-4 items-center">
        <button
          onClick={addBoxes}
          className="px-4 py-2 w-[150px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add Boxes
        </button>
        <button
          onClick={deleteAllBoxes}
          className="px-4 py-2 w-[100px] bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete All
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
      <div className="relative w-full h-[calc(100%-80px)] border border-gray-400 rounded-lg overflow-auto">
        <div className="absolute" ref={containerRef}>
          {boxes.map((box) => (
            <ItemBox
              key={box.id}
              id={box.id}
              position={{ x: box.x, y: box.y }}
              size={{ width: box.width, height: box.height }}
              text={box.text}
              rotation={box.rotation}
              isSelected={selectedIds.includes(box.id)}
              className="item-box"
              selectedElements={selectedIds}
              onStartDrag={handleStartDrag}
              onResize={(width, height) => updateBoxSize(box.id, width, height)}
              onRotate={(rotation) => updateBoxRotation(box.id, rotation)}
              onTextChange={(text) => updateBoxText(box.id, text)}
              onDelete={() => deleteBox(box.id)}
            />
          ))}
        </div>
        <Selecto
          container={containerRef.current}
          selectableTargets={[".item-box"]}
          hitRate={70}
          selectByClick={true}
          selectFromInside={false}
          onSelectEnd={handleSelect}
        />
      </div>
    </div>
  );
}