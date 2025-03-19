"use client";

import { useState, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";

import ResizableBoxCpn from "../insert-table/resizable-box-cpn";
import SelectionTool from "../map2d/select";

const BOXES_STORAGE_KEY = "draggable-boxes";

export default function AddOneBox() {
  const [boxes, setBoxes] = useState<{ id: string; x: number; y: number }[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Load danh sách box từ localStorage khi tải trang
  useEffect(() => {
    const savedBoxes = localStorage.getItem(BOXES_STORAGE_KEY);
    if (savedBoxes) {
      setBoxes(JSON.parse(savedBoxes));
    }
  }, []);

  // Lưu danh sách box vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem(BOXES_STORAGE_KEY, JSON.stringify(boxes));
  }, [boxes]);

  // Thêm box mới
  const addBoxes = () => {
    const spacing = 15; 
    const boxWidth = 50; 
    const boxHeight = 50; 
    const containerWidth = window.innerWidth * 0.8; // Giới hạn 80% chiều rộng màn hình

    const newBoxes = Array.from({ length: quantity }, (_, index) => {
      const totalIndex = boxes.length + index;
      const boxesPerRow = Math.floor(containerWidth / (boxWidth + spacing));
      const x = (totalIndex % boxesPerRow) * (boxWidth + spacing);
      const y = Math.floor(totalIndex / boxesPerRow) *  (boxHeight + spacing);
      return {
        id: uuidv4(),
        x,
        y,
      };
    });

    setBoxes([...boxes, ...newBoxes]);
  };

  const deleteBox = (id: string) => {
    const newBoxes = boxes.filter((box) => box.id !== id);
    setBoxes(newBoxes);
    localStorage.setItem(BOXES_STORAGE_KEY, JSON.stringify(newBoxes));

    // Xóa dữ liệu của box khỏi localStorage
    localStorage.removeItem(`${id}-position`);
    localStorage.removeItem(`${id}-text`);
    localStorage.removeItem(`${id}-size`);
    localStorage.removeItem(`${id}-rotation`);
  };
// Xóa tất cả box
const deleteAllBoxes = () => {
  // Xóa toàn bộ dữ liệu localStorage của từng box
  boxes.forEach((box) => {
    localStorage.removeItem(`${box.id}-position`);
    localStorage.removeItem(`${box.id}-text`);
    localStorage.removeItem(`${box.id}-size`);
    localStorage.removeItem(`${box.id}-rotation`);
  });
  // Xóa danh sách boxes và cập nhật localStorage
  setBoxes([]);
  localStorage.setItem(BOXES_STORAGE_KEY, JSON.stringify([]));
};
  return (
    <div className="relative w-screen h-screen flex flex-col p-4 gap-4">
      <div className="flex flex-row gap-4 items-center">
        <button
          onClick={addBoxes}
          className="px-4 py-2 w-[100px] bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add Box
        </button>
        <button
          onClick={deleteAllBoxes}
          className="px-4 py-2 w-[100px] bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete All
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="border p-2 w-[60px] text-center rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative w-full h-[calc(100%-80px)] border border-gray-400 rounded-lg overflow-auto">
        <div className="absolute">
          {boxes.map((box) => (
            <ResizableBoxCpn
              key={box.id}
              storageKey={`box-${box.id}`}
              onDelete={() => deleteBox(box.id)}
              initialPosition={{ x: box.x, y: box.y }}
            />
          ))}
        </div>
        <SelectionTool/>
      </div>
    </div>
  );
}