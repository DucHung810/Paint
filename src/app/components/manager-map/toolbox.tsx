// Toolbox.tsx
import { useCallback } from "react";

interface ToolboxProps {
  onUpdateColor: (color: string) => void;
  onUpdateText: (text: string) => void;
  textInput: string;
}

export const Toolbox = ({
  onUpdateColor,
  onUpdateText,
  textInput,
}: ToolboxProps) => {
  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateColor(e.target.value);
    },
    [onUpdateColor]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateText(e.target.value);
    },
    [onUpdateText]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <div
          draggable
          onDragStart={(e) => e.dataTransfer.setData("type", "square")}
          className="w-10 h-10 bg-gray-500 cursor-move"
        />

        <div
          draggable
          onDragStart={(e) => e.dataTransfer.setData("type", "circle")}
          className="w-10 h-10 bg-gray-500 rounded-full cursor-move"
        />
        <div
          draggable
          onDragStart={(e) => e.dataTransfer.setData("type", "arrow")}
          className="w-10 h-10 flex items-center justify-center cursor-move bg-gray-500"
        >
          <svg width={24} height={24} fill="none">
            <path
              d="M0 12 H18 L12 6 M18 12 L12 18"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div  className="flex flex-row gap-4">
      <div className=" w-10 h-10 cursor-move"
         draggable
            onDragStart={(e) => e.dataTransfer.setData("type", "car")}
         >
        <img src="./icon/car.svg" alt="car" />
      </div>
      <div className="w-10 h-10 cursor-move"
         draggable
            onDragStart={(e) => e.dataTransfer.setData("type", "motor")}
         >
        <img src="./icon/motor.svg" alt="car" />
      </div>
      <div className=" w-10 h-10 cursor-move"
         draggable
            onDragStart={(e) => e.dataTransfer.setData("type", "bicycle")}
         >
        <img src="./icon/bicycle.svg" alt="car" />
      </div>
      </div>
      
      <div className="flex flex-row gap-4 items-center">
        <label className="text-gray-700 font-bold">Choose Color:</label>
        <input
          type="color"
          onChange={handleColorChange}
          className="w-6 h-6 cursor-pointer"
        />
      </div>
      <input
        type="text"
        value={textInput}
        onChange={handleTextChange}
        placeholder="Enter text"
        className="border p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[150px]"
      />
    </div>
  );
};
