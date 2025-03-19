"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import Selecto from "react-selecto";
import Moveable from "react-moveable";

interface Box {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  rotation: number;
}

export default function Editor() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const selectedTargetsRef = useRef<HTMLElement[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const moveableRef = useRef<Moveable>(null);
  const selectoRef = useRef<Selecto>(null);

  // ✅ Load dữ liệu từ localStorage một lần
  useEffect(() => {
    const savedBoxes = localStorage.getItem("boxes");
    if (savedBoxes) {
      setBoxes(JSON.parse(savedBoxes));
    }
  }, []);

  // ✅ Lưu vào localStorage khi kết thúc thao tác (debounce)
  const saveToLocalStorage = useCallback(() => {
    localStorage.setItem("boxes", JSON.stringify(boxes));
  }, [boxes]);

  // ✅ Thêm box mới
  const addBox = () => {
    setBoxes((prev) => [
      ...prev,
      {
        id: uuidv4(),
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        text: "Box",
        rotation: 0,
      },
    ]);
  };

  // ✅ Cập nhật vị trí/kích thước khi kết thúc thao tác
  const updateBoxState = () => {
    setBoxes((prevBoxes) =>
      prevBoxes.map((box) => {
        const el = document.querySelector(`[data-id="${box.id}"]`) as HTMLElement;
        if (!el) return box;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const transform = style.transform;

        let rotation = box.rotation;
        if (transform && transform !== "none") {
          const matrix = transform.match(/matrix\((.+)\)/)?.[1].split(", ");
          if (matrix) {
            rotation = Math.round(Math.atan2(parseFloat(matrix[1]), parseFloat(matrix[0])) * (180 / Math.PI));
          }
        }

        return {
          ...box,
          x: parseFloat(el.style.left || "0"),
          y: parseFloat(el.style.top || "0"),
          width: rect.width,
          height: rect.height,
          rotation,
        };
      })
    );
    saveToLocalStorage();
  };

  return (
    <div className="app">
      <button onClick={addBox}>Add Box</button>
      <div
        ref={containerRef}
        className="container"
        style={{
          position: "relative",
          width: "100%",
          height: "500px",
          border: "1px solid gray",
        }}
      >
        {/* Render các box */}
        {boxes.map((box) => (
          <div
            key={box.id}
            data-id={box.id}
            className="box"
            style={{
              position: "absolute",
              left: box.x,
              top: box.y,
              width: box.width,
              height: box.height,
              transform: `rotate(${box.rotation}deg)`,
              background: "lightblue",
              border: "1px solid blue",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {box.text}
          </div>
        ))}

        {/* Moveable */}
        <Moveable
          ref={moveableRef}
          target={selectedTargetsRef.current}
          container={containerRef.current || undefined}
          draggable
          resizable
          rotatable
          onDrag={({ target, left, top, transform }) => {
            target.style.left = `${left}px`;
            target.style.top = `${top}px`;
            target.style.transform = transform;
          }}
          onResize={({ target, width, height }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
          }}
          onRotate={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onDragEnd={updateBoxState}
          onResizeEnd={updateBoxState}
          onRotateEnd={updateBoxState}
          keepRatio={false}
        />

        {/* Selecto */}
        <Selecto
          ref={selectoRef}
          container={containerRef.current}
          selectableTargets={[".box"]}
          selectByClick
          selectFromInside={false}
          hitRate={0}
          onSelect={(e) => {
            selectedTargetsRef.current = e.selected as HTMLElement[];
          }}
          onDragStart={(e) => {
            const moveable = moveableRef.current;
            if (
              moveable?.isMoveableElement(e.inputEvent.target) ||
              selectedTargetsRef.current.some((t) => t === e.inputEvent.target || t.contains(e.inputEvent.target))
            ) {
              e.stop();
            }
          }}
          onSelectEnd={(e) => {
            selectedTargetsRef.current = e.selected as HTMLElement[];
            const moveable = moveableRef.current;
            if (e.isDragStart && moveable) {
              e.inputEvent.preventDefault();
              setTimeout(() => moveable.dragStart(e.inputEvent), 0);
            }
          }}
        />
      </div>
    </div>
  );
}
